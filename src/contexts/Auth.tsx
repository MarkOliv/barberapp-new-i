// @flow
import { User } from "@supabase/supabase-js";
import * as React from "react";
import supabase from "../utils/supabase";

interface AuthContextData {
  sessionUser: User | null | undefined;
  logout: () => Promise<any> | void;
}

const AuthContext = React.createContext({} as AuthContextData);

interface AuthContextProps {
  children: React.ReactNode;
}
export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>();

  const handleLogout = React.useCallback(async () => {
    let { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
    }
  }, []);

  React.useEffect(() => {
    // Check active sessions and sets the user
    const session = supabase.auth.session();
    setUser(session?.user ?? null);

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    // cleanup the useEffect hook
    return () => {
      listener?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ logout: handleLogout, sessionUser: user }}>
      {children}
    </AuthContext.Provider>
  );
};

// export the useAuth hook
export const useAuth = () => {
  return React.useContext(AuthContext);
};
