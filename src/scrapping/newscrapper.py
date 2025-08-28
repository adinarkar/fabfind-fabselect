# -*- coding: utf-8 -*-
"""
newscrapper.py — SerpAPI Google Shopping scraper that returns DIRECT Myntra/Flipkart/Amazon links.
- Uses google_shopping -> product_id
- Uses google_product with offers=1 to fetch online sellers
- Prefers 'direct_link' from sellers; cleans any google redirects
- Falls back to tile source/domain only if it points directly to merchant (never stores google.com links)
- Saves JSON/CSV; optional Mongo save in your schema

Usage:
  python newscrapper.py --query "red tshirt" --out-json results.json --out-csv results.csv --debug true

Deps:
  pip install requests pandas pymongo
"""

import argparse, json, re, time, random
from typing import Dict, Any, List, Optional
from urllib.parse import urlparse, parse_qs, unquote

import requests
from requests.adapters import HTTPAdapter, Retry
import sys, os, io
# Force UTF-8 stdout/stderr on Windows so ₹ etc. don't crash printing
if os.name == "nt":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")


# ---- your SerpAPI key (rotate later) ----
SERPAPI_KEY = "c6aa49ab0bf450f27fc32d97d340617cc5bfea95db146b880f6626e4255c15a0"

GL = "in"
HL = "en"

TARGET_DOMAINS = {
    "amazon": ["amazon.", "amzn."],
    "flipkart": ["flipkart.com"],
    "myntra": ["myntra.com"],
}

# ---------- utils ----------
def domain_bucket(href: str) -> Optional[str]:
    if not href:
        return None
    host = urlparse(href).netloc.lower()
    for bucket, needles in TARGET_DOMAINS.items():
        if any(n in host for n in needles):
            return bucket
    return None

def source_bucket(source: str) -> Optional[str]:
    s = (source or "").lower()
    if "amazon" in s:   return "amazon"
    if "flipkart" in s: return "flipkart"
    if "myntra" in s:   return "myntra"
    return None

def parse_price_rupees(txt: str) -> Optional[int]:
    """
    Return integer rupees from a messy price string.
    Examples:
      '₹199.00' -> 199
      '₹1,299' -> 1299
      '1,299.50' -> 1300
      '₹2,499 – ₹2,999' -> 2499  (picks the first/lowest)
    """
    if not txt:
        return None
    s = str(txt)

    # normalize currency text & spaces
    s = s.replace("₹", "").replace("Rs.", "").replace("INR", "")
    s = s.replace("\u00a0", " ").replace(",", "").strip()

    # if it's a range like "2499 – 2999" / "2499-2999" / "2499 to 2999" -> take first part
    # (lowest price is usually what you want for comparison tiles)
    parts = re.split(r"\s*(?:–|—|-|to|until)\s*", s, maxsplit=1, flags=re.IGNORECASE)
    s = parts[0]

    # grab first number with optional decimal
    m = re.search(r"(\d+(?:\.\d{1,2})?)", s)
    if not m:
        return None

    val = float(m.group(1))
    return int(round(val))


def extract_product_id_from_google_link(link: str) -> Optional[str]:
    # e.g. https://www.google.com/shopping/product/1908805381537725268?gl=in
    if not link:
        return None
    m = re.search(r"/shopping/product/(\d+)", urlparse(link).path)
    return m.group(1) if m else None

def clean_google_redirect(href: str) -> str:
    """Unwrap google redirect params (adurl/url/q/u) -> final merchant URL."""
    if not href:
        return href
    parsed = urlparse(href)
    if "google." not in parsed.netloc.lower():
        return href
    qs = parse_qs(parsed.query)
    for key in ("adurl", "url", "q", "u"):
        if key in qs and qs[key]:
            target = qs[key][0]
            if target.startswith("http"):
                return unquote(target)
    return href

def to_fashion_schema(row: Dict[str, Any]) -> Dict[str, Any]:
    def pick_price(m): return (m or {}).get("price")
    def pick_link(m):  return (m or {}).get("link")
    return {
        "name": row.get("title") or row.get("query"),
        "brand": None,
        "price": None,
        "description": None,
        "image": row.get("image"),
        "category": None,
        "amazon":   {"price": pick_price(row.get("amazon")),   "link": pick_link(row.get("amazon"))},
        "flipkart": {"price": pick_price(row.get("flipkart")), "link": pick_link(row.get("flipkart"))},
        "myntra":   {"price": pick_price(row.get("myntra")),   "link": pick_link(row.get("myntra"))},
    }

