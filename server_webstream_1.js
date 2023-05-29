import { createServer } from "node:http";
import { createReadStream } from "node:fs";
// manipula dados na fonte, de stream do node
import { Readable, Transform } from "node:stream";
import { WritableStream, TransformStream } from "node:stream/web";
import csvtojson from "csvtojson";
// setTimout assíncrono, é uma promises, não recebe callbacm
import { setTimeout } from "node:timers/promises";

const PORT = 8080;

createServer(async (request, response) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
  };

  if (request.method === "OPTIONS") {
    response.writeHead(204, headers);
    response.end();
    return;
  }

  //com Readable com fonte em Nodejs stream, passando para
  //nodejs web com pipeTo, manipulando com stream da web
  let items = 0;

  Readable.toWeb(createReadStream("./oscar_age_female.csv"))
    //a medida que lermos dados de um csv, convertemos para json
    //pipeThrough = passos de transformação de dados
    .pipeThrough(Transform.toWeb(csvtojson()))
    //mapear dados - controller serve como um next() manda pra frente
    .pipeThrough(
      new TransformStream({
        transform(chunk, controller) {
          //chunk Uint8Array(142)
          // console.log("chunk", Buffer.from(chunk).toString());

          //convertendo json string para JS object
          // para manipularmos cada dado
          const data = JSON.parse(Buffer.from(chunk));
          const mappedData = {
            _id: data.Index,
            age: data.Age,
            name: data.Name,
          };
          //só passa para frente o dados e propridades que desejarmos
          controller.enqueue(JSON.stringify(mappedData).concat("\n"));
        },
      })
    )
    //pipeTo é a última etapa de node strem para web stream
    .pipeTo(
      new WritableStream({
        async write(chunk) {
            //manda os dados sob demanda
          await setTimeout(1000);
          items++;
          response.write(chunk);
        },
        close() {
          response.end();
        },
      })
    );

  //   //   Reading document and sendo to writeStream (response)
  //   createReadStream("./big.file").pipe(response);
  response.writeHead(200, headers);
  //   response.end("ok");
})
  .listen(PORT)
  .on("listening", (_) =>
    console.log(`server is runnint at http://localhost:${PORT}`)
  );
