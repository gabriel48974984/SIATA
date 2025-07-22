  import { useState, useEffect } from 'react';
import { db } from '../FirebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';
import './CadastroFuncionario.css';
function isValidCPF(cpf) {
  cpf = cpf.replace(/[\D]/g, '');
  if (cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.charAt(10));
}

export default function CadastroFuncionario() {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')))
  const [form, setForm] = useState({
    nome: '', idade: '', telefone: '', sexo: '', email: user.email, nascimento: '',
    etnia: '', cpf: '', pcd: '', estadoCivil: '', habilitacao: '', escolaridade: '',
    cep: '', endereco: '', numero: '', complemento: '', cidade: '', bairro: '', estado: '',
    unidade: '', setor: '', matricula: '', cargo: '', status: '', admissao: '', demissao: '', turno: '',
    adm: false
  });
  const [foto, setFoto] = useState(user.photoURL);
  const [erros, setErros] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      if (form.cep.length === 9) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${form.cep.replace(/\D/g, '')}/json/`);
          const data = await response.json();
          if (!data.erro) {
            setForm(prev => ({
              ...prev,
              endereco: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              estado: data.uf
            }));
          }
        } catch (error) {
          console.error('Erro ao buscar endereço:', error);
        }
      }
    };
    fetchAddress();
  }, [form.cep]);

  const validateFields = () => {
    const newErrors = {};
    if (!form.nome) newErrors.nome = 'Nome é obrigatório';
    if (!form.email) newErrors.email = 'E-mail é obrigatório';
    if (!form.cpf || !isValidCPF(form.cpf)) newErrors.cpf = 'CPF inválido';
    if (!form.telefone) newErrors.telefone = 'Telefone é obrigatório';
    if (!form.sexo) newErrors.sexo = 'Sexo é obrigatório';
    if (!form.nascimento) newErrors.nascimento = 'Data de nascimento é obrigatória';
    if (!form.idade) newErrors.idade = 'Idade é obrigatória';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErros(validationErrors);
      return;
    }
    try {
      // let fotoURL = '';
      // if (foto) {
      //   const storageRef = ref(storage, `fotos/${form.cpf}.jpg`);
      //   await uploadBytes(storageRef, foto);
      //   fotoURL = await getDownloadURL(storageRef);
      // }
      //const docRef = doc(collection(db, 'FUNCIONARIOS'), form.cpf);
      // const docRef = doc(collection(db, 'SIATA', 'FUNCIONARIOS'), form.cpf);
      //await setDoc(docRef, { ...form, foto: user.photoURL});
      const docRef = doc(collection(db, 'SIATA', 'FUNCIONARIOS', 'CADASTROS'), form.email);
      await setDoc(docRef, { ...form, foto: user.photoURL });

      alert('Funcionário cadastrado com sucesso!');
      setForm({
        nome: '', idade: '', telefone: '', sexo: '', email: '', nascimento: '',
        etnia: '', cpf: '', pcd: '', estadoCivil: '', habilitacao: '', escolaridade: '',
        cep: '', endereco: '', numero: '', complemento: '', cidade: '', bairro: '', estado: '',
        unidade: '', setor: '', matricula: '', cargo: '', status: '', admissao: '', demissao: '', turno: '',
        adm: false
      });
      setFoto(null);
      setErros({});
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao cadastrar funcionário.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Cadastro de Funcionário</h2>
      <form onSubmit={handleSubmit} style={styles.divisoes}>
        {Object.keys(erros).length > 0 && (
          <div style={styles.errorBox}>
            {Object.values(erros).map((msg, i) => (
              <div key={i}>{msg}</div>
            ))}
          </div>
        )}

        {/* <label style={styles.label}>Foto:
          <input style={styles.input} type="file" onChange={e => setFoto(e.target.files[0])} />
        </label> */}
        <h1>Informações Pessoais</h1>

        <div style={styles.pessoais}>
          <label style={styles.label}>Nome:
            <input style={styles.input} type="text" name="nome" value={form.nome} onChange={handleChange} />
          </label>
          {/* <div className='pessoais'> */}

          <label style={styles.label}>CPF:
            <input style={styles.input} type="text" name="cpf" value={form.cpf} onChange={handleChange} />
          </label>
          {/* </div> */}
          {/* <label style={styles.label}>E-mail:
            <input style={styles.input} type="email" name="email" value={form.email} onChange={handleChange} />
          </label> */}

          <label style={styles.label}>Telefone:
            <input style={styles.input} type="text" name="telefone" value={form.telefone} onChange={handleChange} />
          </label>

          <label style={styles.label}>Sexo:
            <select style={styles.input} name="sexo" value={form.sexo} onChange={handleChange}>
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </label>

          <label style={styles.label}>Nascimento:
            <input style={styles.input} type="date" name="nascimento" value={form.nascimento} onChange={handleChange} />
          </label>

          <label style={styles.label}>Idade:
            <input style={styles.input} type="number" name="idade" value={form.idade} onChange={handleChange} />
          </label>

          <label style={styles.label}>Etnia:
            <input style={styles.input} type="text" name="etnia" value={form.etnia} onChange={handleChange} />
          </label>

          <label style={styles.label}>PCD:
            <input style={styles.input} type="text" name="pcd" value={form.pcd} onChange={handleChange} />
          </label>

          <label style={styles.label}>Estado Civil:
            <input style={styles.input} type="text" name="estadoCivil" value={form.estadoCivil} onChange={handleChange} />
          </label>

          <label style={styles.label}>Habilitação:
            <input style={styles.input} type="text" name="habilitacao" value={form.habilitacao} onChange={handleChange} />
          </label>

        </div>
        <h1>Informações Acadêmicas</h1>
        <div style={styles.pessoais}>

          <label style={styles.label}>Escolaridade:
            <input style={styles.input} type="text" name="escolaridade" value={form.escolaridade} onChange={handleChange} />
          </label>
        </div>
        <h1>Informações de Contato</h1>
        <div style={styles.pessoais}>

          <label style={styles.label}>CEP:
            <input style={styles.input} type="text" name="cep" value={form.cep} onChange={handleChange} />
          </label>

          <label style={styles.label}>Endereço:
            <input style={styles.input} type="text" name="endereco" value={form.endereco} onChange={handleChange} />
          </label>

          <label style={styles.label}>Número:
            <input style={styles.input} type="text" name="numero" value={form.numero} onChange={handleChange} />
          </label>

          <label style={styles.label}>Complemento:
            <input style={styles.input} type="text" name="complemento" value={form.complemento} onChange={handleChange} />
          </label>

          <label style={styles.label}>Cidade:
            <input style={styles.input} type="text" name="cidade" value={form.cidade} onChange={handleChange} />
          </label>

          <label style={styles.label}>Bairro:
            <input style={styles.input} type="text" name="bairro" value={form.bairro} onChange={handleChange} />
          </label>

          <label style={styles.label}>Estado:
            <input style={styles.input} type="text" name="estado" value={form.estado} onChange={handleChange} />
          </label>
        </div>

        <h1>Informações Profissionais</h1>
        <div style={styles.pessoais}>
          <label style={styles.label}>Unidade:
            <input style={styles.input} type="text" name="unidade" value={form.unidade} onChange={handleChange} />
          </label>

          <label style={styles.label}>Setor:
            <input style={styles.input} type="text" name="setor" value={form.setor} onChange={handleChange} />
          </label>

          <label style={styles.label}>Matrícula:
            <input style={styles.input} type="text" name="matricula" value={form.matricula} onChange={handleChange} />
          </label>

          <label style={styles.label}>Cargo:
            <input style={styles.input} type="text" name="cargo" value={form.cargo} onChange={handleChange} />
          </label>

          <label style={styles.label}>Status:
            <input style={styles.input} type="text" name="status" value={form.status} onChange={handleChange} />
          </label>

          <label style={styles.label}>Admissão:
            <input style={styles.input} type="date" name="admissao" value={form.admissao} onChange={handleChange} />
          </label>

          <label style={styles.label}>Demissão:
            <input style={styles.input} type="date" name="demissao" value={form.demissao} onChange={handleChange} />
          </label>

          <label style={styles.label}>Turno:
            <input style={styles.input} type="text" name="turno" value={form.turno} onChange={handleChange} />
          </label>
        </div>
        <label style={styles.checkboxLabel}> Administrador:
          <input
            type="checkbox"
            name="adm"
            checked={form.adm}
            onChange={handleChange}
            style={{ marginRight: '10px' }}
          />
        </label>

        <button style={styles.button} type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

const styles = {
  form: {
    margin: 0,
    padding: 0,
    backgroundColor: '#f9f9f9',
    height: 'auto',
    display: 'flex',
  },
  pessoais: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    background: '#f9f9f9',
    padding: '20px',
    borderRadius: '20px',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divisoes: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '20px',
    background: '#f9f9f9',
    padding: '20px',
    borderRadius: '20px',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    maxWidth: '1200px',
    margin: '50px auto',
    padding: '30px',

    fontFamily: 'Arial, sans-serif'
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '44px',
    color: '#fff'
  },

  // form: (isMobile) => ({
  //   display: 'grid',
  //   gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
  //   gap: '20px',
  //   background: '#f9f9f9',
  //   padding: '20px',
  //   borderRadius: '20px',
  //   width: '100%',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // }),
  label: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '14px',
    color: '#333'
  },
  checkboxLabel: {
    gridColumn: '1 / -1',
    fontSize: '14px',
    color: '#333',
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    marginTop: '6px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
    width: '100%',
  },
  button: {
    gridColumn: '1 / -1',
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  errorBox: {
    gridColumn: '1 / -1',
    backgroundColor: '#ffe6e6',
    color: '#b00020',
    padding: '10px',
    borderRadius: '5px',
    fontSize: '14px'
  }
};
// ...existing code...