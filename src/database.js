const mysql = require('promise-mysql')

const connection = mysql.createConnection({ 
    // Funcion de conexion a la base de datos
    // si se ejecuta un error se debe usar en el workbench de MySQL de la base de datos
    // la siguiente instruccion para actualizar el protocolo de seguridad:
    //ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'AQUI PASSWORD';
    host: 'localhost',
    user: 'root',
    password: 'sabi2404',
    //ssl: 'DHE-RSA-AES128-GCM-SHA256'
    database: 'flow_db'
})

function getConnection(){
    return connection;
}
module.exports = {getConnection}