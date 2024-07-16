import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorPage from './pages/ErrorPage'
import Home from './pages/Home'
import PostDetail from './pages/PostDetail'
import Register from './pages/Register'
import Login from './pages/Login'
import UserProfile from './pages/UserProfile'
import CategoryPosts from './pages/CategoryPosts';
import Dashboard from './pages/Dashboard'
import AuthorPosts from './pages/AutherPosts'
import Authors from './pages/Auther'
import CreatePosts from './pages/CreatePosts'
import EditPost from './pages/EditPosts'
import DeletePosts from './pages/DeletePosts'
import Logout from './pages/Logout'
import UserProvider from './context/UserContext';

const router = createBrowserRouter([
  {
    path:"/",
    element: <UserProvider><Layout/></UserProvider>,
    errorElement: <ErrorPage/>,
    children:[
      {index: true, element:<Home/>},
      {path:"posts/:id",element:<PostDetail/>},
      {path:"register",element:<Register/>},
      {path:"login",element:<Login/>},
      {path:"profile/:id",element:<UserProfile/>},
      {path:"authors",element:<Authors/>},
      {path:"create",element:<CreatePosts/>},
      {path:"posts/categories/:category",element:<CategoryPosts/>},
      {path:"posts/users/:id",element:<AuthorPosts/>},
      {path:"myposts/:id",element:<Dashboard/>},
      {path:"posts/:id/edit",element:<EditPost/>},
      {path:"posts/:id/delete",element:<DeletePosts/>},
      {path:"/logout",element:<Logout/>},
    ]
  }
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

