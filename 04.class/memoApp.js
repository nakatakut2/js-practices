import readline from "node:readline";
import minimist from "minimist";

import MemoDatabase from "./memoDatabase.js";
import OptionManager from "./optionManager.js";

class MemoApp {
  constructor() {
    this.memoDatabase = new MemoDatabase();
    this.optionManager = new OptionManager();
  }

  async processWithOption(option) {
    if (option === "l") {
      await this.optionManager.outputList();
    } else if (option === "r") {
      await this.optionManager.selectForDetail();
    } else if (option === "d") {
      await this.optionManager.selectForDelete();
    }
  }

  #receiveStdin() {
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: process.stdin,
      });
      let memo = [];
      rl.on("line", (input) => {
        memo.push(input);
      });
      rl.on("close", () => {
        resolve(memo.join("\n"));
      });

      rl.on("error", (err) => {
        reject(err);
      });
    });
  }

  async processWithStdin() {
    try {
      const content = await this.#receiveStdin();
      const title = content.split(/\n/)[0];
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
    await this.memoDatabase.createTable();
    const optionCandidates = Object.keys(minimist(process.argv.slice(2)));

    // オプション候補からminimistで取得される"_"を除く
    optionCandidates.shift();

    // l, r, d 以外の入力があったら終了
    for (const candidate of optionCandidates) {
      if (candidate !== "l" && candidate !== "r" && candidate !== "d") {
        console.log("Please choose an option from -l, -r, or -d.");
        return;
      }
    }

    const filteredOption = optionCandidates.filter((candidate) => {
      return ["l", "r", "d"].includes(candidate);
    });

    // オプションが２つ以上入力されたら終了
    if (filteredOption.length > 1) {
      console.log("Please choose an option from -l, -r, or -d.");
      return;
    }

    // オプションが l, r, d のうち１つだけ入力されれば続行
    if (filteredOption.length === 1) {
      await this.processWithOption(filteredOption[0]);
    } else {
      await this.processWithStdin();
    }
    await this.memoDatabase.close();
  }
}

const newMemo = new MemoApp();
newMemo.main();
