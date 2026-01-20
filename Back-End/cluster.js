const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const cores = os.cpus().length;
  for (let i = 0; i < cores; i++) {
    cluster.fork();
  }
} else {
  require('./app'); // your server
}


// CLUSTER – “Copy the app many times”
// Step-by-step pattern

// You have 1 Node.js app
// Your computer has many CPU cores
// Node.js normally uses only 1 core
// Cluster copies your app
// Each copy runs on a different core
// Incoming users are shared between copies

// In simple words
// 👉 Same app, many copies, many cores