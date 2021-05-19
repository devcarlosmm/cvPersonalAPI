//MongoDB

/* const mongoose = require("mongoose");

const urlMongo = process.env.MONGO_URL;
const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
};
mongoose.connect(urlMongo, config);
 */
//MYSQL

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'talatroncos12',
    database: 'project_media'
});


connection.connect((err) => {

    if (!err)
        console.log('Database is connected!');
    else
        console.log('Database not connected! : ' + JSON.stringify(err, undefined, 2));
});
// Export the pool
module.exports = connection;