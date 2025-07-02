// const express = require("express");
// const router = express.Router();
// const Expense = require("../models/Expense");

// // Add Expense
// router.post("/add", async (req, res) => {
//   try {
//     const { title, amount, type, userId } = req.body;
//     const newExpense = new Expense({ title, amount, type, userId });
//     await newExpense.save();
//     res.status(201).json(newExpense);
//   } catch (err) {
//     res.status(500).json({ msg: "Error adding expense", error: err.message });
//   }
// });

// // Get All Expenses for a User
// router.get("/:userId", async (req, res) => {
//   try {
//     const expenses = await Expense.find({ userId: req.params.userId }).sort({ createdAt: -1 });
//     res.json(expenses);
//   } catch (err) {
//     res.status(500).json({ msg: "Error fetching expenses", error: err.message });
//   }
// });

// // Delete Expense
// router.delete("/:id", async (req, res) => {
//   try {
//     await Expense.findByIdAndDelete(req.params.id);
//     res.json({ msg: "Deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ msg: "Error deleting", error: err.message });
//   }
// });

// module.exports = router;
// server/routes/expense.js

// server/routes/expense.js
const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const authenticateUser = require("../middleware/auth");
const mongoose = require("mongoose"); 
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { title, amount, type } = req.body;

    console.log("📥 Incoming Data:", { title, amount, type });
    console.log("🔐 User ID from token:", req.user.id);

    const expense = new Expense({
  title,
  amount,
  type,
  userId: req.user.id  // ✅ This must be a string (like "68639e1fa65721870cc538ea")
});


    const saved = await expense.save();

    console.log("✅ Saved Expense:", saved);

    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error saving expense:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/", authenticateUser, async (req, res) => {
  console.log("📥 GET /api/expense hit by user:", req.user.id);
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    res.json(expenses);
  } catch (err) {
    console.error("❌ Error fetching expenses:", err);
    res.status(500).json({ message: "Server error" });
  }
});


//Delete
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    res.json({ message: '✅ Expense deleted successfully' });
  } catch (err) {
    console.error("❌ Error deleting expense:", err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
