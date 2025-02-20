import React, { useEffect, useState } from "react";
import "./Chatbox.css";
import { getUser } from "../../api/UserRequest";
import { addMessage, getMessage } from "../../api/MessageRequest";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
export default function ChatBox({
  chat,
  currentUserId,
  setSendMessage,
  recieveMessage,
}) {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  useEffect(() => {
    if (recieveMessage !== null && recieveMessage?.chatId === chat._id) {
      setMessages([...messages, recieveMessage]);
    }
  }, [recieveMessage]);
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUserId);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) getUserData();
  }, [chat, currentUserId]);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const { data } = await getMessage(chat._id);

        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) fetchMessage();
  }, [chat]);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUserId,
      text: newMessage,
      chatId: chat._id,
    };
    // send message to database
    try {
      const { data } = await addMessage(message);
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
    //send message to socket server
    const recceiverId = chat.members.find((id) => id !== currentUserId);
    setSendMessage({ ...message, recceiverId });
  };

  return (
    <>
      <div className="ChatBox-container">
        {chat ? (
          <>
            <div className="chat-header">
              <div className="follower">
                <div>
                  <img
                    src={
                      userData?.profilePicture
                        ? process.env.REACT_APP_PUBLIC_FOLDER +
                          userData.profilePicture
                        : process.env.REACT_APP_PUBLIC_FOLDER +
                          "defaultProfile.png"
                    }
                    alt=""
                    className="followerImage"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                  />
                  <div className="name" style={{ fontSize: "0.8rem" }}>
                    <span>
                      {userData?.firstname} {userData?.lastname}
                    </span>
                  </div>
                </div>
              </div>
              <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
            </div>
            {/* chat box message */}
            <div className="chat-body">
              {messages.map((message) => {
                return (
                  <>
                    <div
                      className={
                        message.senderId === currentUserId
                          ? "message own"
                          : "message"
                      }
                    >
                      <span>{message.text}</span>
                      <span>{format(message.createdAt)}</span>
                    </div>
                  </>
                );
              })}
            </div>

            {/* Chat-sender */}
            <div className="chat-sender">
              <div>+</div>
              <InputEmoji value={newMessage} onChange={handleChange} />
              <div className="send-button button" onClick={handleSend}>
                Send
              </div>
            </div>
          </>
        ) : (
          <span className="chatbox-empty-message">
            Tap on a chat to start conversation...
          </span>
        )}
      </div>
    </>
  );
}
