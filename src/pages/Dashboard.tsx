import { UserAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { session, role } = UserAuth();

  if (!session) return <h1>Please sign in</h1>;

  if (role === "admin") {
    return (
      <div>
        <h1>Admin Dashboard</h1>
        <p>Manage users, tickets, and staff assignments.</p>
        {/* Add components like <UserManagement />, <TicketOverview /> */}
      </div>
    );
  }

  if (role === "staff") {
    return (
      <div>
        <h1>Staff Dashboard</h1>
        <p>View and resolve assigned tickets.</p>
        {/* Add components like <AssignedTickets /> */}
      </div>
    );
  }

  if (role === "user") {
    return (
      <div>
        <h1>User Dashboard</h1>
        <p>Create tickets and track their status.</p>
        {/* Add components like <MyTickets />, <CreateTicket /> */}
      </div>
    );
  }

  return <h1>Loading...</h1>;
};

export default Dashboard;
