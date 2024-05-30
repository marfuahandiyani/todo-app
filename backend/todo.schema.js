const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
  id: mongoose.SchemaTypes.ObjectId,
  name: mongoose.SchemaTypes.String,
  status: mongoose.SchemaTypes.Number
})

exports.default = todoSchema;


const todoModel = mongoose.model('todos', todoSchema)
exports.todoModel = todoModel