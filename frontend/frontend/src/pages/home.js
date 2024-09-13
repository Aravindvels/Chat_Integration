import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { getLocalStorage } from "../utils/helper";
import { LOCAL_CONSTANTS } from "../constant/local";
import { useSelector } from "react-redux";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import ROUTE_CONSTANT from "../constant/route";
import { useLazyUserMeQuery } from "../service/loginservice";
import { useLazyAllChatsQuery } from "../service/chatService";
import moment from "moment";

const socket = io(process.env.REACT_APP_BASE_URL);

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [height, setHeight] = useState(window.innerHeight);
  const navigate = useNavigate();
  const accessToken = getLocalStorage(LOCAL_CONSTANTS.ACCESS);
  const [userMe] = useLazyUserMeQuery();
  const [chats] = useLazyAllChatsQuery();
  const user = useSelector((state) => state?.application?.user);

  useEffect(() => {
    
    socket.on("receiveMessage", (msg) => {
      console.log("Received Message:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);
  useEffect(() => {
    if (!accessToken) {
      navigate(ROUTE_CONSTANT.LOGIN);
    }
  }, [accessToken, navigate]);
  useEffect(() => {
    if (accessToken && !user) {
      userMe()
        .unwrap()
        .then(() => {
          navigate(ROUTE_CONSTANT.HOME);
        })
        .catch((error) => {
          console.log(error);
        });
        chats()
        .unwrap()
        .then((res) => {
          setMessages(res?.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user]);
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", { user: user, message: message });
      setMessage("");
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Chat History", 10, 10);

    doc.setFontSize(12);
    let y = 20;
    messages.forEach((msg, index) => {
      doc.text(`${msg.user.username}: ${msg.content}`, 10, y);
      y += 10;
    });

    doc.save("chat-history.pdf");
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      messages.map((msg) => ({
        User: msg.user.username,
        Message: msg.content,
        Timestamp: new Date(msg.timestamp).toLocaleString(),
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Chat History");
    XLSX.writeFile(wb, "chat-history.xlsx");
  };

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  document.documentElement.style.setProperty("--height", `${height}px`);

  return (
    <div className="chat-container">
      <div className="chat-window">
        <div className="message-list">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.user._id === user?._id ? "my-message" : "other-message"
              }`}
            >
              <p>{msg.user.username}</p>
              <p>{msg.content}</p>
              <p>{moment(msg.timestamp).format("HH:mm A")}</p>
            </div>
          ))}
        </div>
        <div className="Input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="message-input"
          />
          <button
            type="submit"
            id="send-button"
            onClick={sendMessage}
            className="send-btn"
          >
            Send
          </button>
        </div>
        <div className="export-buttons">
          <button onClick={handleExportPDF} className="export-button">
            Export as PDF
          </button>
          <button onClick={handleExportExcel} className="export-button">
            Export as Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
