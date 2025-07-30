import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"

const ProtectedRoutes=({children})=>{
     const {isLoggedIn}=useAuth();
     return isLoggedIn? children: <Navigate to="/login" replace/>
}

export default ProtectedRoutes;
