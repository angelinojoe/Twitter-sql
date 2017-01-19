var pg = require("pg");
const client = new pg.Client("postgres://localhost/twitterdb");


client.connect();
// client.query("SELECT * FROM users", function(err, data){
//   if (err) return err;
//   data.rows.forEach(row=>console.log(row))
// })


module.exports = client;
