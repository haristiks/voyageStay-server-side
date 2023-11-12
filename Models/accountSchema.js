const mongoose = require("mongoose");
const accountSchema = mongoose.Schema({
  _id: String,
  userId: { type: String, ref: "User" },
  type: String,
  provider: String,
  providerAccountId: String,
  refresh_token: String,
  access_token: String,
  expires_at: Number,
  token_type: String,
  scope: String,
  id_token: String,
  session_state: String,
  
});

module.exports = mongoose.model("Account", accountSchema);
