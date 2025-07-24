import './Menu.css'
import './Perfil.css'
import logo from '../assets/logo-1001.png'
import { useState } from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FaWhatsapp, FaPhone, FaTelegram, FaBackward } from 'react-icons/fa';

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
            <button style={styles.voltar} onClick={() => window.location.href = '/Menu'}>
                <FaBackward style={styles.iconVoltar} />
            </button>
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

const styles = {

    voltar: {
        width: '50px',
        height: '50px',
        position: 'fixed',
        top: '20px',
        left: '20px',
        borderRadius: '25px',
    },
    iconVoltar: {
        fontSize: '44px',
        width: '100%',
        height: '100%',
        color: '#333',
    },
}