var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function (socket) {
  socket.on("disconnect", function () {
    console.log(`user disconnected ${socket.id}`);
  });

  socket.on("JOIN", (name) => {
    socket.join("globalchat", () => {
      socket.to("globalchat").emit("WELCOME", `${name} has joined the chat`);
    });
  });

  socket.on("SEND_MESSAGE", function (data) {
    io.to("globalchat").emit("RECEIVE_MESSAGE", data);
  });
});

http.listen(4000, function () {
  console.log("listening on *:4000");
});
