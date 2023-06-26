import path from "path";

const sqlite3 = require('sqlite3').verbose();

// Open a database connection
const x = path.join(process.cwd() + '/database')
const db = new sqlite3.Database(x);

// Execute SELECT query
db.all('SELECT * FROM subjects;', (err: any, rows: any) => {
  if (err) {
    console.error(err);
  } else {
    console.log(rows);
  }
});

// db.all('SELECT * FROM projectDiagrams;', (err: any, rows: any) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(rows);
//   }
// });

// Close the database connection
db.close();