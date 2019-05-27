const  mysql = require('mysql');
const  connection = mysql.createConnection({
host :  'localhost', 
user :  'root', // 
password :  'Elkrief', 
database :  'filrouge', 
});
module.exports = connection;