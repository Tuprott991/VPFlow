import json
import logging
from gremlin_python.driver import client
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection
from gremlin_python.process.anonymous_traversal import traversal
from gremlin_python.process.graph_traversal import __
from gremlin_python.process.traversal import T
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class NeptuneClient:
    """
    Client class for interacting with Amazon Neptune graph database
    """
    
    def __init__(self, neptune_endpoint, port=8182):
        """
        Initialize Neptune client
        
        Args:
            neptune_endpoint (str): Neptune cluster endpoint
            port (int): Port number (default: 8182)
        """
        self.neptune_endpoint = neptune_endpoint
        self.port = port
        self.connection = None
        self.g = None
        
    def connect(self):
        """
        Establish connection to Neptune
        """
        try:
            # Create connection string
            connection_string = f'wss://{self.neptune_endpoint}:{self.port}/gremlin'
            
            # Create remote connection
            self.connection = DriverRemoteConnection(connection_string, 'g')
            
            # Create traversal source
            self.g = traversal().withRemote(self.connection)
            
            logger.info(f"Connected to Neptune at {self.neptune_endpoint}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to connect to Neptune: {str(e)}")
            return False
    
    def disconnect(self):
        """
        Close Neptune connection
        """
        if self.connection:
            self.connection.close()
            logger.info("Disconnected from Neptune")
    
    def get_all_vertices(self, limit=100):
        """
        Get all vertices from the graph
        
        Args:
            limit (int): Maximum number of vertices to return
            
        Returns:
            list: List of vertices
        """
        try:
            vertices = self.g.V().limit(limit).valueMap(True).toList()
            logger.info(f"Retrieved {len(vertices)} vertices")
            return vertices
        except Exception as e:
            logger.error(f"Error getting vertices: {str(e)}")
            return []
    
    def get_vertices_by_label(self, label, limit=100):
        """
        Get vertices by label
        
        Args:
            label (str): Vertex label to filter by
            limit (int): Maximum number of vertices to return
            
        Returns:
            list: List of vertices with specified label
        """
        try:
            vertices = self.g.V().hasLabel(label).limit(limit).valueMap(True).toList()
            logger.info(f"Retrieved {len(vertices)} vertices with label '{label}'")
            return vertices
        except Exception as e:
            logger.error(f"Error getting vertices by label: {str(e)}")
            return []
    
    def get_vertex_by_id(self, vertex_id):
        """
        Get vertex by ID
        
        Args:
            vertex_id: Vertex ID
            
        Returns:
            dict: Vertex data
        """
        try:
            vertex = self.g.V(vertex_id).valueMap(True).next()
            logger.info(f"Retrieved vertex with ID: {vertex_id}")
            return vertex
        except Exception as e:
            logger.error(f"Error getting vertex by ID: {str(e)}")
            return None
    
    def get_all_edges(self, limit=100):
        """
        Get all edges from the graph
        
        Args:
            limit (int): Maximum number of edges to return
            
        Returns:
            list: List of edges
        """
        try:
            edges = self.g.E().limit(limit).valueMap(True).toList()
            logger.info(f"Retrieved {len(edges)} edges")
            return edges
        except Exception as e:
            logger.error(f"Error getting edges: {str(e)}")
            return []
    
    def get_edges_by_label(self, label, limit=100):
        """
        Get edges by label
        
        Args:
            label (str): Edge label to filter by
            limit (int): Maximum number of edges to return
            
        Returns:
            list: List of edges with specified label
        """
        try:
            edges = self.g.E().hasLabel(label).limit(limit).valueMap(True).toList()
            logger.info(f"Retrieved {len(edges)} edges with label '{label}'")
            return edges
        except Exception as e:
            logger.error(f"Error getting edges by label: {str(e)}")
            return []
    
    def get_vertex_neighbors(self, vertex_id, direction='both', limit=50):
        """
        Get neighbors of a vertex
        
        Args:
            vertex_id: Vertex ID
            direction (str): Direction ('in', 'out', 'both')
            limit (int): Maximum number of neighbors to return
            
        Returns:
            list: List of neighboring vertices
        """
        try:
            if direction == 'in':
                neighbors = self.g.V(vertex_id).in_().limit(limit).valueMap(True).toList()
            elif direction == 'out':
                neighbors = self.g.V(vertex_id).out().limit(limit).valueMap(True).toList()
            else:  # both
                neighbors = self.g.V(vertex_id).both().limit(limit).valueMap(True).toList()
            
            logger.info(f"Retrieved {len(neighbors)} neighbors for vertex {vertex_id}")
            return neighbors
        except Exception as e:
            logger.error(f"Error getting neighbors: {str(e)}")
            return []
    
    def get_shortest_path(self, source_id, target_id):
        """
        Get shortest path between two vertices
        
        Args:
            source_id: Source vertex ID
            target_id: Target vertex ID
            
        Returns:
            list: Shortest path
        """
        try:
            path = self.g.V(source_id).repeat(__.out().simplePath()).until(__.hasId(target_id)).path().limit(1).toList()
            if path:
                logger.info(f"Found path from {source_id} to {target_id}")
                return path[0]
            else:
                logger.info(f"No path found from {source_id} to {target_id}")
                return None
        except Exception as e:
            logger.error(f"Error finding shortest path: {str(e)}")
            return None
    
    def search_vertices_by_property(self, property_name, property_value, limit=100):
        """
        Search vertices by property value
        
        Args:
            property_name (str): Property name to search
            property_value: Property value to match
            limit (int): Maximum number of vertices to return
            
        Returns:
            list: List of matching vertices
        """
        try:
            vertices = self.g.V().has(property_name, property_value).limit(limit).valueMap(True).toList()
            logger.info(f"Found {len(vertices)} vertices with {property_name}='{property_value}'")
            return vertices
        except Exception as e:
            logger.error(f"Error searching vertices by property: {str(e)}")
            return []
    
    def get_vertex_count(self):
        """
        Get total count of vertices
        
        Returns:
            int: Number of vertices
        """
        try:
            count = self.g.V().count().next()
            logger.info(f"Total vertices: {count}")
            return count
        except Exception as e:
            logger.error(f"Error getting vertex count: {str(e)}")
            return 0
    
    def get_edge_count(self):
        """
        Get total count of edges
        
        Returns:
            int: Number of edges
        """
        try:
            count = self.g.E().count().next()
            logger.info(f"Total edges: {count}")
            return count
        except Exception as e:
            logger.error(f"Error getting edge count: {str(e)}")
            return 0
    
    def execute_custom_query(self, query_string):
        """
        Execute custom Gremlin query
        
        Args:
            query_string (str): Gremlin query string
            
        Returns:
            list: Query results
        """
        try:
            # This is a simplified approach - in production, use proper query building
            logger.warning("Executing custom query - ensure query is safe")
            results = eval(f"self.g.{query_string}").toList()
            logger.info(f"Custom query returned {len(results)} results")
            return results
        except Exception as e:
            logger.error(f"Error executing custom query: {str(e)}")
            return []

