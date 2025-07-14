import './Menu.css'
import logo from '../assets/logo-1001.png'
import { useState } from 'react'
export default function Menu() {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')))
  return (
    <div>
      <img src={logo} alt="" id='logo1' />
      <img src={logo} alt="" id='avatar' />
      <h2>SIATA</h2>
      <h3>Seja bem vindo, {user.displayName}! ao Sistema de Integração ATA</h3>
      <section>
        <h2>Menu</h2>
        <ul>
          <li><a href="#">DP</a></li>
          <li><a href="#">RH</a></li>
          <li><a href="#">ADM</a></li>
          <li><a href="#">Perfil</a></li>
          <li><a href="#">Sair</a></li>
        </ul>
      </section>
      <h3>Um sistema de <img src={logo} alt="" /> Utilidades</h3>
    </div>
  )
}