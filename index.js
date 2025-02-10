// Import required packages
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log('MongoDB connected'))
   .catch((err) => console.log('Failed to connect to MongoDB:', err));

// Define MenuItem Schema
const menuItemSchema = new mongoose.Schema({
   name: { type: String, required: true },
   description: { type: String },
   price: { type: Number, required: true }
});

// Create MenuItem model
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// PUT /menu/:id - Update a Menu Item
app.put('/menu/:id', async (req, res) => {
   const { name, description, price } = req.body;

   // Validate required fields
   if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
   }

   try {
      const updatedItem = await MenuItem.findByIdAndUpdate(
         req.params.id,
         { name, description, price },
         { new: true, runValidators: true }  // Returns updated document and runs schema validation
      );

      if (!updatedItem) {
         return res.status(404).json({ error: 'Menu item not found' });
      }

      res.status(200).json(updatedItem);
   } catch (err) {
      res.status(400).json({ error: err.message });
   }
});

// DELETE /menu/:id - Delete a Menu Item
app.delete('/menu/:id', async (req, res) => {
   try {
      const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);

      if (!deletedItem) {
         return res.status(404).json({ error: 'Menu item not found' });
      }

      res.status(200).json({ message: 'Menu item deleted successfully' });
   } catch (err) {
      res.status(400).json({ error: err.message });
   }
});

// Start the server
app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});