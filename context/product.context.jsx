import { createContext, useEffect, useState } from "react";
import service from "../src/services/service.config";

const ProductsContext = createContext();

const ProductsProvider = (props) => {
  const [allProducts, setAllProducts] = useState([]);

  const getAllProducts = async () => {
      try {
          const response = await service.get("/product/allproducts");
          setAllProducts(response.data);
        } catch (error) {
            console.error("Error al obtener los productos:", error);
        }
    };
    useEffect(() => {
      
        getAllProducts();
      }, []);
//   console.log("Llamada productos contexto",allProducts);

  return (
    <ProductsContext.Provider value={{ allProducts, getAllProducts }}>
      {props.children}
    </ProductsContext.Provider>
  );
};

export { ProductsContext, ProductsProvider };
