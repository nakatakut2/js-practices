import Enquirer from "enquirer";

import MemoDatabase from "./memoDatabase.js";

export default class OptionManager {
  constructor() {
    this.database = new MemoDatabase();
  }

  async outputList() {
    let memos;
    try {
      memos = await this.database.getMemos();
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

    if (memos.length === 0) {
      console.log("No memos.");
      return;
    }

    for (const memo of memos) {
      console.log(memo.title);
    }
  }

  async selectForDetail() {
    let memos;
    try {
      memos = await this.database.getMemos();
    } catch (err) {
      if (err instanceof Error) {
        console.error(
          "An error occurred while selecting memos for details from DataBase:",
          err.message
        );
      } else {
        throw err;
      }
    }

    if (memos.length === 0) {
      console.log("No memos.");
      return;
    }

    const question = {
      type: "select",
      name: "memoId",
      message: "Choose a memo you want to see:",
      choices: memos.map((memo) => ({ name: memo.title, value: memo.id })),
      result() {
        return this.focused.value;
      },
    };

    let answer;
    try {
      answer = await Enquirer.prompt(question);
    } catch (err) {
      console.error("Program has been interrupted.");
      return;
    }

    const memo = memos.find(({ id }) => id === answer.memoId);
    console.log(memo.content);
  }

  async selectForDelete() {
    let memos;
    try {
      memos = await this.database.getMemos();
    } catch (err) {
      if (err instanceof Error) {
        console.error(
          "An error occurred while selecting memos for deletion from DataBase:",
          err.message
        );
      } else {
        throw err;
      }
    }

    if (memos.length === 0) {
      console.log("No memos.");
      return;
    }

    const question = {
      type: "select",
      name: "memoId",
      message: "Choose a memo you want to delete:",
      choices: memos.map((memo) => ({ name: memo.title, value: memo.id })),
      result() {
        return this.focused.value;
      },
    };

    let answer;
    try {
      answer = await Enquirer.prompt(question);
    } catch (err) {
      console.error("Program has been interrupted.");
      return;
    }

    try {
      await this.database.deleteMemo(answer.memoId);
    } catch (err) {
      if (err instanceof Error) {
        console.error("An error occurred while deleting a memo:", err.message);
      } else {
        throw err;
      }
    }
  }
}