def create_workflow_diagram_from_neptune(neptune_endpoint, workflow_id=None):
    """
    Create workflow diagram from Neptune data
    
    Args:
        neptune_endpoint (str): Neptune cluster endpoint
        workflow_id (str): Specific workflow ID to query (optional)
        
    Returns:
        dict: Workflow diagram data
    """
    client = NeptuneClient(neptune_endpoint)
    
    try:
        # Connect to Neptune
        if not client.connect():
            return {"error": "Failed to connect to Neptune"}
        
        # Get workflow data
        if workflow_id:
            # Get specific workflow
            workflow_vertices = client.search_vertices_by_property('workflow_id', workflow_id)
        else:
            # Get all workflow vertices
            workflow_vertices = client.get_vertices_by_label('workflow')
        
        # Get workflow steps/tasks
        task_vertices = client.get_vertices_by_label('task')
        
        # Get relationships between tasks
        workflow_edges = client.get_edges_by_label('next_step')
        dependency_edges = client.get_edges_by_label('depends_on')
        
        # Build diagram data structure
        diagram_data = {
            'workflows': [],
            'tasks': [],
            'connections': [],
            'metadata': {
                'total_workflows': len(workflow_vertices),
                'total_tasks': len(task_vertices),
                'total_connections': len(workflow_edges) + len(dependency_edges)
            }
        }
        
        # Process workflows
        for workflow in workflow_vertices:
            diagram_data['workflows'].append({
                'id': workflow.get(T.id),
                'name': workflow.get('name', ['Unknown'])[0] if workflow.get('name') else 'Unknown',
                'description': workflow.get('description', [''])[0] if workflow.get('description') else '',
                'status': workflow.get('status', ['active'])[0] if workflow.get('status') else 'active',
                'created_at': workflow.get('created_at', [''])[0] if workflow.get('created_at') else '',
                'properties': workflow
            })
        
        # Process tasks
        for task in task_vertices:
            diagram_data['tasks'].append({
                'id': task.get(T.id),
                'name': task.get('name', ['Unknown'])[0] if task.get('name') else 'Unknown',
                'type': task.get('type', ['generic'])[0] if task.get('type') else 'generic',
                'status': task.get('status', ['pending'])[0] if task.get('status') else 'pending',
                'duration': task.get('duration', [0])[0] if task.get('duration') else 0,
                'properties': task
            })
        
        # Process connections
        for edge in workflow_edges + dependency_edges:
            diagram_data['connections'].append({
                'id': edge.get(T.id),
                'source': edge.get('source_id'),
                'target': edge.get('target_id'),
                'type': edge.get(T.label),
                'properties': edge
            })
        
        logger.info(f"Created diagram with {len(diagram_data['workflows'])} workflows and {len(diagram_data['tasks'])} tasks")
        return diagram_data
        
    except Exception as e:
        logger.error(f"Error creating workflow diagram: {str(e)}")
        return {"error": str(e)}
    
    finally:
        client.disconnect()

