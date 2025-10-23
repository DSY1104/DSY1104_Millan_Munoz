import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/common/Navigation.jsx";
import Footer from "./components/common/Footer.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import LoginModal from "./components/modals/auth/LoginModal.jsx";
import RegisterModal from "./components/modals/auth/RegisterModal.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import HomePage from "./pages/Home.jsx";
import BlogPage from "./pages/Blog.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import About from "./pages/About.jsx";
import Cart from "./pages/Cart.jsx";
import CatalogPage from "./pages/Catalog.jsx";
import ProductDetailPage from "./pages/ProductDetail.jsx";
import SupportPage from "./pages/Support.jsx";
import NotFound from "./pages/NotFound.jsx";
import UserProfile from "./pages/UserProfile.jsx";

// Layout component
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
      <LoginModal />
      <RegisterModal />
    </>
  );
}

// Create router with data API
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "blog",
        element: <BlogPage />,
      },
      {
        path: "blog/:slug",
        element: <BlogPost />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "products",
        element: <CatalogPage />,
      },
      {
        path: "products/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "profile",
        element: <UserProfile />,
      },
      {
        path: "support",
        element: <SupportPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}
