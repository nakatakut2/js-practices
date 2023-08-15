import sqlite3 from "sqlite3";
import { setTimeout } from "timers/promises";

let db;

// 1.コールバック（エラーなし）
db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run("INSERT INTO books (title) VALUES ('sample1')", function () {
      console.log(this.lastID);
      db.get("SELECT title FROM books", (_, row) => {
        console.log(row);
        db.run("DROP TABLE books", () => {
          db.close();
        });
      });
    });
  }
);

await setTimeout(100);

// 1.コールバック（エラーあり）
db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run("INSERT INTO books (title) VALUES (NULL)", (err) => {
      console.error(err.message);
      db.get("SELECT hoge FROM books", (err) => {
        console.error(err.message);
        db.run("DROP TABLE books", () => {
          db.close();
        });
      });
    });
  }
);

await setTimeout(100);

// 2.Promise
// Promiseでラップした関数の定義
const runAsync = (db, sql) => {
  return new Promise((resolve, reject) => {
    db.run(sql, function (err) {
      if (!err) {
        resolve(this);
      } else {
        reject(err);
      }
    });
  });
};

const getAsync = (db, sql) => {
  return new Promise((resolve, reject) => {
    db.get(sql, (err, row) => {
      if (!err) {
        resolve(row);
      } else {
        reject(err);
      }
    });
  });
};

const closeAsync = (db) => {
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

// 2.Promise（エラーなし）
db = new sqlite3.Database(":memory:");

runAsync(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
)
  .then(() => {
    return runAsync(db, "INSERT INTO books (title) VALUES ('sample1')");
  })
  .then((res) => {
    console.log(res.lastID);
    return getAsync(db, "SELECT title FROM books");
  })
  .then((row) => {
    console.log(row);
    return runAsync(db, "DROP TABLE books");
  })
  .then(() => {
    return closeAsync(db);
  });

await setTimeout(100);

// 2.Promise（エラーあり）

db = new sqlite3.Database(":memory:");
runAsync(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
)
  .then(() => {
    return runAsync(db, "INSERT INTO books (title) VALUES (NULL)");
  })
  .catch((err) => {
    console.error(err.message);
    return getAsync(db, "SELECT hoge FROM books");
  })
  .catch((err) => {
    console.error(err.message);
    return runAsync(db, "DROP TABLE books");
  })
  .then(() => {
    return closeAsync(db);
  });

await setTimeout(100);

// 3.async/await（エラーなし）

db = new sqlite3.Database(":memory:");

const asyncMain = async () => {
  await runAsync(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
  );

  const res = await runAsync(
    db,
    "INSERT INTO books (title) VALUES ('sample1')"
  );
  console.log(res.lastID);
  const row = await getAsync(db, "SELECT title FROM books");
  console.log(row);
  await runAsync(db, "DROP TABLE books");
  await closeAsync(db);
};

asyncMain();

await setTimeout(100);

// 3.async/await（エラーあり）

db = new sqlite3.Database(":memory:");

const asyncMain2 = async () => {
  await runAsync(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
  );
  try {
    await runAsync(db, "INSERT INTO books (title) VALUES (NULL)");
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      throw err;
    }
  }
  try {
    await getAsync(db, "SELECT hoge FROM books");
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      throw err;
    }
  }
  await runAsync(db, "DROP TABLE books");
  await closeAsync(db);
};

asyncMain2();
