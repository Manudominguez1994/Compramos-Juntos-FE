import { useContext } from "react"
import { AuthContext } from "../../context/auth.context"
import { Navigate } from "react-router-dom"

function IsPrivate(props) {

const {isUserActived} = useContext(AuthContext)

if(isUserActived === true){
    return props.children
    
}else{
    return <Navigate to={"/"}/>
}
}

export default IsPrivate