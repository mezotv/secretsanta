import { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import Subheader from '../Subheader';
import GiftRequestList from './GiftRequestList';

export default function GiftRequests() {

    const { user } = useAuthContext()
    const [gifts, setGifts] = useState(null)

    useEffect(() => {
        const fetchGifts = async () => {
            const response = await fetch('/api/gifts/assigned', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                setGifts(json);
            }
        };

        if (user) {
            fetchGifts();
        }
    }, [user]);

    return (
        <>
            <Subheader subheaderTitle={"Gift Requests"} />
            <div className="mx-auto mt-8 lg:max-w-7xl">
                <div className="space-y-6 lg:col-span-2 lg:col-start-1">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                Gift Name
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Price
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                URL
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {gifts && gifts.length > 0 ? (
                                            gifts.map((g) => (
                                                <GiftRequestList key={g._id} gift={g} />
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 text-center"
                                                >
                                                    Your recipient has not added any gifts. Please check back later.
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
    )
}
