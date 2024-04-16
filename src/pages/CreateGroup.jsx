import React, { useEffect, useState } from "react";
import service from "../services/service.config";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { ProductsContext } from "../../context/product.context";

//Imports Map
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import ClickMarker from "../components/ClickMarker";
//Estilos
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCheckbox,
  MDBBtn,
} from "mdb-react-ui-kit";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

function CreateGroup() {
  const navigate = useNavigate();

  const ActiveUserId = useContext(AuthContext);

  const { allProducts } = useContext(ProductsContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [errorMessage, setError] = useState("");

  //Estado de Grupos
  const [nameLider, setNameLider] = useState("");
  const [nameGroup, setNameGroup] = useState("");
  const [productArrayGroup, setProductArrayGroup] = useState([]);

  const array = [];
  //Estado para reiniciar el selects
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  //Estados de Productos
  const [nameProduct, setNameProduct] = useState("");
  const [imageProduct, setImageProduct] = useState("");
  const [categorieProduct, setCategorieProduct] = useState("");
  const [quantityProduct, setQuantityProduct] = useState(0);
  const [unidadProduct, setUnidadProduct] = useState("");
  const [priceUnit, setPriceUnit] = useState(0);
  const [showFormProduct, setShowFormProduct] = useState(false);

  //Mapa
  const [center, setCenter] = useState([4.60971, -74.08175]);
  const [clickedPosition, setClickedPosition] = useState(null);
  // Estados para la fecha y la hora
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = React.useState(
    dayjs("2022-04-17T15:30")
  );

  useEffect(() => {
    getUserInfo();
    setProductArrayGroup([]);
  }, []);

  //Datos Usuario Lider
  const getUserInfo = async () => {
    try {
      const response = await service.get("/user/myprofile");
      setNameLider(response.data.name);
    } catch (error) {
      navigate(error);
    }
  };

  useEffect(() => {
    // Filtrar productos cuando cambia la categoría seleccionada
    if (categorieProduct) {
      const filtered = allProducts
        .filter((product) => product.categorie === categorieProduct)
        .map((product) => ({
          ...product,
          quantity: 0,
          price: 0,
        }));
      setFilteredProducts(filtered);
      setShowFormProduct(false);
    }
  }, [categorieProduct, allProducts]);

  //Funciones Grupo
  const handleNameGroup = (e) => {
    setNameGroup(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };
  const handleAddUserLiderToUsers = () => {
    array.push(ActiveUserId.ActiveUserId);
  };
  //Funciones Producto
  const handleCategorieSelection = (selectedCategorie) => {
    setCategorieProduct(selectedCategorie); // Actualizar el estado de la categoría seleccionada
    setSelectedCategory(selectedCategorie); // Actualizar el estado del selector de categoría
  };
  const handleQuantityChange = (e) => {
    setQuantityProduct(e.target.value);
  };

  const handleUnidadChange = (unidad) => {
    setUnidadProduct(unidad);
  };
  const handlePriceChange = (e) => {
    setPriceUnit(e.target.value);
  };
  const handleNameProductChange = (productName) => {
    setNameProduct(productName);
    setShowFormProduct(true);
    setSelectedProduct(productName);
    const selectedProduct = filteredProducts.find(
      (product) => product.name === productName
    );
    if (selectedProduct && selectedProduct.image) {
      setImageProduct(selectedProduct.image);
    }
  };
  //Para Borrar un producto creado por error
  const handleRemoveProduct = async (index, productId) => {
    try {
      await service.post(`/product/delete/${productId}`);
      const updatedProducts = [...productArrayGroup];
      updatedProducts.splice(index, 1);
      setProductArrayGroup(updatedProducts);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.errorMessage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/error");
      }
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    handleAddUserLiderToUsers();
    const formattedTime = selectedTime.format("HH:mm:ss");
    const formattedDate = selectedDate.toISOString();
    if (productArrayGroup.length === 0) {
      setError("Para crear un grupo, debes agregar al menos un producto.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    try {
      const response = await service.post("/group/create", {
        name: nameGroup,
        liderUser: nameLider,
        coordinates: clickedPosition,
        date: formattedDate,
        hour: formattedTime,
        products: productArrayGroup,
        users: array,
      });
      navigate(`/groupselected/${response.data._id}`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.errorMessage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/error");
      }
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await service.post("/product/create", {
        nombre: nameProduct,
        imagen: imageProduct,
        categoria: categorieProduct,
        cantidad: quantityProduct,
        unidad: unidadProduct,
        precio: priceUnit,
      });
      setShowFormProduct(false);
      setProductArrayGroup([...productArrayGroup, response.data]);
      setSelectedCategory("");
      setSelectedProduct("");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.errorMessage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/error");
      }
    }
  };

  const closeModal = () => {
    setError("");
  };
  // console.log(productArrayGroup);
  return (
    <div>
      <Navbar />
      <div style={{ width: "100%" }}>
        <div className="container-creategroup">
          {/* mensaje de error */}
          <div className="error-message">
            {errorMessage && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={closeModal}>
                    &times;
                  </span>
                  <p>{errorMessage}</p>
                  <button onClick={closeModal}>Cerrar</button>
                </div>
              </div>
            )}
          </div>
          {/* Contenedor formulario crear grupo */}
          <div className="title-creategroup">
            <p>Crear grupo</p>
          </div>
          {allProducts ? (
            <div className="form-creategroup">
              <form>
                <div className="form-info-create-group">
                  <div className="form-info-create-group-div-input">
                    <MDBInput
                    style={{height:"50px", height:"56px"}}
                      type="text"
                      name="name"
                      onChange={handleNameGroup}
                      className="mb-4"
                      id="form1Example1"
                      label="Elige un nombre para tu grupo"
                    />
                  </div>
                  <div className="form-info-create-group-div">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Selecciona una fecha"
                        value={selectedDate}
                        onChange={handleDateChange}
                        renderInput={(props) => <TextField {...props} />}
                      />
                    </LocalizationProvider>
                  </div>
                  <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        label="Selecciona una hora"
                        value={selectedTime}
                        onChange={(newValue) => setSelectedTime(newValue)}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
                <div className="container-map-title">
                  <div>
                    <p>Seleccion una ubicacion de entrega en el mapa :</p>
                  </div>
                  <div className="container-map">
                    <MapContainer
                      center={center}
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
                </div>
              </form>
            </div>
          ) : null}

          {/* Añadir producto */}
          <div className="container-add-product">
            <p className="add-product-title" style={{ fontSize: "24px" }}>
              Agrega un producto
            </p>
            <div className="container-category-product">
              <div className="container-select-cat-pro">
                <div className="container-categories-add">
                  <FormControl
                    style={{ width: "150px" }}
                    variant="standard"
                    sx={{ m: 1, minWidth: 120 }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Categorias
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedCategory}
                      label="Categoria"
                      onChange={(e) => handleCategorieSelection(e.target.value)}
                    >
                      <MenuItem value={"Alimentos"}>Alimentos</MenuItem>
                      <MenuItem value={"Higiene"}>Higiene</MenuItem>
                      <MenuItem value={"Medicina"}>Medicina</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="container-product-add">
                  <FormControl
                    style={{ width: "150px" }}
                    variant="standard"
                    sx={{ m: 1, minWidth: 120 }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Productos
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={selectedProduct}
                      label="Producto"
                      onChange={(e) => handleNameProductChange(e.target.value)}
                    >
                      {filteredProducts.map((product) => (
                        <MenuItem key={product.id} value={product.name}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>

              {showFormProduct === true ? (
                <div style={{width:"40%"}}>
                  <form
                    className="form-product-add"
                    onSubmit={handleCreateProduct}
                  >
                    <div style={{ margin: "10px", textAlign: "center" }}>
                      <img
                        src={
                          nameProduct &&
                          filteredProducts.find(
                            (product) => product.name === nameProduct
                          )?.image
                        }
                        alt={nameProduct}
                        style={{ width: "200px" }}
                      />
                    </div>

                    <TextField
                      style={{ marginTop: "20px", width:"100%" }}
                      id="standard-number"
                      label="Cantidad"
                      type="number"
                      onChange={handleQuantityChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="standard"
                    />

                    <FormControl
                      variant="standard"
                      sx={{ m: 2, minWidth: 120 }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Selecciona
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        onChange={(e) => handleUnidadChange(e.target.value)}
                        label="Selecciona"
                      >
                        <MenuItem value="">
                          <em>Selecciona</em>
                        </MenuItem>
                        <MenuItem value={"Kg"}>Kg</MenuItem>
                        <MenuItem value={"Ud"}>Unidades</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      style={{ marginTop: "20px", width:"100%"  }}
                      id="standard-number"
                      label="Precio unidad/kg"
                      type="number"
                      onChange={handlePriceChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="standard"
                    />
                    <Button type="submit" style={{ marginTop: "20px" }}>
                      Añadir producto
                    </Button>
                    {/* <button style={{marginTop:"20px"}}>Añadir producto</button> */}
                  </form>
                </div>
              ) : null}
            </div>
          </div>
          {/* Productos añadidos */}
          <div className="container-product-added">
            <div className="container-title-product-added">
              <p>Productos añadidos </p>
            </div>
            <div className="container-target-product-added">
              {productArrayGroup.map((product, index) => (
                <div key={product._id} className="target-product-added">
                  <div className="boton-container">
                    <button
                      className="boton-cerrar"
                      onClick={() => handleRemoveProduct(index, product._id)}
                    >
                      X
                    </button>
                  </div>
                  <div className="target-product">
                    <div>
                      <img src={product.imagen} className="target-product-img"/>
                    </div>
                    <div className="target-product-item">
                      <p>{product.nombre}</p>
                    </div>
                    <div className="target-product-item">
                      <p>
                        {product.cantidad} {product.unidad}
                      </p>
                    </div>
                    <div className="target-product-item">
                      <p>
                        {" "}
                        {product.precio}$ por {product.unidad}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="button-crear-grupo">
            <Button variant="contained" onClick={handleCreateGroup}>
              Crear Grupo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateGroup;
