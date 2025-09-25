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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Ticket Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Describe your issue"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Create Ticket</button>
    </form>
  );
}
