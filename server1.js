const express = require("express");
const app = express();
const cors = require("cors");

const fs = require("fs");
const { Transform, Writable } = require("stream");
const file = fs.createWriteStream("./big.file");

const payloadStream = fs.createReadStream(
  "./programacao_de_aplicativos moveis.pdf"
);

payloadStream.setEncoding("UTF8");

const port = 3000;
const host = "192.168.1.68";

var data = "";
var chunk;
// file.write(
//   "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n"
// );

// file.end();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  payloadStream
    .pipe(
      new Transform({
        async transform(chunk, enc, cb) {
          const item = chunk;
          //   console.log(item);
          cb(null, JSON.stringify(item));
        },
      })
    )
    .pipe(
      new Writable({
        write(chunk, enc, cb) {
          console.log("Parte \n", chunk.toString());
          res.write(chunk.toString());
          cb();
        },
      })
    );

  payloadStream.on("error", (error) => {
    console.log(error);
  });

  payloadStream.on("end", (data) => {
    console.log(data);
    res.end(data);
  });
});

app.listen(port, host, () => {
  console.log(`http://${host}:${port}`);
});
