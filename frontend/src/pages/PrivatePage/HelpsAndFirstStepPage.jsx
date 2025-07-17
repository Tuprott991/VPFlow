import { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Paper,
    Avatar,
    Grow,
} from '@mui/material';
import {
    Rocket,
    CheckCircle,
    ArrowForward,
    ExpandMore,
    Assignment,
    Group,
    Settings,
    Book,
    VideoLibrary,
    Forum,
    Support,
    AccountTree,
    Speed,
    Security,
    Timeline as TimelineIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import {
    HeroSectionComponent
} from '@/components/ui';

// Styled component
const FeatureCard = styled(Card)(({ theme }) => ({
    height: '100%',
    transition: 'all 0.3s ease-in-out',
    borderRadius: theme.spacing(2),
    border: 'none',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    }
}));

const ResourceCard = styled(Card)(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    }
}));

// Custom Timeline Component
const CustomTimelineItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    position: 'relative',
    paddingBottom: theme.spacing(3),
    '&:not(:last-child)::after': {
        content: '""',
        position: 'absolute',
        left: '20px',
        top: '40px',
        bottom: '-12px',
        width: '2px',
        backgroundColor: theme.palette.divider,
    }
}));

const TimelineDot = styled(Box)(({ theme, color = 'primary' }) => ({
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: theme.palette[color].main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(2),
    zIndex: 1,
    flexShrink: 0,
}));

