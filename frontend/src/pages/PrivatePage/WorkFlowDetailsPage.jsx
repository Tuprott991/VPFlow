// Import necessary libraries
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Import necessary components from MUI
import {
    Box, Typography, Button, TextField, InputAdornment,
} from '@mui/material';

// Import necessary icons
import {
    Search, Upload, TextSnippet, Delete, Compare, List as ListIcon, Feedback, Psychology, AutoAwesome,
    SmartToy, Description
} from '@mui/icons-material';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { FiGitCommit } from "react-icons/fi";

// Import custom components
import { SwimlaneDiagram } from '@/components/ui';
import { ToolButton, ToolGroupTitle } from '@/components/custom';

// Import mock data for swimlane diagram
import { nodeDataArray, linkDataArray } from '@/data/mock_data/swimlaneData';
import { subNodeDataArray, subLinkDataArray } from '@/data/mock_data/subSwimlaneData';
import { enhanceNodeDataArray, enhanceLinkDataArray } from '@/data/mock_data/enchanceSwimlaneData';

const WorkflowHeader = () => (
    <Box sx={{ bgcolor: '#E5EEFF', px: 1.5, py: 1, borderRadius: '8px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IoInformationCircleOutline size={20} color="#1E3C7D" />
                <Typography fontSize={14} color="#1E3C7D" fontWeight={500}>
                    This workflow has not yet been published ( For manager to review )
                </Typography>
            </Box>
            <Button sx={{ borderRadius: '8px', px: 2, bgcolor: '#256CF1', color: 'white', fontWeight: 400 }}>
                Publish workflow
            </Button>
        </Box>
    </Box>
);

const WorkflowLegend = () => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 1,
            }}>
                <FiGitCommit size={24} />
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    Version 3.0
                </Typography>
            </Box>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 1,
            }}>
                <Typography variant="body1" sx={{
                    color: 'text.primary',
                    fontWeight: 'medium'
                }}>
                    Pain Point
                </Typography>

                <Box sx={{
                    width: 50,
                    height: 20,
                    bgcolor: '#DF98EA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #8308BC'
                }}>
                </Box>
            </Box>
        </Box>
    )
};




