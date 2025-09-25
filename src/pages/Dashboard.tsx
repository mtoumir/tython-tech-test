import { UserAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
    const { session, signOut } = UserAuth();
    const navigate = useNavigate();

    const handleSignOut = async (e) => {
        e.preventDefault();
        try {
            await signOut();
            navigate("/");
            console.log("You are logged out");
        }
        catch (error) {
            console.log(error.message);
        }
    }
     
    return (
        <>
            <div>
                <h1>Dashboard</h1>
                <p>Welcome, {session?.user?.email}</p>
                <button onClick={handleSignOut}>Sign Out</button>
            </div>
        </>
    )
}
export default Dashboard