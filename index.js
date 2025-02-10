require('dotenv').config(); // This loads the .env file

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log('MongoDB connected'))
   .catch((err) => console.log('Failed to connect to MongoDB:', err));

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});