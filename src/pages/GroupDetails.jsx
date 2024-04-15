import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import service from "../services/service.config";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { ProductsContext } from "../../context/product.context";
//Imports de Ratin de Miu
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
//Imports Map
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import ClickMarker from "../components/ClickMarker";
import L from "leaflet";
//Estilos
import Button from "@mui/material/Button";

const customIcon = L.icon({
  iconUrl: "/public/icon_casa.png",
  iconSize: [32, 38],
  iconAnchor: [16, 16],
});

function GroupDetails() {
  const navigate = useNavigate();
  const ActiveUserId = useContext(AuthContext);
  const params = useParams();

  //*Mapa
  const [center, setCenter] = useState([4.60971, -74.08175]);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [clickedPositionUser, setClickedPositionUser] = useState(null);

  //*Estados del grupo seleccionado
  const [thisGroup, setThisGroup] = useState(null);

  //*Info User Conectado
  const [infoUser, setInfoUser] = useState("");

  //* Estado de Ratin Miu
  const [value, setValue] = React.useState(0);

  //*Ciclo de vida
  useEffect(() => {
    handleThisGruop();
    getUserInfo();
  }, [params.groupid]);

  //*Funcion que entrega las caracteristicas del grupo
  const handleThisGruop = async () => {
    try {
      const groupselected = await service.get(`/group/${params.groupid}`);

      setThisGroup(groupselected.data);
      setCenter(groupselected.data.coordinates);
      setClickedPosition(groupselected.data.coordinates);
    } catch (error) {
      navigate(error);
    }
  };

  //*Funcion para info de usuario
  const getUserInfo = async () => {
    try {
      const response = await service.get("/user/myprofile");

      setInfoUser(response.data);
      setClickedPositionUser(response.data.coordinates);
    } catch (error) {
      navigate(error);
    }
  };

  //*Añadir Usuario que pulsa el boton al grupo
  const handleAddUserToGroup = async () => {
    try {
      if (thisGroup.users.includes(infoUser._id)) {
        console.log("El usuario ya está en este grupo.");
        return;
      }
      console.log(thisGroup._id, "la id de mi grupo");
      console.log(infoUser._id, "id de mi usuario");
      await service.put(`/group/${thisGroup._id}/adduser/${infoUser._id}`);
    } catch (error) {
      navigate(error);
    }
  };

  //!Clausula de error
  if (thisGroup === null) {
    return (
      <div>
        <p>error</p>
      </div>
    );
  }
  // console.log(thisGroup,"este grupo");

  return (
    <div>
      <Navbar />
      <div key={thisGroup._id} className="container-group-details">
        <div className="container-group-details-info">
          <div className="container-group-details-info1">
            <p className="container-group-details-info1-title">
              {thisGroup.name}
            </p>

            <p className="container-group-details-info1-nameLider">
              {thisGroup.liderUser.name}
              <Rating
                name="read-only"
                value={Math.floor(Math.random() * 4) + 2}
                readOnly
              />
            </p>
            <p style={{ fontSize: "20px" }}>
              Fecha de entrega <br />
              {thisGroup.date.substring(0, 10).split("-").reverse().join("-")}
            </p>
            <p style={{ fontSize: "20px" }}>
              Hora de entrega <br />
              {thisGroup.hour}
            </p>
          </div>
          <div className="container-group-details-info2">
            <p style={{ fontSize: "20px", color: "#00FF00" }}>
              Grupo {thisGroup.status === true ? <>Abierto</> : <>Cerrado</>}
            </p>
          </div>
        </div>
        <div className="container-details-map">
          <p style={{ fontSize: "20px", fontWeight: "bold", color: "black" }}>
            Lugar de entrega
          </p>
          <MapContainer center={center} zoom={15} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickMarker setClickedPosition={setClickedPosition} />
            {clickedPosition !== null && <Marker position={clickedPosition} />}
            <ClickMarker setClickedPositionUser={setClickedPositionUser} />
            {clickedPositionUser !== null && (
              <Marker position={clickedPositionUser} icon={customIcon} />
            )}
          </MapContainer>
        </div>
        <div className="container-details-product">
          <p style={{ fontSize: "20px", fontWeight: "bold", color: "black" }}>
            Productos
          </p>
          <div className="container-products-map">
            {thisGroup.products.map((product) => {
              // console.log(product.imagen);
              return (
                <div key={product._id} className="container-products-map-taget">
                  <div className="container-products-map-taget1">
                    <img
                      src={`/public/${product.imagen}`}
                      style={{ width: "200px", marginBottom: "10px" }}
                    />
                    <p>{product.nombre}</p>
                  </div>
                  <div className="container-products-map-taget2">
                    <p>
                      {" "}
                      {product.cantidad} {product.unidad}{" "}
                    </p>
                    <p>
                      {" "}
                      {product.precio}$/{product.unidad}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="container-button-entrar button-crear-grupo">
          <Link to={`/groupselected/${thisGroup._id}`}>
            <Button variant="contained" onClick={handleAddUserToGroup}>
              Entrar al grupo
            </Button>
          </Link>
          {/* <button onClick={handleAddUserToGroup}>Entrar al grupo</button> */}
        </div>
      </div>
    </div>
  );
}

export default GroupDetails;