def main():
    """
    Main function to demonstrate Neptune queries
    """
    # Replace with your Neptune endpoint
    NEPTUNE_ENDPOINT = "your-neptune-cluster.cluster-xxxxx.region.neptune.amazonaws.com"
    
    # Create client
    client = NeptuneClient(NEPTUNE_ENDPOINT)
    
    try:
        # Connect
        if client.connect():
            
            # Example queries
            print("=== Neptune Database Stats ===")
            print(f"Total vertices: {client.get_vertex_count()}")
            print(f"Total edges: {client.get_edge_count()}")
            
            print("\n=== Sample Vertices ===")
            vertices = client.get_all_vertices(limit=5)
            for vertex in vertices:
                print(f"Vertex ID: {vertex.get(T.id)}")
                print(f"Label: {vertex.get(T.label)}")
                print(f"Properties: {vertex}")
                print("-" * 40)
            
            print("\n=== Sample Edges ===")
            edges = client.get_all_edges(limit=5)
            for edge in edges:
                print(f"Edge ID: {edge.get(T.id)}")
                print(f"Label: {edge.get(T.label)}")
                print(f"Properties: {edge}")
                print("-" * 40)
            
            # Create workflow diagram
            print("\n=== Creating Workflow Diagram ===")
            diagram = create_workflow_diagram_from_neptune(NEPTUNE_ENDPOINT)
            print(json.dumps(diagram, indent=2, default=str))
            
    except Exception as e:
        logger.error(f"Error in main: {str(e)}")
    
    finally:
        client.disconnect()

if __name__ == "__main__":
    main()