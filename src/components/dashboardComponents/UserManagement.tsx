// components/Admin/UserManagement.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { UserAuth } from "../../context/AuthContext";

const UserManagement = () => {
  const { session } = UserAuth(); // get current session
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!session) return;

      // Fetch users from profiles table
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) console.error("Error fetching users:", error);
      else setUsers(data);
    };

    fetchUsers();
  }, [session]);

  const updateRole = async (id: string, newRole: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", id);

    if (error) {
      console.error("Error updating role:", error);
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
    }
  };

  if (!session) return <p>Please sign in to manage users.</p>;

  return (
    <div>
      <h2 className="font-bold text-xl mb-4">Manage Users</h2>
      <p>Signed in as: {session.user.email}</p> {/* show admin email */}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border">
              <td>{user.email ?? "N/A"}</td> {/* use email from profiles */}
              <td>{user.role}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => updateRole(user.id, e.target.value)}
                  className="border p-1"
                >
                  <option value="user">User</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
