const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT;
app.use(cors({
  // origin:"http://localhost:3000"
  origin:"https://transactionsdashboard.netlify.app/"
}))

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
    const fetchResponse = await fetch('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    if (!fetchResponse.ok) {
      throw new Error('Failed to fetch data');
    }

    const products = await fetchResponse.json();
    await Product.insertMany(products);

    res.json({ message: 'Successfully imported data' });
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
