import minimist from "minimist";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja.js";

dayjs.locale(ja);

let argv = minimist(process.argv.slice(2));
let year = argv["y"] || dayjs().format("YYYY");
let month = argv["m"] || dayjs().format("M");
let startDate = dayjs(new Date(year, month - 1, 1));
let lastDate = dayjs(new Date(year, month, 0));

console.log(`${month}月 ${year}`.padStart(13));
console.log("日 月 火 水 木 金 土");
process.stdout.write("   ".repeat(startDate.day()));

for (let i = 1; i <= lastDate.date(); i++) {
  let formattedDate = String(i).padStart(2).padEnd(3);
  process.stdout.write(formattedDate);

  if (startDate.date(i).day() === 6 || i === lastDate.date()) {
    process.stdout.write("\n");
  }
}
