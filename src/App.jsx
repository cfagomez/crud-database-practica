import React from 'react'
import {firebase} from './firebase'

function App() {

  const [tarea, setTarea] = React.useState('')
  const [listaTareas, setListaTareas] = React.useState([])
  const [modoEdicion, setModoEdicion] = React.useState(false)
  const [id, setId] = React.useState('')

  React.useEffect(()=>{

    const obtenerDatos = async () => {

      try {
        const db = firebase.firestore()
        const data = await db.collection('tareas-2').get()
        const arrayData = data.docs.map(item => ({
          id: item.id, ...item.data()
        }))
        setListaTareas(arrayData)

      } catch (error) {
        console.log(error)
      }

    }

    obtenerDatos()

  },[])

  const agregarTarea = async (e) => {

    e.preventDefault()

    if (!tarea.trim()) {
      console.log('Campo vacio')
      return
    }

    try {
      const db = firebase.firestore()
      const data = db.collection('tareas-2').add({
        name: tarea,
        fecha: Date.now()
      })
      setListaTareas([
        ...listaTareas, {
          name: tarea,
          fecha: Date.now(),
          id: data.id
        }
      ])
    } catch (error) {
      console.log(error)
    }

    setTarea('')

  }

  const eliminarTarea = async (id) => {

    try {
      const db = firebase.firestore()
      await db.collection('tareas-2').doc(id).delete()
    } catch (error) {
      console.log(error)
    }

    const arrayFiltrado = listaTareas.filter((item => item.id !== id))

    setListaTareas(arrayFiltrado)

  }

  const activarModoEdicion = (item) => {

    setModoEdicion(true)
    setTarea(item.name)
    setId(item.id)

  }

  const editarTarea = async (e) => {

    e.preventDefault()

    if(!tarea.trim()) {
      console.log('Campo vacio')
      return
    }

    try {

      const db = firebase.firestore()
      await db.collection('tareas-2').doc(id).update({
        name: tarea
      })

    } catch (error) {
      console.log(error)
    }

    const arrayEditado = listaTareas.map(item => (item.id === id ? {id: id, name: tarea, fecha: item.fecha} : item))

    setListaTareas(arrayEditado)

    setTarea('')
    setModoEdicion(false)
    setId('')

  }

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6 text-center">
          <h2>Lista de tareas</h2>
          <ul className="list-group mt-2">
            {
              listaTareas.map((item) => (
                <li key={item.id} className="list-group-item">
                  {item.name}
                  <button onClick={()=>activarModoEdicion(item)} className='btn btn-warning float-end btn-sm mx-2'>Editar</button>
                  <button onClick={()=>eliminarTarea(item.id)} className='btn btn-danger float-end btn-sm'>Eliminar</button>
                </li>
              ))
            }
          </ul>
        </div>
        <div className="col-md-6 text-center">
          <h2>
            {
              modoEdicion ? 'Editar tareas' : 'Agregar tareas'
            }
          </h2>
          <form onSubmit={modoEdicion ? editarTarea : agregarTarea} className='mt-2'>
            <input 
              type="text"
              className="form-control"
              value={tarea}
              onChange={(e)=>setTarea(e.target.value)}
              placeholder='Tarea'
            />
            <button type="submit" className={modoEdicion ? 'btn btn-warning btn-block mt-2' : 'btn btn-primary btn-block mt-2'}>
              {
                modoEdicion ? 'Editar' : 'Agregar'
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
