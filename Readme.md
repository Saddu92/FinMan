# 💰 FinMan – Personal Finance Visualizer

FinMan is a full-stack web application that helps users track their expenses and manage budgets with easy-to-understand charts and summaries.

Live Demo:https://fin-man-sigma.vercel.app/


---

## 🚀 Features

- 💸 Add, view, and delete transactions
- 📊 Visualize monthly expenses using BarChart
- 🥧 Category-wise breakdown using PieChart
- 🧠 Set and manage monthly budgets
- ⚙️ Backend with Express.js, MongoDB, and RESTful APIs
- 🌐 Fully deployed using Vercel (frontend) and Render (backend)

---

## 🛠️ Tech Stack

### 🔹 Frontend
- React.js
- Vite
- Tailwind CSS
- Recharts
- shadcn/ui
- Axios

### 🔹 Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- dotenv
- cors

---



---

## 📦 API Endpoints

### 🔹 Transactions
| Method | Endpoint                    | Description            |
|--------|-----------------------------|------------------------|
| GET    | `/api/transactions/get`     | Get all transactions   |
| POST   | `/api/transactions/create`  | Create a new one       |
| DELETE | `/api/transactions/delete/:id` | Delete by ID        |

### 🔹 Budgets
| Method | Endpoint                      | Description         |
|--------|-------------------------------|---------------------|
| GET    | `/api/budgets/getBudgets`     | Get current budget  |
| POST   | `/api/budgets/setBudget`      | Set new budget      |
| DELETE | `/api/budgets/deleteBudget`   | Delete a budget     |



---

## ⚠️ Known Issues

- No authentication yet (for single-user use only)
- No date filters or export features (planned for future)

---

## 🧠 Future Improvements

- 🔐 User login/signup with JWT
- 📆 Filter transactions by date/month
- 📁 Export transactions to CSV
- 📲 Convert to PWA with offline support

---

## 🙌 Acknowledgements

Special thanks to:
- OpenAI ChatGPT for guidance and troubleshooting during deployment.
- Render and Vercel for seamless free hosting.
- You, for checking out FinMan!

---

## 📫 Contact

Made with ❤️ by Mohammad Saad 
📧 Email: shaikhmdsaad92@gmail.com



