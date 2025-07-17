import './app.css'
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Menu from "./Telas/Menu";
import Login from "./Telas/Login";
import Home from "./Telas/Home";
import Perfil from './Telas/Perfil';
import CadastroFuncionario from './Telas/CadastroFuncionario';
export default function App() {
  return (
       <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}>
                    <Route index element={<Login />} />
                    <Route path="Menu" element={<Menu />} />
                    <Route path="Login" element={<Login />} />
                    <Route path="Perfil" element={<Perfil />} />
                    <Route path="CadastroFuncionario" element={<CadastroFuncionario />} />
                    <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
                </Route>
            </Routes>
        </BrowserRouter>
  )
}