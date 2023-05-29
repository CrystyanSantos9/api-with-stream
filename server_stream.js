import express from "express";
const app = express();
import cors from "cors";
import os from "os";

import fs, { read } from "fs";
import internal, {
  PassThrough,
  Transform,
  Writable,
  Readable,
  Duplex,
  pipeline,
  finished,
} from "stream";
import { error } from "console";
const file = fs.createWriteStream("./big.file");

const uptime = os.uptime;
const system = os.platform;

let interval = "";

class Throttle extends Duplex {
  /*
   * Class constructor will receive the injections as parameters.
   */
  constructor(time) {
    super();
    this.delay = time;
  }
  _read() {}

  // Writes the data, push and set the delay/timeout
  _write(chunk, encoding, callback) {
    this.push(chunk);
    setTimeout(callback, this.delay);
  }

  // When all the data is done passing, it stops.
  _final() {
    this.push(null);
  }
}

// const payloadStream = fs.createReadStream(
//   "./programacao_de_aplicativos moveis.pdf"
// );
const payloadStream = fs.createReadStream("./big.file");

payloadStream.setEncoding("UTF8");

const port = 8080;
const host = "192.168.1.68";

// file.end();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/", async (req, res) => {
  // const readStream = fs.createReadStream(
  //   "./programacao_de_aplicativos moveis.pdf"
  // );
  // res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  console.log(JSON.stringify(req.headers) + "\n");
  console.log(req.socket.remoteAddress + "\n");

  const tunnel = new PassThrough();
  const throttle = new Throttle(500);

  const readStream = fs.createReadStream("./big.file");
  readStream.setEncoding("utf-8");

  const inoutStream = new Duplex({
    write(chunk, encoding, next) {
      const buf = Buffer.from(chunk);
      console.log(buf.toString());
      this.push(chunk);
      next();
    },
    read(size) {
      const dateNow = new Date(Date.now()).toLocaleString();
      this.addListener("data", (data) => {
        const buf = Buffer.from(data);
        const dateNow = new Date(Date.now()).toLocaleString();
        console.log("Data read on " + dateNow);
        // console.log(dateNow + size);
        // console.log(buf.toString());
        setInterval(() => {
          this.push(buf);
        }, 2000);
      });
    },
  });

  // readStream.pipe(inoutStream).pipe(res);
  pipeline(readStream.pipe(inoutStream), res, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
});

app.get("/status", (req, res) => {
  console.log(JSON.stringify(req.headers));
  const response = {
    uptime: new Date(uptime()).toLocaleString(),
    os: system(),
    message: "ok",
  };
  res.json(response);
});

app.listen(port, host, () => {
  console.log(`http://${host}:${port}`);
});
