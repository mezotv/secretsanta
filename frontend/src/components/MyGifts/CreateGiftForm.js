import { useState } from "react"
import { useAuthContext } from "../../hooks/useAuthContext"
import { XCircleIcon } from '@heroicons/react/20/solid'

export default function CreateGiftForm() {

    const { user } = useAuthContext()
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [url, setUrl] = useState('')
    const [error, setError] = useState(null)
    const [titleError, setTitleError] = useState(false)
    const [priceError, setPriceError] = useState(false)
    const [urlError, setUrlError] = useState(false)

    const validateUrl = (url) => {
        const pattern = /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return pattern.test(url);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError(true);
            return;
        }

        const titleIsEmpty = !title.trim();
        const priceIsEmpty = !price.trim();
        const urlIsEmpty = !url.trim() || !validateUrl(url);

        setTitleError(titleIsEmpty);
        setPriceError(priceIsEmpty);
        setUrlError(urlIsEmpty);

        if (titleIsEmpty || priceIsEmpty || urlIsEmpty) {
            return;
        }

        const gift = { title, price, url }

        const response = await fetch('/api/gifts', {
            method: 'POST',
            body: JSON.stringify(gift),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
        }
        if (response.ok) {
            setTitle('')
            setPrice('')
            setUrl('')
            setError(null)
            window.location.reload()
        }
    }

    const inputClassName = (error) => `block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6${error ? ' border-2 border-rose-500' : ''}`;

    const errorMessage = (error, message) => {
        if (error) {
            return <span className="mt-8 text-sm text-red-500">{message}<br /></span>;
        }
        return null;
    };

    return (
        <>
            <form className="space-y-3" onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        onChange={(e) => {
                            setTitle(e.target.value)
                            setTitleError(false)
                        }}
                        value={title}
                        className={inputClassName(titleError)}
                    />
                </div>
                {errorMessage(titleError, "Please enter the gift title.")}
                <label className="block text-sm font-medium text-gray-700">
                    Price
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        onChange={(e) => {
                            setPrice(e.target.value)
                            setPriceError(false)
                        }}
                        value={price}
                        className={inputClassName(priceError)}
                    />
                </div>
                {errorMessage(priceError, "Please enter the gift price.")}
                <label className="block text-sm font-medium text-gray-700">
                    URL
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        onChange={(e) => {
                            setUrl(e.target.value)
                            setUrlError(false)
                        }}
                        value={url}
                        className={inputClassName(urlError)}
                    />
                </div>
                {errorMessage(urlError, "Must begin with http:// or https:// and be a valid URL")}
                <button
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-6"
                >Add Gift</button>
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

