import { Link } from "react-router-dom";
import { User, Menu } from "lucide-react";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">

        <Link to="/" className="logo">
          MK Travels
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/tours">Tours</Link>
          <Link to="/search">Search</Link>
          <Link to="/my-trips">My Trips</Link>
        </nav>

        <div className="nav-actions">
          <Link to="/profile">
            <User size={22} />
          </Link>

          <button className="menu-button">
            <Menu size={24} />
          </button>
        </div>

      </div>
    </header>
  );
}
export default Navbar;