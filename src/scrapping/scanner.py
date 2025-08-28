from playwright.sync_api import sync_playwright

def scrape_duckduckgo_shopping(query):
    products = []
    url = f"https://duckduckgo.com/?q={query.replace(' ', '+')}&ia=shopping"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # Set True for silent mode
        page = browser.new_page()
        page.goto(url, timeout=60000)
        page.wait_for_timeout(3000)  # Wait for JS to load

        items = page.query_selector_all("div.result")  # Shopping tiles
        print(f"Found {len(items)} products")

        for item in items[:10]:  # Top 10 products
            title_elem = item.query_selector("span.result__title") or item.query_selector("a")
            price_elem = item.query_selector("span.result__price") or item.query_selector("span")
            link_elem = item.query_selector("a")

            title = title_elem.inner_text().strip() if title_elem else "N/A"
            price = price_elem.inner_text().strip() if price_elem else "N/A"
            link = link_elem.get_attribute("href") if link_elem else "N/A"

            products.append({
                "title": title,
                "price": price,
                "link": link
            })

        browser.close()
    return products


if __name__ == "__main__":
    query = "red tshirt"
    results = scrape_duckduckgo_shopping(query)
    for r in results:
        print(r)
