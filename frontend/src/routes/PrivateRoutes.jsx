import {
    ListOfWorkflowsPage,
    PainPointFeedbackPage,
    FeedbackDetailsPage,
    WorkflowWithAI
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
    },
    {
        path: '/workflow-with-ai',
        element: <WorkflowWithAI />
    }
];

export default PrivateRoutes;
