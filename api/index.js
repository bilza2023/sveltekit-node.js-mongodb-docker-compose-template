const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());  // Enable CORS
app.use(express.json());

const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.LOCAL_MONGO_URI; 
const MONGO_URI = "mongodb://admin:password@local_mongo:27017/localDb?authSource=admin";

console.log('MONGO_URI:', MONGO_URI);

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.json({ message: 'Hello World from API!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
