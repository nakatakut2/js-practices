import Enquirer from "enquirer";

import MemoDatabase from "./memoDatabase.js";

export default class OptionManager {
  constructor() {
    this.database = new MemoDatabase();
  }

  async outputList() {
    try {
      const memos = await this.database.getMemos();
      if (memos.length === 0) {
        console.log("No memos.");
        return;
      }

      for (const memo of memos) {
        console.log(memo.title);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(
          "An error occurred while retrieving the list:",
          err.message
        );
      } else {
        throw err;
      }
    }
  }

  async selectForDetail() {
    try {
      const memos = await this.database.getMemos();
      if (memos.length === 0) {
        console.log("No memos.");
        return;
      }

      const question = {
        type: "select",
        name: "memo_id",
        message: "Choose a memo you want to see:",
        choices: memos.map((memo) => ({ name: memo.title, value: memo.id })),
        result() {
          return this.focused.value;
        },
      };
      const answer = await Enquirer.prompt(question);
      const memo = memos.find(({ id }) => id === answer.memo_id);
      console.log(memo.content);
    } catch (err) {
      if (err instanceof Error) {
        console.error(
          "An error occurred while selecting a memo for details:",
          err.message
        );
      } else {
        throw err;
      }
    }
  }

  async selectForDelete() {
    try {
      const memos = await this.database.getMemos();
      if (memos.length === 0) {
        console.log("No memos.");
        return;
      }

      const question = {
        type: "select",
        name: "memo_id",
        message: "Choose a memo you want to delete:",
        choices: memos.map((memo) => ({ name: memo.title, value: memo.id })),
        result() {
          return this.focused.value;
        },
      };
      const answer = await Enquirer.prompt(question);
      await this.database.deleteMemo(answer.memo_id);
    } catch (err) {
      if (err instanceof Error) {
        console.error(
          "An error occurred while selecting a memo for deletion:",
          err.message
        );
      } else {
        throw err;
      }
    }
  }
}
