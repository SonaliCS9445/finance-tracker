const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }  // ✅ Correctly typed ObjectId
});

module.exports = mongoose.model("Expense", expenseSchema);

