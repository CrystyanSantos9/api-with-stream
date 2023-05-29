import { error } from "console";
import { randomUUID } from "crypto";
import fs from "fs";
import { resolve } from "path";

// const file = fs.readFileSync("./big.file");

// async function refreshFileStream() {
//   setInterval(() => {
//     fs.writeFile("./big.file", (data, err) => {
//       if (err) {
//         console.log(err);
//       }

//       return data = "";
//     });

//     const stats = fs.statSync("./big.file");
//     console.log(`Clean ${Number(stats.size) / (1024 * 1024)}Mb on file.`);
//   }, 2000);
// }

const path = "./big.file";
let interval = "";

fs.watch(path, (eventType, filename) => {
  console.log("\nThe file", filename, "was modified!");
  const stats = fs.statSync("./big.file");
  let sizeFile = Number(stats.size) / (1024 * 1024);
  console.log(`Clean ${filename} - ${sizeFile} Mb on file.`);
  interval = setTimeout(() => {
    if (eventType === "change") {
      if (sizeFile === 0) {
        return clearTimeout(interval);
      }
      fs.writeFileSync(path, "", (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  }, 10000);
});

// await refreshFileStream();
