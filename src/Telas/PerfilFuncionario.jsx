import { useState, useEffect } from 'react';
import { db } from '../FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function PerfilFuncionario() {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
  const [dados, setDados] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erros, setErros] = useState({});

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const docRef = doc(db, 'SIATA', 'FUNCIONARIOS', 'CADASTROS', user.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDados(docSnap.data());
        } else {
          console.log("Funcionário não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDados();
  }, [user.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, 'SIATA', 'FUNCIONARIOS', 'CADASTROS', user.email);
      await updateDoc(docRef, dados);
      alert("Perfil atualizado com sucesso!");
      setEditMode(false);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao atualizar perfil.");
    }
  };

  if (loading) return <p>Carregando perfil...</p>;
  if (!dados) return <p>Perfil não encontrado.</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Perfil do Funcionário</h2>

      <div style={styles.card}>
        <img src={dados.foto} alt="Foto do funcionário" style={styles.foto} />

        {Object.entries(dados).map(([chave, valor]) => (
          chave !== 'foto' && (
            <div key={chave} style={styles.infoBox}>
              <strong>{chave}:</strong>
              {editMode ? (
                <input
                  type="text"
                  name={chave}
                  value={valor}
                  onChange={handleChange}
                  style={styles.input}
                />
              ) : (
                <span>{valor}</span>
              )}
            </div>
          )
        ))}

        {dados.adm && (
          <div style={styles.botoes}>
            {editMode ? (
              <>
                <button style={styles.salvar} onClick={handleUpdate}>Salvar</button>
                <button style={styles.cancelar} onClick={() => setEditMode(false)}>Cancelar</button>
              </>
            ) : (
              <button style={styles.editar} onClick={() => setEditMode(true)}>Editar Perfil</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '50px auto',
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '24px',
    color: '#333'
  },
  card: {
    background: '#f9f9f9',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  foto: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '50%',
    marginBottom: '20px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  infoBox: {
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #ccc',
    paddingBottom: '6px'
  },
  input: {
    padding: '5px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '60%'
  },
  botoes: {
    marginTop: '20px',
    display: 'flex',
    gap: '10px',
    justifyContent: 'center'
  },
  editar: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  salvar: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  cancelar: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};
