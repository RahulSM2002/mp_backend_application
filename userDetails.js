const mongooose = require("mongoose");

const UserDetailSchema = new mongooose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    mobile: String,
    password: String,
  },
  {
    collection: "UserInfo",
  }
);

mongooose.model("UserInfo", UserDetailSchema);
