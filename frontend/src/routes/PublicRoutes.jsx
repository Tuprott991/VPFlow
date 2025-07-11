import { Navigate } from 'react-router-dom';
import LoginPage from '../pages/PublicPage/LoginPage';

const PublicRoutes = [
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/',
        element: <Navigate to="/login" />,
    },
];

export default PublicRoutes;
