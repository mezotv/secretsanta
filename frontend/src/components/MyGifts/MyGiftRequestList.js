import { useAuthContext } from "../../hooks/useAuthContext";

export default function MyGiftRequestList({ gift }) {

    const { user } = useAuthContext()

    const handleUrlClick = () => {
        window.open(gift.url, '_blank');
    };

    const handleDelete = async () => {

        if (!user) {
            return
        }

        const response = await fetch('/api/gifts/' + gift._id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            window.location.reload()
        }
    }

    return (
        <>
            <tr key={gift._id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {gift.title}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{gift.price}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"><a onClick={handleUrlClick} className="text-indigo-600 hover:text-indigo-900 underline cursor-pointer">Link</a></td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <span onClick={handleDelete} className="text-indigo-600 hover:text-indigo-900 cursor-pointer" id={gift._id}>
                        Delete
                    </span>
                </td>
            </tr>
        </>
    )
}
