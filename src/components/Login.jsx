import React from "react";
import service from "../services/service.config";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
//Estilos
import "../styles/NoLogin.css";
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCheckbox,
  MDBBtn,
} from "mdb-react-ui-kit";
import Button from "react-bootstrap/Button";

export default function Login(props) {
  const { verifyToken } = useContext(AuthContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const [errorMessage, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await service.post("/auth/login", {
        email,
        password,
      });
      // console.log(response);

      //Guardar en el local storage el token.

      localStorage.setItem("authToken", response.data);

      await verifyToken();

      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.errorMessage);
      } else {
        navigate("/error");
      }
    }
  };

  return (
    <div className="form-login-container">
      <p className="title-login">Asceso</p>
      {errorMessage ? <p>{errorMessage}</p> : null}
      <form onSubmit={handleLogin}>
        <div>
          <MDBInput
          
            className="mb-4"
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
          />
          <MDBInput
            className="mb-4"
            label="Contraseña"
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div>
          <Button
            as="input"
            type="submit"
            value="Entrar"
            variant="danger"
            className="buttons-styles"
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <hr className="line-buttons" />
        </div>
        <div>
        <Button className="buttons-styles-google">
            <div className="buttons-styles-google-inside" style={{paddingRight:"14px"}}>
              <div >
                <i
                  class="fab fa-google google-icon"
                  style={{
                    color: "#DB4437",
                    marginRight: "10px",
                    paddingBottom:"5px",
                    fontSize: "30px",
                  }}
                ></i>
              </div>
              <div>
                <p style={{paddingTop:"5px"}}>Continuar con Google</p>
              </div>
            </div>
          </Button>
        </div>
        <div>
          <Button className="buttons-styles-google">
            <div className="buttons-styles-google-inside">
              <div>
                <i
                  class="fab fa-facebook facebook-icon"
                  style={{
                    color: "#1877F2",
                    marginRight: "10px",
                    paddingBottom:"5px",
                    fontSize: "30px",
                  }}
                ></i>
              </div>
              <div>
                <p style={{paddingTop:"5px"}}>Continuar con FaceBook</p>
              </div>
            </div>
          </Button>
        </div>
      </form>
    </div>
  );
}
