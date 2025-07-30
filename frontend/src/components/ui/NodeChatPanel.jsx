import { useState, useMemo } from 'react';
import { Box, Typography, TextField, Paper, Portal } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { CiMicrophoneOn } from "react-icons/ci";

const NodeInfo = ({ mockNodeData, leftBgColor, leftTitleBgColor }) => {
    return (
        <Box
            sx={{
                flex: 1,
                pr: 2,
                bgcolor: alpha(leftBgColor, 0.5),
                borderRadius: 2,
                p: 1.5,
            }}
        >
            <Box
                sx={{
                    display: 'inline-block',
                    fontWeight: 600,
                    bgcolor: alpha(leftTitleBgColor, 0.6),
                    borderRadius: 2,
                    px: 2,
                    py: 0.5,
                    fontSize: '1rem',
                    color: '#333',
                    boxShadow: 'inset 0 0 4px rgba(0,0,0,0.05)',
                    mb: 1,
                }}
            >
                {mockNodeData?.text}
            </Box>
            <Box>
                <Typography variant="body2" gutterBottom>
                    <strong>Key:</strong> {mockNodeData.key}
                </Typography>
                <Typography variant="body2" gutterBottom>
                    <strong>Duration:</strong> {mockNodeData.duration}
                </Typography>
                <Typography variant="body2" gutterBottom>
                    <strong>Description:</strong> {mockNodeData.description}
                </Typography>
            </Box>
        </Box>
    );
};

const Chatbot = () => {
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;

        const userMessage = { sender: 'user', text: chatInput };
        const updatedMessages = [...chatMessages, userMessage];

        setChatMessages(updatedMessages);
        setChatInput('');
        setLoading(true);

        setTimeout(() => {
            const predefinedReplies = [
                "Welcome! How can I assist you with your loan application?",
                "Sure, submitting your documents is the first step.",
                "Your application will be reviewed within 1 - 2 business days.",
                "Please wait for a notification via email or SMS regarding the result.",
                "Let us know if you have further questions!"
            ];

            const userIndex = updatedMessages.filter(msg => msg.sender === 'user').length;

            const botReply = {
                sender: 'bot',
                text: predefinedReplies[userIndex] || "I'm here to help you with anything related to your application."
            };

            setChatMessages(prev => [...prev, botReply]);
            setLoading(false);
        }, 1000);
    };

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    bgcolor: 'transparent',
                    p: 1,
                    mb: 1,
                }}
            >
                {chatMessages.map((msg, i) => (
                    <Typography
                        key={i}
                        align={msg.sender === 'user' ? 'right' : 'left'}
                        sx={{
                            mb: 0.5,
                            color: msg.sender === 'user' ? 'primary.main' : 'text.secondary',
                        }}
                    >
                        {msg.text}
                    </Typography>
                ))}
                {loading && (
                    <Typography variant="body2" color="text.disabled">
                        Bot is typing...
                    </Typography>
                )}
            </Box>

            <TextField
                placeholder="Ask anything..."
                fullWidth
                size="small"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                    }
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                        paddingRight: 1,
                        backgroundColor: '#fff',
                        boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.08)',
                        fontSize: '0.875rem',
                        '& fieldset': {
                            borderColor: '#C0C0C0',
                        },
                        '&:hover fieldset': {
                            borderColor: '#C0C0C0',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#C0C0C0',
                        },
                    },
                    '& .MuiInputBase-input': {
                        padding: '8px 12px',
                    },
                    mt: 1,
                }}
                InputProps={{
                    endAdornment: (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                color: 'primary.main',
                            }}
                        >
                            <CiMicrophoneOn size={24} color="#B2B2B2" />
                        </Box>
                    ),
                }}
            />
        </Box>
    );
};

const NodeChatPanel = ({ selectedNode, nodePosition }) => {
    const mockNodeData = useMemo(() => {
        if (!selectedNode) return null;

        const key = String(selectedNode.key).toLowerCase();

        if (key === 'submit loan application') {
            return {
                ...selectedNode,
                duration: '1 - 2 business days',
                description:
                    'The customer initiates the loan process by submitting a completed loan application form through an online portal or in person at a branch. This step involves providing personal, employment, financial, and collateral information, along with any required documentation such as income proof or identification. Accurate and complete submission is crucial to proceed to the initial review phase.',
            };
        }

        return {
            ...selectedNode,
            duration: '1 - 2 business days',
            description:
                'The customer provides information or interacts with the loan system at this stage. Please refer to specific instructions provided for the selected step.',
        };
    }, [selectedNode?.key]);

    const leftBgColor = selectedNode?.color || '#eee';
    const leftTitleBgColor = selectedNode?.stroke || '#ccc';

    if (!mockNodeData || !nodePosition) return null;

    return (
        <Portal>
            <Paper
                elevation={4}
                sx={{
                    position: 'fixed',
                    top: nodePosition.y,
                    left: nodePosition.x + 260,
                    transform: (nodePosition.x + 600 > window.innerWidth) ? 'translateX(-610px)' : 'none',
                    width: 560,
                    height: 340,
                    display: 'flex',
                    p: 0.7,
                    bgcolor: 'white',
                    zIndex: 1300,
                    borderRadius: 2,
                    boxShadow: 6,
                    borderColor: alpha(leftTitleBgColor, 0.75),
                    borderWidth: 2,
                    borderStyle: 'solid',
                    gap: 1,
                }}
            >
                <NodeInfo
                    mockNodeData={mockNodeData}
                    leftBgColor={leftBgColor}
                    leftTitleBgColor={leftTitleBgColor}
                />
                <Chatbot />
            </Paper>
        </Portal>
    );
};

export default NodeChatPanel;
