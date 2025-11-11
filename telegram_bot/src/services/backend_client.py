"""
Backend Service Client
"""
import logging
import httpx
import os
from typing import Optional, Dict, List
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8001")


class BackendClient:
    """Client for Backend Service API"""
    
    def __init__(self, base_url: str = BACKEND_URL):
        self.base_url = base_url
        self.timeout = 30.0
    
    async def register(self, username: str, email: str, password: str) -> Optional[Dict]:
        """Register a new user"""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/v1/users/register",
                    json={
                        "username": username,
                        "email": email,
                        "password": password
                    }
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"Registration failed: {e.response.text}")
            return None
        except Exception as e:
            logger.error(f"Registration error: {e}")
            return None
    
    async def login(self, email: str, password: str) -> Optional[str]:
        """Login and get access token"""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/v1/users/login",
                    data={
                        "username": email, 
                        "password": password
                    }
                )
                response.raise_for_status()
                data = response.json()
                return data.get("access_token")
        except httpx.HTTPStatusError as e:
            logger.error(f"Login failed: {e.response.text}")
            return None
        except Exception as e:
            logger.error(f"Login error: {e}")
            return None
    
    async def get_profile(self, token: str) -> Optional[Dict]:
        """Get user profile"""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.base_url}/api/v1/users/me",
                    headers={"Authorization": f"Bearer {token}"}
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"Get profile error: {e}")
            return None
    
    async def generate_course(self, token: str, query: str) -> Optional[Dict]:
        """Generate a course"""
        try:
            async with httpx.AsyncClient(timeout=300.0) as client:  
                response = await client.post(
                    f"{self.base_url}/api/v1/courses/generate",
                    headers={"Authorization": f"Bearer {token}"},
                    json={"query": query}
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"Course generation failed: {e.response.text}")
            return None
        except Exception as e:
            logger.error(f"Course generation error: {e}")
            return None
    
    async def get_my_courses(self, token: str) -> List[Dict]:
        """Get user's courses"""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.base_url}/api/v1/courses/user/my-courses",
                    headers={"Authorization": f"Bearer {token}"}
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"Get courses error: {e}")
            return []
    
    async def get_course(self, course_id: int) -> Optional[Dict]:
        """Get course by ID"""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.base_url}/api/v1/courses/{course_id}"
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"Get course error: {e}")
            return None

