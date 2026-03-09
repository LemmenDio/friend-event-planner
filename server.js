const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static('client/build'));

// In-memory storage for events (in production, use a proper database)
let events = [];

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send current events to new user
  socket.emit('events', events);

  // Handle new event
  socket.on('addEvent', (eventData) => {
    const newEvent = {
      id: uuidv4(),
      ...eventData,
      createdAt: new Date().toISOString()
    };
    events.push(newEvent);
    io.emit('eventAdded', newEvent);
  });

  // Handle event update
  socket.on('updateEvent', (updatedEvent) => {
    const index = events.findIndex(e => e.id === updatedEvent.id);
    if (index !== -1) {
      events[index] = { ...events[index], ...updatedEvent };
      io.emit('eventUpdated', events[index]);
    }
  });

  // Handle event deletion
  socket.on('deleteEvent', (eventId) => {
    events = events.filter(e => e.id !== eventId);
    io.emit('eventDeleted', eventId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// REST API endpoints
app.get('/api/events', (req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const newEvent = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  events.push(newEvent);
  io.emit('eventAdded', newEvent);
  res.json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const index = events.findIndex(e => e.id === req.params.id);
  if (index !== -1) {
    events[index] = { ...events[index], ...req.body };
    io.emit('eventUpdated', events[index]);
    res.json(events[index]);
  } else {
    res.status(404).json({ error: 'Event not found' });
  }
});

app.delete('/api/events/:id', (req, res) => {
  events = events.filter(e => e.id !== req.params.id);
  io.emit('eventDeleted', req.params.id);
  res.json({ success: true });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/client/build/index.html');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
