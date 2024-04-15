import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import service from "../services/service.config";
import { uploadImageService } from "../services/cloud.services";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import ClickMarker from "./ClickMarker";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function EditProfile(props) {
  const navigate = useNavigate();

  //Map
  const [clickedPosition, setClickedPosition] = useState(null);
  //
  const [name, setName] = useState(props.infoUser ? props.infoUser.name : "");
  const [email, setEmail] = useState(
    props.infoUser ? props.infoUser.email : ""
  );
  const [coordinates, setCoordinates] = useState(
    props.infoUser ? props.infoUser.coordinates : [4.60971, -74.08175]
  );
  //Foto
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  //
  useEffect(() => {
    if (props.infoUser && props.infoUser.image) {
      setImageUrl(props.infoUser.image);
    }
    if (!clickedPosition && props.infoUser && props.infoUser.coordinates) {
      setCoordinates(props.infoUser.coordinates);
    }
  }, [clickedPosition, props.infoUser]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleFileUpload = async (event) => {
    if (!event.target.files[0]) {
      return;
    }
    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("image", event.target.files[0]);
    try {
      const response = await service.post("/upload", uploadData);
      console.log("imagen actualizando", response.data.imageUrl);
      setImageUrl(response.data.imageUrl);
      setIsUploading(false);
    } catch (error) {
      navigate("/error");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!imageUrl) {
      setImageUrl(props.infoUser.imagen);
    }
    try {
      const response = await service.put("/user/editprofile", {
        name: name,
        email: email,
        imagen: imageUrl || props.infoUser.imagen,
        coordinates: clickedPosition || coordinates,
      });
      console.log("imagen envidada a la base de datos", imageUrl);
      console.log(response, "perfil actualizado");
      props.handleSetEditButton(true);
      props.getUserInfo();
    } catch (error) {
      navigate("/error");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="container-edit-profile">
          <div className="edit-image">
            {isUploading ? <p>cargando imagen</p> : null}
            {imageUrl ? (
              <div>
                <img
                  src={imageUrl}
                  alt="img"
                  width={200}
                  style={{ borderRadius: "50%", marginLeft: "30px" }}
                />
              </div>
            ) : null}
            <TextField
              style={{ marginTop: "15px" }}
              type="file"
              name="image"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </div>
          <div style={{ margin: "10px" }}>
            <TextField
              id="standard-basic"
              label="Nombre"
              variant="standard"
              type="text"
              value={name}
              name="name"
              onChange={handleNameChange}
            />
          </div>
          <div style={{ margin: "10px" }}>
            <TextField
              style={{ margin: "10px" }}
              id="standard-basic"
              label="Email"
              variant="standard"
              type="email"
              value={email}
              name="Email"
              onChange={handleEmailChange}
            />
          </div>
          <div style={{ width: "400px", height: "300px" }}>
            <MapContainer
              center={coordinates}
              zoom={11}
              scrollWheelZoom={false}
            >
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
          <div style={{ marginTop: "30px" }}>
            <button
              className="button-editprofile"
              type="submit"
              disabled={isUploading}
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
