import os
import yaml
from pathlib import Path
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

CONFIG_DIR = Path(__file__).parent.parent.parent / "config"
config_path = CONFIG_DIR / "model_config.yaml"

def load_configs(path=None):
    """
    Load configuration from YAML file
    Uses relative path from current file location
    """
    load_dotenv()
    if path is None:
        path = config_path
    
    if not Path(path).exists():
        alt_path = Path(__file__).parent.parent.parent / "config" / "model_config.yaml"
        if alt_path.exists():
            path = alt_path
        else:
            raise FileNotFoundError(f"Config file not found: {path}")
    
    with open(path, 'r', encoding='utf-8') as f:
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
    max_tokens=2000,
    temperature=0.4,
)
