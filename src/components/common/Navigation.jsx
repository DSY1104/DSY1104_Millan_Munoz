import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "/src/styles/components/_navbar.css";


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


  // Login state bridge to the existing cookie-based mock auth used by vanilla
  const isLoggedIn = useMemo(() => {
    try {
      return window?.LevelUpLogin?.isLoggedIn?.() || false;
    } catch {
      return false;
    }
  }, [menuOpen, userOpen]);


  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
        setUserOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    const onLogout = () => setUserOpen(false);
    window.addEventListener("userLoggedOut", onLogout);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("userLoggedOut", onLogout);
    };
  }, []);


  return (
    <nav className="navbar" role="navigation" aria-label="Navegación principal">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <img
            src="/assets/image/logo/logo_nobg.png"
            width="72"
            alt="LevelUp"
            style={{ verticalAlign: "middle" }}
          />
        </NavLink>


        <button
          className="navbar-toggle"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span></span><span></span><span></span>
        </button>


        <ul className={`navbar-menu ${menuOpen ? "active" : ""}`} id="navbar-menu">
          <li>
            <NavLink to="/" end className="navbar-link">
              HOME
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className="navbar-link">
              Productos
            </NavLink>
          </li>
          <li>
            <NavLink to="/blog" className="navbar-link">
              Blogs/Noticias
            </NavLink>
          </li>
          <li>
            <NavLink to="/support" className="navbar-link">
              Soporte
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className="navbar-link">
              Acerca
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" className="navbar-cart" aria-label="Ver carrito">
              <span role="img" aria-label="carrito">🛒</span>
              <span className="cart-badge" id="cart-count">{cartCount}</span>
            </NavLink>
          </li>


          <li className="navbar-user">
            {!isLoggedIn ? (
              <button
                className="navbar-login-btn"
                id="login-btn"
                aria-label="Iniciar sesión"
                onClick={() => window?.LevelUpLogin?.open?.()}
              >
                <img src="/assets/image/icon/login.svg" alt="Login" />
              </button>
            ) : (
              <>
                <button
                  className="navbar-user-btn"
                  id="user-menu-btn"
                  aria-label="Menú de usuario"
                  onClick={() => setUserOpen((v) => !v)}
                >
                  <span role="img" aria-label="usuario">👤</span>
                </button>
                <div className={`navbar-user-menu ${userOpen ? "active" : ""}`} id="user-menu">
                  <NavLink to="/profile" className="user-menu-link" onClick={() => setUserOpen(false)}>
                    Mi Perfil
                  </NavLink>
                  <NavLink to="/cart" className="user-menu-link" onClick={() => setUserOpen(false)}>
                    Mi Carrito
                  </NavLink>
                  <button className="user-menu-link user-logout" id="logout-btn" onClick={() => window?.LevelUpLogin?.logout?.()}>
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


