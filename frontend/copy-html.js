const fs = require('fs');
const path = require('path');

// Define routes
const routes = [
  '/messages',
  '/login',
  '/buying',
  '/selling',
  '/bookmarks',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-code',
  '/account'
];

const buildDir = path.join(__dirname, 'build');
const indexPath = path.join(buildDir, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

// Create directories and copy index.html for each route
routes.forEach(route => {
  const routeDir = path.join(buildDir, route);
  
  // Create the directory if it doesn't exist
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  
  // Copy index.html to each route directory
  fs.writeFileSync(path.join(routeDir, 'index.html'), indexContent);
  console.log(`Created ${route}/index.html`);
});

console.log('HTML files created successfully!');