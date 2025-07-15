import {
    ListOfWorkflowsPage,
    PainPointFeedbackPage,
    FeedbackDetailsPage
} from '../pages/PrivatePage';

const PrivateRoutes = [
    {
        path: '/list-of-workflows',
        element: <ListOfWorkflowsPage />,
    },
    {
        path: '/pain-point-feedbacks',
        element: <PainPointFeedbackPage />,
    },
    {
        path: '/feedback-details',
        element: <FeedbackDetailsPage />
    }
];

export default PrivateRoutes;
