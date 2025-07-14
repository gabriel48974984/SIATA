import './app.css'
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Menu from "./Telas/Menu";
import Login from "./Telas/Login";
import Home from "./Telas/Home";
export default function App() {
  return (
       <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}>
                    <Route index element={<Login />} />
                    <Route path="Menu" element={<Menu />} />
                    <Route path="Login" element={<Login />} />
                </Route>
            </Routes>
        </BrowserRouter>
  )
}