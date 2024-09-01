const express = require("express");
const app = express();
const mongoose = require("mongoose"); // Fixed typo here
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
app.use(express.json());

const mongoUrl =
  "mongodb+srv://rahulraddi4:8095341540sm@cluster0.v3tto.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose // Corrected here as well
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

const JWT_SECRET =
  "kejfncvwqlkemxndkbr40ru094jrnfoi1ubf90j4-r9h039irei4hr080924ru09@*(U#@UH#DIUHiuheujghvwqlugkuwf86iysvtf86saf7tavaao7fa7vco76f7stav76fs7vsa7tc7ta7isctibgv28h9ug38w2ij9ehoiwh9eh0h93uw7g79h^%R*T&%DCUGU";
require("./userDetails");

const User = mongoose.model("UserInfo");

app.get("/", (req, res) => {
  res.send({ status: "Started" });
});

// Sign-Up API
app.post("/register", async (req, res) => {
  const { name, email, mobile, password } = req.body;

  const oldUser = await User.findOne({ email: email });

  if (oldUser) {
    return res.send({ status: "User Already Exists!!!" });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    await User.create({
      name: name,
      email: email,
      mobile: mobile,
      password: encryptedPassword, // Note the field name used here
    });
    res.send({ status: "ok", data: "User Created Successfully" });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

// Sign-In API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const oldUser = await User.findOne({ email: email });

  if (!oldUser) {
    return res.send({ data: "User Not Found, Please check your email id" });
  }

  // Ensure you are accessing the correct field
  if (await bcrypt.compare(password, oldUser.password)) {
    const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);
    return res.status(201).send({ status: "ok", token: token });
  } else {
    return res.status(401).send({ status: "error", data: "Invalid password" });
  }
});

//Getting UserData
app.post("/userdata", async (req, res) => {
  const { token } = req.body;

  try {
    const user = jwt.verify(token, JWT_SECRET);
    const userEmail = user.email;
    User.findOne({ email: userEmail }).then((data) => {
      return res.send({ status: "ok", data: data });
    });
  } catch (err) {
    return res.send({ status: "error", data: "Invalid token" });
  }
});

app.post("/changePassword", async (req, res) => {
  const { token, password } = req.body;
  console.log(req, "request");

  const user = jwt.verify(token, JWT_SECRET);
  const userEmail = user.email;
  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    await User.updateOne({ email: userEmail }, { password: encryptedPassword });
    return res.send({ status: "ok", data: "Password Updated Successfully" });
  } catch (error) {
    return res.send({ status: "error", data: error });
  }
});

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
