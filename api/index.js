
const express = require('express');
const mongoose = require('mongoose');
const User = require('./schemas/User');
const TCode = require('./schemas/TCode');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAbility = require('./middlewares/authorization/checkAbility');
const jwtMiddleware = require('./middlewares/jwtMiddleware');
const jwtMiddlewareNoLogin = require('./middlewares/jwtMiddlewareNoLogin');
const RestfulExpressRouter = require('restful_express_router'); 
const cors = require('cors');

///////////////////////////////////////////////////////////////
app.use(cors());  // Enable CORS
app.use(express.json());
///////////////////////////////////////////////////////////////
// Add JSON parsing middleware
app.use(express.json());
// Environment variables with fallback values
const PORT = process.env.PORT || 5000;
// const MONGO_URI = "mongodb://localhost:27017/localDb";
const MONGO_URI = "mongodb://admin:password@local_mongo:27017/localDb?authSource=admin";

///////////////////////////////////////////////////////////////
const userRouter = new RestfulExpressRouter(User);
app.use('/user', userRouter.getRouter());

///////////////////////////////////////////////////////////////
const tcodeRouter = new RestfulExpressRouter(TCode);

tcodeRouter.middlewareForList = [jwtMiddlewareNoLogin,checkAbility('list', 'Tcode')]; 
tcodeRouter.middlewareForGetById = [jwtMiddlewareNoLogin,checkAbility('read', 'Tcode')]; // Same 

tcodeRouter.middlewareForCreate = [jwtMiddleware, checkAbility('create', 'Tcode')];
tcodeRouter.middlewareForUpdate = [jwtMiddleware, checkAbility('update', 'Tcode')];
tcodeRouter.middlewareForDelete = [jwtMiddleware, checkAbility('delete', 'Tcode')];

app.use('/tcode', tcodeRouter.getRouter());

///////////////////////////////////////////////////////////////
// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

///////////////////////////////////////////////////////////////
// Home route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Node.js API with MongoDB!' });
});

// Secure route
app.get('/secure', jwtMiddleware, (req, res) => {
  res.json({ message: 'This is a secure route', user: req.user });
});

// User registration
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

// Check database connectivity
app.get('/checkDb', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ message: 'Database connected!', userCount });
  } catch (err) {
    res.status(500).json({ message: 'Database query failed', error: err.message });
  }
});

// User login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = { id: user._id.toString(), email: user.email, role: user.role };
    const token = jwt.sign(payload, 'eea2c1ce3117d5bbba96b9e6791d97d98ca5efd90d242e96927e7ecf79fe97ddf05f071f2ef2352715008adaa4cb2163a647fd0e9cf2343728052be0ceecbfd3', { expiresIn: '15d' });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
