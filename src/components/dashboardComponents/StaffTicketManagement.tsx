// components/dashboardComponents/StaffTicketManagement.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { addComment, solveTicket } from "../../services/TicketService";
import { UserAuth } from "../../context/AuthContext";

const StaffTicketManagement = () => {
  const { session } = UserAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchTickets = async () => {
      if (!session) return;

      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("assigned_to", session.user.id)
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching tickets:", error);
      else setTickets(data);
    };

    fetchTickets();
  }, [session]);

  const handleSolve = async (ticketId: string) => {
    const { error } = await solveTicket(ticketId);
    if (error) console.error("Error solving ticket:", error);
    else
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: "solved" } : t))
      );
  };

  const handleAddComment = async (ticketId: string) => {
    const comment = commentText[ticketId];
    if (!comment) return;

    const { error } = await addComment(ticketId, comment);
    if (error) console.error("Error adding comment:", error);
    else {
      setCommentText((prev) => ({ ...prev, [ticketId]: "" }));
      alert("Comment added!");
    }
  };

  if (!session) return <p>Please sign in to see your tickets.</p>;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">My Assigned Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tickets assigned to you.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Title</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Created By</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="text-center">
                <td className="border p-2">{ticket.title}</td>
                <td className="border p-2">{ticket.description}</td>
                <td className="border p-2">{ticket.status}</td>
                <td className="border p-2">{ticket.user?.email ?? "N/A"}</td>
                <td className="border p-2">
                  {ticket.status !== "solved" && (
                    <button
                      onClick={() => handleSolve(ticket.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mb-2"
                    >
                      Mark as Solved
                    </button>
                  )}
                  <div>
                    <input
                      type="text"
                      placeholder="Add comment"
                      value={commentText[ticket.id] || ""}
                      onChange={(e) =>
                        setCommentText((prev) => ({
                          ...prev,
                          [ticket.id]: e.target.value,
                        }))
                      }
                      className="border p-1 mb-1 w-full"
                    />
                    <button
                      onClick={() => handleAddComment(ticket.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 w-full"
                    >
                      Add Comment
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StaffTicketManagement;