const ChatPanel = ({ onClose }) => {
    const botResponses = [
        'Hello! How can I assist you today?',
        'Verify income, collateral',
        'This step often involves:\n1. Collecting documents from the customer\n2. Third-party verifications (employer, property appraisals)\n3. Manual reviews\n4. This process can take days or even weeks depending on the complexity.'
    ];

    const [messages, setMessages] = useState([
        { text: botResponses[0], fromUser: false }
    ]);
    const [input, setInput] = useState("");
    const [responseIndex, setResponseIndex] = useState(1);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const simulateBotResponse = () => {
        if (responseIndex >= botResponses.length) return;

        const response = botResponses[responseIndex];
        const isLong = response.length > 100;

        setIsBotTyping(true);
        setTimeout(() => {
            setMessages(prev => [...prev, { text: response, fromUser: false }]);
            setResponseIndex(prev => prev + 1);
            setIsBotTyping(false);
        }, isLong ? 2500 : 1000);
    };

    const handleSend = () => {
        if (!input.trim() || isBotTyping) return;
        setMessages(prev => [...prev, { text: input.trim(), fromUser: true }]);
        setInput("");

        simulateBotResponse();
    };

    const TypingIndicator = () => (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            marginBottom: '8px',
            opacity: isBotTyping ? 1 : 0,
            transition: 'opacity 0.3s ease'
        }}>
            <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
            }}>
                VP Agent
            </div>
            <div style={{
                backgroundColor: '#f1f3f5',
                padding: '8px 16px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <div style={{ display: 'flex', gap: '3px' }}>
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: '#667eea',
                                animation: `bounce 1.4s ease-in-out infinite both ${i * 0.16}s`
                            }}
                        />
                    ))}
                </div>
                <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
                    Thinking...
                </span>
            </div>
        </div>
    );

    const styles = `
        @keyframes bounce {
            0%, 80%, 100% {
                transform: scale(0);
            }
            40% {
                transform: scale(1);
            }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .message-animation {
            animation: fadeInUp 0.3s ease-out;
        }

        .chat-scrollbar::-webkit-scrollbar {
            width: 6px;
        }

        .chat-scrollbar::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.1);
            border-radius: 3px;
        }

        .chat-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 3px;
        }

        .send-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        .message-bubble:hover {
            transform: translateY(-1px);
        }

        .close-button:hover {
            transform: scale(1.05);
        }
    `;

    return (
        <>
            <style>{styles}</style>
            <div style={{
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                borderRadius: '20px',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                position: 'relative'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <img src="/chatbot_logo.png" alt="VPFlow Logo" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                        </div>
                        <div>
                            <h3 style={{
                                margin: 0,
                                fontSize: '18px',
                                fontWeight: 'bold'
                            }}>
                                VP ChatBot
                            </h3>
                            <p style={{
                                margin: 0,
                                fontSize: '12px',
                                opacity: 0.8
                            }}>
                                Ready to help you
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="close-button"
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            border: 'none',
                            color: 'white',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Messages Container */}
                <div
                    className="chat-scrollbar"
                    style={{
                        flex: 1,
                        height: '100vh',
                        padding: '20px',
                        overflowY: 'auto',
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.7))'
                    }}
                >
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className="message-animation"
                            style={{
                                display: 'flex',
                                justifyContent: msg.fromUser ? 'flex-end' : 'flex-start',
                                marginBottom: '16px',
                                alignItems: 'flex-end',
                                gap: '8px'
                            }}
                        >
                            {!msg.fromUser && (
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    flexShrink: 0
                                }}>
                                    VP
                                </div>
                            )}

                            <div
                                className="message-bubble"
                                style={{
                                    background: msg.fromUser
                                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                        : '#ffffff',
                                    color: msg.fromUser ? 'white' : '#333',
                                    padding: '12px 16px',
                                    borderRadius: msg.fromUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                                    maxWidth: '75%',
                                    boxShadow: msg.fromUser
                                        ? '0 4px 12px rgba(102, 126, 234, 0.3)'
                                        : '0 2px 8px rgba(0,0,0,0.1)',
                                    transition: 'all 0.2s ease',
                                    fontSize: '14px',
                                    lineHeight: '1.4'
                                }}
                            >
                                <div style={{ whiteSpace: 'pre-line' }}>
                                    {msg.text}
                                </div>
                            </div>

                            {msg.fromUser && (
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    flexShrink: 0
                                }}>
                                    Tú Ktu
                                </div>
                            )}
                        </div>
                    ))}

                    <TypingIndicator />
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div style={{
                    padding: '20px',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    borderTop: '1px solid rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                        <textarea
                            placeholder="Input your message"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            disabled={isBotTyping}
                            rows={1}
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                borderRadius: '20px',
                                border: '2px solid #e1e5e9',
                                fontSize: '14px',
                                resize: 'none',
                                outline: 'none',
                                fontFamily: 'inherit',
                                backgroundColor: 'white',
                                transition: 'border-color 0.2s ease',
                                minHeight: '44px',
                                maxHeight: '100px'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isBotTyping || !input.trim()}
                            className="send-button"
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '20px',
                                border: 'none',
                                background: input.trim() && !isBotTyping
                                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                    : '#ccd6dd',
                                color: 'white',
                                cursor: input.trim() && !isBotTyping ? 'pointer' : 'not-allowed',
                                fontSize: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                                boxShadow: input.trim() && !isBotTyping
                                    ? '0 4px 12px rgba(102, 126, 234, 0.3)'
                                    : 'none'
                            }}
                        >
                            {isBotTyping ? '⏳' : '>>'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};


// const ToolsPanel = ({ onShowChat, onPainPointDetection }) => (
//     <Box sx={{
//         width: '100%',
//         height: '100%',
//         bgcolor: 'white',
//         display: 'flex',
//         flexDirection: 'column',
//         fontSize: '12px'
//     }}>
//         <Box sx={{ p: 1.5, flexShrink: 0, bgcolor: 'white' }}>
//             <Typography fontWeight={600} mb={1} sx={{ fontSize: '12px' }}>
//                 Tools
//             </Typography>

//             <ToolButton
//                 props={{
//                     text: 'Upload file to generate workflow',
//                     icon: <Upload fontSize="small" />
//                 }}
//             />

