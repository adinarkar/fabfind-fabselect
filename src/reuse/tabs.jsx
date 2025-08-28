import React from "react";

export function Tabs({ products }) {
  return (
    <main>
      <div className="container-fluid bg-transparent my-4 p-3" style={{ position: "relative" }}>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
          {products.map((product) => (
            <div className="col" key={product._id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <div className="clearfix mb-2">
                    <span className="float-start badge rounded-pill bg-primary">{product.brand}</span>
                  </div>
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>

                  {/* Buttons for Amazon, Flipkart, Myntra */}
                  <div className="text-center my-3">
                    {product.amazon && (
                      <a
                        href={product.amazon.link}
                        className="btn btn-warning m-1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Amazon – Rs.{product.amazon.price}
                      </a>
                    )}
                    {product.flipkart && (
                      <a
                        href={product.flipkart.link}
                        className="btn btn-primary m-1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Flipkart – Rs.{product.flipkart.price}
                      </a>
                    )}
                    {product.myntra && (
                      <a
                        href={product.myntra.link}
                        className="btn btn-success m-1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Myntra – Rs.{product.myntra.price}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