# ---------- resilient HTTP client ----------
def make_session() -> requests.Session:
    s = requests.Session()
    s.headers.update({"Connection": "close", "User-Agent": "fabfinds/1.3"})
    retries = Retry(
        total=5, connect=5, read=5, backoff_factor=1.2,
        status_forcelist=(429, 500, 502, 503, 504),
        allowed_methods=("GET",)
    )
    s.mount("https://", HTTPAdapter(max_retries=retries, pool_maxsize=2))
    s.mount("http://", HTTPAdapter(max_retries=retries, pool_maxsize=2))
    return s

def fetch_json(url: str, params: dict, session: requests.Session, timeout: int = 30) -> dict:
    last_err = None
    for attempt in range(6):
        try:
            r = session.get(url, params=params, timeout=timeout)
            r.raise_for_status()
            return r.json()
        except (requests.exceptions.ConnectionError,
                requests.exceptions.ReadTimeout,
                requests.exceptions.SSLError) as e:
            last_err = e
            time.sleep(min(6, (2 ** attempt)) + random.random())
    raise last_err or RuntimeError("fetch_json failed")

# ---------- SerpAPI calls ----------
def serpapi_shopping_search(query: str, max_products: int, session: requests.Session) -> List[Dict[str, Any]]:
    url = "https://serpapi.com/search.json"
    params = {
        "engine": "google_shopping",
        "q": query,
        "gl": GL, "hl": HL,
        "api_key": SERPAPI_KEY,
        "num": max_products,
        # "no_cache": "true",
        # "google_domain": "google.co.in",  # optional, gl=in usually enough
    }
    data = fetch_json(url, params, session)
    if "error" in data:
        raise RuntimeError(f"SerpAPI error: {data['error']}")
    return (data.get("shopping_results") or [])[:max_products]

def serpapi_product_offers(product_id: str, session: requests.Session) -> dict:
    url = "https://serpapi.com/search.json"
    params = {
        "engine": "google_product",
        "product_id": product_id,
        "gl": GL, "hl": HL,
        "api_key": SERPAPI_KEY,
        "offers": 1,              # <-- IMPORTANT: required for online sellers
        "filter": "scoring:p",    # sort by base price (optional)
        "no_cache": "true",       # avoid stale cached responses
        "google_domain": "google.co.in",
    }
    time.sleep(0.6 + random.random() * 0.5)
    return fetch_json(url, params, session)

# ---------- offers parsing ----------
def normalize_offer(link: str, price_raw: Optional[str], source_hint: Optional[str]) -> Optional[Dict[str, Any]]:
    link = clean_google_redirect(link)
    b = domain_bucket(link)
    if not b:
        return None
    return {
        "merchant": source_hint or b.title(),
        "price_raw": price_raw,
        "price": parse_price_rupees(price_raw),
        "link": link
    }

def collect_from_online_sellers(sellers: List[Dict[str, Any]]) -> Dict[str, Optional[Dict[str, Any]]]:
    found = {"amazon": None, "flipkart": None, "myntra": None}
    for s in sellers or []:
        # Prefer 'direct_link' if present; else 'link'
        raw_link = (s.get("direct_link") or s.get("link") or s.get("product_link") or "").strip()
        offer = normalize_offer(raw_link, s.get("base_price") or s.get("price") or s.get("price_str"), s.get("name") or s.get("source"))
        if not offer:
            continue
        b = domain_bucket(offer["link"])
        if b in found and not found[b]:
            found[b] = offer
        if all(found.values()):
            break
    return found

