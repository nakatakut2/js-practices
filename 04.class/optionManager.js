import Enquirer from "enquirer";

import MemoDatabase from "./memoDatabase.js";

export default class OptionManager {
  constructor() {
    this.database = new MemoDatabase();
  }

  async outputList() {
    try {
      const rows = await this.database.getObjectsWithTitle();
      if (rows.length === 0) {
        console.log("No memos.");
      } else {
        for (const row of rows) {
          console.log(row.title);
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        throw err;
      }
    }
  }

  async selectForDetail() {
    try {
      const rows = await this.database.getObjectsWithTitle();
      if (rows.length === 0) {
        console.log("No memos.");
      } else {
        const question = {
          type: "select",
          name: "memo",
          message: "Choose a memo you want to see:",
          choices: rows.map((row) => ({ name: row.title, value: row.id })),
          result() {
            return this.focused.value;
          },
        };
        const answer = await Enquirer.prompt(question);
        const res = await this.database.getObjectWithContent(answer.memo);
        const allLines = res.content.split(/\s/);
        for (const line of allLines) {
          console.log(line);
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        throw err;
      }
    }
  }

  async selectForDelete() {
    try {
      const rows = await this.database.getObjectsWithTitle();
      if (rows.length === 0) {
        console.log("No memos.");
      } else {
        const question = {
          type: "select",
          name: "memo",
          message: "Choose a memo you want to delete:",
          choices: rows.map((row) => ({ name: row.title, value: row.id })),
          result() {
            return this.focused.value;
          },
        };
        const answer = await Enquirer.prompt(question);
        await this.database.deleteMemo(answer.memo);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        throw err;
      }
    }
  }
}
