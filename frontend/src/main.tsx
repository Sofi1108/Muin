import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// import PrivateRoute from "./components/PrivateRoute.tsx";
// import CheckoutPage from "./components/CheckoutPage.tsx";
// import IntranetLayout from "./components/IntranetLayout.tsx";
// import IntranetHome from "./components/IntranetHome.tsx";
// import ClockInPage from "./components/ClockInPage.tsx";
// import ClockHistory from "./components/ClockHistory.tsx";
// import AdminUsers from "./components/AdminUsers.tsx";
// import LoginPage from "./components/LoginPage.tsx";
// import RegisterPage from "./components/RegisterPage.tsx";
// import OrderHistory from "./components/OrderHistory.tsx";
// import OrdersPanel from "./components/OrdersPanel.tsx";
// import NotFound from "./components/NotFound.tsx";
// import { UserProvider } from "./context/UserContext.tsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
