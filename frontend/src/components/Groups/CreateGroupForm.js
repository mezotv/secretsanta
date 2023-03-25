import { useState } from "react"
import { XCircleIcon } from '@heroicons/react/20/solid'
import { useUsersContext } from '../../hooks/useUsersContext';
import { v4 as uuidv4 } from 'uuid';
import { useAuthContext } from '../../hooks/useAuthContext';

export default function CreateGiftForm() {

    const { user } = useAuthContext()

    const { users, dispatch } = useUsersContext()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null)

    function isValidEmail(email) {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    }

    function emailExists(email) {
        return users.some(user => user.email === email);
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in to perform this action')
            return
        }

        const id = uuidv4()

        const newUser = { id, firstName, lastName, email }

        if (!firstName || !lastName || !email) {
            setError("Please fill in all fields.");
        } else if (!isValidEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        } else if (emailExists(email)) {
            setError("This email address has already been added.");
        } else {
            setFirstName('')
            setLastName('')
            setEmail('')
            setError(null)
            dispatch({ type: 'CREATE_USER', payload: newUser })
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-gray-700">
                    First Name
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-3"
                    />
                </div>
                <label className="block text-sm font-medium text-gray-700">
                    Last Name
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-3"
                    />
                </div>
                <label className="block text-sm font-medium text-gray-700">
                    Email Address
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <button
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-6"
                >Add User</button>
                {error && <div className="rounded-md bg-red-50 p-4 mt-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                    </div>
                </div>}
            </form>
        </>
    )
}

