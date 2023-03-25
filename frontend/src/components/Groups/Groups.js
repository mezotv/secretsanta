import { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import Subheader from '../Subheader';

export default function Groups() {

    const [groups, setGroups] = useState(null)
    const { user } = useAuthContext()

    const fetchGroups = async () => {
        const response = await fetch('/api/groups', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            setGroups(json)
        }
    }

    useEffect(() => {
        if (user) {
            fetchGroups()
        }
    }, [user])

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this group?');
        if (confirmed) {
            try {
                const response = await fetch(`/api/groups/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    // Refresh the group list
                    fetchGroups();
                } else {
                    console.error('Failed to delete group');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <>
            <Subheader subheaderTitle={"Groups"} />
            <div className="mx-auto mt-8 lg:max-w-7xl">
                <div className="space-y-6 lg:col-span-2 lg:col-start-1">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                Group Name
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Members
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Edit</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {groups && groups.length > 0 ? (
                                            groups.map((group) => (
                                                <tr key={group._id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                        {group.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {group.numUsers !== undefined ? group.numUsers : 'Loading...'}
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <span className="text-indigo-600 hover:text-indigo-900 cursor-pointer" onClick={() => handleDelete(group._id)}>
                                                            Delete
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="3"
                                                    className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 text-center"
                                                >
                                                    No groups found. Please add a group.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}