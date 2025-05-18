import React, { useEffect, useState } from 'react'
import '../styles/ListaTarefas.css'
import FormTarefa from './FormTarefa'
import EditarTarefa from './EditarTarefa'

async function buscarTarefas() {
  const resp = await fetch('http://localhost:3444/tarefas')
  return resp.json()
}

export default function ListaTarefas() {
  const [tarefas, setTarefas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [criando, setCriando] = useState(false)
  const [editando, setEditando] = useState(null)

  function atualizarTarefas() {
    setCarregando(true)
    buscarTarefas().then(data => {
      setTarefas(data)
      setCarregando(false)
    })
  }

  useEffect(() => {
    atualizarTarefas()
  }, [])

  if (criando) {
    return (
      <FormTarefa
        onTarefaCriada={() => {
          setCriando(false)
          atualizarTarefas()
        }}
      />
    )
  }

  if (editando) {
    return (
      <EditarTarefa
        tarefa={editando}
        onTarefaEditada={() => {
          setEditando(null)
          atualizarTarefas()
        }}
        onCancelar={() => setEditando(null)}
      />
    )
  }

  return (
    <div className="lista-tarefas-container">
      <div className="lista-tarefas-header">
        <h1>Minhas Tarefas</h1>
        <div className="lista-tarefas-actions">
          <button onClick={() => setCriando(true)}>
            Nova tarefa
          </button>
          <button onClick={() => alert('Abrir modal de filtros (implementar depois)')}>
            Filtrar tarefas
          </button>
        </div>
      </div>

      {carregando && <div>Carregando tarefas...</div>}

      {tarefas.length === 0 && !carregando && (
        <div style={{ color: '#888', margin: '2em 0' }}>
          Nenhuma tarefa encontrada.<br />
          Clique em <b>Nova tarefa</b> para adicionar a primeira!
        </div>
      )}

      {tarefas.map(tarefa => (
        <div
          key={tarefa.id}
          className={`tarefa-card prioridade-${tarefa.prioridade} ${tarefa.dataConclusao ? 'tarefa-concluida' : ''}`}
          title="Clique para ver detalhes"
        >
          <div className="tarefa-titulo">{tarefa.titulo}</div>
          <div className="tarefa-descricao">{tarefa.descricao}</div>
          <div className="tarefa-info">
            Criada em: {new Date(tarefa.dataCriacao).toLocaleDateString()}<br />
            Prioridade: {tarefa.prioridade}
          </div>
          <div className="tarefa-acoes">
            {!tarefa.dataConclusao && (
              <>
                <button
                  onClick={async (e) => {
                    e.stopPropagation()
                    await fetch(`http://localhost:3444/tarefas/${tarefa.id}/concluir`, { method: 'PATCH' })
                    setTarefas(tarefas =>
                      tarefas.map(t =>
                        t.id === tarefa.id ? { ...t, dataConclusao: new Date().toISOString() } : t
                      )
                    )
                  }}
                >
                  Concluir
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    setEditando(tarefa)
                  }}
                >
                  Editar
                </button>
              </>
            )}
            {tarefa.dataConclusao && <span>✅ Concluída</span>}
          </div>
        </div>
      ))}
    </div>
  )
}