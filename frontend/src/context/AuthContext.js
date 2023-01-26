import React, { useState, useEffect, useContext } from "react";

//TODO: Environment variables are not working when running in a container 
const rootUrl = 'http://localhost:4455/back/auth'; //process.env.REACT_APP_ROOT_URL + '/auth';
const redirectUri = 'http://localhost:4455/front/';

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
        window.location.href = `${rootUrl}/login?redirect_uri=${redirectUri}`;
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