const { SerialPort } = require("serialport");
var createInterface = require("readline").createInterface;

const port = new SerialPort({
  path: "COM13", //TODO: port
  baudRate: 115200,
  autoOpen: false,
});

var lineReader = createInterface({
  input: port,
});

const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

port.open(function (err) {
  if (err) {
    return console.log("Error opening port: ", err.message);
  }

  // Because there's no callback to write, write errors will be emitted on the port:
  port.write("main screen turn on");
});

port.on("error", function (err) {
  console.log("Error: ", err.message);
});

// The open event is always emitted
port.on("open", function () {
  // open logic
  console.log("port open");
});

// serial numbers last time received dictionary
var dict = new Object();

// Switches the port into "flowing mode"
lineReader.on("line", function (data) {
  //TODO: separate lines
  data = data.trim();

  console.log('Data:"' + data + '"');
  io.emit("data", data);

  // //check serial number
  // currentSerNum = data.split(" ")[0];
  // if (currentSerNum != "ADMIN") {
  //   millis = Date.now();
  //   if (
  //     !dict.hasOwnProperty(currentSerNum) ||
  //     dict[currentSerNum].time <= millis - 500
  //   ) {
  //     //save sernum last time
  //     dict[currentSerNum] = millis;

  //     //send data to socket.io
  //     // this will emit the event to all connected sockets
  //     io.emit("data", data);
  //   }
  // }
});

io.on("status", () => {
  //TODO status
});

const readline = require("readline");

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

consoleinput = "";

process.stdin.on("keypress", (key, data) => {
  // console.log("key", key);
  // console.log("data", data);
  process.stdout.write(data.sequence);
  if (data.ctrl && data.name === "c") {
    process.exit();
  } else if (data.name === "return") {
    //send data to socket.io
    // this will emit the event to all connected sockets
    io.emit("data", "ADMIN " + consoleinput);
    console.log(
      new Date().getHours() +
        ":" +
        new Date().getMinutes() +
        ":" +
        new Date().getSeconds() +
        ":" +
        new Date().getMilliseconds() +
        '> wrote "' +
        consoleinput +
        '" to socket'
    );
    consoleinput = "";
  } else {
    consoleinput += data.sequence;
  }
});
console.log("Press a key");
