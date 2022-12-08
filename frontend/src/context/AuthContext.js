import React, { useState, useEffect, useContext } from "react";

const rootUrl = 'http://localhost:4455/auth';

export const AuthContext = React.createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({
    children
}) => {
    const [isAuthenticated, setIsAuthenticated] = useState();
    const [user, setUser] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const getUser = async () => {
        const response = await fetch(`${rootUrl}/whoami`);
        const json = await response.json();

        setIsAuthenticated(json.authenticated);
        setIsLoading(false);
        if (json.authenticated) setUser(json.user);
    }

    useEffect(() => {
        getUser();
    }, []);

    const login = () => {
        window.location.href = `${rootUrl}/login?redirect_uri=http://localhost:3000`;
    }

    const logout = () => {
        window.location.href = `${rootUrl}/logout`;
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                isLoading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};