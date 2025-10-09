import os
import yaml
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI 

config_path = os.path.normpath("C:/Users/User/Desktop/projects/SuzyMiniCourse/ai_service/config/model_config.yaml")

def load_configs(path=config_path):
    load_dotenv()
    with open(path, 'r') as f:
        raw = f.read()
    resolved = os.path.expandvars(raw)
    return yaml.safe_load(resolved)

config = load_configs()

def create_openrouter_llm(model_name, max_tokens, temperature):
    return ChatOpenAI(
        model=model_name,
        openai_api_key=os.getenv("OPENROUTER_API_KEY", config["openrouter"]["api_key"]),
        openai_api_base="https://openrouter.ai/api/v1",
        max_tokens=max_tokens,
        temperature=temperature,
    )

llm_s = create_openrouter_llm(
    model_name=config["openrouter"]["model"],
    max_tokens=config["openrouter"]["max_tokens"],
    temperature=config["openrouter"]["temperature"],
)

llm_t = create_openrouter_llm(
    model_name=config["openrouter"]["model"],
    max_tokens=400,
    temperature=0.4,
)
