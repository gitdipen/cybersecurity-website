const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8081; // Consistent with Jenkins deployment port

// Serve static files from the project root (where index.html, css, js are assumed to be)
// This assumes your static files (index.html, css/, js/) are still in the project root.
// If you already moved them to a 'frontend' folder, adjust this path accordingly:
// app.use(express.static(path.join(__dirname, '../../frontend'))); // If frontend is in a sibling folder
app.use(express.static(path.join(__dirname, '../'))); // Assuming index.html, css, js are one level up from backend/

// Simple Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is healthy.' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Serving static content from: ${path.join(__dirname, '../')}`);
});