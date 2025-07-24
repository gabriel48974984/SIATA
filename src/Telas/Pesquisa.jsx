import React, { useState, useEffect } from 'react';
import './Pesquisa.css';
import { db } from '../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function Pesquisa() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroSelecionado, setFiltroSelecionado] = useState('');
  const [valorFiltro, setValorFiltro] = useState('');
  const [funcionarios, setFuncionarios] = useState([]);
  const [modalFuncionario, setModalFuncionario] = useState(null);
  const [ordenacao, setOrdenacao] = useState('');

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
            foto: data.foto || '', // deve conter a URL da foto
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
       <select
          className="campo-filtro"
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value)}
        >
          <option value="">Ordenar por</option>
          <option value="Crescente (A-Z)">Crescente (A-Z)</option>
          <option value="Decrescente (Z-A)">Decrescente (Z-A)</option>
          <option value="maisAntigo">Mais antigo</option>
          <option value="maisRecente">Mais recente</option>
        </select>

      <div className="grid-funcionarios">
        {funcionariosFiltrados.length > 0 ? (
          funcionariosFiltrados.map((func) => (
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
            <button className="botao-editar" onClick={() => alert("Editar funcionalidade aqui")}>
              Editar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
