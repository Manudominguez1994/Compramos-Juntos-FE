import React from "react";
import service from "../services/service.config";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
//Imports Map
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import ClickMarker from "./ClickMarker";
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
import Form from "react-bootstrap/Form";

export default function Signup(props) {
  const navigate = useNavigate();

  //Map

  const [center, setCenter] = useState([4.60971, -74.08175]);
  const [clickedPosition, setClickedPosition] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setError] = useState("");

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await service.post("/auth/signup", {
        name,
        email,
        password,
        confirmPassword,
        coordinates: clickedPosition,
      });
      props.handleSetButton(1);
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
    <div>
      <div className="form-signup-container">
        <p className="title-sign">Crear una cuenta</p>
        {errorMessage ? <p>{errorMessage}</p> : null}
        <form onSubmit={handleSignup}>
          <div className="form-signup ">
            <MDBInput
              className="mb-4 form-style-input"
              type="text"
              label="Nombre completo"
              name="name"
              onChange={handleNameChange}
              
            />
            <MDBInput
              className="mb-4"
              type="email"
              id="form1Example1"
              label="Email"
              name="email"
              onChange={handleEmailChange}
            />
            <MDBInput
              className="mb-4"
              label="Contraseña"
              type="password"
              name="password"
              onChange={handlePasswordChange}
            />
            <MDBInput
              className="mb-4"
              label="Confirmar contraseña"
              type="password"
              name="confirmPassword"
              onChange={handleConfirmPasswordChange}
            />
          </div>
          <div className="map-container">
            <MapContainer center={center} zoom={11} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ClickMarker setClickedPosition={setClickedPosition} />
              {clickedPosition !== null && (
                <Marker position={clickedPosition} />
              )}
            </MapContainer>
          </div>
          <div>
            <Button
              as="input"
              type="submit"
              value="Crear cuenta"
              variant="danger"
              className="buttons-styles"
            />
          </div>
        </form>
      </div>
      <p>
        Ya tienes cuenta?{" "}
        <Link onClick={() => props.handleSetButton(1)} className="link-style">
          Iniciar sesion
        </Link>
      </p>
    </div>
  );
}
