import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import service from "../services/service.config";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { ProductsContext } from "../../context/product.context";
//Estilos
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Rating from "@mui/material/Rating";

function AllGroupsFilter() {
  const navigate = useNavigate();
  const ActiveUserId = useContext(AuthContext);

  //*Informacion  de usuario
  const [infoUser, setInfoUser] = useState("");

  //* Productos y productos filtrados
  const { allProducts } = useContext(ProductsContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [errorMessage, setError] = useState("");
  const [errorSms, setErrorMessage] = useState("");

  //* Grupos y grupos filtrados
  const [allGroups, setAllGroups] = useState([]);
  const [allGruopsFilterAdd, setAllGruopsFilterAdd] = useState([]);

  //*Cambio de Componente o vista
  const [thisCategory, setThisCategory] = useState("");
  const [visibleComponent, setVisibleComponent] = useState(1);

  //*Buscador por texto
  const [searchProduct, setSearchProduct] = useState("");

  //*Como funciona
  const [howToFunction, setHowToFunction] = useState(true);

  //*Anuncio estado
  const [addVisible, setAddVisible] = useState(true);
  //*Estado estrellas
  const [value, setValue] = React.useState(2);

  //* Ciclo de vida  del componente
  useEffect(() => {
    getAllGroups();
    getUserInfo();
  }, []);

  //*Funcion para info de usuario
  const getUserInfo = async () => {
    try {
      const response = await service.get("/user/myprofile");

      setInfoUser(response.data);
      setHowToFunction(true);
    } catch (error) {
      navigate(error);
    }
  };

  //*Funciones cambio de componente
  const handleChangeComponent = (value) => {
    setVisibleComponent(value);
    if (value === 1) {
      setError(""); // Restablecer el mensaje de error
    }
  };

  const handleSetComponent = (componentNumber, value) => {
    // let arrayfilter;
    if (componentNumber === 2) {
      // console.log(arrayfilter,"arrayfilter");
      setThisCategory(value);
      const arrayfilter = allProducts.filter(
        (item) => item.categorie === value
      );
      // console.log(arrayfilter,"arrayfilter2");
      setFilteredProducts(arrayfilter);
      setHowToFunction(false);
    }
    setVisibleComponent(componentNumber);
  };

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

      setAllGroups(response.data);
    } catch (error) {
      navigate(error);
    }
  };

  //*Filtrado de los grupos
  const handleGroupFilterProduct = (value) => {
    //! Filtro de Producto
    const arrayGroupFilter = allGroups.filter((group) =>
      group.products.some((producto) => producto.nombre === value)
    );

    //! Filtro de distancia y usuarios dentro del grupo
    // Calcula la distancia entre el usuario y cada grupo
    const latUsuario = infoUser.coordinates[0];
    const lonUsuario = infoUser.coordinates[1];
    const groupFilter1 = arrayGroupFilter
      .map((group) => {
        const distancia = calcularDistancia(
          latUsuario,
          lonUsuario,
          group.coordinates[0],
          group.coordinates[1]
        );
        return { ...group, distancia }; // Añade la distancia al objeto del grupo
      })
      .filter((group) => group.distancia < 20);
    //Ordena de menos a mayor
    groupFilter1.sort((a, b) => a.distancia - b.distancia);
    //Filtro usuario activo
    const filterDef = groupFilter1.filter((group) => {
      return group.users.every(
        (user) => user._id !== ActiveUserId.ActiveUserId
      );
    });
    setAllGruopsFilterAdd(filterDef);
    handleSetComponent(3);
    setAddVisible(false);
    if (filterDef.length === 0) {
      setErrorMessage("No se encontraron grupos con ese producto.");
    } else {
      setErrorMessage("");
    }
  };

  //* Funcion de barra de busqueda
  // Función para manejar cambios en el input de búsqueda
  const handleSearchInputChange = (event) => {
    setSearchProduct(event.target.value);
  };
  //* Función para filtrar grupos según el producto ingresado en el input
  const handleSearch = () => {
    const searchValue = searchProduct.trim().toLowerCase();
    const filteredGroups = allGroups.filter((group) =>
      group.products.some((product) =>
        product.nombre.toLowerCase().includes(searchValue)
      )
    );
    if (filteredGroups.length === 0) {
      setError("No se encontraron grupos con ese producto.");
    } else {
      setError("");
    }
    //! Filtro de distancia y usuarios dentro del grupo
    // Calcula la distancia entre el usuario y cada grupo
    const latUsuario = infoUser.coordinates[0];
    const lonUsuario = infoUser.coordinates[1];
    const groupFilter1 = filteredGroups
      .map((group) => {
        const distancia = calcularDistancia(
          latUsuario,
          lonUsuario,
          group.coordinates[0],
          group.coordinates[1]
        );
        return { ...group, distancia }; // Añade la distancia al objeto del grupo
      })
      .filter((group) => group.distancia < 20);
    //Ordena de menos a mayor
    groupFilter1.sort((a, b) => a.distancia - b.distancia);
    //Filtro usuario activo
    const filterDef = groupFilter1.filter((group) => {
      return group.users.every(
        (user) => user._id !== ActiveUserId.ActiveUserId
      );
    });

    setAllGruopsFilterAdd(filterDef);
    setVisibleComponent(3);
    setSearchProduct("");
  };

  return (
    <div>
      <Navbar
        visibleComponent={visibleComponent}
        setVisibleComponent={setVisibleComponent}
        setHowToFunction={setHowToFunction}
        setAddVisible={setAddVisible}
      />
      <div className="allGroups-styles-container">
        <div className="comp-search">
          <div className="comp-search-name-input">
            <div className="comp-search-name">
              <p>Compramos juntos</p>
            </div>
            <div className="comp-search-input">
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Buscar producto"
                  value={searchProduct}
                  onChange={handleSearchInputChange}
                />
                <Button
                  onClick={handleSearch}
                  variant="outline-secondary"
                  id="button-addon1"
                >
                  <i class="fas fa-search fa-2x"></i>
                </Button>
              </InputGroup>
              <p style={{ fontSize: "20px" }}>
                {errorMessage && (
                  <p className="error-message">
                    {errorMessage}{" "}
                    <button
                      className="boton-atras"
                      onClick={() => handleChangeComponent(1)}
                    >
                      Volver
                    </button>
                  </p>
                )}
              </p>
            </div>
          </div>
          <div className="comp-search-image">
            <img src="https://res.cloudinary.com/dgfqxvzld/image/upload/v1713203072/emojione_shopping-cart_djk74y.png" />
          </div>
        </div>
        <div style={{ width: "85%" }}>
          {/* Boton crear o unirte gurpo */}
          {visibleComponent === 1 && (
            <div className="container-create-join">
              <Link
                to={"/creategroup"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  className="container-targets-create"
                  style={{ marginRight: "20px" }}
                >
                  <div className="create-title-description">
                    <div className="create-title">
                      <p>Crear un grupo</p>
                    </div>
                    <div className="create-description">
                      <p>
                        Esta opción le permite iniciar un colectivo de compra
                        para comprar al por mayor, lo que le permite a Usted y a
                        otros ahorrar dinero comprando juntos.
                      </p>
                    </div>
                  </div>
                  <div className="target-create-img">
                    <img src="https://res.cloudinary.com/dgfqxvzld/image/upload/v1713203098/Vector_naranja_qvupip.png" />
                  </div>
                </div>
              </Link>
              <div
                className="container-targets-join"
                onClick={() => handleChangeComponent(2)}
              >
                <div className="join-title-description">
                  <div className="create-title">
                    <p>Unirse a un grupo</p>
                  </div>
                  <div className="create-description">
                    <p>
                      Esta opción le permite unirse a un grupo: Busque grupos
                      existentes y únase a ellos para aprovechar precios más
                      bajos en la compra de productos al por mayor.
                    </p>
                  </div>
                </div>
                <div className="target-create-img">
                  <img src="https://res.cloudinary.com/dgfqxvzld/image/upload/v1713203097/Vector_gris_gsntzt.png" />
                </div>
              </div>
            </div>
          )}
          {/* Select Categories and product */}
          {visibleComponent === 2 && (
            <div className="container-categories-products">
              <div className="container-categories">
                <div className="category-title">
                  <p>Categorias</p>
                </div>
                <div className="allCategory">
                  <div
                    onClick={() => handleSetComponent(2, "Alimentos")}
                    className="thisCategory"
                  >
                    <img
                      style={{ width: "100%", padding: "0 5px 0 5px" }}
                      src="https://res.cloudinary.com/dgfqxvzld/image/upload/v1713203078/imagem_alimentos_cjolio.png"
                    />
                    <p style={{ marginTop: "30px" }}> Alimentos</p>
                  </div>
                  <div
                    onClick={() => handleSetComponent(2, "Higiene")}
                    className="thisCategory"
                  >
                    <img
                      style={{ width: "100%", padding: "0 5px 0 5px" }}
                      src="https://res.cloudinary.com/dgfqxvzld/image/upload/v1713203079/imagem_higiene_caztvz.png"
                    />
                    <p style={{ marginTop: "30px" }}> Higiene</p>
                  </div>
                  <div
                    onClick={() => handleSetComponent(2, "Medicina")}
                    className="thisCategory"
                  >
                    <img
                      style={{ width: "100%", padding: "0 5px 0 5px" }}
                      src="https://res.cloudinary.com/dgfqxvzld/image/upload/v1713203080/imagem_medicina_wems6m.png"
                    />
                    <p style={{ marginTop: "30px" }}>Medicina</p>
                  </div>
                </div>
              </div>
              <div className="container-products">
                <div className="product-title">
                  <p>{thisCategory}</p>
                </div>
                <div className="allProduct-filter">
                  {filteredProducts.map((product) => (
                    <div
                      className="thisProduct"
                      key={product.id}
                      onClick={() => handleGroupFilterProduct(product.name)}
                    >
                      <img
                        src={product.image}
                        style={{ width: "100%", padding: "0 5px 0 5px" }}
                      />

                      <p style={{ marginTop: "30px" }}>{product.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Barra search */}
          {visibleComponent === 3 && (
            <div className="container-allgroups-filter">
              <div className="title-allgroups">
                <p>Grupos</p>
                {errorSms && (
                  <p className="error-message">
                    {errorSms}
                    <button
                      className="boton-atras"
                      onClick={() => handleChangeComponent(1)}
                    >
                      Volver
                    </button>{" "}
                  </p>
                )}
              </div>
              {allGruopsFilterAdd.map((group) => (
                <div key={group._id} style={{ width: "100%" }}>
                  <Link to={`/groupdetails/${group._id}`}>
                    <div className="target-group-filter">
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
              ))}
            </div>
          )}
        </div>
        {addVisible === true ? (
          <div className="container-Add-full">
            <p>Add ad here</p>
          </div>
        ) : null}

        {howToFunction === true ? (
          <div className="container-comofunciona">
            <div id="comoFunciona" className="container-title-comofunciona">
              <p>Como Funciona</p>
            </div>
            <div className="container-img-comofunciona">
              <img
                src="https://res.cloudinary.com/dgfqxvzld/image/upload/v1713203069/Como_funciona1_vdtfps.png"
                className="img-comofunciona"
              />
              <img
                src="https://res.cloudinary.com/dgfqxvzld/image/upload/v1715074107/Como_funciona2_plxva8.png"
                className="img-comofunciona"
              />
              <img
                src="https://res.cloudinary.com/dgfqxvzld/image/upload/v1713203071/Como_funciona3_avfbzo.png"
                className="img-comofunciona"
              />
              <img
                src="https://res.cloudinary.com/dgfqxvzld/image/upload/v1713203069/Como_funciona4_rjf7c6.png"
                className="img-comofunciona"
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
export default AllGroupsFilter;
