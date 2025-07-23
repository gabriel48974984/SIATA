import './Menu.css'
import logo from '../assets/logo-1001.png'
import { useState } from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logoSiata from '../assets/logo-siata.png'
import { faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
export default function Menu() {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')))
  const [fabOpen, setFabOpen] = useState(false)
  const abrirPerfil = () => {
    window.location.href = '/Perfil'
  }
  const listarRH = () => {
    window.location.href = '/ListaFuncionarios'
  }
  const abrirMenuDP = () => {
    window.location.href = '/MenuDP'
  }

  const handleLogout = () => {
    const auth = getAuth()
    signOut(auth).then(() => {
      sessionStorage.removeItem('user')
      window.location.href = '/' 
    }).catch((error) => {
      console.error('Erro ao sair:', error)
    })
  }
  const abrirCadastroFuncionario = () => {
    window.location.href = '/CadastroFuncionario'
  }
  return (
    <div className='menu'>
      <div style={{ position: 'absolute', top: '30px', left: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <img src={logoSiata} alt="" style={{ width: '50px', margin: 0 }} />
                <h2 style={{ margin: 0, fontWeight: 'bold', fontStretch: 'ultra-expanded', marginLeft: '5px' }}>I A T A</h2>
              </div>
              <h4 style={{ position: 'relative', margin: 0, fontSize: '10px', top: '-22px', left: '26px', color: '#fff' }}>Sistema de Integração ATA</h4>
            </div>
      
      <img src={user.photoURL} alt="avatar" id='avatar' onClick={() => setFabOpen(!fabOpen)} />
      {fabOpen && (
        <div className='fab-menu'>
          <button onClick={abrirPerfil}>
            <FontAwesomeIcon icon={faUser} />
          </button>
          <button onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} />
          </button>
        </div>
      )}
      <h2>Menu</h2>
      <h3 style={{color: '#fff', fontSize: '18px',marginBottom:'20px', position: 'relative', backgroundColor:'#33333300'}}>Seja bem vindo, {user.displayName}! ao Sistema de Integração ATA</h3>
      <section>
        <ul style={{marginTop: '20px'}}>
          <li onClick={abrirMenuDP}><a href="#">DP</a></li>
          <li onClick={listarRH}><a href="#">RH</a></li>
          <li onClick={abrirCadastroFuncionario}><a href="#">Cadastrar funcionário</a></li>
          {/* <li><a href="#">ADM</a></li> */}
          <li onClick={abrirPerfil}><a href="#">Perfil</a></li>
          <li><a href="#" onClick={handleLogout}>Sair</a></li>
        </ul>
      </section>
      <h3>Um sistema de <img src={logo} alt="" style={{ marginTop: '-30px' }} /> Utilidades</h3>
    </div>
  )
}
