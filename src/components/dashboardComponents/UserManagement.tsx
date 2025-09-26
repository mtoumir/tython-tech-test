import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { UserAuth } from "../../context/AuthContext";

const UserManagement = () => {
  const { session } = UserAuth();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!session) return;
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

  if (!session) return <p className="text-red-500">Please sign in to manage users.</p>;

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="font-bold text-2xl mb-6 text-gray-800">Manage Users</h2>
      <p className="mb-4 text-sm text-gray-500">
        Signed in as: <span className="font-medium">{session.user.email}</span>
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-3 ">Email</th>
              <th className="py-2 px-3">Role</th>
              <th className="py-2 px-3">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-3 font-medium">{user.email ?? "N/A"}</td>
                <td className="py-2 px-3 capitalize font-medium text-center">{user.role}</td>
                <td className="py-2 px-3 font-medium text-center">
                  <select
                    value={user.role}
                    onChange={(e) => updateRole(user.id, e.target.value)}
                    className="border rounded-md p-1 text-sm focus:ring focus:ring-blue-300"
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
    </div>
  );
};

export default UserManagement;
