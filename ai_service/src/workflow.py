from ai_service.src.agents.agent_gen import generate_c

def main_workflow(query: str):
    try:
        result = generate_c(query)
        return {
            "success": True,
            "data": {
                "summary": result.summary,
                "tests": result.tests,
                "videos": result.videos
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "data": {
                "summary": "",
                "tests": [],
                "videos": []
            }
        }