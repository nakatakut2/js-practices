import readline from "node:readline";
import minimist from "minimist";
import DatabaseManager from "./databaseManager.js";
import OptionManager from "./optionManager.js";

const databaseManager = new DatabaseManager();
const optionManager = new OptionManager();

// 【標準入力】があったときの処理

const OperationWithStdin = async () => {
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
    await databaseManager.createTable(databaseManager.db);
    await databaseManager.insertMemo(databaseManager.db, title, content);
  } catch (err) {
    console.error(err.message);
  }
};

// 【オプション】標準入力がなくて、オプションを指定したときの処理

const OperationWithOption = async () => {
  try {
    const argv = minimist(process.argv.slice(2));
    if (Object.keys(argv).length > 2) {
      console.log("The available options are only one, which are l, r, and d.");
    } else if (Object.keys(argv).length === 1) {
      console.log("Please choose one option from l, r, and d.");
    } else if (argv.l) {
      await optionManager.outputList();
    } else if (argv.r) {
      await optionManager.selectForDetail();
    } else if (argv.d) {
      await optionManager.selectForDelete();
    }
  } catch (err) {
    console.error(err.message);
  }
};

// main
(async () => {
  try {
    if (!process.stdin.isTTY) {
      await OperationWithStdin();
    } else {
      await OperationWithOption();
    }
  } catch (err) {
    console.error(err.message);
  } finally {
    await databaseManager.close(databaseManager.db);
  }
})();
