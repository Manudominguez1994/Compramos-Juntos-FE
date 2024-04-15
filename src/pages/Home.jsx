import React, { useState, useEffect } from "react";
import Login from "../components/Login";
import SignUp from "../components/Signup";

import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import MyNavbar from "../components/Navbar";

export default function Home() {
  const [buttonSwitch, setButton] = useState(1);

  const handleSetButton = (buttonNumber) => {
    setButton(buttonNumber);
  };

  return (
    <div>
      <MyNavbar handleSetButton={handleSetButton} />
      <div className="classContainerLogSign">
        <div className="nameAndLogo">
          <p>Compramos juntos</p>
          <img
            src="https://res.cloudinary.com/dgfqxvzld/image/upload/v1713201823/logo_compramos_juntos_fykqoh.png"
           
            style={{ width: "300px",marginBottom:"40px" }}
          />
          <div className="container-Add">
            <p style={{ fontSize: "16px" }}>Add ad here</p>
          </div>
        </div>
        <div className="log-sign-container">
          <div className="buttons-container-log-sign">
          <button
              className={buttonSwitch === 1 ? "active" : ""}
              onClick={() => handleSetButton(1)}
            >
              Ingresar
            </button>
            <button
              className={buttonSwitch === 2 ? "active" : ""}
              onClick={() => handleSetButton(2)}
            >
              Registrase
            </button>           
          </div>
          <div className="form-cotainer-log-sign">
            {buttonSwitch === 2 && <SignUp handleSetButton={handleSetButton} />}
            {buttonSwitch === 1 && <Login handleSetButton={handleSetButton} />}
          </div>
        </div>
      </div>
    </div>
    
  );
}
