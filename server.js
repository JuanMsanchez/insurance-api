require('dotenv').config();
const config = require('config');
const { app, container } = require('./app');

// Set app constants
const PORT = config.get('port');

const server = app.listen(PORT).on('error', (err) => {
  console.log(err, 'warn');
});

server.on('close', async () => {
  console.log('server closed');
  await container.dispose();
});

console.log(`Server running on port ${PORT}`);

module.exports = server;
