const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory database for simplicity
let users = {
  'admin@klaape.com': {
    id: 'admin',
    email: 'admin@klaape.com',
    password: 'admin123',
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    fullName: 'Admin User',
    dateOfBirth: new Date().toISOString(),
    role: 'admin',
    profileCompleted: true,
    createdAt: new Date().toISOString(),
    emailVerified: true,
    verificationCode: '123456'
  }
};

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Delete user
app.delete('/api/users/:email', (req, res) => {
  const email = req.params.email;
  
  if (users[email]) {
    delete users[email];
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Update user
app.put('/api/users/:email', (req, res) => {
  const email = req.params.email;
  
  if (users[email]) {
    users[email] = { ...users[email], ...req.body };
    res.json(users[email]);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Add user
app.post('/api/users', (req, res) => {
  const user = req.body;
  
  if (!user.email) {
    return res.status(400).json({ error: 'Email required' });
  }
  
  users[user.email] = user;
  res.json(user);
});

// Serve the admin panel
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/web-admin.html');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
