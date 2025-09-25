import { UserAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
    const { session, signOut } = UserAuth();
    const navigate = useNavigate();
     
    return (
        <div>Dashboard</div>
    )
}
export default Dashboard