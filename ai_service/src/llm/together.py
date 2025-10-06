from langchain_together import Together

llm_s = Together(model="", together_api_key="", max_tokens=500, temperature=0.3)
llm_t = Together(model="", together_api_key="", max_tokens=400, temperature=0.4)