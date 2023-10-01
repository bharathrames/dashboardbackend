const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT;


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  sold: Boolean,
  dateOfSale: Date,
});


const Product = mongoose.model('Product', productSchema);


app.get('/fetch-data', async (req, res) => {
  try {
    
    const response = await axios.get(
      'https://s3.amazonaws.com/roxiler.com/product_transaction.json'
    );

    
    const products = response.data;
    await Product.insertMany(products);

    res.json({ message: 'sucessfully imported data' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error importing data' });
  }
});

app.get('/data', async (req, res) => {
  try {
    
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
