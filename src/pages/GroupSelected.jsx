import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import service from "../services/service.config";
import EditableField from "../components/EditableField";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { ProductsContext } from "../../context/product.context";
//Imports Map
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import ClickMarker from "../components/ClickMarker";
import L from "leaflet";
//Bostrap y miu
import Spinner from "react-bootstrap/Spinner";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ClearIcon from "@mui/icons-material/Clear";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ForumIcon from "@mui/icons-material/Forum";
import TextField from "@mui/material/TextField";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button, Checkbox, Switch } from "@mui/material";
import ChatComp from "../components/ChatComp";
import { styled } from "@mui/material/styles";
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const customIcon = L.icon({
  iconUrl: "https://res.cloudinary.com/dgfqxvzld/image/upload/v1713203077/icon_casa_h9qfc7.png",
  iconSize: [32, 38],
  iconAnchor: [16, 16],
});
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

function MyPageGroup() {
  const navigate = useNavigate();
  const ActiveUserId = useContext(AuthContext);
  const params = useParams();

  //*Mapa
  const [center, setCenter] = useState([4.60971, -74.08175]);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [clickedPositionUser, setClickedPositionUser] = useState(null);

  //! Verificar si el usuario actual es el administrador del grupo
  const [isAdmin, setIsAdmin] = useState(false);

  //* Estado de Ratin Miu
  const [value, setValue] = React.useState(0);

  //*Estados del grupo seleccionado
  const [thisGroup, setThisGroup] = useState(null);

  //* Estado del switch
  const [groupState, setGroupState] = useState(null);
  const [userStates, setUserStates] = useState(() => {
    const initialUserStates = {};
    if (thisGroup && thisGroup.users) {
      thisGroup.users.forEach((user) => {
        initialUserStates[user._id] = false;
      });
    }
    return initialUserStates;
  });

  //*Info User Conectado
  const [infoUser, setInfoUser] = useState("");

  //*Estado de la cantidad seleccionada
  const [quantities, setQuantities] = useState({});

  //* Componente cargar vista
  const [compValue, setCompValue] = useState(1);
  //*Estados del Boton
  const [addedButtons, setAddedButtons] = useState([]); // Estado para rastrear botones agregados

  const handleClick = (productId) => {
    // Función para manejar el clic en el botón y actualizar el estado
    if (!addedButtons.includes(productId)) {
      // Si el botón no está en el estado, agrégalo
      setAddedButtons([...addedButtons, productId]);
    }
  };

  //* Estados de chat
  const [popupOpen, setPopupOpen] = useState(false);
  //* Función para alternar el estado del pop-up
  const togglePopup = () => {
    setPopupOpen(!popupOpen);
  };

  //*Ciclo de vida
  useEffect(() => {
    handleThisGruop();
    getUserInfo();
  }, [params.groupid]);
  //*Verificar si el usuario actual es el administrador del grupo
  useEffect(() => {
    if (thisGroup && thisGroup.liderUser._id === ActiveUserId.ActiveUserId) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [thisGroup, ActiveUserId]);
  useEffect(() => {
    const storedStates = localStorage.getItem("userStates");
    if (storedStates) {
      setUserStates(JSON.parse(storedStates));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("userStates", JSON.stringify(userStates));
  }, [userStates]);

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
      if (error.response.status === 404 && !isAdmin) {
        navigate("/finishpage");
      } else {
        console.error("Error al obtener la información del usuario:", error);
      }
    }
  };

  //* Función para cambiar el estado del switch
  const handleUserSwitchChange = (userId) => {
    setUserStates((prevState) => {
      const newUserStates = { ...prevState };
      newUserStates[userId] = !newUserStates[userId];
      return newUserStates;
    });
  };

  //* Funcion para seleccionar la cantidad deseada
  const handleQuantityChange = (productId, event) => {
    const { value } = event.target;
    // Actualiza el estado con la nueva cantidad para el producto correspondiente
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: value,
    }));
  };
  //* Funcion crear compra personal
  const createQuantityProduct = async (productId) => {
    // setButtonState(false);
    try {
      if (quantities[productId] === 0) {
        console.error("No puedes comprar un producto con cantidad 0.");
        return;
      }

      await service.put(`/group/${thisGroup._id}/addpurchase/${infoUser._id}`, {
        productId,
        quantity: quantities[productId], // Utilizo la cantidad correspondiente al producto
      });
      handleThisGruop();
      setTotal(calculateTotal());

      console.log(buttonState, "despues de cambiarlo");
    } catch (error) {
      navigate(error);
    }
  };

  //*Resumen de compra
  const generatePurchaseSummary = () => {
    let totalPrice = 0;
    let summary = [];

    if (thisGroup && thisGroup.purchase) {
      thisGroup.purchase.forEach((purchase) => {
        if (purchase.userId === infoUser._id) {
          const product = thisGroup.products.find(
            (p) => p._id === purchase.productId
          );
          if (product) {
            const purchaseTotal = product.precio * purchase.quantity;
            totalPrice += purchaseTotal;
            summary.push({
              productId: product._id,
              name: product.nombre,
              quantity: purchase.quantity,
              unitPrice: product.precio,
              total: purchaseTotal,
            });
          }
        }
      });
    }

    return { summary, totalPrice };
  };
  const purchaseSummary = generatePurchaseSummary();

  // Función para establecer todas las cantidades a cero
  const resetQuantities = () => {
    setQuantities({});
  };

  //*Remover un prodcuto por equivacion
  const removePurchase = async (productId, quantity) => {
    try {
      await service.delete(
        `/group/${thisGroup._id}/removepurchase/${infoUser._id}/${productId}/${quantity}`
      );
      handleThisGruop(); // Actualizar los datos del grupo después de eliminar la compra
    } catch (error) {
      console.error("Error al eliminar la compra:", error);
    }
  };

  //* Salir de grupo y borrar compras
  const leaveGroup = async () => {
    try {
      // Eliminar todas las compras del usuario en el grupo
      await Promise.all(
        thisGroup.purchase.map(async (purchase) => {
          if (purchase.userId === infoUser._id) {
            await removePurchase(purchase.productId, purchase.quantity);
          }
        })
      );
      await service.delete(`/group/${thisGroup._id}/leave`);
      handleThisGruop();
      navigate("/");
    } catch (error) {
      console.error("Error al salir del grupo:", error);
    }
  };

  //* Función para calcular el total de cada producto
  const calculateProductTotal = (productId) => {
    let productTotal = 0;
    thisGroup.purchase.forEach((purchase) => {
      if (purchase.productId === productId) {
        const product = thisGroup.products.find((p) => p._id === productId);
        if (product) {
          productTotal += product.precio * purchase.quantity;
        }
      }
    });
    return productTotal;
  };

  //* Función para calcular el total general en pesos
  const calculateTotal = () => {
    let total = 0;
    const processedProducts = {}; // Objeto para rastrear los productos ya procesados

    thisGroup.purchase.forEach((purchase) => {
      const productTotal = calculateProductTotal(purchase.productId);
      // Asegúrate de que el producto no se haya procesado antes
      if (!processedProducts[purchase.productId]) {
        total += productTotal;
        processedProducts[purchase.productId] = true; // Marca el producto como procesado
      }
    });

    return total;
  };

  //* Función para cerrar el grupo
  const closeGroup = async () => {
    try {
      await service.put(`/group/${thisGroup._id}/close`);
      // Actualiza el estado del grupo para reflejar el cambio
      setThisGroup((prevGroup) => ({
        ...prevGroup,
        status: false,
      }));
    } catch (error) {
      console.error("Error al cerrar el grupo:", error);
    }
  };

  //* Función para abrir el grupo
  const openGroup = async () => {
    try {
      await service.put(`/group/${thisGroup._id}/open`);
      setThisGroup((prevGroup) => ({
        ...prevGroup,
        status: true,
      }));
      handleThisGruop();
      getUserInfo();
    } catch (error) {
      console.error("Error al abrir el grupo:", error);
    }
  };

  //* Borrar grupo y productos relacionado con el grupo
  const handleDeleteGroup = async () => {
    const groupId = thisGroup._id;
    try {
      const response = await service.delete(`/group/${groupId}`);
      console.log(response.data.message); // Mensaje de confirmación del backend
      navigate("/finishpage");
    } catch (error) {
      console.error("Error al eliminar el grupo:", error);
    }
  };

  //TODO Funciones y estados de edicion de grupo
  const handleFieldSave = async (field, value) => {
    try {
      console.log(`Nuevo ${field}:`, value);
      const groupId = thisGroup._id;
      const response = await service.put(`/group/edit/${groupId}`, {
        [field]: value,
      });
      // if (!response.ok) {
      //   throw new Error('Error al guardar los cambios');
      // }
      if (field === "nombre") {
        setNameEditMode(false);
      } else if (field === "fecha") {
        setDateEditMode(false);
      } else if (field === "hora") {
        setHourEditMode(false);
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error.message);
    }
  };

  //!Clausula de error
  if (thisGroup === null) {
    return (
      <Spinner animation="border" role="status" style={{color:"#F92B42"}}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }
  // console.log(buttonState);
  return (
    <div>
      <Navbar />
      {/* Grupo abierto */}
      {thisGroup.status === true ? (
        <div key={thisGroup._id} className="container-group-details">
          <div className="container-group-details-info">
            {isAdmin ? (
              <>
                <div className="container-group-details-info1 ">
                  <div className="container-group-details-info1-title">
                    <EditableField
                      initialValue={thisGroup.name}
                      onSave={(value) => handleFieldSave("nombre", value)}
                      type="text"
                    />
                  </div>
                  <div className="date-hour-admin-edit">
                    <EditableField
                      initialValue={thisGroup.date
                        .substring(0, 10)
                        .split("-")
                        .reverse()
                        .join("-")}
                      onSave={(value) => handleFieldSave("fecha", value)}
                      type="date"
                    />
                  </div>
                  <div className="date-hour-admin-edit">
                    <EditableField
                      initialValue={thisGroup.hour}
                      onSave={(value) => handleFieldSave("hora", value)}
                      type="time"
                    />
                  </div>
                </div>
                <div>
                  <p>Estado {thisGroup.status ? <span style={{color:"green"}}>"Abierto"</span> : <span style={{color:"red"}}>"Cerrado"</span>}</p>
                </div>
              </>
            ) : (
              <>
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
                    {thisGroup.date
                      .substring(0, 10)
                      .split("-")
                      .reverse()
                      .join("-")}
                  </p>
                  <p style={{ fontSize: "20px" }}>
                    Hora de entrega <br />
                    {thisGroup.hour}
                  </p>
                </div>
                <div className="container-group-details-info2">
                  <p style={{ fontSize: "20px", color: "#00FF00" }}>
                    Grupo{" "}
                    {thisGroup.status === true ? <>Abierto</> : <>Cerrado</>}
                  </p>
                </div>
              </>
            )}
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
              {clickedPosition !== null && (
                <Marker position={clickedPosition} />
              )}
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
            {compValue === 1 ? (
              <div className="container-products-map">
                {thisGroup.products.map((product) => {
                  return (
                    <div
                      key={product._id}
                      className="container-products-map-taget"
                    >
                      <div className="container-products-map-taget1">
                        <img
                          src={product.imagen}
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
                      {!isAdmin && (
                        <form className="container-buy-product-target">
                          <TextField
                            className="container-buy-product-target-input"
                            id={`quantity_${product._id}`}
                            label="Cantidad"
                            type="number"
                            value={quantities[product._id] || ""}
                            onChange={(event) =>
                              handleQuantityChange(product._id, event)
                            }
                            placeholder={product.unidad}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              if (product.cantidad > 0) {
                                createQuantityProduct(product._id);
                                handleClick(product._id);
                              }
                            }}
                            disabled={product.cantidad === 0}
                            className={
                              addedButtons.includes(product._id)
                                ? "added-button"
                                : ""
                            }
                            style={{
                              backgroundColor: addedButtons.includes(
                                product._id
                              )
                                ? "#34C759"
                                : "#F92B42",
                            }}
                          >
                            {addedButtons.includes(product._id)
                              ? "Agregado"
                              : "Agregar"}{" "}
                          </Button>
                        </form>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : null}
            {/* Resumen compra usuario grupo abierto */}
            {compValue === 2 ? (
              <div>
                <TableContainer
                  component={Paper}
                  sx={{ boxShadow: " 6px 6px 6px 6px #e0e0e0" }}
                >
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "18px",
                            fontFamily: "IBM Plex Mono",
                            fontWeight: "bold",
                          }}
                        >
                          Productos
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "18px",
                            fontFamily: "IBM Plex Mono",
                            fontWeight: "bold",
                          }}
                        >
                          Cantidad
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "18px",
                            fontFamily: "IBM Plex Mono",
                            fontWeight: "bold",
                          }}
                        >
                          Precio Unitario
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "18px",
                            fontFamily: "IBM Plex Mono",
                            fontWeight: "bold",
                          }}
                        >
                          Total
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "18px",
                            fontFamily: "IBM Plex Mono",
                            fontWeight: "bold",
                          }}
                        >
                          {"  "}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {purchaseSummary.summary.map((item, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            align="center"
                            sx={{
                              fontSize: "18px",
                              fontFamily: "IBM Plex Mono",
                            }}
                          >
                            {item.name}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              fontSize: "18px",
                              fontFamily: "IBM Plex Mono",
                            }}
                          >
                            {item.quantity}{" "}
                            {
                              thisGroup.products.find(
                                (p) => p._id === item.productId
                              )?.unidad
                            }
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              fontSize: "18px",
                              fontFamily: "IBM Plex Mono",
                            }}
                          >
                            ${item.unitPrice}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              fontSize: "18px",
                              fontFamily: "IBM Plex Mono",
                            }}
                          >
                            ${item.total}
                          </TableCell>
                          <TableCell align="center">
                            {" "}
                            <button
                              className="delete-purchase"
                              onClick={() => {
                                const purchase = thisGroup.purchase.find(
                                  (p) => p.productId === item.productId
                                );
                                if (purchase) {
                                  removePurchase(item.productId, item.quantity);
                                } else {
                                  console.error(
                                    "Compra no encontrada para el producto",
                                    item.name
                                  );
                                }
                              }}
                            >
                              <ClearIcon sx={{ fontSize: 40 }} />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          align="right"
                          sx={{
                            fontSize: "18px",
                            fontFamily: "IBM Plex Mono",
                            fontWeight: "bold",
                          }}
                        >
                          <b>Total</b>
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontSize: "18px",
                            fontFamily: "IBM Plex Mono",
                            fontWeight: "bold",
                          }}
                        >
                          <b>${purchaseSummary.totalPrice}</b>
                        </TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            ) : null}

            {/* {isAdmin && compValue === 2 ? (
              <div>
                <h5>Resumen de compra por producto:</h5>
                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {thisGroup.products.map((product) => (
                      <tr key={product._id}>
                        <td>{product.nombre}</td>
                        <td>
                          {thisGroup.purchase.reduce((acc, purchase) => {
                            if (purchase.productId === product._id) {
                              return acc + purchase.quantity;
                            }
                            return acc;
                          }, 0)}{" "}
                          {product.unidad}
                        </td>
                        <td>{calculateProductTotal(product._id)} pesos</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <h5>Precio total de la compra:</h5>
                <p>{calculateTotal()} pesos</p>
              </div>
            ) : null} */}

            {/* Participantes vista para admin */}
            {compValue === 1 && isAdmin ? (
              <div className="container-users">
                <div className="container-users-title">
                  <p>Participantes</p>
                </div>
                {thisGroup &&
                  thisGroup.users.map((user) => {
                    
                    const totalPurchaseThisUser = thisGroup.purchase.filter(
                      (purchase) => purchase.userId === user._id
                    );
                    
                    let totalPrice = 0;
                    totalPurchaseThisUser.forEach((purchase) => {
                      const product = thisGroup.products.find(
                        (p) => p._id === purchase.productId
                      );
                      if (product) {
                        totalPrice += product.precio * purchase.quantity;
                      }
                    });

                    return (
                      <div key={user._id} className="container-users-buttons">
                        <div>
                          <p>{user.name}</p>
                          <Rating name="read-only" value={4} readOnly />
                        </div>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <div>
                            {/* Muestra el total de compras del usuario */}
                            <span>${totalPrice.toFixed(0)}</span>
                          </div>
                          <div style={{marginLeft:"40px"}}>
                            <IOSSwitch
                              {...label}
                              checked={userStates[user._id]}
                              onChange={() => handleUserSwitchChange(user._id)}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : null}
            {/* Boton de chat */}
            <div className="chat-button-container">
              <div key={thisGroup._id}>
                {!popupOpen && compValue === 1 ? (
                  <button className="button-open-chat" onClick={togglePopup}>
                    <ForumIcon sx={{ fontSize: 120 }} />
                  </button>
                ) : // <button onClick={togglePopup}>Cerrar Chat</button>
                null}
              </div>
              <div>
                {popupOpen && (
                  <div className="popup">
                    <div className="popup-content">
                      <div className="container-chat1">
                        <p className="container-group-details-info1-title"> </p>
                        <button
                          style={{
                            marginBottom: "15px",
                            position: "absolute",
                            right: "10%",
                            top: "3%",
                          }}
                          className="boton-cerrar"
                          onClick={togglePopup}
                        >
                          X
                        </button>
                      </div>
                      <div>
                        <ChatComp
                          thisGroup={thisGroup}
                          setThisGroup={setThisGroup}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Grupo abierto vista usuario */}
          <div>
            {!isAdmin ? (
              <div>
                {compValue === 2 ? (
                  <div className="container-end-exit-group">
                    <Button
                      onClick={() => {
                        setCompValue(1);
                        resetQuantities();
                      }}
                    >
                      Editar Orden
                    </Button>
                    <Button
                      onClick={() => {
                        setCompValue(1);
                        resetQuantities();
                        leaveGroup();
                      }}
                    >
                      Salir del grupo
                    </Button>
                  </div>
                ) : (
                  <div className="container-end-exit-group">
                    <Button
                      onClick={() => {
                        setCompValue(2);
                        resetQuantities();
                      }}
                    >
                      Finalizar Compra
                    </Button>
                    <Button
                      onClick={() => {
                        setCompValue(1);
                        resetQuantities();
                        leaveGroup();
                      }}
                    >
                      Salir del grupo
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="container-delete-group">
                <button
                  onClick={() => {
                    setCompValue(2);
                    setGroupState(true);
                    closeGroup();
                  }}
                >
                  Cerrar grupo
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="container-group-details">
          {/* Grupo cerrado */}
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
              <p style={{ fontSize: "20px", color: "black" }}>Grupo Cerrado</p>
            </div>
          </div>
          {/* Mapa grupo cerrado */}
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
              {clickedPosition !== null && (
                <Marker position={clickedPosition} />
              )}
              <ClickMarker setClickedPositionUser={setClickedPositionUser} />
              {clickedPositionUser !== null && (
                <Marker position={clickedPositionUser} icon={customIcon} />
              )}
            </MapContainer>
          </div>
          {/* Resumen de compra de usuario y grupo cerrado */}
          {!isAdmin ? (
            <div style={{ width: "85%", marginBottom: "40px" }}>
              <TableContainer
                component={Paper}
                sx={{ boxShadow: " 6px 6px 6px 6px #e0e0e0" }}
              >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="center"
                        sx={{
                          fontSize: "18px",
                          fontFamily: "IBM Plex Mono",
                          fontWeight: "bold",
                        }}
                      >
                        Productos
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontSize: "18px",
                          fontFamily: "IBM Plex Mono",
                          fontWeight: "bold",
                        }}
                      >
                        Cantidad
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontSize: "18px",
                          fontFamily: "IBM Plex Mono",
                          fontWeight: "bold",
                        }}
                      >
                        Precio Unitario
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontSize: "18px",
                          fontFamily: "IBM Plex Mono",
                          fontWeight: "bold",
                        }}
                      >
                        Total
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontSize: "18px",
                          fontFamily: "IBM Plex Mono",
                          fontWeight: "bold",
                        }}
                      >
                        {"  "}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchaseSummary.summary.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          align="center"
                          sx={{
                            fontSize: "18px",
                            fontFamily: "IBM Plex Mono",
                          }}
                        >
                          {item.name}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "18px",
                            fontFamily: "IBM Plex Mono",
                          }}
                        >
                          {item.quantity}{" "}
                          {
                            thisGroup.products.find(
                              (p) => p._id === item.productId
                            )?.unidad
                          }
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "18px",
                            fontFamily: "IBM Plex Mono",
                          }}
                        >
                          ${item.unitPrice}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "18px",
                            fontFamily: "IBM Plex Mono",
                          }}
                        >
                          ${item.total}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        align="right"
                        sx={{
                          fontSize: "18px",
                          fontFamily: "IBM Plex Mono",
                          fontWeight: "bold",
                        }}
                      >
                        <b>Total</b>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontSize: "18px",
                          fontFamily: "IBM Plex Mono",
                          fontWeight: "bold",
                        }}
                      >
                        <b>${purchaseSummary.totalPrice}</b>
                      </TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) : null}
          {/* Resumen de compra de admin y vista de admin de grupo cerrado */}
          {isAdmin ? (
            <div style={{ width: "85%" }}>
              <div>
                <TableContainer
                  component={Paper}
                  sx={{ boxShadow: " 6px 6px 6px 6px #e0e0e0" }}
                >
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "18px",
                            fontFamily: "IBM Plex Mono",
                            fontWeight: "bold",
                          }}
                        >
                          Productos
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "18px",
                            fontFamily: "IBM Plex Mono",
                            fontWeight: "bold",
                          }}
                        >
                          Cantidad
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "18px",
                            fontFamily: "IBM Plex Mono",
                            fontWeight: "bold",
                          }}
                        >
                          Participantes
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "18px",
                            fontFamily: "IBM Plex Mono",
                            fontWeight: "bold",
                          }}
                        >
                          Total
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: "18px",
                            fontFamily: "IBM Plex Mono",
                            fontWeight: "bold",
                          }}
                        >
                          {"  "}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {thisGroup.products.map((product) => {
                        // Suma de la cantidad total para este producto
                        let totalQuantity = 0;
                        thisGroup.purchase.forEach((purchase) => {
                          if (purchase.productId === product._id) {
                            totalQuantity += purchase.quantity;
                          }
                        });

                        return (
                          <TableRow key={product._id}>
                            <TableCell
                              align="center"
                              sx={{
                                fontSize: "18px",
                                fontFamily: "IBM Plex Mono",
                              }}
                            >
                              {product.nombre}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                fontSize: "18px",
                                fontFamily: "IBM Plex Mono",
                              }}
                            >
                              {totalQuantity} {product.unidad}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                fontSize: "18px",
                                fontFamily: "IBM Plex Mono",
                                paddingLeft: "200px",
                              }}
                            >
                              {thisGroup.purchase
                                .filter(
                                  (purchase) =>
                                    purchase.productId === product._id
                                )
                                .map((purchase) => {
                                  const user = thisGroup.users.find(
                                    (user) => user._id === purchase.userId
                                  );
                                  return user ? (
                                    <div style={{ marginBottom: "10px" }}>
                                      <ShoppingCartIcon />
                                      {user.name}
                                    </div>
                                  ) : (
                                    " "
                                  );
                                })
                                .reduce(
                                  (prev, curr) =>
                                    prev === null ? [curr] : [prev, " ", curr],
                                  null
                                )}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                fontSize: "18px",
                                fontFamily: "IBM Plex Mono",
                              }}
                            >
                              {calculateProductTotal(product._id)}$
                            </TableCell>
                          </TableRow>
                        );
                      })}

                      <TableRow>
                        <TableCell
                          colSpan={3}
                          align="right"
                          sx={{
                            fontSize: "18px",
                            fontFamily: "IBM Plex Mono",
                            fontWeight: "bold",
                          }}
                        >
                          <b>Total</b>
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontSize: "18px",
                            fontFamily: "IBM Plex Mono",
                            fontWeight: "bold",
                          }}
                        >
                          <b>${calculateTotal()}</b>
                        </TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className="container-delete-group">
                <button
                  onClick={() => {
                    openGroup();
                    setCompValue(1);
                  }}
                >
                  Abrir Grupo
                </button>
                <button onClick={handleDeleteGroup}>Borrar Grupo</button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default MyPageGroup;
