import { useState, useRef } from 'react';
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
import { useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MicNoneIcon from '@mui/icons-material/MicNone';
import LinkIcon from '@mui/icons-material/Link';
import { CustomAlert } from '@/components/custom';

export default function ChatPromptUI() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const [alertOpen, setAlertOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const fileInputRef = useRef(null);

    const showComingSoon = () => {
        setAlertOpen(true);
        setTimeout(() => setAlertOpen(false), 3000);
    };

    const handleUploadFromDevice = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setChatMessages((prev) => [...prev, ...files]);
        e.target.value = '';
    };

    const handleRemoveFile = (fileToRemove) => {
        setChatMessages((prev) => prev.filter((file) => file !== fileToRemove));
    };

    const handleUploadFromDrive = () => {
        showComingSoon();
    };

    const handleUploadFromURL = () => {
        showComingSoon();
    };

    const handleSend = () => {
        setIsLoading(true);
        setProgress(0);
        let current = 0;

        const interval = setInterval(() => {
            current += 2;
            setProgress(current);
            if (current >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    navigate('/home');
                }, 500);
            }
        }, 100);
    };

    const canSend = inputValue.trim() !== '' || chatMessages.length > 0;

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

            {/* Alert */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 80,
                    right: 16,
                    width: 'auto',
                    maxWidth: 400,
                    zIndex: 9999,
                }}
            >
                <CustomAlert
                    open={alertOpen}
                    severity="error"
                    message="Feature coming soon!"
                    onClose={() => setAlertOpen(false)}
                />
            </Box>

            {/* Upload Buttons */}
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
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
                    <Grid size={{ xs: 12, sm: 4 }} key={index}>
                        <Button
                            variant="outlined"
                            onClick={item.onClick}
                            sx={{
                                width: '150px',
                                aspectRatio: '1',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textTransform: 'none',
                                borderRadius: 2,
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </Button>
                    </Grid>
                ))}
            </Grid>

            {/* File Preview (horizontal) */}
            {chatMessages.length > 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        overflowX: 'auto',
                        whiteSpace: 'nowrap',
                        width: '80%',
                        mb: 1,
                    }}
                >
                    {chatMessages.map((file, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'inline-block',
                                mr: 2,
                                cursor: 'pointer',
                                maxWidth: 150,
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                px: 1,
                                py: 0.5,
                                borderRadius: '10px',
                                bgcolor: '#dde3ea',
                                color: '#575b5f'
                            }}
                            onClick={() => handleRemoveFile(file)}
                            title="Click to remove"
                        >
                            {file.name}
                        </Box>
                    ))}
                </Box>
            )}

            {/* Prompt Input */}
            <Box sx={{ width: '80%' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type your prompt here..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <MicNoneIcon sx={{ cursor: 'pointer' }} onClick={showComingSoon} />
                                    <SendIcon
                                        sx={{
                                            cursor: canSend ? 'pointer' : 'default',
                                            color: canSend ? '#1976d2' : 'gray',
                                        }}
                                        onClick={canSend ? handleSend : undefined}
                                    />
                                </Box>
                            </InputAdornment>
                        ),
                        sx: {
                            bgcolor: '#f5f5f5',
                            borderRadius: '10px',
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        },
                    }}
                    sx={{
                        input: { color: 'black' },
                    }}
                />
            </Box>

            {/* Hidden File Input */}
            <input
                type="file"
                multiple
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            {/* Loading Overlay */}
            {isLoading && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        bgcolor: 'rgba(255, 255, 255, 0.85)',
                        zIndex: 9999,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Processing... {progress}%
                    </Typography>
                    <Box
                        sx={{
                            width: '60%',
                            height: 10,
                            bgcolor: '#ddd',
                            borderRadius: 5,
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                width: `${progress}%`,
                                height: '100%',
                                bgcolor: '#1976d2',
                                transition: 'width 0.1s linear',
                            }}
                        />
                    </Box>
                </Box>
            )}
        </Box>
    );
}
