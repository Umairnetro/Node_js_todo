const express = require("express");
const { v4: uuidv4 } = require("uuid");

// helpers functions
const {
  registerSchema,
  loginSchema,
  validate,
} = require("./helpers/validation");
const { readJSON, writeJSON } = require("./helpers/fileOps");

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

  const users = readJSON("userinfo.json");
  let user = users.find((u) => {
    return u.username === username;
  });

  console.log({ user });

  if (!user || user.password !== password) {
    return res.status(401).send({
      message: "Invalid username or password.",
    });
  }

  res.status(200).send({
    message: "Login Successful",
    username,
    password,
    user,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
