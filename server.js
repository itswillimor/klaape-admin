const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Data file
const DATA_FILE = 'users.json';

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({
    users: {
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
    }
  }));
}

// Get all users
app.get('/api/users', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data.users);
});

// Delete user
app.delete('/api/users/:email', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const email = req.params.email;
  
  if (data.users[email]) {
    delete data.users[email];
    fs.writeFileSync(DATA_FILE, JSON.stringify(data));
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Update user
app.put('/api/users/:email', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const email = req.params.email;
  
  if (data.users[email]) {
    data.users[email] = { ...data.users[email], ...req.body };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data));
    res.json(data.users[email]);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Add user
app.post('/api/users', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const user = req.body;
  
  if (!user.email) {
    return res.status(400).json({ error: 'Email required' });
  }
  
  data.users[user.email] = user;
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  res.json(user);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
