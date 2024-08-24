const express = require("express");
const app = express();
const mongooose = require("mongoose");
const bcrypt = require("bcryptjs");

app.use(express.json());

const mongoUrl =
  "mongodb+srv://rahulraddi4:8095341540sm@cluster0.v3tto.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongooose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

require("./userDetails");

const User = mongooose.model("UserInfo");

app.get("/", (req, res) => {
  res.send({ status: "Started" });
});

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
      mobile,
      encryptedPassword,
    });
    res.send({ status: "ok", data: "User Created Successfully" });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
