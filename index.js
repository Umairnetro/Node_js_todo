const express = require("express");
const { v4: uuidv4 } = require("uuid");

// helpers functions
const {
  registerSchema,
  loginSchema,
  taskSchema,
  validate,
} = require("./helpers/validation");
const { readJSON, writeJSON } = require("./helpers/fileOps");
const { generateToken, verifyToken } = require("./helpers/auth");

const port = 3000;
const app = express();

app.use(express.json()); // for parsing JSON request bodies

// Register Route
app.post("/register", (req, res) => {
  const validationError = validate(req.body, registerSchema);
  if (validationError) return res.status(400).send(validationError);

  const { username, password } = req.body;

  let users = readJSON("userInfo.json");
  if (users.find((user) => user.username === username)) {
    return res.status(400).send("Username is already exists.");
  }

  const newUser = { id: uuidv4(), username, password };
  users.push(newUser);
  writeJSON("userInfo.json", users);

  res.status(201).send({
    message: "User registered successfully.",
    body: req.body,
    users,
    newUser,
  });
});

// Login Route
app.post("/login", (req, res) => {
  const validationError = validate(req.body, loginSchema);
  if (validationError) return res.status(400).send(validationError);

  const { username, password } = req.body;

  const users = readJSON("userInfo.json");
  let user = users.find((u) => {
    return u.username === username;
  });

  if (!user || user.password !== password) {
    return res.status(401).send({
      message: "Invalid username or password.",
    });
  }

  const token = generateToken(user.username, user.id);
  res.json({ token });
});

// Get todos
app.get("/todos", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader;

  if (!token) return res.status(401).send("Access denied.");

  const user = verifyToken(token);
  if (!user) return res.status(403).send("Invalid token.");

  const todos = readJSON("todo.json");
  res.json(todos.filter((todo) => todo.username === user.username));
});

// Add todos
app.post("/todos", (req, res) => {
  const validationError = validate(req.body, taskSchema);
  if (validationError) return res.status(400).send(validationError);

  const { task } = req.body;
  const authHeader = req.headers.authorization;

  const token = authHeader;

  if (!token) return res.status(401).send("Access denied.");

  const user = verifyToken(token);
  if (!user) return res.status(403).send("Invalid token.");

  const todos = readJSON("todo.json");
  const newTask = { id: uuidv4(), username: user.username, task };
  todos.push(newTask);
  writeJSON("todo.json", todos);

  res.status(201).send("Task added successfully.");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
