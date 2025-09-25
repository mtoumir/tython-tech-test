import { supabase } from "../supabaseClient";

// Create Ticket
export const createTicket = async (title: string, description: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  const { data, error } = await supabase
    .from("tickets")
    .insert([{ title, description, created_by: user?.id }]);
  return { data, error };
};

// Assign Ticket (Admin)
export const assignTicket = async (ticketId: string, staffId: string) => {
  const { data, error } = await supabase
    .from("tickets")
    .update({ assigned_to: staffId, status: "assigned" })
    .eq("id", ticketId);
  return { data, error };
};

// Mark as Solved (Staff)
export const solveTicket = async (ticketId: string) => {
  const { data, error } = await supabase
    .from("tickets")
    .update({ status: "solved" })
    .eq("id", ticketId);
  return { data, error };
};

// Approve Ticket (User)
export const approveTicket = async (ticketId: string) => {
  const { data, error } = await supabase
    .from("tickets")
    .update({ status: "approved" })
    .eq("id", ticketId);
  return { data, error };
};

// Add Comment
export const addComment = async (ticketId: string, comment: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  const { data, error } = await supabase
    .from("ticket_comments")
    .insert([{ ticket_id: ticketId, user_id: user?.id, comment }]);
  return { data, error };
};
