import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import { Register } from "./components/Register";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductList from "./components/ProductList";
import UserTables from "./components/UserTables.jsx";
import OrderDetails from "./components/OrderDetails.jsx";
import EditTables from "./components/EditTables.jsx";
import EditProducts from "./components/EditProducts.jsx";
import Bill from "./components/Bill.jsx";

export const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true); 
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/edit-products" element={<EditProducts />} />
                    <Route path="/bill" element={<Bill />} />
                    <Route path="/tables" element={<UserTables />} />
                    <Route path="/edit-tables" element={<EditTables />} />
                    <Route path="/orders" element={<OrderDetails />} />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
};
