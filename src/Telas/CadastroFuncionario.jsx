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
  const [senhaMatch, setSenhaMatch] = useState(null); // null, true, false
  const [form, setForm] = useState({
    nome: '', idade: '', telefone: '', sexo: '', email: user.email, nascimento: '',
    etnia: '', cpf: '', pcd: '', estadoCivil: '', habilitacao: '', tipoSanguineo: '', senha: '', repitaSenha: '',
    especializacao: '', previsaoTermino: '', escolaridade: '',
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

  // const validateFields = () => {
  //   const newErrors = {};
  //   if (!form.nome) newErrors.nome = 'Nome é obrigatório';
  //   if (!form.email) newErrors.email = 'E-mail é obrigatório';
  //   if (!form.cpf || !isValidCPF(form.cpf)) newErrors.cpf = 'CPF inválido';
  //   if (!form.telefone) newErrors.telefone = 'Telefone é obrigatório';
  //   if (!form.sexo) newErrors.sexo = 'Sexo é obrigatório';
  //   if (!form.nascimento) newErrors.nascimento = 'Data de nascimento é obrigatória';
  //   if (!form.idade) newErrors.idade = 'Idade é obrigatória';
  //   return newErrors;
  // };

  const validateFields = () => {
    const newErrors = {};
    if (!form.nome) newErrors.nome = 'Nome é obrigatório';
    if (!form.email) newErrors.email = 'E-mail é obrigatório';
    if (!form.cpf || !isValidCPF(form.cpf)) newErrors.cpf = 'CPF inválido';
    if (!form.telefone) newErrors.telefone = 'Telefone é obrigatório';
    if (!form.sexo) newErrors.sexo = 'Sexo é obrigatório';
    if (!form.nascimento) newErrors.nascimento = 'Data de nascimento é obrigatória';
    if (!form.idade) newErrors.idade = 'Idade é obrigatória';

    if (!form.senha || form.senha.length < 6) newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    if (form.senha !== form.repitaSenha) {
      newErrors.repitaSenha = 'As senhas não coincidem';
      setSenhaMatch(false);
    } else {
      setSenhaMatch(true);
    }

    if (
      ['Técnico', 'Superior', 'Pós-Graduação'].includes(form.escolaridade) &&
      !form.especializacao
    ) {
      newErrors.especializacao = 'Informe a área de especialização';
    }

    if (
      form.escolaridade.includes('Incompleto') &&
      !form.previsaoTermino
    ) {
      newErrors.previsaoTermino = 'Informe a previsão de término';
    }

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
      await setDoc(docRef, {
        ...form,
        foto: user.photoURL,
        especializacao: form.especializacao,
        previsaoTermino: form.previsaoTermino
      });

      alert('Funcionário cadastrado com sucesso!');
      setForm({
        nome: '', idade: '', telefone: '', sexo: '', email: '', nascimento: '',
        etnia: '', cpf: '', pcd: '', estadoCivil: '', habilitacao: '', tipoSanguineo: '', senha: '', repitaSenha: '',
        especializacao: '', previsaoTermino: '', escolaridade: '',
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
            <select style={styles.input} name="etnia" value={form.etnia} onChange={handleChange}>
              <option value="">Selecione</option>
              <option value="Indígena">Indígena</option>
              <option value="Branca">Branca</option>
              <option value="Preta">Preta</option>
              <option value="Parda">Parda</option>
              <option value="Amarela">Amarela</option>
              <option value="Outra">Outra</option>
            </select>
          </label>
          
          <label style={styles.label}>PCD:
            <select style={styles.input} name="pcd" value={form.pcd} onChange={handleChange}>
              <option value="">Selecione</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </label>


          <label style={styles.label}>Estado Civil:
            <select style={styles.input} name="estadoCivil" value={form.estadoCivil} onChange={handleChange}>
              <option value="">Selecione</option>
              <option value="Solteiro">Solteiro</option>
              <option value="Casado">Casado</option>
              <option value="Divorciado">Divorciado</option>
              <option value="Viúvo">Viúvo</option>
              <option value="União Estável">União Estável</option>
            </select>
          </label>

          <label style={styles.label}>Habilitação:
            <select style={styles.input} name="habilitacao" value={form.habilitacao} onChange={handleChange}>
              <option value="">Selecione</option>
              <option value="Nenhuma">Nenhuma</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="AB">AB</option>
              <option value="AC">AC</option>
              <option value="AD">AD</option>
              <option value="AE">AE</option>
            </select>
          </label>

            <label style={styles.label}>Tipo Sanguíneo:
            <select style={styles.input} name="tipoSanguineo" value={form.tipoSanguineo} onChange={handleChange}>
              <option value="">Selecione</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </label>

        </div>
        <h1>Informações Acadêmicas</h1>
        <div style={styles.pessoais}>

          <label style={styles.label}>Escolaridade:
            <select style={styles.input} name="escolaridade" value={form.escolaridade} onChange={handleChange}>
              <option value="">Selecione</option>
              <option value="Ensino Fundamental Incompleto">Ensino Fundamental incompleto</option>
              <option value="Ensino Fundamental">Ensino Fundamental</option>
              <option value="Ensino Médio Incompleto">Ensino Médio incompleto</option>
              <option value="Ensino Médio">Ensino Médio</option>
              <option value="Técnico Incompleto">Técnico incompleto</option>
              <option value="Técnico">Técnico</option>
              <option value="Superior Incompleto">Superior incompleto</option>
              <option value="Ensino Superior">Ensino Superior</option>
              <option value="Pós-Graduação Incompleto">Pós-Graduação incompleto</option>
              <option value="Pós-Graduação">Pós-Graduação</option>
            </select>
          </label>

          {['Técnico', 'Superior', 'Pós-Graduação', 'Técnico Incompleto', 'Superior Incompleto', 'Pós-Graduação Incompleto'].includes(form.escolaridade) && (
            <label style={styles.label}>Área de Especialização:
              <input
                style={styles.input}
                type="text"
                name="especializacao"
                value={form.especializacao}
                onChange={handleChange}
              />
            </label>
          )}

          {form.escolaridade.includes('Incompleto') && (
            <label style={styles.label}>Previsão de Término:
              <input
                style={styles.input}
                type="date"
                name="previsaoTermino"
                value={form.previsaoTermino}
                onChange={handleChange}
              />
            </label>
          )}


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

          <label style={styles.label}>Senha:
            <input type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              style={styles.senhaInput(senhaMatch)} />
          </label>

          <label style={styles.label}>Repita Senha:
            <input type="password"
              name="repitaSenha"
              value={form.repitaSenha}
              onChange={handleChange}
              style={styles.senhaInput(senhaMatch)} />
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
            <select style={styles.input} name="status" value={form.status} onChange={handleChange}>
              <option value="">Selecione</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              <option value="Afastado">Afastado</option>
              <option value="Licença">Licença</option>
            </select>
          </label>

          <label style={styles.label}>Admissão:
            <input style={styles.input} type="date" name="admissao" value={form.admissao} onChange={handleChange} />
          </label>

          <label style={styles.label}>Demissão:
            <input style={styles.input} type="date" name="demissao" value={form.demissao} onChange={handleChange} />
          </label>

          <label style={styles.label}>Turno:
            <select style={styles.input} name="turno" value={form.turno} onChange={handleChange}>
              <option value="">Selecione</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
              <option value="Integral">Integral</option>
            </select>
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
  },
  senhaInput: (match) => ({
    marginTop: '6px',
    padding: '10px',
    border: `2px solid ${match === null ? '#ccc' : match ? 'green' : 'red'}`,
    borderRadius: '5px',
    fontSize: '14px',
    width: '100%',
    transition: 'border-color 0.3s ease',
  })

};
// ...existing code...