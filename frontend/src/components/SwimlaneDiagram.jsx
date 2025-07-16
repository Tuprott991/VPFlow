import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import React from 'react';
import { nodeDataArray, linkDataArray } from './swimlane.config';

const initDiagram = () => {
    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, {
        'undoManager.isEnabled': true,
        allowZoom: true,
        allowHorizontalScroll: true,
        allowVerticalScroll: true,
        padding: 20,
        initialAutoScale: go.Diagram.Uniform,
        layout: $(go.Layout) // không tự động layout để dùng loc
    });

    // Swimlane template (Group)
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

    // Node template
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
                font: 'bold 20px sans-serif',   // ⬅️ Tăng kích thước font ở đây
                editable: false,
                textAlign: 'center'
            },
            new go.Binding('text', 'text')
        )
    );


    // Link template với đường đi rõ ràng, tránh đè node
    diagram.linkTemplate = $(
        go.Link,
        {
            routing: go.Link.AvoidsNodes,   // ✅ Né node
            curve: go.Link.JumpGap,         // ✅ Nhảy qua nếu trùng
            corner: 10,                     // ✅ Bo góc rõ
            fromShortLength: 12,           // ✅ Tạo khoảng cách ra khỏi node
            toShortLength: 12,
        },
        $(go.Shape, { strokeWidth: 1.5, stroke: '#666' }),
        $(go.Shape, { toArrow: 'Standard', stroke: '#666', fill: '#666' })
    );

    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    return diagram;
};

export default function SwimlaneHorizontal() {
    return (
        <div style={{ width: '100%', height: '100%', overflow: 'auto', border: '1px solid #ccc' }}>
            <ReactDiagram
                initDiagram={initDiagram}
                divClassName="swimlane-horizontal"
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
}