const HelpsAndFirstStepPage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [expanded, setExpanded] = useState('panel1');

    const quickStartSteps = [
        {
            label: 'Create Your First Project',
            description: 'Set up your workspace and create a new project to begin managing your workflow.',
            icon: <Assignment />,
            details: 'Navigate to the Projects section from your dashboard. Click on "New Project" and fill in the basic information including project name, description, and initial team members. This will be your central workspace for all project activities.',
            action: 'Create Project'
        },
        {
            label: 'Invite Team Members',
            description: 'Add collaborators to your project and assign appropriate roles.',
            icon: <Group />,
            details: 'Go to Team Management and use the "Invite Members" feature. Enter email addresses, select roles (Admin, Manager, or Member), and send invitations. Team members will receive email notifications with access instructions.',
            action: 'Invite Team'
        },
        {
            label: 'Configure Workflow',
            description: 'Set up your project workflow, stages, and automation rules.',
            icon: <Settings />,
            details: 'Define your workflow stages, create task templates, set up approval processes, and configure automated notifications. This ensures smooth project execution and team coordination.',
            action: 'Setup Workflow'
        },
        {
            label: 'Start Managing',
            description: 'Begin creating tasks, tracking progress, and managing your team effectively.',
            icon: <Rocket />,
            details: 'Create your first tasks, assign them to team members, set deadlines, and start tracking progress. Use the dashboard to monitor project health and team productivity.',
            action: 'Start Managing'
        }
    ];

    const features = [
        {
            title: 'Project Management',
            description: 'Comprehensive project planning and execution tools',
            icon: <AccountTree sx={{ fontSize: 40, color: '#1976d2' }} />,
            capabilities: ['Task Management', 'Gantt Charts', 'Progress Tracking', 'File Sharing', 'Milestone Planning'],
            color: '#1976d2'
        },
        {
            title: 'Team Collaboration',
            description: 'Enhanced communication and teamwork features',
            icon: <Group sx={{ fontSize: 40, color: '#2e7d32' }} />,
            capabilities: ['Real-time Chat', 'Team Notifications', 'Role Management', 'Activity Feed', 'Video Calls'],
            color: '#2e7d32'
        },
        {
            title: 'Workflow Automation',
            description: 'Streamline processes with intelligent automation',
            icon: <Speed sx={{ fontSize: 40, color: '#7b1fa2' }} />,
            capabilities: ['Custom Workflows', 'Auto Notifications', 'Status Updates', 'API Integration', 'Smart Reports'],
            color: '#7b1fa2'
        }
    ];

    const timelineEvents = [
        { title: 'Welcome & Setup', description: 'Complete your profile and explore the dashboard', color: 'primary' },
        { title: 'First Project', description: 'Create your first project and understand the interface', color: 'secondary' },
        { title: 'Team Building', description: 'Invite team members and establish collaboration', color: 'success' },
        { title: 'Advanced Features', description: 'Explore automation, integrations, and reporting', color: 'warning' },
        { title: 'Optimization', description: 'Fine-tune workflows and achieve maximum efficiency', color: 'error' }
    ];

    const faqData = [
        {
            id: 'panel1',
            question: 'How do I create my first project in VPFlow?',
            answer: 'Creating your first project is simple! Navigate to the Projects section from your main dashboard, click the "New Project" button, fill in your project details including name, description, and initial team members, then click "Create Project". You\'ll immediately have access to all project management tools.'
        },
        {
            id: 'panel2',
            question: 'What are the different user roles and permissions?',
            answer: 'VPFlow offers three main roles: Admin (full system access and user management), Project Manager (project-level control and team management), and Team Member (task execution and basic collaboration). Each role has carefully designed permissions to ensure security and proper workflow.'
        },
        {
            id: 'panel3',
            question: 'How can I track project progress effectively?',
            answer: 'VPFlow provides multiple progress tracking tools: interactive dashboards with real-time metrics, Gantt charts for timeline visualization, Kanban boards for workflow stages, progress reports for detailed analysis, and automated status updates to keep everyone informed.'
        },
        {
            id: 'panel4',
            question: 'Does VPFlow integrate with other business tools?',
            answer: 'Yes! VPFlow seamlessly integrates with popular tools including Slack, Microsoft Teams, Google Workspace, Jira, GitHub, Trello, and many more. Our API also allows custom integrations to fit your specific business needs.'
        }
    ];

    const resources = [
        {
            title: 'Documentation',
            description: 'Comprehensive guides and API references',
            icon: <Book sx={{ fontSize: 48, color: '#1976d2' }} />,
            color: '#1976d2'
        },
        {
            title: 'Video Tutorials',
            description: 'Step-by-step video guides for all features',
            icon: <VideoLibrary sx={{ fontSize: 48, color: '#2e7d32' }} />,
            color: '#2e7d32'
        },
        {
            title: 'Community Forum',
            description: 'Connect with users and share experiences',
            icon: <Forum sx={{ fontSize: 48, color: '#ed6c02' }} />,
            color: '#ed6c02'
        },
        {
            title: 'Support Center',
            description: 'Get help from our dedicated support team',
            icon: <Support sx={{ fontSize: 48, color: '#d32f2f' }} />,
            color: '#d32f2f'
        }
    ];

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Hero Section */}
            <HeroSectionComponent />

            {/* Quick Start Guide */}
            <Grow in timeout={1000}>
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <CheckCircle sx={{ mr: 2, color: 'primary.main' }} />
                        Quick Start Guide
                    </Typography>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                        <Stepper activeStep={activeStep} orientation="vertical">
                            {quickStartSteps.map((step, index) => (
                                <Step key={index}>
                                    <StepLabel
                                        icon={<Avatar sx={{ bgcolor: 'primary.main' }}>{step.icon}</Avatar>}
                                        onClick={() => handleStepChange(index)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <Typography variant="h6">{step.label}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {step.description}
                                        </Typography>
                                    </StepLabel>
                                    <StepContent>
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            {step.details}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                endIcon={<ArrowForward />}
                                            >
                                                {step.action}
                                            </Button>
                                            {index < quickStartSteps.length - 1 && (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => handleStepChange(index + 1)}
                                                >
                                                    Next Step
                                                </Button>
                                            )}
                                        </Box>
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                    </Paper>
                </Box>
            </Grow>

            {/* Key Features */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Security sx={{ mr: 2, color: 'primary.main' }} />
                    Key Features
                </Typography>
                <Grid container spacing={3}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Grow in timeout={1200 + index * 200}>
                                <FeatureCard>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            {feature.icon}
                                            <Typography variant="h5" component="h3" sx={{ ml: 2, fontWeight: 600 }}>
                                                {feature.title}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                            {feature.description}
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {feature.capabilities.map((capability, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={capability}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: `${feature.color}15`,
                                                        color: feature.color,
                                                        fontWeight: 500
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </CardContent>
                                </FeatureCard>
                            </Grow>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Journey Timeline */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <TimelineIcon sx={{ mr: 2, color: 'primary.main' }} />
                    Your Journey with VPFlow
                </Typography>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Box sx={{ pl: 2 }}>
                        {timelineEvents.map((event, index) => (
                            <CustomTimelineItem key={index}>
                                <TimelineDot color={event.color}>
                                    <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
                                </TimelineDot>
                                <Box>
                                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                                        {event.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {event.description}
                                    </Typography>
                                </Box>
                            </CustomTimelineItem>
                        ))}
                    </Box>
                </Paper>
            </Box>

            {/* FAQ Section */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Support sx={{ mr: 2, color: 'primary.main' }} />
                    Frequently Asked Questions
                </Typography>
                {faqData.map((faq) => (
                    <Accordion
                        key={faq.id}
                        expanded={expanded === faq.id}
                        onChange={handleAccordionChange(faq.id)}
                        sx={{ mb: 1, borderRadius: 1, '&:before': { display: 'none' } }}
                    >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                {faq.question}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                {faq.answer}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>

            {/* Resources Section */}
            <Box>
                <Typography variant="h3" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Book sx={{ mr: 2, color: 'primary.main' }} />
                    Additional Resources
                </Typography>
                <Grid container spacing={3}>
                    {resources.map((resource, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Grow in timeout={1400 + index * 100}>
                                <ResourceCard>
                                    <CardContent>
                                        {resource.icon}
                                        <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                                            {resource.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {resource.description}
                                        </Typography>
                                        <Button
                                            variant="text"
                                            endIcon={<ArrowForward />}
                                            sx={{ color: resource.color }}
                                        >
                                            Learn More
                                        </Button>
                                    </CardContent>
                                </ResourceCard>
                            </Grow>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <style jsx global>{`
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }
            `}</style>
        </Container>
    );
};

export default HelpsAndFirstStepPage;