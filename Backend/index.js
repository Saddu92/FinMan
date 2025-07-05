const express= require('express');
const mongoose= require('mongoose');
const cors=require('cors');
const tranRoutes = require('./routes/transactionRoutes');
require('dotenv').config();
const connectDB = require('./config/db');


const app= express();
const port=process.env.PORT || 5000;

connectDB();


// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/transactions',tranRoutes);

app.listen(port || 5000, () => {
  console.log(`Server running on port ${port}`);
});