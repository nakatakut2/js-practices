import sqlite3 from "sqlite3";

export default class MemoDatabase {
  constructor() {
    this.db = new sqlite3.Database("memo.db");
  }

  createTable = () => {
    return new Promise((resolve, reject) => {
      this.db.run(
        "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT)",
        function (err) {
          if (!err) {
            resolve();
          } else {
            reject(err);
          }
        }
      );
    });
  };

  insertMemo = (title, content) => {
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO memos (title, content) VALUES (?, ?)",
        [title, content],
        function (err) {
          if (!err) {
            resolve();
          } else {
            reject(err);
          }
        }
      );
    });
  };

  getObjectsWithTitle = () => {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT id, title FROM memos ORDER BY id", (err, rows) => {
        if (!err) {
          resolve(rows);
        } else {
          reject(err);
        }
      });
    });
  };

  getObjectWithContent = (answer) => {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT content FROM memos WHERE id = ?",
        [answer],
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

  deleteMemo = (answer) => {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM memos WHERE id = ?", [answer], function (err) {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  };

  close = () => {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  };
}
