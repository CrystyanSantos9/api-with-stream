import { randomUUID } from "crypto";
import fs from "fs";
const file = fs.createWriteStream("./big.file", {flags: 'a'});


function* run() {
  for (let index = 0; index <= 10; index++) {
    const data = {
      date: new Date(Date.now()).toLocaleString(),
      id: randomUUID(),
      name: `Person-${index}`,
    };
    yield data;
  }
}

async function createFileStream() {
  setInterval(() => {
    for (const data of run()) {
      file.write(JSON.stringify(data) + "\n");
    }
    const stats = fs.statSync(file.path);
    console.log(`Wrote ${Number(stats.size) / (1024 * 1024)}Mb`);
  }, 2000);
}

await createFileStream();
