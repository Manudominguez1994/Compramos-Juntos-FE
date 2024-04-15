
import { Route, Routes } from 'react-router-dom'
import IsPrivate from './components/IsPrivate'
//? Estilos

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './App.css'
import './styles/NoLogin.css'
import './styles/FirstPages.css'
import './styles/CreateGroup.css'
import './styles/ThisGroup.css'
import './styles/MyProfile.css'

import Home from './pages/Home'
import MyProfile from './pages/MyProfile'
import NotFound from './pages/NotFound'
import Error from './pages/Error'
import CreateGroup from './pages/CreateGroup'
import GroupDetails from './pages/GroupDetails'
import AllGroupsFilter from './pages/AllGroupsFilter'
import MyGroups from './pages/MyGroups'
import GroupSelected from './pages/GroupSelected'
import FinishPage from './pages/FinishPage'

import { useContext } from "react";
import { AuthContext } from "../context/auth.context";


function App() {
  
  const { isUserActived} = useContext(AuthContext);

  return (
    <>
      
      <Routes>

        {/*Public Pages*/}
        {!isUserActived && <Route path='/' element={<Home/>}/>}
        

        {/*Private Page*/}

        <Route path='/' element={<IsPrivate><AllGroupsFilter/></IsPrivate>}/>
        <Route path='/myprofile' element={<IsPrivate><MyProfile/></IsPrivate>}/>
        <Route path='/creategroup' element={<IsPrivate><CreateGroup/></IsPrivate>}/>
        <Route path='/groupdetails/:groupid' element={<IsPrivate><GroupDetails/></IsPrivate>}/>
        <Route path='/groupselected/:groupid' element={<IsPrivate><GroupSelected/></IsPrivate>}/>
        <Route path='/mygroups' element={<IsPrivate><MyGroups/></IsPrivate>}/>
        <Route path='/finishpage' element={<IsPrivate><FinishPage/></IsPrivate>}/>


        {/*Gestion de errores*/}

        <Route path='/error' element={<Error/>}/>
        <Route path='/*' element={<NotFound/>}/>

      </Routes>
    </>
  )
}

export default App
