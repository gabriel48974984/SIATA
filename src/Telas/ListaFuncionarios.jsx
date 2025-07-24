import { useState, useEffect } from 'react';
import { db } from '../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaPhone, FaTelegram, FaBackward } from 'react-icons/fa';

export default function ListaFuncionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const colRef = collection(db, 'SIATA', 'FUNCIONARIOS', 'CADASTROS');
        const snapshot = await getDocs(colRef);
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFuncionarios(lista);
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
      }
    };

    fetchFuncionarios();
  }, []);

  return (
    <div style={styles.container}>
       <button style={styles.voltar} onClick={() => window.location.href = '/Menu'}>
                      <FaBackward style={styles.iconVoltar} />
                  </button>
      <h2 style={styles.title}>Lista de Funcionários</h2>
      <div style={styles.lista}>
        {funcionarios.map(func => (
          <div key={func.id} style={styles.card}>
            <img src={func.foto} alt="Foto" style={styles.foto} />
            <div style={styles.info}>
              <p><strong>Nome:</strong> {func.nome}</p>
              <p><strong>Matrícula:</strong> {func.matricula}</p>
              <p><strong>Setor:</strong> {func.setor}</p>
              <p><strong>Cargo:</strong> {func.cargo}</p>
              <p><strong>Status:</strong> {func.status}</p>
              <p><strong>Admissão:</strong> {func.admissao}</p>
              <button
                style={styles.botao}
                onClick={() => navigate(`/editar/${encodeURIComponent(func.email)}`)}
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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
  container: {
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: 'auto'
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '20px'
  },
  lista: {
    display: 'flex',
    flexDirection: 'row ',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    gap: '20px'
  },
  card: {
    display: 'flex',
    backgroundColor: '#d0e8ff',
    borderRadius: '15px',
    padding: '20px',
    alignItems: 'center',
    boxShadow: '8px 8px 10px rgba(0,0,0,0.1)',
    flexDirection: 'row',
    width: '400px',
  },
  foto: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '20px',
    border: '2px solid #007bff'
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  botao: {
    marginTop: '10px',
    width: '120px',
    padding: '8px 12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  }
};
