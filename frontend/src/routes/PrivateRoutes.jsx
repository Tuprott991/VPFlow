import {
    ListOfWorkflowsPage,
    PainPointFeedbackPage
} from '../pages/PrivatePage';

const PrivateRoutes = [
    {
        path: '/list-of-workflows',
        element: <ListOfWorkflowsPage />,
    },
    {
        path: '/pain-point-feedback',
        element: <PainPointFeedbackPage />,
    }
];

export default PrivateRoutes;
