import http from "http";
import { Readable } from "stream";
import { randomUUID } from "crypto";
//cria dados sob demanda
function* run() {
  for (let index = 0; index <= 1e4; index++) {
    const data = {
      id: randomUUID(),
      name: `Person-${index}`,
    };
    yield data;
  }
}
async function handler(request, response) {
  const readable = new Readable({
    read() {
      //lendo data do generator

      for (const data of run()) {
        this.pause;
        setTimeout(() => {}, 2000);
        setTimeout(() => {}, 2000);
        setTimeout(() => {}, 2000);
        console.log(
          `sending ${new Date(Date.now()).toLocaleTimeString()}`,
          data
        );
        this.push(JSON.stringify(data) + "\n");
      }

      this.push(null);
      //informa que os dados acabaram
    },
  });

  readable.pipe(response);
}


http
  .createServer(handler)
  .listen(3000)
  .on("listening", () => console.log("http://localhost:3000"));
