import React from 'react'
import Navbar from "../components/Navbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
// estilos
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

function NotFound() {
  return (
    <div>
      <Navbar />
      <div className="container-gotohome">
        <div className="gotohome">
          <p>
           Ups! pagina no encontrada,<br/> pulsa para ir a la pagina principal {"  "}
            <Link to={"/"}>
              <HomeRoundedIcon sx={{ fontSize: 50, marginBottom: "18px", color:"#F92B42" }} />
            </Link>
            
          </p>
        </div>
        <div className="nameAndLogo">
          <p>Compramos juntos</p>
          <img
            src="/public/logo_compramos_juntos.png"
            alt=""
            style={{ width: "300px", marginBottom: "40px" }}
          />
          <div className="container-Add">
            <p style={{ fontSize: "16px" }}>Add ad here</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default NotFound