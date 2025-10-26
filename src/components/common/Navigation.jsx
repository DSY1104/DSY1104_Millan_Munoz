import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "/src/styles/components/_navbar.css";
import {
  IconLogin,
  IconShoppingCart,
  IconUserFilled,
} from "@tabler/icons-react";

// Simple cart count from localStorage, mirrors legacy logic
function useCartCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const load = () => {
      try {
        const cartData = JSON.parse(localStorage.getItem("cart:data"));
        const c = cartData?.items?.reduce((s, it) => s + (it.qty || 1), 0) || 0;
        setCount(c);
      } catch {}
    };
    load();
    const handler = () => load();
    document.addEventListener("cart:changed", handler);
    return () => document.removeEventListener("cart:changed", handler);
  }, []);
  return count;
}

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const cartCount = useCartCount();
  const { isAuthenticated, user, openLoginModal, logout } = useAuth();

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
        setUserOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Close menu on scroll
  useEffect(() => {
    const onScroll = () => {
      if (menuOpen || userOpen) {
        setMenuOpen(false);
        setUserOpen(false);
      }
    };

    if (menuOpen || userOpen) {
      window.addEventListener("scroll", onScroll);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [menuOpen, userOpen]);

  // Function to handle NavLink clicks
  const handleNavLinkClick = () => {
    setMenuOpen(false);
  };

  // Function to toggle menu and close user menu
  const handleMenuToggle = () => {
    setMenuOpen((v) => !v);
    setUserOpen(false);
  };

  // Function to toggle user menu and close main menu
  const handleUserToggle = () => {
    setUserOpen((v) => !v);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Navegación principal">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <img
            src="/src/assets/images/logo/logo_nobg.png"
            width="72"
            alt="LevelUp"
            style={{ verticalAlign: "middle" }}
          />
        </NavLink>

        <button
          className="navbar-toggle"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={handleMenuToggle}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul id="navbar-menu-mobile">
          <li>
            <NavLink
              to="/cart"
              className="navbar-cart"
              aria-label="Ver carrito"
            >
              <IconShoppingCart color="black" size={48} />
              <span className="cart-badge" id="cart-count">
                {cartCount}
              </span>
            </NavLink>
          </li>

          <li className="navbar-user">
            {!isAuthenticated ? (
              <button
                className="navbar-login-btn"
                id="login-btn"
                aria-label="Iniciar sesión"
                onClick={openLoginModal}
              >
                <IconLogin color="white" size={48} />
              </button>
            ) : (
              <>
                <button
                  className="navbar-user-btn"
                  id="user-menu-btn"
                  aria-label="Menú de usuario"
                  onClick={handleUserToggle}
                >
                  <IconUserFilled color="white" size={48} />
                </button>
                <div
                  className={`navbar-user-menu ${userOpen ? "active" : ""}`}
                  id="user-menu"
                >
                  <NavLink
                    to="/profile"
                    className="user-menu-link"
                    onClick={() => setUserOpen(false)}
                  >
                    Mi Perfil
                  </NavLink>
                  <NavLink
                    to="/cart"
                    className="user-menu-link"
                    onClick={() => setUserOpen(false)}
                  >
                    Mi Carrito
                  </NavLink>
                  <button
                    className="user-menu-link user-logout"
                    id="logout-btn"
                    onClick={() => {
                      logout();
                      setUserOpen(false);
                    }}
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </>
            )}
          </li>
        </ul>

        <ul
          className={`navbar-menu ${menuOpen ? "active" : ""}`}
          id="navbar-menu"
        >
          <li>
            <NavLink
              to="/"
              end
              className="navbar-link"
              onClick={handleNavLinkClick}
            >
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/products"
              className="navbar-link"
              onClick={handleNavLinkClick}
            >
              Productos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/blog"
              className="navbar-link"
              onClick={handleNavLinkClick}
            >
              Blogs/Noticias
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/support"
              className="navbar-link"
              onClick={handleNavLinkClick}
            >
              Soporte
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className="navbar-link"
              onClick={handleNavLinkClick}
            >
              Acerca
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/cart"
              className="navbar-cart cart-desktop"
              aria-label="Ver carrito"
              onClick={handleNavLinkClick}
            >
              <IconShoppingCart color="black" size={48} />
              <span className="cart-badge" id="cart-count">
                {cartCount}
              </span>
            </NavLink>
          </li>

          <li className="navbar-user user-desktop">
            {!isAuthenticated ? (
              <button
                className="navbar-login-btn"
                id="login-btn"
                aria-label="Iniciar sesión"
                onClick={openLoginModal}
              >
                <IconLogin color="white" size={48} />
              </button>
            ) : (
              <>
                <button
                  className="navbar-user-btn"
                  id="user-menu-btn"
                  aria-label="Menú de usuario"
                  onClick={handleUserToggle}
                >
                  <IconUserFilled color="white" size={48} />
                </button>
                <div
                  className={`navbar-user-menu ${userOpen ? "active" : ""}`}
                  id="user-menu"
                >
                  <NavLink
                    to="/profile"
                    className="user-menu-link"
                    onClick={() => setUserOpen(false)}
                  >
                    Mi Perfil
                  </NavLink>
                  <NavLink
                    to="/cart"
                    className="user-menu-link"
                    onClick={() => setUserOpen(false)}
                  >
                    Mi Carrito
                  </NavLink>
                  <button
                    className="user-menu-link user-logout"
                    id="logout-btn"
                    onClick={() => {
                      logout();
                      setUserOpen(false);
                    }}
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
