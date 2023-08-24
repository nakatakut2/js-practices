import readline from "node:readline";
import minimist from "minimist";
import DatabaseManager from "./databaseManager.js";
import OptionManager from "./optionManager.js";

class MemoApp {
  constructor() {
    this.databaseManager = new DatabaseManager();
    this.optionManager = new OptionManager();
  }

  OperationWithStdin = async () => {
    try {
      let memo = " ";
      const rl = readline.createInterface({
        input: process.stdin,
      });
      await new Promise((resolve) => {
        rl.on("line", (input) => {
          memo = input;
        });
        rl.on("close", async () => {
          resolve();
        });
      });
      const title = memo.split(" ")[0];
      const content = memo;
      await this.databaseManager.createTable(this.databaseManager.db);
      await this.databaseManager.insertMemo(
        this.databaseManager.db,
        title,
        content
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  OperationWithOption = async () => {
    try {
      const argv = minimist(process.argv.slice(2));
      if (Object.keys(argv).length > 2) {
        console.log(
          "The available options are only one, which are l, r, and d."
        );
      } else if (Object.keys(argv).length === 1) {
        console.log("Please choose one option from l, r, and d.");
      } else if (argv.l) {
        await this.optionManager.outputList();
      } else if (argv.r) {
        await this.optionManager.selectForDetail();
      } else if (argv.d) {
        await this.optionManager.selectForDelete();
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  main = async () => {
    try {
      if (!process.stdin.isTTY) {
        await this.OperationWithStdin();
      } else {
        await this.OperationWithOption();
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      await this.databaseManager.close(this.databaseManager.db);
    }
  };
}

const memo = new MemoApp();
memo.main();
