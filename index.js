const fs = require('fs'); // file system module
const http = require('http');

const url = require('url');
const renderTemplate = require('./modules/renderTemplate');

// ! FILES:
// ! Synchronous way (blocking)

// how to read data from files and write data into files
// reading data
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// writing data
// const textOut = `This is what we all know about avocado: ${textIn}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("Implemented the writing data in node");

// * Asynchronous way (Non-blocking)

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, (err) => {
//         console.log("Data added to the output file");
//       });
//     });
//   });
// });

// ! SERVER
// ! Building a simple web server
// * 1) First we create a server
// * 2) We start a server so we can listen to incoming  requests

// const server = http.createServer((req, res) => {
//   res.end("Hello server  !!!");
// });

// server.listen(5000, "localhost", () => {
//   console.log("server is running on http://localhost:5000");
// });

// ! ROUTING IN SERVER

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const overViewTemplate = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  'utf-8'
);
const cardTemplate = fs.readFileSync(
  `${__dirname}/templates/card.html`,
  'utf-8'
);

const productTemplate = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  'utf-8'
);
const dataObj = JSON.parse(data);

// top level code always execute once that why using synchronous

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  // ! OVERVIEW

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    const cardOutPut = dataObj
      .map((obj) => renderTemplate(cardTemplate, obj))
      .join('');

    const finalOutput = overViewTemplate.replace(/{%CARDS%}/g, cardOutPut);

    res.end(finalOutput);
  }
  // ! PRODUCTS
  else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    const finalOut = renderTemplate(productTemplate, dataObj[query.id]);
    res.end(finalOut);
  }

  // ! API
  else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
    });
    res.end(data);
  } else {
    // ! ERROR
    res.writeHead(404, {
      'Content-Type': 'text/html',
    });
    res.end('<h1>Page Not Found</h1>');
  }
});

server.listen(5000, '127.0.0.1', () => {
  console.log('server is live at http://127.0.0.1:5000');
});

// ! What is an api
// ? API is a service from which we can request data
