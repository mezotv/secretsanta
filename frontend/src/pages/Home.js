import React, { useEffect, useState } from 'react';
import GiftRequests from '../components/GiftRequests/GiftRequests'
import { useAuthContext } from '../hooks/useAuthContext'

const LoginRedirect = () => {
    useEffect(() => {
        window.location.replace('/login');
    }, []);

    return null;
};

export default function Home() {
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user !== undefined) {
            setLoading(false);
        }
    }, [user]);

    return (
        <>
            {loading ? (
                <div>&nbsp;</div>
            ) : user ? (
                <GiftRequests />
            ) : (
                <LoginRedirect />
            )}
        </>
    );
}