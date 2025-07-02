import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './Dashboard.css';

const Dashboard = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/expense", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTransactions(res.data);
    } catch (err) {
      console.error("🔥 Error fetching transactions:", err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/expense", {
        title,
        amount,
        type
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setTitle('');
      setAmount('');
      setType('income');
      fetchTransactions();
    } catch (err) {
      console.error("🔥 Error adding transaction:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expense/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchTransactions();
    } catch (err) {
      console.error("🔥 Error deleting transaction:", err);
    }
  };

  useEffect(() => {
    if (!token) {
      alert("🔒 Please login first");
      navigate("/login");
    } else {
      fetchTransactions();
    }
  }, [navigate]);

  const totalIncome = transactions.filter(tx => tx.type === "income").reduce((acc, cur) => acc + Number(cur.amount), 0);
  const totalExpense = transactions.filter(tx => tx.type === "expense").reduce((acc, cur) => acc + Number(cur.amount), 0);
  const balance = totalIncome - totalExpense;

  const chartData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ["#4CAF50", "#F44336"]
      }
    ]
  };

  return (
    <div className="dashboard-container">
      <h1 className="main-heading">📊 Finance Dashboard</h1>
      <div className="summary">
        <div>Total Income: ₹{totalIncome}</div>
        <div>Total Expense: ₹{totalExpense}</div>
        <div>Remaining Balance: ₹{balance}</div>
      </div>

      <div className="chart-box">
        <Pie data={chartData} />
      </div>

      <form className="form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button type="submit">Add</button>
      </form>

      <div className="transactions">
        {transactions.map(tx => (
          <div key={tx._id} className="transaction">
            <span>{tx.title} — ₹{tx.amount} ({tx.type})</span>
            <button onClick={() => handleDelete(tx._id)}>❌</button>
          </div>
        ))}
      </div>

      <button
        className="logout-btn"
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;



