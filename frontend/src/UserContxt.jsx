import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/v1/user/get-user-details', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user details", error);
            setUser(null);
        } 
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    );
};
