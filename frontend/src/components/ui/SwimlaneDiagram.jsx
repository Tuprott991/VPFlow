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
} from '@mui/material';
import {
    ZoomIn,
    ZoomOut,
    ZoomOutMap,
    Undo,
    Redo
} from '@mui/icons-material';

const createDiagram = (nodeDataArray, linkDataArray) => {
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
    return diagram;
};

export default function SwimlaneDiagram({ nodeDataArray, linkDataArray }) {
    const diagramRef = useRef(null);
    const [zoom, setZoom] = useState(1);

    const initDiagram = () => {
        const diagram = createDiagram(nodeDataArray, linkDataArray);
        diagramRef.current = diagram;

        // Listen for scale changes
        diagram.addDiagramListener('ViewportBoundsChanged', (e) => {
            setZoom(diagram.scale);
        });

        return diagram;
    };

    const handleZoomIn = () => {
        if (diagramRef.current) {
            diagramRef.current.commandHandler.increaseZoom();
        }
    };

    const handleZoomOut = () => {
        if (diagramRef.current) {
            diagramRef.current.commandHandler.decreaseZoom();
        }
    };

    const handleZoomToFit = () => {
        if (diagramRef.current) {
            diagramRef.current.commandHandler.zoomToFit();
        }
    };

    const handleUndo = () => {
        if (diagramRef.current) {
            diagramRef.current.commandHandler.undo();
        }
    };

    const handleRedo = () => {
        if (diagramRef.current) {
            diagramRef.current.commandHandler.redo();
        }
    };

    return (
        <Box sx={{ width: '100%', height: '90%', position: 'relative', backgroundColor: '#fff' }}>
            {/* Control Panel */}
            <Paper
                elevation={1}
                sx={{
                    position: 'absolute',
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
                    <Tooltip title="Zoom In" placement="left">
                        <IconButton
                            onClick={handleZoomIn}
                            size="small"
                            color="#000"
                            sx={{
                                border: '1px solid #EEEFF1',
                                borderRadius: '10px',
                            }}
                        >
                            <ZoomIn />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Zoom Out" placement="left">
                        <IconButton
                            onClick={handleZoomOut}
                            size="small"
                            color="#000"
                            sx={{
                                border: '1px solid #EEEFF1',
                                borderRadius: '10px',
                            }}
                        >
                            <ZoomOut />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Zoom to Fit" placement="left">
                        <IconButton
                            onClick={handleZoomToFit}
                            size="small"
                            color="#000"
                            sx={{
                                border: '1px solid #EEEFF1',
                                borderRadius: '10px',
                            }}
                        >
                            <ZoomOutMap />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Undo" placement="left">
                        <IconButton
                            onClick={handleUndo}
                            size="small"
                            color="#000"
                            sx={{
                                border: '1px solid #EEEFF1',
                                borderRadius: '10px',
                            }}
                        >
                            <Undo />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Redo" placement="left">
                        <IconButton
                            onClick={handleRedo}
                            size="small"
                            color="#000"
                            sx={{
                                border: '1px solid #EEEFF1',
                                borderRadius: '10px',
                            }}
                        >
                            <Redo />
                        </IconButton>
                    </Tooltip>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                            variant="caption"
                            sx={{
                                textAlign: 'center',
                                color: 'text.secondary',
                            }}
                        >
                            {Math.round(zoom * 100)}%
                        </Typography>
                    </Box>
                </Stack>
            </Paper>

            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    overflow: 'auto',
                }}
            >
                <ReactDiagram
                    initDiagram={initDiagram}
                    divClassName="swimlane-horizontal"
                    style={{ width: '100%', height: '100%' }}
                />
            </Box>
        </Box>
    );
}