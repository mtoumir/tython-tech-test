// components/dashboardComponents/UserTicketManagement.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { approveTicket } from "../../services/TicketService";
import { UserAuth } from "../../context/AuthContext";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  assigned_to?: string;
  created_at: string;
  assigned?: { email: string };
}

const UserTicketManagement = () => {
  const { session } = UserAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const fetchTickets = async () => {
    if (!session) return;

    const { data, error } = await supabase
  .from("tickets")
  .select("*")
  .eq("created_by", session.user.id) // ✅ use the correct column
  .order("created_at", { ascending: false });

if (error) console.error("Error fetching tickets:", error);
else setTickets(data);

    if (error) console.error("Error fetching tickets:", error);
    else setTickets(data || []);
  };

  useEffect(() => {
    fetchTickets();
  }, [session]);

  const handleApprove = async (ticketId: string) => {
    const { error } = await approveTicket(ticketId);
    if (error) console.error("Error approving ticket:", error);
    else {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId ? { ...t, status: "approved" } : t
        )
      );
    }
  };

  if (!session) return <p>Please sign in to see your tickets.</p>;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">My Tickets</h2>
      {tickets.length === 0 ? (
        <p>You haven't created any tickets yet.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Title</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Assigned To</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="text-center">
                <td className="border p-2">{ticket.title}</td>
                <td className="border p-2">{ticket.description}</td>
                <td className="border p-2">{ticket.status}</td>
                <td className="border p-2">{ticket.assigned?.email ?? "Unassigned"}</td>
                <td className="border p-2">
                  {ticket.status === "solved" && (
                    <button
                      onClick={() => handleApprove(ticket.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserTicketManagement;
