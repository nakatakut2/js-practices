import Enquirer from "enquirer";
import DatabaseManager from "./databaseManager.js";

export default class OptionManager {
  constructor() {
    this.database = new DatabaseManager();
  }

  outputList = async () => {
    try {
      const rows = await this.database.getAllTitles(this.database.db);
      if (rows.length === 0) {
        console.log("No memos.");
      } else {
        for (const row of rows) {
          console.log(row.title);
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  selectForDetail = async () => {
    try {
      const rows = await this.database.getAllTitles(this.database.db);
      if (rows.length === 0) {
        console.log("No memos.");
      } else {
        const list = rows.map((row) => {
          return row.title;
        });
        const question = {
          type: "select",
          name: "memo",
          message: "Choose a note you want to see:",
          choices: list,
        };
        const answer = await Enquirer.prompt(question);
        const res = await this.database.getContent(
          this.database.db,
          answer.memo
        );
        const allLines = res.content.split(" ");
        allLines.forEach((line) => {
          console.log(line);
        });
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  selectForDelete = async () => {
    try {
      const rows = await this.database.getAllTitles(this.database.db);
      if (rows.length === 0) {
        console.log("No memos.");
      } else {
        const list = rows.map((row) => {
          return row.title;
        });
        const question = {
          type: "select",
          name: "memo",
          message: "Choose a note you want to delete:",
          choices: list,
        };
        const answer = await Enquirer.prompt(question);
        await this.database.deleteMemo(this.database.db, answer.memo);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
}
