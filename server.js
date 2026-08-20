require('dotenv').config();
const express = require('express');
const cors = require('cors');
const workflowRoutes = require('./routes/workflowRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory (index.html)
app.use(express.static('public'));

// API Routes
app.use('/workflow', workflowRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend Execution Server running on port ${PORT}`));