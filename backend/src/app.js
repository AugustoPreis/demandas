require('dotenv/config');

const { init } = require('./server');
const { connect } = require('./config/database/database');

connect().then(init);