//             <TextField
//                 fullWidth
//                 size="small"
//                 placeholder="Search blocks..."
//                 InputProps={{
//                     startAdornment: (
//                         <InputAdornment position="start">
//                             <Search sx={{ color: '#AFB0B4', fontSize: '16px' }} />
//                         </InputAdornment>
//                     ),
//                 }}
//                 inputProps={{
//                     style: { fontSize: '12px', padding: '8px 0px' },
//                 }}
//                 sx={{
//                     mb: 1,
//                     borderRadius: '10px',
//                     '& .MuiOutlinedInput-root': {
//                         borderRadius: '10px',
//                         fontSize: '12px',
//                     },
//                     '& .MuiOutlinedInput-notchedOutline': {
//                         borderColor: '#EEEFF1',
//                     },
//                 }}
//             />

//             <ToolGroupTitle title="Generation" />

//             <ToolButton
//                 props={{
//                     text: 'Import text to generate workflow',
//                     icon: <TextSnippet fontSize="small" color="action" />
//                 }}
//             />

//             <ToolButton
//                 props={{
//                     text: 'Delete workflow',
//                     icon: <Delete fontSize="small" color="action" />
//                 }}
//             />

//             <ToolGroupTitle title="Interaction" />

//             <ToolButton
//                 props={{
//                     icon: <Compare fontSize="small" color="action" />,
//                     text: 'Compare workflow'
//                 }}
//             />

//             <ToolButton
//                 props={{
//                     icon: <ListIcon fontSize="small" color="action" />,
//                     text: 'Find list entries'
//                 }}
//             />

//             <ToolButton
//                 props={{
//                     icon: <Feedback fontSize="small" color="action" />,
//                     text: 'Give feedback'
//                 }}
//             />

//             <ToolGroupTitle title="AI" />

//             <ToolButton
//                 props={{
//                     icon: <Psychology fontSize="small" color="primary" />,
//                     text: 'Pain Point Detection',
//                     onClick: onPainPointDetection
//                 }}
//             />

//             <ToolButton
//                 props={{
//                     icon: <AutoAwesome fontSize="small" color="action" />,
//                     text: 'AI suggestion'
//                 }}
//             />

//             <ToolButton
//                 props={{
//                     icon: <SmartToy fontSize="small" color="primary" />,
//                     text: 'Global AI Assistant',
//                     onClick: onShowChat
//                 }}
//             />

//             <ToolButton
//                 props={{
//                     icon: <Description fontSize="small" color="action" />,
//                     text: 'Auto SOP Generator'
//                 }}
//             />
//         </Box>
//     </Box>
// );

const ToolsPanel = (props) => {

    const { onShowChat, onPainPointDetection, onAISuggestion } = props;

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            bgcolor: 'white',
            display: 'flex',
            flexDirection: 'column',
            fontSize: '12px'
        }}>
            <Box sx={{ p: 1.5, flexShrink: 0, bgcolor: 'white' }}>
                <Typography fontWeight={600} mb={1} sx={{ fontSize: '12px' }}>
                    Tools
                </Typography>

                <ToolButton
                    props={{
                        text: 'Upload file to generate workflow',
                        icon: <Upload fontSize="small" />
                    }}
                />

                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search blocks..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ color: '#AFB0B4', fontSize: '16px' }} />
                            </InputAdornment>
                        ),
                    }}
                    inputProps={{
                        style: { fontSize: '12px', padding: '8px 0px' },
                    }}
                    sx={{
                        mb: 1,
                        borderRadius: '10px',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            fontSize: '12px',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#EEEFF1',
                        },
                    }}
                />

                <ToolGroupTitle title="Generation" />

                <ToolButton
                    props={{
                        text: 'Import text to generate workflow',
                        icon: <TextSnippet fontSize="small" color="action" />
                    }}
                />

                <ToolButton
                    props={{
                        text: 'Delete workflow',
                        icon: <Delete fontSize="small" color="action" />
                    }}
                />

                <ToolGroupTitle title="Interaction" />

                <ToolButton
                    props={{
                        icon: <Compare fontSize="small" color="action" />,
                        text: 'Compare workflow'
                    }}
                />

                <ToolButton
                    props={{
                        icon: <ListIcon fontSize="small" color="action" />,
                        text: 'Find list entries'
                    }}
                />

                <ToolButton
                    props={{
                        icon: <Feedback fontSize="small" color="action" />,
                        text: 'Give feedback'
                    }}
                />

                <ToolGroupTitle title="AI" />

                <ToolButton
                    props={{
                        icon: <Psychology fontSize="small" color="primary" />,
                        text: 'Pain Point Detection',
                        onClick: onPainPointDetection
                    }}
                />

                <ToolButton
                    props={{
                        icon: <AutoAwesome fontSize="small" color="action" />,
                        text: 'AI suggestion',
                        onClick: onAISuggestion
                    }}
                />

                <ToolButton
                    props={{
                        icon: <SmartToy fontSize="small" color="primary" />,
                        text: 'Global AI Assistant',
                        onClick: onShowChat
                    }}
                />

                <ToolButton
                    props={{
                        icon: <Description fontSize="small" color="action" />,
                        text: 'Auto SOP Generator'
                    }}
                />
            </Box>
        </Box>
    );
};

