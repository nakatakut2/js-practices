import sqlite3 from "sqlite3";

export default class MemoDatabase {
  constructor() {
    this.db = new sqlite3.Database("memo.db");
  }

  createTable() {
    return new Promise((resolve, reject) => {
      this.db.run(
        "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT)",
        (err) => {
          if (!err) {
            resolve();
          } else {
            reject(err);
          }
        }
      );
    });
  }

  insertMemo(title, content) {
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO memos (title, content) VALUES (?, ?)",
        [title, content],
        (err) => {
          if (!err) {
            resolve();
          } else {
            reject(err);
          }
        }
      );
    });
  }

  getMemos() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM memos ORDER BY id", (err, rows) => {
        if (!err) {
          resolve(rows);
        } else {
          reject(err);
        }
      });
    });
  }

  deleteMemo(id) {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM memos WHERE id = ?", [id], (err) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }
}
