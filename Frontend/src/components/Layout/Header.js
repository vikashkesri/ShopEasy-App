import React, { useState } from "react"; 
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import { Badge } from "antd";
import "../../styles/Navbar.css";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Logout
  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
    navigate("/login");
    setMenuOpen(false);
  };

  // Close menu on link click
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" onClick={handleLinkClick}>
          🛒 ShopEasy
        </Link>
      </div>

      <button
        className="navbar-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✖" : "☰"}
      </button>

      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <SearchInput />

        <NavLink to="/" className="nav-item" onClick={handleLinkClick}>
          Home
        </NavLink>

        {!auth?.user ? (
          <>
            <NavLink to="/register" onClick={handleLinkClick}>
              Register
            </NavLink>
            <NavLink to="/login" onClick={handleLinkClick}>
              Login
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to={`/dashboard/${auth.user.role === 1 ? "admin" : "user"}`}
              onClick={handleLinkClick}
            >
              Dashboard
            </NavLink>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

        {/* Cart */}
        <NavLink to="/cart" onClick={handleLinkClick} className="nav-item">
          <Badge count={cart?.length} showZero offset={[10, -5]}>
            <span className="cart-text">Cart</span>
          </Badge>
        </NavLink>
      </div>
    </nav>
  );
};

export default Header;
