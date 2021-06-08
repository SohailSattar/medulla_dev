var env = process.env.NODE_ENV || 'development',
config = require('./config.json');

if(env === 'development'){
    module.exports = config[env];
}else if(env === 'production'){
    module.exports = {
        "username": process.env.username,
        "password": process.env.password,
        "database": process.env.database,
        "host": process.env.host,
        "dialect": "mysql",
        "secret": process.env.secret
      }
}