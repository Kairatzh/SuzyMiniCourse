from langchain_openai import OpenAI

llm_s = OpenAI(model="", temperature=0.3, max_tokens=500, api_key="")
llm_t = OpenAI(model="", temperature=0.4, max_tokens=400, api_key="")
