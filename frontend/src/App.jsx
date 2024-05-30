import { useEffect, useState } from 'react';
import './App.css';
import TodoItem from './components/TodoItem';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, deleteTodo, editTodoName, setErrorMessage, setLoading, setTodos, toggleTodoStatus } from './features/todo/todoSlice';

const url = import.meta.env.VITE_API_URL;

function App() {
  const [status, setStatus] = useState(-1);


  const todos = useSelector((state) => state.todos.data)
  const loading = useSelector(state => state.todos.loading)
  const error = useSelector(state => state.todos.error)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setLoading(true))
    fetch(`${url}/todos`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        return response.json();
      })
      .then(data => {
        dispatch(setTodos(data))
      }).catch(error => {
        dispatch(setErrorMessage(error.message))
      }).finally(() => {
        dispatch(setLoading(false))
      })
  }, [dispatch])

  const filteredTodos = todos.filter((todo) => {
    if (status === -1) return true;
    return todo.status === status;
  })

  const handlerChangeStatus = (event) => {
    const filteredStatus = event.target.getAttribute('data-filter');
    setStatus(Number(filteredStatus));
  }

  const editTodo = (id, name, index) => {
    fetch(`${url}/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        return response.json();
      })
      .then(data => {
        dispatch(editTodoName({ index, name }))
      }).catch(error => {
        dispatch(setErrorMessage(error.message))
      }).finally(() => {
        dispatch(setLoading(false))
      })
  }

  const editTodoStatus = (id, status, index) => {
    fetch(`${url}/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        status: status == 1 ? 0 : 1
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        return response.json();
      })
      .then(data => {
        dispatch(toggleTodoStatus(index))
      }).catch(error => {
        dispatch(setErrorMessage(error.message))
      }).finally(() => {
        dispatch(setLoading(false))
      })
  }

  const handleDeleteTodo = (id, index) => {
    fetch(`${url}/todos/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        return response.json();
      })
      .then(data => {
        dispatch(deleteTodo(index))
      }).catch(error => {
        dispatch(setErrorMessage(error.message))
      }).finally(() => {
        dispatch(setLoading(false))
      })
  }

  const addTodoItem = (event) => {
    event.preventDefault();
    const todoName = document.querySelector('input[type=text]').value;

    if (todoName.trim().length === 0) {
      alert('Todo Name Can\'t Empty');
      return;
    }

    fetch(`${url}/todos`, {
      method: 'POST',
      body: JSON.stringify({
        name: todoName
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        return response.json();
      })
      .then(data => {
        console.log(data)
        dispatch(addTodo(data))
      }).catch(error => {
        dispatch(setErrorMessage(error.message))
      }).finally(() => {
        dispatch(setLoading(false))
      })
    document.querySelector('input[type=text]').value = '';
  }

  const RenderTodoList = () => {
    return (
      <div className="todo_app_list">
        {
          filteredTodos.length > 0 ? filteredTodos.map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={() => handleDeleteTodo(todo.id, index)}
              onEdit={(newName) => editTodo(todo.id, newName, index)}
              onToggleStatus={() => editTodoStatus(todo.id, todo.status, index)}
            />
          ))
            : <h4 className='todo_app_list_notfound'>No Todo</h4>
        }
      </div>
    )
  }

  const RenderLoading = () => (
    <div className="todo_app_list">
      <h4>Loading</h4>
    </div>
  )

  const RenderErrorMessage = () => (
    <div className="todo_app_list">
      <h4>Error: {error}</h4>
    </div>
  )

  return (
    <div className='todo-wrapper'>
      <h1 className="todo_app_title">
        What's the plan for today?
      </h1>
      <div className="todo_app_card">
        <form className="todo_app_input" onSubmit={addTodoItem}>
          <input type="text" name="name" placeholder='What to do' />
          <button onClick={addTodoItem}>Add</button>
        </form>
        <div className="todo_app_filter">
          <button className={"todo_app_filter_item " + (status == -1 ? 'active' : '')} data-filter="-1" onClick={handlerChangeStatus}>All</button>
          <button className={"todo_app_filter_item " + (status == 1 ? 'active' : '')} data-filter="1" onClick={handlerChangeStatus}>Completed</button>
          <button className={"todo_app_filter_item " + (status == 0 ? 'active' : '')} data-filter="0" onClick={handlerChangeStatus}>Active</button>
        </div>
        {
          loading ? <RenderLoading /> : error == null ? <RenderTodoList /> : <RenderErrorMessage />
        }
      </div>
    </div>
  );
}

export default App;
