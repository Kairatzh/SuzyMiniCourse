import os
import yaml
from langchain_together import Together

config_path = os.path.normpath("C:/Users/User/Desktop/projects/SuzyMiniCourse/ai_service/config/model_config.yaml")

with open(config_path, 'r', encoding='utf-8') as f:
    config = yaml.safe_load(f)

llm_s = Together(
    model=config['together']['model'],
    together_api_key=os.getenv('TOGETHER_API_KEY', config['together']['api_key']),
    max_tokens=config['together']['max_tokens'],
    temperature=config['together']['temperature']
)

llm_t = Together(
    model=config['together']['model'],
    together_api_key=os.getenv('TOGETHER_API_KEY', config['together']['api_key']),
    max_tokens=2000,
    temperature=0.4
)