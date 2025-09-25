import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [session, setSession] = useState(undefined)
    const [role, setRole] = useState(undefined)

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

    useEffect(() => {
  const getProfile = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (!error && data) {
      setRole(data.role);
    } else {
      setRole(null);
    }
  };

  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    if (session?.user) {
      getProfile(session.user.id);
    }
  });

  const { data: listener } = supabase.auth.onAuthStateChange(
    async (_event, session) => {
      setSession(session);
      if (session?.user) {
        getProfile(session.user.id);
      } else {
        setRole(null);
      }
    }
  );

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);


    const signOut = () => {
        const { error } = supabase.auth.signOut()
        if (error) {
            console.error("Error signing out:", error);
        }
    }

    return (
        <AuthContext.Provider value={{session, signUpNewUser, signInUser, signOut, role}}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext)
}