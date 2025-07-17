import { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Grid,
    InputAdornment,
    Button,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MicNoneIcon from '@mui/icons-material/MicNone';
import LinkIcon from '@mui/icons-material/Link';
import { CustomAlert } from '@/components/custom';

export default function ChatPromptUI() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [alertOpen, setAlertOpen] = useState(false);

    const showComingSoon = () => {
        setAlertOpen(true);
        setTimeout(() => setAlertOpen(false), 3000); // Auto-hide after 3s
    };

    const handleUploadFromDevice = () => {
        console.log('Upload from device');
    };

    const handleUploadFromDrive = () => {
        console.log('Upload from Google Drive');
        showComingSoon();
    };

    const handleUploadFromURL = () => {
        console.log('Upload from URL');
        showComingSoon();
    };

    const uploadButtonStyle = {
        width: '175px',
        height: '175px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1rem',
        borderRadius: 2,
        textTransform: 'none',
    };

    return (
        <Box
            sx={{
                bgcolor: '#fff',
                color: 'black',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            {/* Logo */}
            <Box sx={{ mb: 2 }} component="img" src="/chatbot_logo.png" alt="logo" width={125} />

            {/* Heading */}
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                How can I help you today?
            </Typography>

            {/* Subheading */}
            <Typography
                variant="body1"
                sx={{
                    mb: 2,
                    maxWidth: 600,
                    textAlign: 'center',
                    color: '#666',
                }}
            >
                This code will display a prompt asking the user for their name, and
                then it will display a greeting message with the name entered by the user.
            </Typography>

            {/* ✅ Alert */}
            <Box sx={{ width: '100%', maxWidth: 500, mb: 2 }}>
                <CustomAlert
                    open={alertOpen}
                    severity="info"
                    message="🚧 Feature coming soon!"
                    onClose={() => setAlertOpen(false)}
                />
            </Box>

            {/* Upload Buttons */}
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                {[
                    {
                        label: 'Upload File',
                        icon: <UploadFileIcon sx={{ fontSize: 50, mb: 1 }} />,
                        onClick: handleUploadFromDevice,
                    },
                    {
                        label: 'Google Drive',
                        icon: <CloudUploadIcon sx={{ fontSize: 50, mb: 1 }} />,
                        onClick: handleUploadFromDrive,
                    },
                    {
                        label: 'From URL',
                        icon: <LinkIcon sx={{ fontSize: 50, mb: 1 }} />,
                        onClick: handleUploadFromURL,
                    },
                ].map((item, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Box
                            sx={{
                                width: '100%',
                                aspectRatio: '1',
                                display: 'flex',
                            }}
                        >
                            <Button
                                variant="outlined"
                                onClick={item.onClick}
                                sx={uploadButtonStyle}
                            >
                                {item.icon}
                                {item.label}
                            </Button>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Prompt Input */}
            <Box sx={{ width: '80%' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type your prompt here..."
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <MicNoneIcon sx={{ cursor: 'pointer' }} />
                                    <SendIcon sx={{ cursor: 'pointer' }} />
                                </Box>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            bgcolor: '#f5f5f5',
                            borderRadius: '10px',
                            boxShadow: 'none',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                            '&.Mui-focused': {
                                boxShadow: 'none',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                        },
                        input: {
                            color: 'black',
                        },
                    }}
                />
            </Box>
        </Box>
    );
}
