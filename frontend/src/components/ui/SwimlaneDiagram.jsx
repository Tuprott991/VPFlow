import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import { useState, useRef } from 'react';
import {
    Box,
    IconButton,
    Paper,
    Stack,
    Tooltip,
    Typography,
    Modal
} from '@mui/material';
import {
    ZoomIn,
    ZoomOut,
    ZoomOutMap,
    Undo,
    Redo,
    Close
} from '@mui/icons-material';

const createDiagram = (nodeDataArray, linkDataArray, onNodeClick) => {
    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, {
        'undoManager.isEnabled': true,
        allowZoom: true,
        allowHorizontalScroll: true,
        allowVerticalScroll: true,
        padding: 20,
        initialAutoScale: go.Diagram.Uniform,
        layout: $(go.Layout)
    });

    diagram.groupTemplate = $(
        go.Group,
        'Vertical',
        {
            background: 'white',
            isSubGraphExpanded: true,
            movable: false,
            copyable: false,
            deletable: false
        },
        new go.Binding('background', 'color'),
        $(go.Panel, 'Auto',
            $(go.Shape, 'Rectangle', { fill: null, stroke: null }),
            $(go.Panel, 'Table',
                $(go.TextBlock,
                    { row: 0, margin: 6, font: 'bold 13px sans-serif', alignment: go.Spot.Left },
                    new go.Binding('text', 'label')
                ),
                $(go.Placeholder, { row: 1, padding: 10 })
            )
        )
    );

    diagram.nodeTemplate = $(
        go.Node,
        'Auto',
        new go.Binding('location', 'loc', go.Point.parse),
        $(
            go.Shape,
            'RoundedRectangle',
            {
                fill: '#ffffff',
                stroke: '#888',
                strokeWidth: 1.5,
                width: 240,
                height: 100,
                portId: '',
                fromLinkable: true,
                toLinkable: true
            }
        ),
        $(
            go.TextBlock,
            {
                margin: 16,
                wrap: go.TextBlock.WrapFit,
                width: 220,
                font: 'bold 20px sans-serif',
                editable: false,
                textAlign: 'center'
            },
            new go.Binding('text', 'text')
        )
    );

    diagram.linkTemplate = $(
        go.Link,
        {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpGap,
            corner: 10,
            fromShortLength: 12,
            toShortLength: 12
        },
        $(go.Shape, { strokeWidth: 1.5, stroke: '#666' }),
        $(go.Shape, { toArrow: 'Standard', stroke: '#666', fill: '#666' })
    );

    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

    // 👇 Listen for node click
    diagram.addDiagramListener('ObjectSingleClicked', (e) => {
        const part = e.subject.part;
        if (part instanceof go.Node) {
            onNodeClick(part.data);
        }
    });

    return diagram;
};

export default function SwimlaneDiagram({ nodeDataArray, linkDataArray }) {
    const diagramRef = useRef(null);
    const [zoom, setZoom] = useState(1);
    const [selectedNodeData, setSelectedNodeData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const initDiagram = () => {
        const diagram = createDiagram(nodeDataArray, linkDataArray, (nodeData) => {
            setSelectedNodeData(nodeData);
            setIsModalOpen(true);
        });

        diagramRef.current = diagram;

        diagram.addDiagramListener('ViewportBoundsChanged', () => {
            setZoom(diagram.scale);
        });

        return diagram;
    };

    const handleZoomIn = () => diagramRef.current?.commandHandler.increaseZoom();
    const handleZoomOut = () => diagramRef.current?.commandHandler.decreaseZoom();
    const handleZoomToFit = () => diagramRef.current?.commandHandler.zoomToFit();
    const handleUndo = () => diagramRef.current?.commandHandler.undo();
    const handleRedo = () => diagramRef.current?.commandHandler.redo();

    return (
        <Box sx={{ width: '100%', height: '90%', position: 'relative', backgroundColor: '#fff' }}>
            {/* Control Panel */}
            <Paper
                elevation={1}
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1000,
                    p: 1,
                    borderRadius: '10px',
                    backgroundColor: '#FFF',
                    border: '1px solid #EEEFF1',
                }}
            >
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Zoom In" placement="top">
                        <IconButton onClick={handleZoomIn} size="small" sx={{ border: '1px solid #EEEFF1', borderRadius: '10px' }}>
                            <ZoomIn />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Zoom Out" placement="top">
                        <IconButton onClick={handleZoomOut} size="small" sx={{ border: '1px solid #EEEFF1', borderRadius: '10px' }}>
                            <ZoomOut />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Zoom to Fit" placement="top">
                        <IconButton onClick={handleZoomToFit} size="small" sx={{ border: '1px solid #EEEFF1', borderRadius: '10px' }}>
                            <ZoomOutMap />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Undo" placement="top">
                        <IconButton onClick={handleUndo} size="small" sx={{ border: '1px solid #EEEFF1', borderRadius: '10px' }}>
                            <Undo />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Redo" placement="top">
                        <IconButton onClick={handleRedo} size="small" sx={{ border: '1px solid #EEEFF1', borderRadius: '10px' }}>
                            <Redo />
                        </IconButton>
                    </Tooltip>

                    <Box display="flex" alignItems="center">
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {Math.round(zoom * 100)}%
                        </Typography>
                    </Box>
                </Stack>
            </Paper>

            {/* Diagram Area */}
            <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
                <ReactDiagram
                    initDiagram={initDiagram}
                    divClassName="swimlane-horizontal"
                    style={{ width: '100%', height: '100%' }}
                />
            </Box>

            {/* Node Info Modal */}
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="node-info-title"
                aria-describedby="node-info-description"
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        p: 3,
                        borderRadius: 2,
                        outline: 'none',
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography id="node-info-title" variant="h6">
                            Node Information
                        </Typography>
                        <IconButton onClick={() => setIsModalOpen(false)}>
                            <Close />
                        </IconButton>
                    </Box>

                    <Typography variant="body2" id="node-info-description">
                        <strong>Text:</strong> {selectedNodeData?.text}<br />
                        <strong>Key:</strong> {selectedNodeData?.key}<br />
                        <strong>Description:</strong> This is simulated content for this node.
                    </Typography>
                </Paper>
            </Modal>
        </Box>
    );
}
