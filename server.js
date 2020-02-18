const express = require('express');
const accountsRouter =  require('./accounts/accounts-router')

const server = express();
server.use(express.json());
server.use('/api/accounts', accountsRouter);

server.get('/', (req, res) => {
    res.send('<h3>DB Helpers with knex</h3>');
  });



module.exports = server;