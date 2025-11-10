"""
Client for calling AI Service API
"""

import httpx
import os
from typing import Dict, List
from dotenv import load_dotenv

load_dotenv()

AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://localhost:8000")


class AIServiceClient:
    
    def __init__(self, base_url: str = AI_SERVICE_URL):
        self.base_url = base_url
        self.timeout = 300.0  
    
    async def generate_course(self, query: str) -> Dict:
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/v1/generate_main/generate",
                    json={"query": query}
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            raise Exception(f"AI Service error: {str(e)}")
        except Exception as e:
            raise Exception(f"Failed to generate course: {str(e)}")

