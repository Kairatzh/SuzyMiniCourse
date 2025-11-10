import os
from dotenv import load_dotenv
import yaml
from langchain_openai import OpenAI

config_path = os.path.normpath("C:/Users/User/Desktop/projects/SuzyMiniCourse/ai_service/config/model_config.yaml")

def load_configs(path=config_path):
    load_dotenv()
    with open(path, 'r') as f:
        raw = f.read()
    resolved = os.path.expandvars(raw)
    return yaml.safe_load(resolved)

config = load_configs()

llm_s = OpenAI(
    model=config['openai']['model'],
    temperature=config['openai']['temperature'],
    max_tokens=config['openai']['max_tokens'],
    api_key=os.getenv('OPENAI_API_KEY', config['openai']['api_key'])
)

llm_t = OpenAI(
    model=config['openai_tests']['model'],
    temperature=config['openai_tests']['temperature'],
    max_tokens=config['openai_tests']['max_tokens'],
    api_key=os.getenv('OPENAI_API_KEY', config['openai_tests']['api_key'])
)
