const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const SRC_DIR = path.join(__dirname, 'src');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Simple HTML template that includes React from CDN
const getIndexHTML = () => {
  try {
    console.log('Reading source files...');
    const appJS = fs.readFileSync(path.join(SRC_DIR, 'App.js'), 'utf8');
    const appCSS = fs.readFileSync(path.join(SRC_DIR, 'App.css'), 'utf8');
    const indexCSS = fs.readFileSync(path.join(SRC_DIR, 'index.css'), 'utf8');
    console.log('Files read successfully');
    console.log('App.js length:', appJS.length);
    console.log('App.css length:', appCSS.length);

  // Clean up the App.js code for browser use
  let cleanedAppJS = appJS
    .replace(/import\s+React,\s*\{\s*useState,\s*useEffect\s*\}\s*from\s+['"]react['"];?/g, '')
    .replace(/import\s+React.*from\s+['"]react['"];?/g, '')
    .replace(/import\s+.*from\s+['"].*['"];?/g, '')
    .replace(/export\s+default\s+App;?/g, '')
    .trim();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="3 Month Capability Matrix - Drag and Drop Planning Tool" />
  <title>3 Month Capability Matrix</title>
  <style>${indexCSS}</style>
  <style>${appCSS}</style>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect } = React;
    
    ${cleanedAppJS}
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      React.createElement(React.StrictMode, null,
        React.createElement(App, null)
      )
    );
  </script>
  <script>
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      console.error('Error: ' + msg + '\\nURL: ' + url + '\\nLine: ' + lineNo + '\\nColumn: ' + columnNo + '\\nError object: ' + JSON.stringify(error));
      return false;
    };
  </script>
</body>
</html>`;
  } catch (error) {
    console.error('Error generating HTML:', error);
    return '<html><body><h1>Error loading app</h1><pre>' + error.message + '</pre></body></html>';
  }
};

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log('Request:', req.url);
  try {
    if (req.url === '/' || req.url === '/index.html') {
      console.log('Generating HTML...');
      const html = getIndexHTML();
      console.log('HTML length:', html.length);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }

    // Serve static files from public directory
    let filePath = path.join(PUBLIC_DIR, req.url);
    
    if (!fs.existsSync(filePath)) {
      // Try src directory
      filePath = path.join(SRC_DIR, req.url);
    }

    if (fs.existsSync(filePath)) {
      const extname = String(path.extname(filePath)).toLowerCase();
      const contentType = mimeTypes[extname] || 'application/octet-stream';
      
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } else {
      res.writeHead(404);
      res.end('File not found');
    }
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500);
    res.end('Server error: ' + error.message);
  }
});

server.listen(PORT, () => {
  console.log(`\n🚀 Development Server running at http://localhost:${PORT}/`);
  console.log(`📁 Serving React app from source files\n`);
  console.log('✨ Changes to src/App.js and src/App.css will be visible on refresh\n');
  console.log('Press Ctrl+C to stop the server\n');
});
