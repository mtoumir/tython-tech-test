import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext<any>(null);

export const AuthContextProvider = ({ children }: any) => {
  const [session, setSession] = useState<any>(null); 
  const [role, setRole] = useState<string | null>(null);

  const fetchRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching role:", error.message);
      setRole(null);
    } else {
      setRole(data.role);
    }
  };

  // Sign up a new user
  const signUpNewUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { success: false, error };
    return { success: true, data };
  };

  // Sign in an existing user
  const signInUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error };

    setSession(data.session); 
    if (data.session?.user?.id) {
      fetchRole(data.session.user.id);
    }

    return { success: true, data };
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error.message);
    setSession(null);
    setRole(null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) fetchRole(session.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.id) fetchRole(session.user.id);
      else setRole(null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, role, signUpNewUser, signInUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);
