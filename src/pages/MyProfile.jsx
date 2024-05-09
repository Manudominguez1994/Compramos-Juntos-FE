import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import service from "../services/service.config";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import EditProfile from "../components/EditProfile";
// estilos
import EditIcon from "@mui/icons-material/Edit";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Rating from "@mui/material/Rating";

function MyProfile() {
  const navigate = useNavigate();

  const ActiveUserId = useContext(AuthContext);

  //*los grupos
  const [allGroups, setAllGroups] = useState([]);

  const [editButton, setEditButton] = useState(true);
  const [infoUser, setInfoUser] = useState(null);

  useEffect(() => {
    getUserInfo();
  }, []);
  useEffect(() => {
    if (infoUser && infoUser.coordinates) {
      getAllGroups();
    }
  }, [infoUser]);

  //*Funcion para comparar las coordenadas
  function calcularDistancia(lat1, lon1, lat2, lon2) {
    const radioTierra = 6371;

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distancia = radioTierra * c;
    // console.log(distancia);
    return distancia;
  }

  //*Peticion de todos los grupos
  const getAllGroups = async () => {
    try {
      const response = await service.get("/group/allgroups");
      // console.log("Datos de grupos recibidos:", response.data);
      const groupFilter = response.data.filter((group) => {
        return group.users.some(
          (user) => user._id === ActiveUserId.ActiveUserId
        );
      });
      // Calcula la distancia entre el usuario y cada grupo
      const latUsuario = infoUser.coordinates[0];
      const lonUsuario = infoUser.coordinates[1];
      const groupFilter1 = groupFilter.map((group) => {
        const distancia = calcularDistancia(
          latUsuario,
          lonUsuario,
          group.coordinates[0],
          group.coordinates[1]
        );
        return { ...group, distancia }; // Añade la distancia al objeto del grupo
      });
      groupFilter1.sort((a, b) => a.distancia - b.distancia);
      // console.log(groupFilter1, "arrays de grupos en los que el usuario esta");
      setAllGroups(groupFilter1);
    } catch (error) {
      navigate(error);
    }
  };

  const handleSetEditButton = (value) => {
    setEditButton(value);
  };

  const getUserInfo = async () => {
    try {
      const response = await service.get("/user/myprofile");
      console.log(response.data);
      setInfoUser(response.data);
    } catch (error) {
      navigate(error);
    }
  };
// console.log(infoUser.imagen);
  return (
    <div>
      <Navbar />
      <div className="container-my-profile">
        <div className="my-profile-image">
          {editButton === true ? (
            infoUser && (
              <div className="my-profile-info">
                <div>
                  <img
                    src={infoUser.imagen}
                    alt="Profile Picture"
                    style={{ width: "350px", borderRadius: "50%" }}
                  />
                </div>
                <div className="info-button-edit">
                  <div>
                    <p>{infoUser.name}</p>
                  </div>
                  <div>
                    <p>{infoUser.email}</p>
                  </div>
                  <div>
                    <button
                      className="button-editprofile"
                      onClick={handleSetEditButton}
                    >
                      Editar <EditIcon />
                    </button>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="edit-my-profile">
              <EditProfile
                handleSetEditButton={handleSetEditButton}
                infoUser={infoUser}
                getUserInfo={getUserInfo}
              />
            </div>
          )}
          <div className="nameAndLogo">
            <p>Compramos juntos</p>
            <img
              src="https://res.cloudinary.com/dgfqxvzld/image/upload/v1713201847/logo_compramos_juntos_rw2epv.png"
              alt=""
              style={{ width: "300px", marginBottom: "40px" }}
            />
            <div className="container-Add">
              <p style={{ fontSize: "16px" }}>Add ad here</p>
            </div>
          </div>
        </div>

        <div className="myGruops-styles-container-myprofile">
          <p className="target-group-title" style={{ fontWeight: "bold" }}>
            Mis grupos
          </p>
          <div className="allgroups-myprofile">
            <div className="containergroup-admin-user">
            
              {allGroups.map(
                (group) =>
                  ActiveUserId.ActiveUserId === group.liderUser._id && (
                    <div 
                      style={{
                        width: "100%",
                        background: "none",
                      }}
                    >
                      <Link to={`/groupselected/${group._id}`}>
                        <div className="target-group-mygroups">
                          <div className="target-group-left">
                            <div className="target-group-title">
                              <p>{group.name}</p>
                            </div>
                            <div className="target-group-lideruser">
                              <p>
                                {group.liderUser.name}
                                <Rating
                                  name="read-only"
                                  value={Math.floor(Math.random() * 4) + 2}
                                  readOnly
                                />
                              </p>
                            </div>
                            <div className="target-group-info">
                              <div>
                                <p>
                                  {" "}
                                  Día y hora de entrega:{" "}
                                  {group.date
                                    .substring(0, 10)
                                    .split("-")
                                    .reverse()
                                    .join("-")}{" "}
                                  {group.hour.substring(0, 5)}
                                </p>
                              </div>
                              <div>
                                <p style={{ color: "#4D90FE" }}>
                                  Esta a{" "}
                                  {group.distancia
                                    ? group.distancia.toFixed(2)
                                    : "N/A"}{" "}
                                  km de ti
                                </p>
                              </div>
                              <div>
                                <p>
                                  Estado:{" "}
                                  {group.status === true ? (
                                    <>Abierto</>
                                  ) : (
                                    <>Cerrado</>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="target-group-right">
                            {group.status === true ? (
                              <div style={{ color: "#00FF00" }}>
                                {" "}
                                <CheckCircleIcon sx={{ fontSize: 70 }} />
                              </div>
                            ) : (
                              <div style={{ color: "#666666" }}>
                                {" "}
                                <LockIcon sx={{ fontSize: 70 }} />
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  )
              )}
            </div>
            <div className="containergroup-admin-user">
            
              {allGroups.map(
                (group) =>
                  ActiveUserId.ActiveUserId !== group.liderUser._id && (
                    <div 
                      style={{
                        width: "100%",
                        background: "none"
                      }}
                    >
                      <Link to={`/groupselected/${group._id}`}>
                        <div className="target-group-mygroups">
                          <div className="target-group-left">
                            <div className="target-group-title">
                              <p>{group.name}</p>
                            </div>
                            <div className="target-group-lideruser">
                              <p>
                                {group.liderUser.name}
                                <Rating
                                  name="read-only"
                                  value={Math.floor(Math.random() * 4) + 2}
                                  readOnly
                                />
                              </p>
                            </div>
                            <div className="target-group-info">
                              <div>
                                <p>
                                  {" "}
                                  Dia y hora de entrega:{" "}
                                  {group.date
                                    .substring(0, 10)
                                    .split("-")
                                    .reverse()
                                    .join("-")}{" "}
                                  {group.hour.substring(0, 5)}
                                </p>
                              </div>
                              <div>
                                <p style={{ color: "#4D90FE" }}>
                                  Esta a{" "}
                                  {group.distancia
                                    ? group.distancia.toFixed(2)
                                    : "N/A"}{" "}
                                  km de ti
                                </p>
                              </div>
                              <div>
                                <p>
                                  Estado:{" "}
                                  {group.status === true ? (
                                    <>Abierto</>
                                  ) : (
                                    <>Cerrado</>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="target-group-right">
                            {group.status === true ? (
                              <div style={{ color: "#00FF00" }}>
                                {" "}
                                <CheckCircleIcon sx={{ fontSize: 70 }} />
                              </div>
                            ) : (
                              <div style={{ color: "#666666" }}>
                                {" "}
                                <LockIcon sx={{ fontSize: 70 }} />
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
