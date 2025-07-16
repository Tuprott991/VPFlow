import { Navigate } from 'react-router-dom';
import { LoginPage, SignupPage } from '../pages/PublicPage';

const PublicRoutes = [
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/signup',
        element: <SignupPage />,
    },
    {
        path: '/',
        element: <Navigate to="/login" />,
    },
];

export default PublicRoutes;
