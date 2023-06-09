import React from 'react'

const Navbar = (props) => {

    const apiKeyEntered = (event) => {
        props.getApiKey(event.target.value);
    }

    return (
        <div>
            <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">ImageGenerator</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link" href="/">Generate Image</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/">Merge Images</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/">Variate Image</a>
                            </li>
                        </ul>
                        <form className="d-flex">
                            <label style = {{color: 'white', marginTop: "7px", marginRight: "12px"}}><b>APIKEY:</b></label>
                            <input className="form-control me-2" type="search" aria-label="Search" onChange={apiKeyEntered}/>
                        </form>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;