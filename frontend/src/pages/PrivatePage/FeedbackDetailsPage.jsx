import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Button,
    Paper,
    IconButton,
    Avatar,
} from '@mui/material';
import {
    Feedback,
    Close,
    Info,
    ArrowDownward,
    ArrowRightAlt,
    ArrowUpward,
    Person,
    Business,
    Upload,
    Check,
    Warning,
} from '@mui/icons-material';

const FeedbackDetailsPage = () => {
    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', p: 2 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Pain Point Feedbacks / Feedback 1
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#00bcd4', width: 32, height: 32 }}>
                        <Typography variant="caption" sx={{ fontSize: 12 }}>T</Typography>
                    </Avatar>
                    <IconButton size="small">
                        <Info />
                    </IconButton>
                </Box>
            </Box>

            {/* Main Feedback Card */}
            <Card sx={{ bgcolor: '#fff8e1', border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <CardContent>
                    {/* Feedback Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Paper sx={{ p: 1, bgcolor: '#4caf50', color: 'white', borderRadius: 1 }}>
                                <Feedback sx={{ fontSize: 20 }} />
                            </Paper>
                            <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 600 }}>
                                Feedback 1
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="textSecondary">
                                from LXThanh (director)
                            </Typography>
                            <Chip label="Received" size="small" sx={{ bgcolor: '#2196f3', color: 'white' }} />
                        </Box>
                    </Box>

                    {/* Title */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                        Title: Report the problem
                    </Typography>

                    {/* Problem Description */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                        <Close sx={{ color: '#f44336', fontSize: 24, mt: 0.5 }} />
                        <Box>
                            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                                This pain point appears to be most prominent during the user confirmation step, which is one of the most critical and
                                sensitive stages in the bank account opening workflow.
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                                At this point, users are typically required to verify their identity by providing multiple documents such as national ID cards, utility
                                bills, or income proof, and then cross-check the accuracy of all previously entered information.
                            </Typography>
                            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                This step demands a high level of precision, as even minor errors or inconsistencies—such as a mismatched address, spelling
                                mistake, or unclear photo—can result in the process being halted or reset.
                            </Typography>
                        </Box>
                    </Box>

                    {/* Workflow Diagram */}
                    <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                        <Box sx={{ position: 'relative', height: 350 }}>
                            {/* Bottleneck */}
                            <Paper sx={{
                                position: 'absolute',
                                top: 0,
                                right: 40,
                                bgcolor: '#ba68c8',
                                color: 'white',
                                px: 2,
                                py: 1,
                                borderRadius: 1
                            }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    Bottleneck
                                </Typography>
                            </Paper>

                            {/* Customer */}
                            <Paper sx={{
                                position: 'absolute',
                                left: 0,
                                top: 60,
                                bgcolor: '#ff8a80',
                                color: 'white',
                                px: 2,
                                py: 3,
                                width: 80,
                                height: 80,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 1
                            }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center', fontSize: 12 }}>
                                    Customer
                                </Typography>
                            </Paper>

                            {/* Relationship Management */}
                            <Paper sx={{
                                position: 'absolute',
                                left: 0,
                                top: 180,
                                bgcolor: '#ffb74d',
                                color: 'white',
                                px: 2,
                                py: 3,
                                width: 80,
                                height: 80,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 1
                            }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center', fontSize: 12 }}>
                                    Relationship Management
                                </Typography>
                            </Paper>

                            {/* Submit loan application */}
                            <Paper sx={{
                                position: 'absolute',
                                left: 120,
                                top: 40,
                                bgcolor: '#ffcdd2',
                                px: 2,
                                py: 2,
                                borderRadius: 1,
                                border: '1px solid #f44336'
                            }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center', fontSize: 12 }}>
                                    Submit loan<br />application +<br />documents
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                                    <IconButton size="small" sx={{ bgcolor: 'white', width: 20, height: 20 }}>
                                        <Warning sx={{ fontSize: 12 }} />
                                    </IconButton>
                                    <IconButton size="small" sx={{ bgcolor: 'white', width: 20, height: 20 }}>
                                        <Info sx={{ fontSize: 12 }} />
                                    </IconButton>
                                </Box>
                            </Paper>

                            {/* Upload to system */}
                            <Paper sx={{
                                position: 'absolute',
                                left: 120,
                                top: 160,
                                bgcolor: '#fff3e0',
                                px: 2,
                                py: 2,
                                borderRadius: 1,
                                border: '1px solid #ff9800'
                            }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center', fontSize: 12 }}>
                                    Upload to system<br />(LOS)
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                                    <IconButton size="small" sx={{ bgcolor: 'white', width: 20, height: 20 }}>
                                        <Warning sx={{ fontSize: 12 }} />
                                    </IconButton>
                                    <IconButton size="small" sx={{ bgcolor: 'white', width: 20, height: 20 }}>
                                        <Info sx={{ fontSize: 12 }} />
                                    </IconButton>
                                </Box>
                            </Paper>

                            {/* Verify income */}
                            <Paper sx={{
                                position: 'absolute',
                                left: 320,
                                top: 160,
                                bgcolor: '#fff3e0',
                                px: 2,
                                py: 2,
                                borderRadius: 1,
                                border: '1px solid #ff9800'
                            }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center', fontSize: 12 }}>
                                    Verify income<br />employment,<br />collateral
                                </Typography>
                            </Paper>

                            {/* Finish */}
                            <Paper sx={{
                                position: 'absolute',
                                right: 40,
                                top: 160,
                                bgcolor: '#ffcdd2',
                                px: 2,
                                py: 2,
                                borderRadius: 1,
                                border: '1px solid #f44336'
                            }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center', fontSize: 12 }}>
                                    Finish
                                </Typography>
                            </Paper>

                            {/* Arrows */}
                            <ArrowDownward sx={{
                                position: 'absolute',
                                left: 180,
                                top: 120,
                                color: '#666',
                                fontSize: 24
                            }} />

                            <ArrowRightAlt sx={{
                                position: 'absolute',
                                left: 260,
                                top: 180,
                                color: '#666',
                                fontSize: 24
                            }} />

                            <ArrowUpward sx={{
                                position: 'absolute',
                                right: 120,
                                top: 100,
                                color: '#666',
                                fontSize: 24
                            }} />
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Go to workflow button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                    variant="contained"
                    sx={{
                        bgcolor: '#4fc3f7',
                        '&:hover': { bgcolor: '#29b6f6' },
                        borderRadius: 3,
                        px: 3
                    }}
                >
                    Go to this workflow
                </Button>
            </Box>
        </Box>
    );
};

export default FeedbackDetailsPage;