"""
AI Service Client
"""
import logging
import httpx
import os
from typing import Optional, Dict
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://localhost:8000")


class AIServiceClient:
    """Client for AI Service API"""
    
    def __init__(self, base_url: str = AI_SERVICE_URL):
        self.base_url = base_url
        self.timeout = 300.0  # Long timeout for AI generation
    
    async def generate_or_chat(self, query: str) -> Optional[Dict]:
        """Generate course or chat response"""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/v1/generate_main/generate",
                    json={"query": query}
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"AI service error: {e.response.text}")
            return None
        except Exception as e:
            logger.error(f"AI service error: {e}")
            return None