const App = () => {
    const [showChat, setShowChat] = useState(false);
    const [defaultFile, setDefaultFile] = useState(new File(["content"], "sample.txt"));
    const [highlightedNodes, setHighlightedNodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [enhancedNodeDataArray, setEnhancedNodeDataArray] = useState([]);
    const [enhancedLinkDataArray, setEnhancedLinkDataArray] = useState([]);

    const location = useLocation();
    const fromPage = location.state?.from;

    const handlePainPointDetection = () => {
        if (highlightedNodes.length > 0) {
            setHighlightedNodes([]);
            return;
        }

        setLoading(true);
        setProgress(0);

        let current = 0;
        const interval = setInterval(() => {
            current += 5;
            setProgress(current);
            if (current >= 100) {
                clearInterval(interval);
                setLoading(false);

                const cicNode = nodeDataArray
                    .filter(node => node.text === "Check CIC (Credit Report)" || node.text === "Tiếp nhận hồ sơ và thẩm định")
                    .map(node => node.key);

                setHighlightedNodes(cicNode);
            }
        }, 100);
    };

    const onAISuggestion = () => {
        console.log('Applying AI suggestion...');
        console.log('Original:', enhanceNodeDataArray, enhanceLinkDataArray);
        // Ép React render lại bằng cách clone dữ liệu mới
        setEnhancedNodeDataArray([...enhanceNodeDataArray]);
        setEnhancedLinkDataArray([...enhanceLinkDataArray]);
    };

    return (
        <Box sx={{ bgcolor: 'background.default', height: '100vh', overflow: 'hidden', width: '100%', display: 'flex' }}>
            {/* Diagram & Header */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 'calc(100% - 280px)', overflow: 'hidden' }}>
                {/* Header & Legend */}
                <Box sx={{ bgcolor: 'background.default', flexShrink: 0, p: 1.5 }}>
                    <WorkflowHeader />
                    <WorkflowLegend />
                </Box>

                {/* Diagram */}
                <Box sx={{ flex: 1, overflow: 'hidden', p: 1.5 }}>
                    {enhancedNodeDataArray.length > 0 && enhancedLinkDataArray.length > 0 ? (
                        <SwimlaneDiagram
                            nodeDataArray={enhancedNodeDataArray}
                            linkDataArray={enhancedLinkDataArray}
                            highlightedNodes={highlightedNodes}
                        />
                    ) : fromPage === 'list-of-workflows' ? (
                        <SwimlaneDiagram
                            nodeDataArray={nodeDataArray}
                            linkDataArray={linkDataArray}
                            highlightedNodes={highlightedNodes}
                        />
                    ) : (
                        <SwimlaneDiagram
                            nodeDataArray={subNodeDataArray}
                            linkDataArray={subLinkDataArray}
                            highlightedNodes={highlightedNodes}
                        />
                    )}
                </Box>
            </Box>

            {/* Sidebar Chat / Tool */}
            <Box
                sx={{
                    width: 280,
                    bgcolor: '#f8f9fa',
                    borderLeft: 0.5,
                    borderColor: 'divider',
                    overflow: 'hidden',
                    flexShrink: 0
                }}
            >
                {showChat ? (
                    <ChatPanel onClose={() => setShowChat(false)} defaultFile={defaultFile} />
                ) : (
                    <ToolsPanel
                        onShowChat={() => setShowChat(true)}
                        onPainPointDetection={handlePainPointDetection}
                        onAISuggestion={onAISuggestion}
                    />
                )}
            </Box>

            {/* Loading Overlay */}
            {loading && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        bgcolor: 'rgba(255, 255, 255, 0.7)',
                        zIndex: 1300,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Box sx={{ width: '60%', textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: '#1976d2', mb: 2 }}>
                            Detecting Pain Points...
                        </Typography>
                        <Box sx={{ width: '100%' }}>
                            <Box
                                sx={{
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
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default App;