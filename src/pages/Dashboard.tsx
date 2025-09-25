import CreateTicketForm from "../components/dashboardComponents/CreateTicketForm";
import StaffTicketManagement from "../components/dashboardComponents/StaffTicketManagement";
import TicketManagement from "../components/dashboardComponents/TicketManagement";
import UserManagement from "../components/dashboardComponents/UserManagement";
import UserTicketManagement from "../components/dashboardComponents/UserTicketManagement";
import { UserAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { session, role, signOut } = UserAuth();

  if (!session) return <h1>Please sign in</h1>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {role?.charAt(0).toUpperCase() + role?.slice(1)} Dashboard
        </h1>
        <button
          onClick={signOut}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>

      {role === "admin" && (
        <div>
          <p className="mb-4">Manage users, tickets, and staff assignments.</p>
          <UserManagement />
          <TicketManagement />
        </div>
      )}

      {role === "staff" && (
        <div>
          <p className="mb-4">View and resolve assigned tickets.</p>
          <StaffTicketManagement />
        </div>
      )}

      {role === "user" && (
        <div>
          <p className="mb-4">Create tickets and track their status.</p>
          <CreateTicketForm />
          <UserTicketManagement />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
