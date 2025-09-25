import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext<any>(null);

export const AuthContextProvider = ({ children }: any) => {
  const [session, setSession] = useState<any>(undefined);
  const [role, setRole] = useState<string | null>(null);

  const signUpNewUser = async (email, password) => {
        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password,
        })
        if (error) {
            console.error("Error signing up:", error);
            return { success: false ,error };
        }
        return { success: true, data };
    }

    const signInUser = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            })
            if (error) {
                console.error("Error signing in:", error);
                return { success: false, error: error.message };
            }
            console.log("Sign-in successful:", data);
            return { success: true, data };
        } catch (error) {
            console.error("Error signing in:", error);
        }
    }


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

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) {
        fetchRole(session.user.id);
      }
    });

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user?.id) {
          fetchRole(session.user.id);
        } else {
          setRole(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error.message);
  };

  return (
    <AuthContext.Provider
      value={{ session, role, signUpNewUser, signInUser, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);
