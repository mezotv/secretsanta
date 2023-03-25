import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./pages/Error";
import Home from './pages/Home';
import Gifts from './components/MyGifts/Gifts'
import Groups from './components/Groups/Groups';
import CreateGroup from './components/Groups/CreateGroup';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { UsersContextProvider } from './context/UsersContext';
import { AuthContextProvider } from './context/AuthContext'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "gifts",
        element: <Gifts />,
      },
      {
        path: "groups",
        element: <Groups />,
      },
      {
        path: "groups/create",
        element: <UsersContextProvider><CreateGroup /></UsersContextProvider>,
      }
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>
);
