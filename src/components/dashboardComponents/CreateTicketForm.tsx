import { useState } from "react";
import { createTicket } from "../../services/TicketService";

export default function CreateTicketForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await createTicket(title, description);
    if (error) {
      console.error("Error creating ticket:", error.message);
    } else {
      console.log("Ticket created:", data);
      setTitle("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-md w-full max-w-md">
  <input
    type="text"
    placeholder="Ticket Title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="border p-2 mb-2 w-full rounded"
    required
  />
  <textarea
    placeholder="Describe your issue"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    className="border p-2 mb-2 w-full rounded h-24"
    required
  />
  <button
    type="submit"
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  >
    Create Ticket
  </button>
</form>

  );
}
