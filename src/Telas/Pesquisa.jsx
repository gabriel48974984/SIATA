import React, { useState, useEffect } from 'react';
import './Pesquisa.css';
import { db } from '../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { FaWhatsapp, FaPhone, FaTelegram, FaBackward } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Pesquisa() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroSelecionado, setFiltroSelecionado] = useState('');
  const [valorFiltro, setValorFiltro] = useState('');
  const [funcionarios, setFuncionarios] = useState([]);
  const [modalFuncionario, setModalFuncionario] = useState(null);
  const [ordenacao, setOrdenacao] = useState('');
  const [ordemCrescente, setOrdemCrescente] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'SIATA', 'FUNCIONARIOS', 'CADASTROS'));
        const lista = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            nome: data.nome || '',
            cargo: data.cargo || '',
            setor: data.setor || '',
            unidade: data.unidade || '',
            status: data.status || 'Indefinido',
            foto: data.foto || '',
            admissao: data.admissao || data.dataAdmissao || '', // Usado para ordenação
            tempo: calcularTempoAdmissao(data.admissao || data.dataAdmissao),
          };
        });
        setFuncionarios(lista);
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
      }
    };

    fetchFuncionarios();
  }, []);

  function calcularTempoAdmissao(dataAdmissao) {
    if (!dataAdmissao) return '';
    const admissao = new Date(dataAdmissao);
    const hoje = new Date();
    const diffMeses = (hoje.getFullYear() - admissao.getFullYear()) * 12 + (hoje.getMonth() - admissao.getMonth());

    if (diffMeses < 1) return 'Menos de 1 mês';
    if (diffMeses === 1) return '1 mês';
    if (diffMeses < 12) return `${diffMeses} meses`;
    const anos = Math.floor(diffMeses / 12);
    const mesesRestantes = diffMeses % 12;
    return mesesRestantes === 0 ? `${anos} anos` : `${anos} anos e ${mesesRestantes} meses`;
  }

  const funcionariosFiltrados = funcionarios.filter(func => {
    const nomeMatch = func.nome.toLowerCase().includes(searchTerm.toLowerCase());

    if (['Ativo', 'Inativo', 'Demitido'].includes(filtroSelecionado)) {
      return nomeMatch && func.status === filtroSelecionado;
    }

    if (filtroSelecionado && valorFiltro) {
      return nomeMatch && (func[filtroSelecionado]?.toLowerCase() || '').includes(valorFiltro.toLowerCase());
    }

    return nomeMatch;
  });

  // Ordenação
  const funcionariosOrdenados = [...funcionariosFiltrados].sort((a, b) => {
    const asc = ordemCrescente ? 1 : -1;
    if (ordenacao === 'nome') {
      return a.nome.localeCompare(b.nome) * asc;
    }
    if (ordenacao === 'admissao') {
      return (new Date(a.admissao) - new Date(b.admissao)) * asc;
    }
    return 0;
  });

  function formatarFiltro(filtro) {
    switch (filtro) {
      case 'Ativo': return 'Ativos';
      case 'Inativo': return 'Inativos';
      case 'Demitido': return 'Demitidos';
      case 'tempo': return 'Tempo de Empresa';
      case 'cargo': return 'Cargo';
      case 'setor': return 'Setor';
      case 'unidade': return 'Unidade';
      default: return '';
    }
  }

  return (
    <div className="container-pesquisa">
      <button style={styles.voltar} onClick={() => window.location.href = '/Menu'}>
        <FaBackward style={styles.iconVoltar} />
      </button>

      <input
        type="text"
        className="barra-pesquisa"
        placeholder="Digite o nome do funcionário"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="botoes-filtros">
        {['Ativo', 'Inativo', 'Demitido', 'cargo', 'setor', 'unidade'].map((item) => (
          <button
            key={item}
            className={`botao-filtro ${filtroSelecionado === item ? 'selecionado' : ''}`}
            onClick={() => {
              setFiltroSelecionado(item);
              setValorFiltro('');
            }}
          >
            {formatarFiltro(item)}
          </button>
        ))}
      </div>

      {['cargo', 'setor', 'unidade'].includes(filtroSelecionado) && (
        <input
          type="text"
          className="campo-filtro"
          placeholder={`Digite o ${formatarFiltro(filtroSelecionado).toLowerCase()}`}
          value={valorFiltro}
          onChange={(e) => setValorFiltro(e.target.value)}
        />
      )}

      <div className="ordenacao-container">
        <select
          className="campo-filtro"
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value)}
        >
          <option value="">Ordenar por</option>
          <option value="nome">Nome</option>
          <option value="admissao">Data de Admissão</option>
        </select>

        {ordenacao && (
          <button className="botao-toggle" onClick={() => setOrdemCrescente(!ordemCrescente)}>
            {ordemCrescente ? '▲ Crescente' : '▼ Decrescente'}
          </button>
        )}
      </div>

      <div className="grid-funcionarios">
        {funcionariosOrdenados.length > 0 ? (
          funcionariosOrdenados.map((func) => (
            <div
              key={func.id}
              className="card-funcionario"
              onClick={() => setModalFuncionario(func)}
            >
              <img src={func.foto || '/placeholder.png'} alt={func.nome} className="foto-funcionario" />
              <span className="nome-funcionario">{func.nome}</span>
            </div>
          ))
        ) : (
          <p className="mensagem-nao-encontrado">Nenhum funcionário encontrado.</p>
        )}
      </div>

      {modalFuncionario && (
        <div className="modal-overlay" onClick={() => setModalFuncionario(null)}>
          <div className="modal-conteudo" onClick={e => e.stopPropagation()}>
            <img src={modalFuncionario.foto || '/placeholder.png'} alt={modalFuncionario.nome} className="foto-modal" />
            <h2>{modalFuncionario.nome}</h2>
            <p><strong>Status:</strong> {modalFuncionario.status}</p>
            <p><strong>Tempo de empresa:</strong> {modalFuncionario.tempo}</p>
            <p><strong>Cargo:</strong> {modalFuncionario.cargo}</p>
            <p><strong>Setor:</strong> {modalFuncionario.setor}</p>
            <p><strong>Unidade:</strong> {modalFuncionario.unidade}</p>
            <button className="botao-editar" onClick={() => navigate(`/editar/${encodeURIComponent(modalFuncionario.email)}`)}>
              Editar
            </button>
          </div>
        </div>
      )}
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
};
