// In your Express/Node.js server
const compression = require('compression');

// Add BEFORE your routes
app.use(compression({
  level: 6, // Compression level (1-9)
  threshold: 1024, // Only compress responses > 1kb
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

// This reduces response size by 60-80%
// 100kb response → 20-40kb with compression