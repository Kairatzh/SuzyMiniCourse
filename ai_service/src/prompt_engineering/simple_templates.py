from langchain_core.prompts import PromptTemplate

template_s = ""
prompt_simple = PromptTemplate(
    template=template_s,
    input_variables=["query"]
)
