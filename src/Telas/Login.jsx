import './login.css'
import logo from '../assets/logo-1001.png'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import app from '../FirebaseConfig'
export default function Login() {
  const [user, setUser] = useState('')
  const [senha, setSenha] = useState('')
  const navigate = useNavigate()

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider()
    const auth = getAuth(app)
    try {
      const result = await signInWithPopup(auth, provider)
      console.log('Usuário:', result)
      sessionStorage.setItem('user', JSON.stringify(result.user))
      navigate('/Menu')
    } catch (error) {
      alert('Erro ao autenticar com Google: ' + error.message)
    }
  }
  return (
    <div>
      <img src={logo} alt="" id='logo1' />
      <h2>SIATA</h2>
      <h3>Sistema de Integração ATA</h3>
      <button type="button" onClick={handleGoogleLogin}>Entrar com Google</button>
      <h3>Um sistema de <img src={logo} alt="" /> Utilidades</h3>
    </div>
  )
}