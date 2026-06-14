import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({});


export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);


  useEffect(() => {


    try {


      const storedUser =
      localStorage.getItem("@RNAuth:user");


      if (storedUser && storedUser !== "undefined") {


        setUser(
          JSON.parse(storedUser)
        );


      }


    } catch(error) {


      console.log(
        "Auth parse error:",
        error
      );


      localStorage.removeItem("@RNAuth:user");


      setUser(null);


    }


    setLoading(false);


  }, []);



  return (

    <AuthContext.Provider

      value={{
        user,
        setUser,
        loading,
        setLoading
      }}

    >

      {children}

    </AuthContext.Provider>

  );

};