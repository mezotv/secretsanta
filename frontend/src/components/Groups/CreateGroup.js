import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import CreateGroupForm from './CreateGroupForm';
import UserList from './UserList'
import { useUsersContext } from '../../hooks/useUsersContext';
import { useAuthContext } from '../../hooks/useAuthContext';

export default function CreateGroup() {

    const { user } = useAuthContext()
    const { users, dispatch } = useUsersContext()
    const [tableClassActive, setTableClassActive] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [groupName, setGroupName] = useState('')
    const [showBorder, setShowBorder] = useState(false);
    const [groupNameMessage, setGroupNameMessage] = useState(false)


    const handleDeleteUser = (userId) => {
        dispatch({ type: 'DELETE_USER', payload: userId });
    };

    const handleGroupNameChange = (event) => {
        setGroupName(event.target.value);
        setShowBorder(false);
        setGroupNameMessage(false);
    }

    useEffect(() => {
        setTableClassActive(false);
        setShowMessage(false);

        const fetchUsers = () => {
            dispatch({ type: 'SET_USERS', payload: users })
        }

        fetchUsers()

    }, [dispatch, users])


    const handleCancelClick = () => {
        if (users && users.length >= 1) {
            const confirmed = window.confirm('Are you sure you want to cancel?');
            if (confirmed) {
                // Perform the cancel action, e.g., navigate back or reset the form
                console.log('User confirmed cancel action');
            } else {
                // Do nothing, keep the user on the current page
                console.log('User did not confirm cancel action');
            }
        }
    }

    function assignSecretSantas(users) {
        const shuffledUsers = shuffle([...users]);

        for (let i = 0; i < shuffledUsers.length; i++) {
            const santa = shuffledUsers[i];
            const recipient = shuffledUsers[(i + 1) % shuffledUsers.length];
            santa.assignedUser = recipient._id || recipient.id;
        }

        return shuffledUsers;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const handleSaveClick = async () => {
        if (!groupName) {
            setShowBorder(true);
            setGroupNameMessage(true);
        } else {
            setShowBorder(false);
            setGroupNameMessage(false);
        }

        if (users && (users.length === 0 || users.length % 2 !== 0)) {
            setTableClassActive(true);
            setShowMessage(true);
        } else {
            setTableClassActive(false);
            setShowMessage(false);

            try {
                await createGroup({
                    name: groupName,
                    users: users.map(user => ({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                    }))
                });

                // Clear the form and navigate to the groups page
                setGroupName('');
                dispatch({ type: 'CLEAR_USERS' });
                window.location.replace('/groups');
            } catch (error) {
                // Display an error message to the user
                console.error(error);
            }
        }
    };

    const createGroup = async (groupData) => {
        if (!user) {
            return
        }
        try {
            const response = await fetch('/api/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(groupData),
            });

            if (!response.ok) {
                throw new Error('Failed to create group');
            }

            const group = await response.json();
            return group;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to create group');
        }
    };

    return (
        <>
            <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
                <h3 className="text-base font-semibold leading-6 text-gray-900">Create Group</h3>
            </div>
            <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between pt-5">
                <div className="w-full">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Group Name
                    </label>
                    <input
                        type="text"
                        onChange={handleGroupNameChange}
                        value={groupName}
                        className={`mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm${showBorder ? ' border-2 border-rose-500' : ''}`}
                    />
                    {groupNameMessage && <p className="mt-4 text-red-500">Please provide a group name</p>}
                </div>
            </div>
            <div className="sm:flex sm:items-center sm:justify-between pt-5">
                <div className="w-full">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Group Users
                    </label>
                </div>
            </div>
            <div className="mx-auto my-5 grid grid-cols-1 gap-6 lg:grid-flow-col-dense lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2 lg:col-start-1">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div
                                className={`overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg ${tableClassActive ? 'border-2 border-rose-500' : ''}`}
                            >
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                            >
                                                #
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                First Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Last Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Email
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Edit</span>
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Delete</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {users && users.length > 0 ? (
                                            users.map((user, index) => (
                                                <UserList
                                                    user={user}
                                                    key={user.id}
                                                    onDelete={handleDeleteUser}
                                                    rowNum={index + 1}
                                                />
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 text-center"
                                                >
                                                    No users found. Please add a user.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {showMessage && <p className="mt-4 text-red-500">Users must not be empty or an odd number</p>}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1 lg:col-start-3">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                Add New User
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        <tr>
                                            <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                                                <CreateGroupForm />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-5 sm:flex sm:items-center sm:justify-end">
                <div className="mt-3 flex sm:mt-0 sm:ml-4">
                    <Link
                        onClick={handleCancelClick}
                        to="/groups"
                        type="button"
                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Cancel
                    </Link>

                    {(!groupName || !users || users.length === 0 || users.length % 2 !== 0) ? (
                        <button
                            type="button"
                            onClick={handleSaveClick}
                            className="ml-3 inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm bg-indigo-300 focus:outline-none"
                        >
                            Save
                        </button>)
                        : (
                            <Link
                                onClick={handleSaveClick}
                                type="button"
                                className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Save
                            </Link>
                        )
                    }
                </div>
            </div>
        </>
    )
}
