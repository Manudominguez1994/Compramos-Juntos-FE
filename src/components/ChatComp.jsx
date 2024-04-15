import React, { useEffect, useState, useRef } from "react";
import service from "../services/service.config";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { ProductsContext } from "../../context/product.context";
//Estilos
import Form from "react-bootstrap/Form";
import SendIcon from "@mui/icons-material/Send";

function ChatComp(props) {
  const navigate = useNavigate();
  const ActiveUserId = useContext(AuthContext);
  console.log(ActiveUserId.ActiveUserId);
  const groupId = props.thisGroup._id;

  //* Estado de chat
  const [allChats, setAllChats] = useState("");

  //* Estado de mesanjes
  const [message, setMessage] = useState("");

//* Scroll chats
const messagesEndRef = useRef(null); // Referencia al último elemento de la lista de mensajes

  //* Ciclo de vida del chat
  useEffect(() => {
    handleAllChat();
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [allChats]);

  //*Funcion que recoja y que cree el mensaje
  const handleChatMessage = (event) => {
    setMessage(event.target.value);
  };
  const setChatMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await service.post(`/chat/create/${groupId}`, {
        description: message,
      });
      setMessage("");
      handleAllChat();
      scrollToBottom();
    } catch (error) {
      navigate(error);
    }
  };
  //*Funcion que entregue todos los mensajes que hay en el chat
  const handleAllChat = async () => {
    try {
      const response = await service.get("/chat/allChats");
      setAllChats(response.data);
    } catch (error) {
      navigate(error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  //!Clausula de error
  if (allChats === null) {
    return (
      <div>
        <p>error</p>
      </div>
    );
  }
  return (
    <div>
      <div className="chat-container">
        <div className="messagge-container">
          {allChats &&
            allChats.map((message) => (
              <div key={message._id} className="thisMessagge">
                <div className="thisMessagge-img-user">
                  <img src={message.userOwner.imagen}  style={{width:"50px",height:"50px"}}/>
                </div>
                <div className="thisMessagge-description-hour-date">
                  <div className={`thisMessagge-description-${message.userOwner._id === ActiveUserId.ActiveUserId ? 'owner' : 'back'}`}>
                    <p>{message.description}</p>
                    <div ref={messagesEndRef}></div>
                  </div>
                  <div className="thisMessagge-hour-date">
                    <div>
                      <p>{message.userOwner.name}</p>
                    </div>
                    <div >
                      <p>
                        {message.updatedAt.substring(0, 10)}{" "}
                        {message.updatedAt.substring(11, 16)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="form-chat-container">
          <Form onSubmit={setChatMessage}>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Control
                as="textarea"
                rows={3}
                onChange={handleChatMessage}
                type="text"
                name="description"
                value={message}
              />
              <Form.Text className="text-muted">
                <div className="input-message">
                  <p>Escribe un mensaje</p>
                  <button
                    style={{
                      border: "1px solid",
                      borderRadius: "50%",
                      padding: "5px",
                      color: "#3498db",
                    }}
                  >
                    <SendIcon />
                  </button>
                </div>
              </Form.Text>
            </Form.Group>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ChatComp;
