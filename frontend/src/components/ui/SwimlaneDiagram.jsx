import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import { useState, useRef, useEffect } from 'react';
import {
    Box,
    IconButton,
    Paper,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    ZoomIn,
    ZoomOut,
    ZoomOutMap,
    Undo,
    Redo,
} from '@mui/icons-material';

// ===== DIAGRAM CONFIGURATION =====

const createGroupTemplate = ($) => {
    return $(
        go.Group,
        'Vertical',
        {
            background: 'white',
            isSubGraphExpanded: true,
            movable: false,
            copyable: false,
            deletable: false,
        },
        new go.Binding('background', 'color'),
        $(
            go.Panel,
            'Auto',
            $(go.Shape, 'Rectangle', { fill: null, stroke: null }),
            $(
                go.Panel,
                'Table',
                $(
                    go.TextBlock,
                    {
                        row: 0,
                        margin: 6,
                        font: 'bold 13px sans-serif',
                        alignment: go.Spot.Left,
                    },
                    new go.Binding('text', 'label')
                ),
                $(go.Placeholder, { row: 1, padding: 10 })
            )
        )
    );
};

const createNodeTemplate = ($, highlightedNodes) => {
    return $(
        go.Node,
        'Auto',
        new go.Binding('location', 'loc', go.Point.parse),
        $(
            go.Shape,
            'RoundedRectangle',
            {
                stroke: '#888',
                strokeWidth: 1.5,
                width: 240,
                height: 100,
                portId: '',
                fromLinkable: true,
                toLinkable: true,
            },
            // Binding để đổi màu theo highlightedNodes
            new go.Binding('fill', 'key', function(key) {
                return highlightedNodes.includes(key) ? "#DF98EA" : "#ffffff";
            })
        ),
        $(
            go.TextBlock,
            {
                margin: 16,
                wrap: go.TextBlock.WrapFit,
                width: 220,
                font: 'bold 20px sans-serif',
                editable: false,
                textAlign: 'center',
            },
            new go.Binding('text', 'text')
        )
    );
};

const createLinkTemplate = ($) => {
    return $(
        go.Link,
        {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpGap,
            corner: 10,
            fromShortLength: 12,
            toShortLength: 12,
        },
        $(go.Shape, { strokeWidth: 1.5, stroke: '#666' }),
        $(go.Shape, { toArrow: 'Standard', stroke: '#666', fill: '#666' })
    );
};

// ===== CONTROL PANEL COMPONENT =====
const DiagramControlPanel = ({
    onZoomIn,
    onZoomOut,
    onZoomToFit,
    onUndo,
    onRedo,
    zoom,
}) => {
    const buttonStyles = {
        border: '1px solid #EEEFF1',
        borderRadius: '10px',
    };

    const panelStyles = {
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        p: 1,
        borderRadius: '10px',
        backgroundColor: '#FFF',
        border: '1px solid #EEEFF1',
    };

    return (
        <Paper elevation={1} sx={panelStyles}>
            <Stack direction="row" spacing={1}>
                <Tooltip title="Zoom In" placement="top">
                    <IconButton onClick={onZoomIn} size="small" sx={buttonStyles}>
                        <ZoomIn />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Zoom Out" placement="top">
                    <IconButton onClick={onZoomOut} size="small" sx={buttonStyles}>
                        <ZoomOut />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Zoom to Fit" placement="top">
                    <IconButton onClick={onZoomToFit} size="small" sx={buttonStyles}>
                        <ZoomOutMap />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Undo" placement="top">
                    <IconButton onClick={onUndo} size="small" sx={buttonStyles}>
                        <Undo />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Redo" placement="top">
                    <IconButton onClick={onRedo} size="small" sx={buttonStyles}>
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
    );
};

// ===== DIAGRAM HOOKS =====
const useDiagramControls = (diagramRef) => {
    const handleZoomIn = () => diagramRef.current?.commandHandler.increaseZoom();
    const handleZoomOut = () => diagramRef.current?.commandHandler.decreaseZoom();
    const handleZoomToFit = () => diagramRef.current?.commandHandler.zoomToFit();
    const handleUndo = () => diagramRef.current?.commandHandler.undo();
    const handleRedo = () => diagramRef.current?.commandHandler.redo();

    return {
        handleZoomIn,
        handleZoomOut,
        handleZoomToFit,
        handleUndo,
        handleRedo,
    };
};

// ===== MAIN COMPONENT =====
export default function SwimlaneDiagram({ nodeDataArray, linkDataArray, highlightedNodes = [] }) {
    const diagramRef = useRef(null);
    const [zoom, setZoom] = useState(1);
    const [diagram, setDiagram] = useState(null);

    const diagramControls = useDiagramControls(diagramRef);

    const createDiagram = (nodeDataArray, linkDataArray, highlightedNodes) => {
        const $ = go.GraphObject.make;
        const newDiagram = $(go.Diagram, {
            'undoManager.isEnabled': true,
            allowZoom: true,
            allowHorizontalScroll: true,
            allowVerticalScroll: true,
            padding: 20,
            initialAutoScale: go.Diagram.Uniform,
            layout: $(go.Layout),
        });

        newDiagram.groupTemplate = createGroupTemplate($);
        newDiagram.nodeTemplate = createNodeTemplate($, highlightedNodes);
        newDiagram.linkTemplate = createLinkTemplate($);
        newDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

        return newDiagram;
    };

    const initDiagram = () => {
        const newDiagram = createDiagram(nodeDataArray, linkDataArray, highlightedNodes);
        diagramRef.current = newDiagram;
        setDiagram(newDiagram);

        newDiagram.addDiagramListener('ViewportBoundsChanged', () => {
            setZoom(newDiagram.scale);
        });

        return newDiagram;
    };

    useEffect(() => {
        if (diagramRef.current) {
            // Recreate node template với highlightedNodes mới
            const $ = go.GraphObject.make;
            diagramRef.current.nodeTemplate = createNodeTemplate($, highlightedNodes);
            
            // Trigger update cho tất cả nodes
            diagramRef.current.nodes.each(node => {
                node.updateTargetBindings();
            });
        }
    }, [highlightedNodes]);

    return (
        <Box sx={{ width: '100%', height: '90%', position: 'relative', backgroundColor: '#fff' }}>
            <DiagramControlPanel
                onZoomIn={diagramControls.handleZoomIn}
                onZoomOut={diagramControls.handleZoomOut}
                onZoomToFit={diagramControls.handleZoomToFit}
                onUndo={diagramControls.handleUndo}
                onRedo={diagramControls.handleRedo}
                zoom={zoom}
            />

            <Box sx={{
                width: '100%',
                height: '100%',
                overflow: 'auto',
                transition: 'width 0.3s ease'
            }}>
                <ReactDiagram
                    initDiagram={initDiagram}
                    divClassName="swimlane-horizontal"
                    style={{ width: '100%', height: '100%' }}
                />
            </Box>
        </Box>
    );
}