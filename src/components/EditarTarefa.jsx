import React, { useState } from 'react'
import '../styles/FormTarefa.css'

export default function EditarTarefa({ tarefa, onTarefaEditada, onCancelar }) {
  const [titulo, setTitulo] = useState(tarefa.titulo)
  const [descricao, setDescricao] = useState(tarefa.descricao)
  const [prioridade, setPrioridade] = useState(tarefa.prioridade)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    if (!titulo || !descricao || !prioridade) {
      setErro('Preencha todos os campos!')
      return
    }
    setCarregando(true)
    try {
      const resp = await fetch(`http://localhost:3444/tarefas/${tarefa.id}/prioridade`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prioridade })
      })
      const resp2 = await fetch(`http://localhost:3444/tarefas/${tarefa.id}/titulo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo })
      })
      const resp3 = await fetch(`http://localhost:3444/tarefas/${tarefa.id}/descricao`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descricao })
      })
      if (!resp.ok || !resp2.ok || !resp3.ok) throw new Error('Erro ao editar tarefa')
      if (onTarefaEditada) onTarefaEditada()
    } catch {
      setErro('Erro ao editar tarefa')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <form className="form-tarefa" onSubmit={handleSubmit}>
      <h2>Editar Tarefa</h2>
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
      <div style={{ display: 'flex', gap: '1em', marginTop: '1em' }}>
        <button type="submit" disabled={carregando}>
          {carregando ? 'Salvando...' : 'Salvar'}
        </button>
        <button type="button" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  )
}