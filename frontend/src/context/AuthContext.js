import React, { useState, useEffect, useContext } from "react";

const rootUrl = process.env.REACT_APP_ROOT_URL + '/auth'; //'http://localhost:4455/auth';

console.log(`root url ${rootUrl}`);

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
        window.location.href = `${rootUrl}/login?redirect_uri=${process.env.REACT_APP_ROOT_URL}/front/app`;
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