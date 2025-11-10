"""
Neo4j database connection for knowledge graph
"""
import logging
from neo4j import GraphDatabase
import os
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "neo4j")

_driver = None


def init_neo4j_driver():
    """
    Initialize Neo4j driver
    """
    global _driver
    if _driver is None:
        try:
            _driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
            # Verify connectivity
            _driver.verify_connectivity()
            logger.info("Neo4j driver initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Neo4j driver: {e}")
            raise
    return _driver


def get_neo4j_driver():
    """
    Get Neo4j driver instance
    """
    global _driver
    if _driver is None:
        return init_neo4j_driver()
    return _driver


def close_neo4j_driver():
    """
    Close Neo4j driver
    """
    global _driver
    if _driver is not None:
        try:
            _driver.close()
            logger.info("Neo4j driver closed")
        except Exception as e:
            logger.error(f"Error closing Neo4j driver: {e}")
        finally:
            _driver = None


from contextlib import contextmanager

@contextmanager
def get_neo4j_session():
    """
    Get Neo4j session with proper cleanup
    Usage:
        with get_neo4j_session() as session:
            result = session.run("MATCH (n) RETURN n")
    """
    driver = get_neo4j_driver()
    session = driver.session()
    try:
        yield session
    finally:
        session.close()

