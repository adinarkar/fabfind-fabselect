import { Link } from "react-router-dom";
import Mens from "../pages/Mens";
import { useState } from "react";
import { useNavigate,Navigate } from "react-router-dom";

export function NavBar() {


    return (

        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a href="https://fabfind.shop" className="navbar-brand" aria-current="page" to="/">FabSelect</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/home">Home</Link>

                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/product-search">SEARCH</Link>
                        </li>
                        <li className="nav-item">

                            <Link className="nav-link active" aria-current="page" to="/">carous main</Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" aria-disabled="true">Disabled</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )

}

export function NavBar2(){
                        const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (!search.trim()) return
    // HashRouter will produce /fabselect/#/search-fabfinds?q=...
    navigate(`/search-fabfinds?q=${encodeURIComponent(search)}`)
  }
    return(
        <div>
        <nav class="navbar bg-body-tertiary fixed-top">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">FabSelect</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                    <div class="offcanvas-header">
                        <Link><h5 class="offcanvas-title" id="offcanvasNavbarLabel">FabFinds</h5></Link>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">
                        <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/home">Home</Link>

                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/mens">about</Link>
                        </li>
                        <li className="nav-item">

                            <Link className="nav-link active" aria-current="page" to="/">carou main</Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link disabled" aria-disabled="true">Disabled</a>
                        </li>
                            
                        </ul>
                            <form className="d-flex mt-3" role="search" onSubmit={handleSearch}>
      <input className="form-control me-2" value={search} onChange={(e) => setSearch(e.target.value)} />
      <button className="btn btn-outline-success" type="submit">Search</button>
    </form>
                    </div>
                </div>
            </div>
        </nav>
        </div>
    );
}