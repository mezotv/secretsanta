export default function GiftRequestList({ gift }) {

    const handleUrlClick = () => {
        window.open(gift.url, '_blank');
    };

    return (
        <>
            <tr key={gift._id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {gift.title}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{gift.price}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"><a onClick={handleUrlClick} className="text-indigo-600 hover:text-indigo-900 underline cursor-pointer">Link</a></td>
            </tr>
        </>
    )
}
