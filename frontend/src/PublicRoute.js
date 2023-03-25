import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const PublicRoute = ({ element }) => {
    const { user } = useContext(AuthContext);

    if (user) {
        return <Navigate to="/" replace />;
    }

    return element;
};

export default PublicRoute;