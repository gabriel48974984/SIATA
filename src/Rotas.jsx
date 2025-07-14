import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Menu from "./Telas/Menu";
import Login from "./Telas/Login";
import Home from "./Telas/Home";
import App from "./App";
const Rotas = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<Home />} />
                    <Route path="Menu" element={<Menu />} />
                    <Route path="Login" element={<Login />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
export default Rotas;