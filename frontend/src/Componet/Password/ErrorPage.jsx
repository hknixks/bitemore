import React from 'react'

const ErrorPage = () => {

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white border shadow-md rounded-lg p-8 max-w-sm w-full">
                    <h2 className="text-4xl text-red-600 mb-4">404</h2>
                    <p className="text-gray-600 text-lg">
                        Sorry, the page you&lsqu;re looking for was not found.
                    </p>
                    <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">
                        Back to Home
                    </a>
                </div>
            </div>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <h1 className="text-4xl text-red-600 font-bold">Oops! Something went wrong.</h1>
                    <p className="text-gray-600">We apologize for the inconvenience. An error occurred.</p>
                    <a routerLink="/" className="mt-4 text-blue-500 hover:underline block">Go back to the home page</a>
                </div>
            </div>
        </>
    )
}

export default ErrorPage