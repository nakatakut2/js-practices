import readline from "node:readline";
import minimist from "minimist";

import MemoDatabase from "./memoDatabase.js";
import OptionManager from "./optionManager.js";

class MemoApp {
  constructor() {
    this.memoDatabase = new MemoDatabase();
    this.optionManager = new OptionManager();
  }

  async operationWithOption(argv) {
    if (argv.l) {
      await this.optionManager.outputList();
    } else if (argv.r) {
      await this.optionManager.selectForDetail();
    } else if (argv.d) {
      await this.optionManager.selectForDelete();
    }
  }

  async operationWithStdin() {
    let memo = "";
    const rl = readline.createInterface({
      input: process.stdin,
    });
    try {
      await new Promise((resolve) => {
        rl.on("line", (input) => {
          memo += input + "\n";
        });
        rl.on("close", async () => {
          resolve();
        });
      });
    } catch (err) {
      console.error(err.message);
    }
    const title = memo.split(/\s/)[0];
    const content = memo;
    try {
      await this.memoDatabase.insertMemo(title, content);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        throw err;
      }
    }
  }

  async main() {
    const argv = minimist(process.argv.slice(2));
    await this.memoDatabase.createTable();
    if (Object.keys(argv).length > 2) {
      console.log(
        "Please input your memo using the 'echo' command or choose an option from -l, -r, or -d."
      );
    } else if (Object.keys(argv).length === 2 && (argv.l || argv.r || argv.d)) {
      await this.operationWithOption(argv);
    } else if (!process.stdin.isTTY) {
      await this.operationWithStdin();
    }
    await this.memoDatabase.close();
  }
}

const memo = new MemoApp();
memo.main();
