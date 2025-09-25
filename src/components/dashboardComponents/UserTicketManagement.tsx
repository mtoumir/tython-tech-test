// components/dashboardComponents/UserTicketManagement.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { approveTicket } from "../../services/TicketService";
import { UserAuth } from "../../context/AuthContext";

interface Comment {
  id: string;
  comment: string;
  created_at: string;
  user?: { email: string };
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  assigned?: { email: string };
  ticket_comments?: Comment[];
}

const UserTicketManagement = () => {
  const { session } = UserAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const fetchTickets = async () => {
    if (!session) return;

    const { data, error } = await supabase
      .from("tickets")
      .select(`
        *,
        assigned:profiles!tickets_assigned_to_fkey(email),
        ticket_comments (
          id,
          comment,
          created_at,
          user:profiles!ticket_comments_user_id_fkey(email)
        )
      `)
      .eq("created_by", session.user.id)
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching tickets:", error);
    else setTickets(data || []);
  };

  const handleApprove = async (ticketId: string) => {
    const { error } = await approveTicket(ticketId);
    if (error) console.error("Error approving ticket:", error);
    else {
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: "approved" } : t))
      );
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [session]);

  if (!session) return <p>Please sign in to see your tickets.</p>;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">My Tickets</h2>

      {tickets.length === 0 ? (
        <p>You haven't created any tickets yet.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-lg">{ticket.title}</h3>
              <p className="text-gray-700">{ticket.description}</p>
              <p className="mt-1">
                <strong>Status:</strong> {ticket.status} |{" "}
                <strong>Assigned To:</strong> {ticket.assigned?.email ?? "Unassigned"}
              </p>

              {/* Approve Button */}
              {ticket.status === "solved" && (
                <button
                  onClick={() => handleApprove(ticket.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mt-2"
                >
                  Approve
                </button>
              )}

              {/* Comments */}
              {ticket.ticket_comments && ticket.ticket_comments.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold">Comments:</h4>
                  <ul className="list-disc list-inside">
                    {ticket.ticket_comments.map((c) => (
                      <li key={c.id}>
                        <span className="font-medium">{c.user?.email ?? "Unknown"}:</span>{" "}
                        {c.comment}{" "}
                        <span className="text-gray-400 text-xs">
                          ({new Date(c.created_at).toLocaleString()})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserTicketManagement;
