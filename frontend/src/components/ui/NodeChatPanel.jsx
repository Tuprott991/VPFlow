import { useState, useMemo } from 'react';
import { Box, Typography, TextField, Paper, Portal } from '@mui/material';

const NodeChatPanel = (props) => {
    const { selectedNode, nodePosition } = props;
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        const userMessage = { sender: 'user', text: chatInput };
        setChatMessages(prev => [...prev, userMessage]);
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

            const userIndex = chatMessages.filter(msg => msg.sender === 'user').length;

            const botReply = {
                sender: 'bot',
                text: predefinedReplies[userIndex] || "I'm here to help you with anything related to your application."
            };

            setChatMessages(prev => [...prev, botReply]);
            setLoading(false);
        }, 1000);
    };

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

        const durations = ['1 - 2 business days'];
        const descriptions = [
            'The customer initiates the loan process by submitting a completed loan application form through an online portal or in person at a branch. This step involves providing personal, employment, financial, and collateral information.',
        ];

        const randomDuration = durations[Math.floor(Math.random() * durations.length)];
        const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];

        return {
            ...selectedNode,
            duration: randomDuration,
            description: randomDescription,
        };
    }, [selectedNode?.key]);

    const leftBgColor = useMemo(() => {
        if (!selectedNode?.color) return '#eee';
        return selectedNode.color;
    }, [selectedNode?.color]);

    const leftTitleBgColor = useMemo(() => {
        if (!selectedNode?.stroke) return '#ccc';
        return selectedNode.stroke;
    }, [selectedNode?.stroke]);

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
                    p: 2,
                    bgcolor: '#fafafa',
                    zIndex: 1300,
                    borderRadius: 2,
                    boxShadow: 6,
                }}
            >
                {/* Left Column - Node Info */}
                <Box
                    sx={{
                        flex: 1,
                        pr: 2,
                        borderRight: '1px solid #ddd',
                        bgcolor: leftBgColor,
                        borderRadius: 1,
                        p: 1.5,
                    }}
                >
                    <Box
                        sx={{
                            display: 'inline-block',
                            fontWeight: 600,
                            bgcolor: leftTitleBgColor,
                            borderRadius: 1,
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

                {/* Right Column - Chatbot */}
                <Box sx={{ flex: 1, pl: 2, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" gutterBottom>Chatbot</Typography>

                    <Box
                        sx={{
                            flex: 1,
                            overflowY: 'auto',
                            bgcolor: '#fff',
                            p: 1,
                            borderRadius: 1,
                            mb: 1,
                            border: '1px solid #ccc',
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
                            <Typography variant="body2" color="text.disabled">Bot is typing...</Typography>
                        )}
                    </Box>

                    <TextField
                        placeholder="Type message..."
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
                    />
                </Box>
            </Paper>
        </Portal>
    );
};

export default NodeChatPanel;
