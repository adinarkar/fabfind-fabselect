import { Link } from "react-router-dom";
import PropTypes from "prop-types";


export function ImageCard({ img, title, text, lastUpdated, routeTo }) {
  return (
    <Link to={routeTo} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="card text-bg-dark mb-4 h-100 image-card">
        <img src={img} className="card-img" alt={title} />
        <div className="card-img-overlay d-flex flex-column justify-content-end">
          <div className="overlay-gradient"></div>
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{text}</p>
          {lastUpdated && (
            <p className="card-text">
              <small>{lastUpdated}</small>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

ImageCard.propTypes = {
  img: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  lastUpdated: PropTypes.string,
  routeTo: PropTypes.string.isRequired,
};
