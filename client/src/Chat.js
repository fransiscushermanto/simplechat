import React, { useState, useEffect } from "react";
import io from "socket.io-client";
const socket = io("localhost:4000");

const Chat = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [join, setJoin] = useState(false);

  const sendMessage = (ev) => {
    ev.preventDefault();
    if (join) {
      socket.emit("SEND_MESSAGE", {
        author: username,
        message: message,
      });
      setMessage("");
    } else {
      socket.emit("JOIN", username);
      setJoin(true);
    }
  };

  useEffect(() => {
    socket.on("WELCOME", (message) => {
      alert(message);
    });
  }, []);

  useEffect(() => {
    socket.on("RECEIVE_MESSAGE", function (data) {
      addMessage(data);
    });
  }, [messages]);

  const addMessage = (data) => {
    setMessages([...messages, data]);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-5">
          <div className="card">
            <div className="card-body">
              <div className="card-title">Global Chat</div>
              <hr />
              <div className="messages">
                {messages.map((message, i) => {
                  return (
                    <div key={i}>
                      {message.author}: {message.message}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="card-footer">
              <form onSubmit={sendMessage}>
                {join ? (
                  <>
                    <input
                      type="text"
                      placeholder="Message"
                      className="form-control"
                      value={message}
                      onChange={(ev) => setMessage(ev.target.value)}
                    />
                    <br />
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Username"
                      className="form-control"
                      value={username}
                      onChange={(ev) => setUsername(ev.target.value)}
                    />
                    <br />
                  </>
                )}

                <button type="submit" className="btn btn-primary form-control">
                  {join ? "Send" : "Join"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
