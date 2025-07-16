import React, { useCallback } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { groups, nodes as rawNodes, edges as rawEdges } from '@/data/mock_data/swimlaneData.js';

const groupY = Object.fromEntries(groups.map(g => [g.id, g.y]));

const initialNodes = rawNodes.map(n => ({
    id: n.id,
    type: 'default',
    data: { label: n.label },
    position: { x: n.x, y: groupY[n.group] + 20 },
    style: {
        backgroundColor: groups.find(g => g.id === n.group)?.color,
        padding: 10,
        borderRadius: 6,
        whiteSpace: 'pre-line',
        fontSize: 12
    }
}));

const initialEdges = rawEdges.map((e, i) => ({
    id: `e-${i}`,
    source: e.from,
    target: e.to,
    animated: true,
    type: 'smoothstep'
}));

const LoanWorkflow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (connection) => setEdges((eds) => addEdge(connection, eds)),
        []
    );

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* Swimlane Backgrounds */}
            {groups.map((g) => (
                <div
                    key={g.id}
                    style={{
                        position: 'absolute',
                        top: groupY[g.id],
                        left: 0,
                        height: 100,
                        width: '100%',
                        backgroundColor: g.color,
                        opacity: 0.1,
                        zIndex: 0
                    }}
                >
                    <strong style={{
                        position: 'absolute',
                        left: 10,
                        top: groupY[g.id] + 10,
                        fontWeight: 'bold',
                        color: '#333'
                    }}>
                        {g.label}
                    </strong>
                </div>
            ))}

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
};

export default LoanWorkflow;
