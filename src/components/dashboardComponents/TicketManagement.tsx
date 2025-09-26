// components/Admin/TicketManagement.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const TicketManagement = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: ticketsData, error: ticketsError } = await supabase
  .from("tickets")
  .select("*")
  .order("created_at", { ascending: false });

  console.log("Fetched tickets:", ticketsData);


      if (ticketsError) console.error("Error fetching tickets:", ticketsError);
      else setTickets(ticketsData);

      // Fetching staff members
      const { data: staffData, error: staffError } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("role", "staff");

      if (staffError) console.error("Error fetching staff:", staffError);
      else setStaff(staffData);
    };

    fetchData();
  }, []);

  const assignTicket = async (ticketId: string, staffId: string) => {
    const { error } = await supabase
      .from("tickets")
      .update({ assigned_to: staffId, status: "assigned" })
      .eq("id", ticketId);

    if (error) {
      console.error("Error assigning ticket:", error);
    } else {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? { ...t, assigned: staff.find((s) => s.id === staffId), status: "assigned" }
            : t
        )
      );
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Ticket Management</h2>
      {tickets.length === 0 ? (
        <p className="text-gray-600">No tickets available.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Title</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Created By</th>
              <th className="border p-2">Assigned To</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="text-center">
                <td className="border p-2">{ticket.title}</td>
                <td className="border p-2">{ticket.description}</td>
                <td className="border p-2">{ticket.status}</td>
                <td className="border p-2">{ticket.user?.email ?? "N/A"}</td>
                <td className="border p-2">{ticket.assigned?.email ?? "Unassigned"}</td>
                <td className="border p-2">
                  <select
                    onChange={(e) => assignTicket(ticket.id, e.target.value)}
                    className="border p-1 rounded"
                    defaultValue=""
                  >
                    <option value="">Assign staff</option>
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.email}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TicketManagement;
