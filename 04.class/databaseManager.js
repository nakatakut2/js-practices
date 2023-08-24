import sqlite3 from "sqlite3";

export default class DatabaseManager {
  constructor() {
    this.db = new sqlite3.Database("memo.db");
  }

  createTable = (db) => {
    return new Promise((resolve, reject) => {
      db.run(
        "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT)",
        function (err) {
          if (!err) {
            resolve(this);
          } else {
            reject(err);
          }
        }
      );
    });
  };

  insertMemo = (db, title, content) => {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO memos (title, content) VALUES ('${title}', '${content}')`,
        function (err) {
          if (!err) {
            resolve(this);
          } else {
            reject(err);
          }
        }
      );
    });
  };

  getAllTitles = (db) => {
    return new Promise((resolve, reject) => {
      db.all("SELECT title FROM memos ORDER BY id", (err, rows) => {
        if (!err) {
          resolve(rows);
        } else {
          reject(err);
        }
      });
    });
  };

  getContent = (db, answer) => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT content FROM memos WHERE title = '${answer}'`,
        (err, row) => {
          if (!err) {
            resolve(row);
          } else {
            reject(err);
          }
        }
      );
    });
  };

  deleteMemo = (db, answer) => {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM memos WHERE title = '${answer}'`, function (err) {
        if (!err) {
          resolve(this);
        } else {
          reject(err);
        }
      });
    });
  };

  close = (db) => {
    return new Promise((resolve, reject) => {
      db.close((err) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  };
}
