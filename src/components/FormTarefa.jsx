import React, { useState } from 'react'
import '../styles/FormTarefa.css'

export default function FormTarefa({ onTarefaCriada }) {
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [prioridade, setPrioridade] = useState('baixa')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    if (!titulo || !descricao || !prioridade) {
      setErro('Preencha todos os campos!')
      return
    }
    setCarregando(true)
    try {
      const resp = await fetch('http://localhost:3444/tarefas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          descricao,
          prioridade,
          dataCriacao: new Date().toISOString()
        })
      })
      if (!resp.ok) throw new Error('Erro ao criar tarefa')
      setTitulo('')
      setDescricao('')
      setPrioridade('baixa')
      setSucesso(true)
      // Não chama onTarefaCriada aqui, só depois do clique no botão
    } catch {
      setErro('Erro ao criar tarefa')
    } finally {
      setCarregando(false)
    }
  }

  if (sucesso) {
    return (
      <div className="form-tarefa">
        <h2>Tarefa criada com sucesso!</h2>
        <button onClick={onTarefaCriada}>Voltar para a lista</button>
      </div>
    )
  }

  return (
    <form className="form-tarefa" onSubmit={handleSubmit}>
      <h2>Criar Nova Tarefa</h2>
      {erro && <div className="form-erro">{erro}</div>}
      <label>
        Título:
        <input
          type="text"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          required
        />
      </label>
      <label>
        Descrição:
        <textarea
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          required
        />
      </label>
      <label>
        Prioridade:
        <select
          value={prioridade}
          onChange={e => setPrioridade(e.target.value)}
          required
        >
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
      </label>
      <button type="submit" disabled={carregando}>
        {carregando ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  )
}