import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const { dispatch } = useAuthContext()

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailIsEmpty = !email.trim();
        const passwordIsEmpty = !password.trim();

        setEmailError(emailIsEmpty);
        setPasswordError(passwordIsEmpty);

        if (emailIsEmpty || passwordIsEmpty) {
            return;
        }

        try {
            const response = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const json = await response.json()

            console.log(json)

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(json))
                dispatch({ type: 'LOGIN', payload: json })
                window.location.replace('/');
            } else {
                const error = await response.json();
                console.error(error.message);

                // Check if the error message is related to an existing email
                if (error.message === 'Invalid email or password') {
                    setEmailError(true);
                }
            }
        } catch (error) {

        }
    };

    const inputClassName = (error) => `block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6${error ? ' border-2 border-rose-500' : ''}`;

    const errorMessage = (error, message) => {
        if (error) {
            return <p className="mt-2 text-sm text-red-500">{message}</p>;
        }
        return null;
    };


    return (
        <>
            <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img
                        className="mx-auto h-12 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Log in to your account</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign up for an account
                        </a>
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-4" onSubmit={handleSubmit}>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                            setEmailError(false)
                                        }}
                                        value={email}
                                        type="text"
                                        name="email"
                                        id="email"
                                        autoComplete="email"
                                        className={inputClassName(emailError)} />
                                </div>
                                {errorMessage(emailError, "Incorrect email")}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                            setPasswordError(false)
                                        }}
                                        value={password}
                                        type="password"
                                        name="password"
                                        id="password"
                                        autoComplete="password"
                                        className={inputClassName(passwordError)} />
                                </div>
                                {errorMessage(passwordError, "Incorrect password")}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="mt-8 flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Log in
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </>
    )
}