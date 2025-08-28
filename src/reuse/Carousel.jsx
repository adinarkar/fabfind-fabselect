import { useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js"; // ensures Carousel JS is available

export function Carousel({ items, width = "100%", height = "350px", borderRadius = "10px" }) {
  useEffect(() => {
    const el = document.querySelector("#carouselExample");
    if (el) {
      new bootstrap.Carousel(el, {
        interval: 4000, // 4 seconds
        ride: "carousel", // start automatically
      });
    }
  }, []);

  return (
    <div
      id="carouselExample"
      className="carousel slide"
      style={{ maxWidth: width, margin: "auto" }}
    >
      <div className="carousel-inner">
        {items.map((item, index) => (
          <div
            className={`carousel-item ${index === 0 ? "active" : ""}`}
            key={index}
          >
            <Link to={item.link}>
              <img
                src={item.img}
                className="d-block w-100"
                alt={`Slide ${index + 1}`}
                style={{
                  height,
                  borderRadius,
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

Carousel.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      img: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    })
  ).isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  borderRadius: PropTypes.string,
};
