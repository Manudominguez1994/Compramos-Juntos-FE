import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthWrapper } from "../context/auth.context.jsx";
import { ProductsProvider } from "../context/product.context.jsx";
import Footer from "./components/Footer.jsx";





ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>    
    <AuthWrapper>
      <ProductsProvider>
        <App />
      </ProductsProvider>
    </AuthWrapper>
    <Footer/>
  </BrowserRouter>
);
