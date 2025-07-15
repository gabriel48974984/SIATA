import './Menu.css'
import logo from '../assets/logo-1001.png'
import { useState } from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
export default function Menu() {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')))
  const [fabOpen, setFabOpen] = useState(false)
  const handleLogout = () => {
    const auth = getAuth()
    signOut(auth).then(() => {
      sessionStorage.removeItem('user')
      window.location.href = '/' 
    }).catch((error) => {
      console.error('Erro ao sair:', error)
    })
  }
  return (
    <div className='menu'>
      <img src={logo} alt="" id='logo1' />
      <img src={user.photoURL} alt="avatar" id='avatar' onClick={() => setFabOpen(!fabOpen)} />
      {fabOpen && (
        <div className='fab-menu'>
          <button onClick={() => alert('Editar perfil em breve')}>
            <FontAwesomeIcon icon={faUser} />
          </button>
          <button onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} />
          </button>
        </div>
      )}
      <h2>SIATA</h2>
      <h3>Seja bem vindo, {user.displayName}! ao Sistema de Integração ATA</h3>
      <section>
        <h2>Menu</h2>
        <ul>
          <li><a href="#">DP</a></li>
          <li><a href="#">RH</a></li>
          <li><a href="#">ADM</a></li>
          <li><a href="#">Perfil</a></li>
          <li><a href="#" onClick={handleLogout}>Sair</a></li>
        </ul>
      </section>
      <h3>Um sistema de <img src={logo} alt="" /> Utilidades</h3>
    </div>
  )
}
