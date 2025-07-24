import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FaWhatsapp, FaPhone, FaTelegram, FaBackward } from 'react-icons/fa';

export default function EditarFuncionario() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFuncionario = async () => {
      try {
        const docRef = doc(db, 'SIATA', 'FUNCIONARIOS', 'CADASTROS', email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setForm(docSnap.data());
        } else {
          alert("Funcionário não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar funcionário:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFuncionario();
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, 'SIATA', 'FUNCIONARIOS', 'CADASTROS', email);
      await updateDoc(docRef, form);
      alert("Dados atualizados com sucesso.");
      navigate(-1);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao atualizar funcionário.");
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (!form) return <p>Funcionário não encontrado.</p>;

  return (
    <div style={styles.container}>
      <button style={styles.voltar} onClick={() => window.location.href = '/Menu'}>
        <FaBackward style={styles.iconVoltar} />
      </button>
      <h2 style={styles.title}>Editar Funcionário</h2>
      <div style={styles.form}>
        {Object.entries(form).map(([campo, valor]) =>
          campo !== 'foto' && (
            <label key={campo} style={styles.label}>
              {campo}:
              <input
                style={styles.input}
                type="text"
                name={campo}
                value={valor}
                onChange={handleChange}
              />
            </label>
          )
        )}
        <button style={styles.botao} onClick={handleUpdate}>Salvar</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '50px auto',
    padding: '30px',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '15px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '8px 8px 10px rgba(0,0,0,0.1)',
    backgroundColor: '#f9f9f9',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '14px'
  },
  input: {
    width: '340px',
    padding: '10px',
    fontSize: '14px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
  },
  botao: {
    with: '800px',
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
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

};
