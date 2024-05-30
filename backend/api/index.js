const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const { todoModel } = require('../todo.schema')

require('dotenv').config()

// initialize Express.js server and save as a variable
// so it can be referred to as `app`
const app = express();

app.use(bodyParser.json());
app.use(cors())

mongoose.connect(process.env.DB_URL, {
}).then(() => console.log)

// GET endpoint to fetch all todo items
app.get("/todos", async (req, res) => {
  let todos = await todoModel.find({})
  todos = todos.map((todo) => {
    todo.id = todo._id
    return todo
  })
  res.json(todos);
});

// POST endpoint to create a new todo item
// provide `title` and optionally `completed` in the request body as JSON
app.post("/todos", async (req, res) => {
  console.log(req.body.name)
  const todo = await todoModel.create({
    name: req.body.name,
    status: 0
  })

  res.status(201).json(todo);
});

// PUT endpiont to update an existing todo item with the specified `id`
// provide updated `title` and/or `completed` in the request body as JSON
app.put("/todos/:id", async (req, res) => {
  const id = req.params.id;
  const todo = await todoModel.findById({ _id: id }).exec();
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  await todoModel.updateOne({
    name: req.body.name,
    status: req.body.status
  }).where({
    _id: id
  })
  todo.name = req.body.name
  res.json(todo);
});

// DELETE endpoint to remove an existing todo item with the specified `id`
app.delete("/todos/:id", async (req, res) => {
  const id = req.params.id;
  const todo = await todoModel.findById({ _id: id }).exec();
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  await todoModel.deleteOne({ _id: id })
  res.json({
    'message': 'success'
  }).send();
});

// run the server on port 3000
// for example the app can run locally at this URL: http://localhost:3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;