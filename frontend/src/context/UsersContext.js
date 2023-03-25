

import { createContext, useReducer } from 'react'

export const UsersContext = createContext()

export const usersReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USERS':
            return {
                users: action.payload,
            };
        case 'CREATE_USER':
            return {
                users: [action.payload, ...state.users],
            };
        case 'DELETE_USER':
            return {
                users: state.users.filter((user) => user.id !== action.payload),
            };
        case 'CLEAR_USERS':
            return {
                users: []
            };
        default:
            return state;
    }
};

export const UsersContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(usersReducer, {
        users: []
    })

    return (
        <UsersContext.Provider value={{ ...state, dispatch }}>
            {children}
        </UsersContext.Provider>
    )
}