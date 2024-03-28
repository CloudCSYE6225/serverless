const Sequelize = require('sequelize');

try 
{
    const sequelize = new Sequelize({
        dialect: 'mysql',
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database:  process.env.DB_NAME,
        port: process.env.DB_PORT, // MySQL default port
    });
    module.exports = sequelize;
}
catch(error)
{
    console.error('Error loading .env file', error)
}