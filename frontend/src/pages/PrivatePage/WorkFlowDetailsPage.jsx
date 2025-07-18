import {
    Box,
    Typography,
    Button,
    TextField,
    InputAdornment,
    Chip
} from '@mui/material';
import {
    Search,
    Upload,
    TextSnippet,
    Delete,
    Compare,
    List as ListIcon,
    Feedback,
    Psychology,
    AutoAwesome,
    SmartToy,
    Description
} from '@mui/icons-material';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { FaWindowClose } from "react-icons/fa";
import { FcAssistant } from "react-icons/fc";

import { SwimlaneDiagram } from '@/components/ui';
import { nodeDataArray, linkDataArray } from '@/data/mock_data/swimlaneData';
import { ToolButton, ToolGroupTitle } from '@/components/custom';
import { useState } from 'react';

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

const ChatPanel = ({ onClose, defaultFile }) => {
    const [selectedFiles, setSelectedFiles] = useState(defaultFile ? [defaultFile] : []);
    const [messages, setMessages] = useState([
        { text: 'Hi, I need some help', fromUser: true },
        { text: 'Of course! What do you need help with?', fromUser: false },
    ]);
    const [input, setInput] = useState("");

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const handleDeleteFile = (index) => {
        setSelectedFiles(files => files.filter((_, i) => i !== index));
    };

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { text: input, fromUser: true }]);
        setInput("");
    };

    return (
        <Box sx={{ p: 2, bgcolor: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                    <FcAssistant fontSize="medium" />
                    &nbsp; Global AI Assistant
                </Typography>
                <Button size="small" onClick={onClose} sx={{ minWidth: 'auto', p: 0.5 }}>
                    <FaWindowClose />
                </Button>
            </Box>

            <TextField
                fullWidth
                size="small"
                placeholder="Search ..."
                sx={{ mb: 1 }}
            />

            <Typography variant="subtitle2" fontWeight="bold" mb={1}>List of chat</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1 }}>
                <Button variant="outlined" size="small">Chat 1</Button>
                <Button variant="outlined" size="small">Chat 2</Button>
                <Button variant="outlined" size="small">New chat</Button>
            </Box>

            <Box sx={{ p: 1, bgcolor: '#f1c6b9ff', borderRadius: 1, mb: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" mb={0.5}>Import</Typography>
                {selectedFiles.map((file, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip
                            label={
                                <span style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: 200
                                }}>
                                    {file.name}
                                </span>
                            }
                            onDelete={() => handleDeleteFile(idx)}
                            color="primary"
                            sx={{
                                flex: 1,
                                '& .MuiChip-root': {
                                    display: 'flex',
                                    alignItems: 'center'
                                },
                                '& .MuiChip-deleteIcon': {
                                    marginLeft: 'auto',
                                    order: 2
                                },
                                '& .MuiChip-label': {
                                    order: 1,
                                    flex: 1
                                }
                            }}
                        />
                    </Box>
                ))}
                <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    sx={{
                        color: 'primary.main',
                        borderColor: 'primary.main',
                        '&:hover': {
                            borderColor: 'primary.dark',
                            color: 'primary.dark',
                            backgroundColor: 'primary.light'
                        }
                    }}
                >
                    Import file
                    <input
                        type="file"
                        hidden
                        multiple
                        onChange={handleFileChange}
                    />
                </Button>
            </Box>

            <Box sx={{
                height: 380,
                bgcolor: '#fff',
                border: '1px solid #ccc',
                borderRadius: 1,
                p: 1,
                mb: 1,
                overflowY: 'auto',
            }}>
                {messages.map((msg, idx) => (
                    <Box
                        key={idx}
                        sx={{
                            display: 'flex',
                            justifyContent: msg.fromUser ? 'flex-end' : 'flex-start',
                            mb: 1
                        }}
                    >
                        <Box sx={{
                            bgcolor: msg.fromUser ? '#cce5ff' : '#e1f7d5',
                            p: 1,
                            borderRadius: 1,
                            maxWidth: '70%'
                        }}>
                            <Typography variant="body2">{msg.text}</Typography>
                        </Box>
                    </Box>
                ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Text prompt"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Button variant="contained" onClick={handleSend}>Send</Button>
            </Box>
        </Box>
    );
};

const ToolsPanel = ({ onShowChat, onPainPointDetection }) => (
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
                    text: 'AI suggestion'
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

const App = () => {
    const [showChat, setShowChat] = useState(false);
    const [defaultFile, setDefaultFile] = useState(new File(["content"], "sample.txt"));
    const [highlightedNodes, setHighlightedNodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

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
                    .filter(node => node.text === "Check CIC (Credit Report)")
                    .map(node => node.key);
                setHighlightedNodes(cicNode);
            }
        }, 100);
    };



    return (
        <Box sx={{ bgcolor: 'background.default', height: '100vh', overflow: 'hidden', width: '100%', display: 'flex' }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 'calc(100% - 280px)', overflow: 'hidden' }}>
                <Box sx={{ bgcolor: 'background.default', flexShrink: 0, p: 1.5 }}>
                    <WorkflowHeader />

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: 2,
                        mt: 2
                    }}>
                        <Typography variant="body1" sx={{
                            color: 'text.primary',
                            fontWeight: 'medium'
                        }}>
                            Pain Point
                        </Typography>

                        {/* Pain Point Icon/Illustration */}
                        <Box sx={{
                            width: 80,
                            height: 40,
                            bgcolor: '#DF98EA',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid #8308BC'
                        }}>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ flex: 1, overflow: 'hidden', p: 1.5 }}>
                    <SwimlaneDiagram
                        nodeDataArray={nodeDataArray}
                        linkDataArray={linkDataArray}
                        highlightedNodes={highlightedNodes}
                    />
                </Box>
            </Box>

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
                    />
                )}
            </Box>
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

                </Box>)}

        </Box>
    );
};

export default App;