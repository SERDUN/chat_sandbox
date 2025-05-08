import express from 'express';
import cors from 'cors';


const app = express();
app.use(express.json());
app.use(cors());
app.use(cors({
  origin: 'https://chat-sanbox-web.fly.dev'
}));

const users = new Map(); // userId => { name, lastSeen }
const messages = [];     // { userId, text, timestamp }
const events = [];       // { userId, type, text, timestamp }

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

// Register user
app.post('/register', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const userId = generateId();
  users.set(userId, { name, lastSeen: Date.now() });

  events.push({ userId, type: 'registered', text: 'User registered', timestamp: Date.now() });

  res.json({ userId });
});

// Send message
app.post('/send', (req, res) => {
  const { userId, text } = req.body;
  if (!users.has(userId)) return res.status(401).json({ error: 'User not registered' });

  users.get(userId).lastSeen = Date.now();
  messages.push({ userId, text, timestamp: Date.now() });

  res.json({ success: true });
});

// Get new messages
app.get('/messages', (req, res) => {
  const { userId, since } = req.query;
  if (!users.has(userId)) return res.status(401).json({ error: 'User not registered' });

  users.get(userId).lastSeen = Date.now();

  const sinceTime = Number(since) || 0;
  const newMessages = messages.filter(m => m.timestamp > sinceTime);

  res.json({ messages: newMessages, now: Date.now() });
});

// Get new events
app.get('/events', (req, res) => {
  const { userId, since } = req.query;
  if (!users.has(userId)) return res.status(401).json({ error: 'User not registered' });

  users.get(userId).lastSeen = Date.now();

  const sinceTime = Number(since) || 0;
  const newEvents = events.filter(e => e.timestamp > sinceTime);

  res.json({ events: newEvents, now: Date.now() });
});

// Get all users
app.get('/users', (req, res) => {
  const userList = Array.from(users.entries()).map(([id, data]) => ({
    userId: id,
    ...data,
  }));
  res.json({ users: userList });
});

// Get one user by ID
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const user = users.get(id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({ userId: id, ...user });
});

// Remove inactive users
function cleanupInactiveUsers() {
  const now = Date.now();
  for (const [userId, user] of users.entries()) {
    if (now - user.lastSeen > 3 * 60 * 1000) {
      users.delete(userId);
      events.push({ userId, type: 'removed', text: 'User removed due to inactivity', timestamp: now });
      console.log(`Removed inactive user ${user.name} (${userId})`);
    }
  }
}
setInterval(cleanupInactiveUsers, 60 * 60 * 1000 * 24); // once a day

// Start server
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});