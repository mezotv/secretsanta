import { useState } from 'react'
import validator from 'validator'
import { useAuthContext } from '../hooks/useAuthContext'

export default function Signup() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstNameError, setFirstNameError] = useState(false)
    const [lastNameError, setLastNameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const { dispatch } = useAuthContext()

    const handleSubmit = async (e) => {
        e.preventDefault();

        const firstNameIsEmpty = !firstName.trim();
        const lastNameIsEmpty = !lastName.trim();
        const emailIsEmpty = !email.trim() || !validator.isEmail(email);
        const passwordIsEmpty = !password.trim() || !validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0,
        });

        setFirstNameError(firstNameIsEmpty);
        setLastNameError(lastNameIsEmpty);
        setEmailError(emailIsEmpty);
        setPasswordError(passwordIsEmpty);

        if (firstNameIsEmpty || lastNameIsEmpty || emailIsEmpty || passwordIsEmpty) {
            return;
        }

        try {
            const response = await fetch("/api/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
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
                if (error.message === 'Email already in use') {
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
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign up for an account</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            log in to your account
                        </a>
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="given-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    First Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        onChange={(e) => {
                                            setFirstName(e.target.value)
                                            setFirstNameError(false)
                                        }}
                                        value={firstName}
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        autoComplete="given-name"
                                        className={inputClassName(firstNameError)} />
                                </div>
                                {errorMessage(firstNameError, "Please enter your first name.")}
                            </div>

                            <div>
                                <label htmlFor="family-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Last Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        onChange={(e) => {
                                            setLastName(e.target.value)
                                            setLastNameError(false)
                                        }}
                                        value={lastName}
                                        type="text"
                                        name="last-name"
                                        id="last-name"
                                        autoComplete="family-name"
                                        className={inputClassName(lastNameError)} />
                                </div>
                                {errorMessage(lastNameError, "Please enter your last name.")}
                            </div>

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
                                {errorMessage(emailError, emailError ? "Email already in use" : "Please enter a valid email address.")}
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
                                {errorMessage(passwordError, "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.")}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="mt-8 flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Sign up
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </>
    )
}