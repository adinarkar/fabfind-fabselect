import React, { useState } from "react";
import { Tabs } from "./reuse/tabs";

export default function ProductSearchPage() {
  const [q, setQ] = useState("red tshirt");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // map the scraper rows -> what Tabs expects
  const toTabProduct = (row, idx) => ({
    _id: `${(row.title || row.query || "prod").slice(0, 40)}-${idx}-${Date.now()}`, // safe key
    name: row.title || row.query || "Product",
    brand: row.brand || "",                 // scraper doesn't provide brand—left blank
    description: row.description || "",     // scraper doesn't provide description—left blank
    image: row.image || "",
    amazon: row.amazon?.link ? { link: row.amazon.link, price: row.amazon.price ?? null } : null,
    flipkart: row.flipkart?.link ? { link: row.flipkart.link, price: row.flipkart.price ?? null } : null,
    myntra: row.myntra?.link ? { link: row.myntra.link, price: row.myntra.price ?? null } : null,
  });

  const onSearch = async (e) => {
    e?.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    setErr("");
    try {
      // This calls the Node route we set up earlier: /api/search -> runs newscrapper.py
      const r = await fetch(`http://localhost:5001/api/search?q=${encodeURIComponent(q)}`);
      const json = await r.json();
      if (!json.ok) throw new Error(json.error || "API error");
      const mapped = (json.data || []).map(toTabProduct);
      setProducts(mapped);
    } catch (e) {
      setErr(e.message || "Failed to fetch");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <form className="d-flex gap-2 mb-3" onSubmit={onSearch}>
        <input
          className="form-control"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search e.g. 'red tshirt', 'puma running shoes men'"
        />
        <button className="btn btn-dark" type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {err && <div className="alert alert-danger">{err}</div>}
      {!loading && !err && products.length === 0 && (
        <div className="text-muted">No results yet. Try adding a brand (e.g., “puma red tshirt”).</div>
      )}

      {/* Your tab/grid */}
      <Tabs products={products} />
    </div>
  );
}
