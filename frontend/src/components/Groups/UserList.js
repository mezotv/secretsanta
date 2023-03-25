export default function UserList({ user, rowNum, onDelete }) {

    const handleDeleteClick = () => {
        onDelete(user.id);
    };

    console.log(user)

    return (
        <>
            <tr key={user._id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {rowNum}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.firstName}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.lastName}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                <td className="relative whitespace-nowrap py-4 pl-3 text-right text-sm font-medium ">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
                        Edit<span className="sr-only"></span>
                    </a>
                </td>
                <td className="relative whitespace-nowrap pr-4 text-right text-sm font-medium sm:pr-6">
                    <a onClick={handleDeleteClick} className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
                        Delete<span className="sr-only"></span>
                    </a>
                </td>
            </tr>
        </>
    )
}