# ---------- main scrape ----------
def scrape(query: str, max_products: int = 6, debug: bool = False) -> List[Dict[str, Any]]:
    session = make_session()
    results = serpapi_shopping_search(query, max_products=max_products, session=session)
    if debug:
        print(f"[debug] shopping_results: {len(results)}")

    rows: List[Dict[str, Any]] = []

    for idx, item in enumerate(results):
        title = item.get("title") or query
        image = item.get("thumbnail") or item.get("image")
        item_link = item.get("link") or item.get("product_link") or ""
        item_source = item.get("source")
        item_price = item.get("price") or item.get("extracted_price")

        product_id = item.get("product_id") or item.get("product_id_v2") \
                     or extract_product_id_from_google_link(item_link)

        amazon = flipkart = myntra = None

        # 1) Try detailed product offers (ONLINE SELLERS) with offers=1
        sellers = []
        if product_id:
            try:
                detail = serpapi_product_offers(product_id, session=session)
                # sellers live here when offers=1:
                sellers = (
                    (detail.get("sellers_results") or {}).get("online_sellers")
                    or detail.get("sellers")  # legacy shape
                    or (detail.get("product_results") or {}).get("sellers")  # older examples
                    or []
                )
                if debug:
                    print(f"[debug] #{idx+1} product_id={product_id} sellers={len(sellers)}")
            except Exception as e:
                if debug:
                    print(f"[debug] #{idx+1} offers error: {e}")

        if sellers:
            filtered = collect_from_online_sellers(sellers)
            amazon, flipkart, myntra = filtered["amazon"], filtered["flipkart"], filtered["myntra"]

        # 2) Fallbacks — but NEVER store google.com for merchant fields
        if not (amazon or flipkart or myntra):
            # a) Use source label (Myntra/Flipkart/Amazon) if tile link already points to them
            b = source_bucket(item_source)
            if b:
                offer = normalize_offer(item_link, str(item_price), item_source)
                if offer and domain_bucket(offer["link"]) == b:
                    if b == "amazon":   amazon = offer
                    if b == "flipkart": flipkart = offer
                    if b == "myntra":   myntra = offer
                    if debug:
                        print(f"[debug] #{idx+1} filled from source={item_source}")

        if not (amazon or flipkart or myntra):
            # b) If tile link domain is already the merchant, use it; otherwise skip
            offer = normalize_offer(item_link, str(item_price), None)
            if offer:
                b = domain_bucket(offer["link"])
                if b == "amazon":   amazon = offer
                if b == "flipkart": flipkart = offer
                if b == "myntra":   myntra = offer
                if debug:
                    print(f"[debug] #{idx+1} filled from link domain {b}")

        # Only keep products where we found at least one direct merchant link
        if amazon or flipkart or myntra:
            rows.append({
                "query": query,
                "title": title,
                "image": image,
                "amazon": amazon,
                "flipkart": flipkart,
                "myntra": myntra
            })
        else:
            if debug:
                print(f"[debug] #{idx+1} skipped — no direct merchant link")

    if debug:
        print(f"[debug] kept rows: {len(rows)}")
    return rows

# ---------- saving ----------
def save_json(rows: List[Dict[str, Any]], path: str) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(rows, f, indent=2, ensure_ascii=False)
    print(f"[ok] saved JSON -> {path}")

def save_csv(rows: List[Dict[str, Any]], path: str) -> None:
    try:
        import pandas as pd
    except ImportError:
        print("[warn] pandas not installed; run `pip install pandas` for CSV export")
        return
    flat = []
    for r in rows:
        flat.append({
            "query": r.get("query"),
            "title": r.get("title"),
            "image": r.get("image"),
            "amazon_link": (r.get("amazon") or {}).get("link"),
            "amazon_price": (r.get("amazon") or {}).get("price"),
            "flipkart_link": (r.get("flipkart") or {}).get("link"),
            "flipkart_price": (r.get("flipkart") or {}).get("price"),
            "myntra_link": (r.get("myntra") or {}).get("link"),
            "myntra_price": (r.get("myntra") or {}).get("price"),
        })
    pd.DataFrame(flat).to_csv(path, index=False)
    print(f"[ok] saved CSV -> {path}")

def save_mongo(rows: List[Dict[str, Any]], mongo_uri: str, db_name: str, col_name: str) -> None:
    try:
        from pymongo import MongoClient
    except ImportError:
        print("[warn] pymongo not installed; run `pip install pymongo` to save to MongoDB")
        return
    client = MongoClient(mongo_uri)
    col = client[db_name][col_name]
    if rows:
        docs = [to_fashion_schema(r) for r in rows]
        col.insert_many(docs)
        print(f"[ok] inserted {len(docs)} docs into {db_name}.{col_name}")
    client.close()

# ---------- CLI ----------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--query", required=True)
    ap.add_argument("--max-products", type=int, default=6)
    ap.add_argument("--out-json", default=None)
    ap.add_argument("--out-csv", default=None)
    ap.add_argument("--mongo-uri", default=None)
    ap.add_argument("--mongo-db", default="fashion_db")
    ap.add_argument("--mongo-col", default="products")
    ap.add_argument("--debug", type=lambda x: str(x).lower()=="true", default=False)
    args = ap.parse_args()

    rows = scrape(args.query, max_products=args.max_products, debug=args.debug)

    if args.out_json:
        save_json(rows, args.out_json)
    if args.out_csv:
        save_csv(rows, args.out_csv)
    if args.mongo_uri:
        save_mongo(rows, args.mongo_uri, args.mongo_db, args.mongo_col)

    print(json.dumps(rows, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
