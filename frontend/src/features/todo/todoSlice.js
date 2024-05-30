import { createSlice } from '@reduxjs/toolkit'

export const todoSlice = createSlice({
  name: 'todo',
  initialState: {
    loading: false,
    error: null,
    data: []
  },
  reducers: {
    setTodos: (state, action) => {
      state.data = action.payload
    },
    addTodo: ({ data }, action) => {
      data.push(action.payload)
    },
    toggleTodoStatus: ({ data }, action) => {
      const index = action.payload
      data[index].status = data[index].status == 1 ? 0 : 1;
    },
    editTodoName: ({ data }, action) => {
      const index = action.payload.index
      data[index].name = action.payload.name
    },
    deleteTodo: ({ data }, action) => {
      const index = action.payload
      data.splice(index, 1)
    },
    setErrorMessage: (state, action) => {
      state.error = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { addTodo, toggleTodoStatus, editTodoName, deleteTodo, setTodos, setErrorMessage, setLoading } = todoSlice.actions

export default todoSlice.reducer