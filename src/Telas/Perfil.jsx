import './Menu.css'
import './Perfil.css'
import logo from '../assets/logo-1001.png'
import { useState } from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
export default function Perfil() {
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
            <div className='perfil-info'>
                <img src={user.photoURL} alt="" />
                <h2>{user.displayName}</h2>
                <h3>Instrutor</h3>
                <form className='perfil-form'>
                    <div>
                        <p><b>Endereço: </b>Rua A, 123, Bairro B, Cidade C</p>
                    </div>
                
                    <div>
                        <p><b>Email: </b>{user.email}</p>
                    </div>
                    <div>
                        <p><b>Telefone: </b>{user.phoneNumber}</p>
                    </div>
                </form>
            </div>
        </div>
    )
}