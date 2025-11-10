"""
Service for Neo4j knowledge graph operations
"""

from typing import List, Dict, Optional
from backend_service.src.database.neo4j_db import get_neo4j_session


class Neo4jService:
    
    def create_course_node(self, course_id: int, title: str, topic: str, category: Optional[str] = None):
        """
        Create a course node in Neo4j graph
        
        Args:
            course_id: Course ID from PostgreSQL
            title: Course title
            topic: Course topic
            category: Optional category name
        """
        with get_neo4j_session() as session:
            query = """
            CREATE (c:Course {
                id: $course_id,
                title: $title,
                topic: $topic,
                category: COALESCE($category, 'Uncategorized')
            })
            """
            session.run(query, course_id=course_id, title=title, topic=topic, category=category)
    
    def create_category_relationship(self, course_id: int, category: str):
        """
        Create BELONGS_TO relationship between course and category
        
        Args:
            course_id: Course ID
            category: Category name
        """
        with get_neo4j_session() as session:
            query = """
            MERGE (cat:Category {name: $category})
            WITH cat
            MATCH (c:Course {id: $course_id})
            MERGE (c)-[:BELONGS_TO]->(cat)
            """
            session.run(query, course_id=course_id, category=category)
    
    def create_user_course_relationship(self, user_id: int, course_id: int):
        """
        Create CREATED relationship between user and course
        
        Args:
            user_id: User ID
            course_id: Course ID
        """
        with get_neo4j_session() as session:
            query = """
            MERGE (u:User {id: $user_id})
            WITH u
            MATCH (c:Course {id: $course_id})
            MERGE (u)-[:CREATED]->(c)
            """
            session.run(query, user_id=user_id, course_id=course_id)
    
    def create_similar_relationship(self, course_id1: int, course_id2: int, similarity_score: float = 0.7):
        """
        Create SIMILAR_TO relationship between courses
        
        Args:
            course_id1: First course ID
            course_id2: Second course ID
            similarity_score: Similarity score (0-1)
        """
        with get_neo4j_session() as session:
            query = """
            MATCH (c1:Course {id: $course_id1})
            MATCH (c2:Course {id: $course_id2})
            WHERE c1 <> c2
            MERGE (c1)-[r:SIMILAR_TO {score: $score}]->(c2)
            """
            session.run(query, course_id1=course_id1, course_id2=course_id2, score=similarity_score)
    
    def get_course_graph(self, course_id: Optional[int] = None) -> Dict:
        """
        Get knowledge graph data for visualization
        
        Args:
            course_id: Optional course ID to get graph for specific course
            
        Returns:
            Dictionary with nodes and edges
        """
        with get_neo4j_session() as session:
            if course_id:
                query = """
                MATCH (c:Course {id: $course_id})
                OPTIONAL MATCH path = (c)-[*1..2]-(connected)
                RETURN c, collect(DISTINCT path) as paths
                """
                result = session.run(query, course_id=course_id)
            else:
                query = """
                MATCH (n)
                OPTIONAL MATCH (n)-[r]->(m)
                RETURN n, collect(DISTINCT {type: type(r), target: m}) as relationships
                LIMIT 100
                """
                result = session.run(query)
            
            nodes = []
            edges = []
            node_ids = set()
            
            for record in result:
                if course_id:
                    course = record["c"]
                    if course:
                        node_id = f"course_{course['id']}"
                        if node_id not in node_ids:
                            nodes.append({
                                "id": node_id,
                                "label": course.get("title", ""),
                                "type": "Course",
                                "data": dict(course)
                            })
                            node_ids.add(node_id)
                else:
                    node = record["n"]
                    if node:
                        node_type = list(node.labels)[0] if node.labels else "Node"
                        node_id = f"{node_type.lower()}_{node['id']}" if 'id' in node else str(node.id)
                        
                        if node_id not in node_ids:
                            nodes.append({
                                "id": node_id,
                                "label": node.get("title") or node.get("name") or str(node_id),
                                "type": node_type,
                                "data": dict(node)
                            })
                            node_ids.add(node_id)
            
            query_edges = """
            MATCH (a)-[r]->(b)
            RETURN a, type(r) as rel_type, b
            LIMIT 200
            """
            result_edges = session.run(query_edges)
            
            for record in result_edges:
                source = record["a"]
                target = record["b"]
                rel_type = record["rel_type"]
                
                source_type = list(source.labels)[0] if source.labels else "Node"
                target_type = list(target.labels)[0] if target.labels else "Node"
                
                source_id = f"{source_type.lower()}_{source['id']}" if 'id' in source else str(source.id)
                target_id = f"{target_type.lower()}_{target['id']}" if 'id' in target else str(target.id)
                
                edges.append({
                    "source": source_id,
                    "target": target_id,
                    "type": rel_type
                })
            
            return {"nodes": nodes, "edges": edges}
    
    def delete_course_node(self, course_id: int):
        """
        Delete course node and its relationships
        
        Args:
            course_id: Course ID
        """
        with get_neo4j_session() as session:
            query = """
            MATCH (c:Course {id: $course_id})
            DETACH DELETE c
            """
            session.run(query, course_id=course_id)

