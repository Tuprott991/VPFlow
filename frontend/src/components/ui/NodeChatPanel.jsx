import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    TextField,
    Paper,
    Portal,
} from '@mui/material';

const NodeChatPanel = ({ selectedNode, nodePosition }) => {
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

    // 🧠 Mô phỏng dữ liệu mô tả node (có rule riêng cho "Submit loan application")
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

    // 🎨 Màu nền ngẫu nhiên cho cột trái
    const leftBgColor = useMemo(() => {
        if (!selectedNode?.key) return '#eee';

        const colors = ['#FFECB3', '#C8E6C9', '#B3E5FC', '#D1C4E9', '#FFCDD2', '#F0F4C3'];
        const keyStr = String(selectedNode.key);
        const index = [...keyStr].reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;

        return colors[index];
    }, [selectedNode?.key]);

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
                    <Typography variant="h6" gutterBottom>Node Info</Typography>
                    <Typography variant="body2" gutterBottom><strong>Key:</strong> {mockNodeData.key}</Typography>
                    <Typography variant="body2" gutterBottom><strong>Text:</strong> {mockNodeData.text}</Typography>
                    <Typography variant="body2" gutterBottom><strong>Duration:</strong> {mockNodeData.duration}</Typography>
                    <Typography variant="body2" gutterBottom><strong>Description:</strong> {mockNodeData.description}</Typography>
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
