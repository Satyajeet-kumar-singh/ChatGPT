
import os
import sqlite3
from pathlib import Path
from dotenv import load_dotenv
import certifi

os.environ["SSL_CERT_FILE"] = certifi.where()
os.environ["REQUESTS_CA_BUNDLE"] = certifi.where()

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage
from langgraph.graph import StateGraph, START, MessagesState
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.checkpoint.sqlite import SqliteSaver
from tool import tools

load_dotenv()
Path("data").mkdir(exist_ok=True)

DEFAULT_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

ALLOWED_MODELS = {
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3.6-27b",
    "qwen/qwen3.8-27b",
}

SYSTEM_PROMPT = """
You are a helpful Agentic AI assistant named ChatGPT, similar to ChatGPT.

You can:
1. Answer normal questions.
2. Use tools when needed.
3. Search uploaded documents using the RAG tool.
4. Search the web for latest/current information using Tavily Search.
5. Get current weather information for a city.
6. Get the latest stock price for a stock symbol.
7. Remember important user information using the memory tool.
8. Recall saved memory when useful.
9. Use calculator for math.

TOOLS AND WHEN TO USE THEM:

1. calculator
- Use calculator for mathematical calculations.
- Use it when the user asks to calculate, solve, evaluate, or perform arithmetic.
- Do not manually calculate when using the calculator tool would be more reliable.

2. search_uploaded_documents
- Use this when the user asks about an uploaded PDF, DOCX, TXT, MD, PY, CSV, notes, files, or documents.
- Search the uploaded documents for the answer.
- Do not use general web search instead when the required information is available in the uploaded documents.

3. remember_this
- Use this when the user explicitly asks you to remember, save, store, or keep some information for future use.
- Save only the information the user wants remembered.

4. recall_memory
- Use this when the user asks about something previously remembered, saved preferences, saved facts, or previous information stored in memory.

5. get_news
- Use this for latest news, current events, recent updates, today's news, breaking news, or other time-sensitive news.
- If the user specifies a city, pass that city to the tool.
- If no city is specified, search for relevant latest news.
- Do not answer time-sensitive news questions from your own knowledge.

6. get_weather
- Use this when the user asks for current weather, temperature, weather conditions, or today's weather for a city.
- Pass the city name to the tool.
- Do not guess current weather from your own knowledge.

7. get_stock_price
- Use this when the user asks for the current/latest stock price or stock market quote of a company.
- Pass the stock ticker symbol to the tool.
- If the user gives a company name instead of a ticker symbol, determine the appropriate ticker symbol before calling the tool when possible.
- Do not provide a current stock price from memory.

GENERAL RULES:
- Choose the appropriate tool based on the user's request.
- Use a tool when the requested information requires current, external, uploaded-document, calculation, or saved-memory information.
- Do not use a tool unnecessarily for normal conversational questions.
- When a tool is used, use its result to formulate the final answer.
- Do not claim that you used a tool if you did not actually use it.
- Be clear, helpful, and concise.
"""


def normalize_model_name(model_name:str|None) ->str:
    """
    Validate selected model from frontend.
    If model is missing or not allowed, fallback to DEFAULT_MODEL.
    """

    if not model_name:
        return DEFAULT_MODEL

    model_name = model_name.strip()

    if not model_name in ALLOWED_MODELS:
        return DEFAULT_MODEL

    return model_name


def build_agent(model_name:str):
    """
    Build one LangGraph agent for a selected Gemini model.
    """

    selected_model = normalize_model_name(model_name)

    # Initialize ChatGoogleGenerativeAI
    llm = ChatGroq(
        model=selected_model,
        temperature=0.3,
        streaming=True
    )

    llm_with_tools = llm.bind_tools(tools)

    def chatbot_node(state:MessagesState):
        messages = [SystemMessage(content=SYSTEM_PROMPT)] + state["messages"]

        response = llm_with_tools.invoke(messages)

        return {
            "messages": [response]
        }

    tool_node = ToolNode(tools)

    workflow = StateGraph(MessagesState)

    workflow.add_node("chatbot",chatbot_node)
    workflow.add_node("tools",tool_node)

    workflow.add_edge(START,"chatbot")
    workflow.add_conditional_edges("chatbot",tools_condition)
    workflow.add_edge("tools","chatbot")

    conn = sqlite3.connect(
    database="data/langgraph_checkpoints.sqlite",
    check_same_thread=False
    )

    checkpointer = SqliteSaver(conn)

    return workflow.compile(checkpointer=checkpointer)

_AGENT_CACHE = {}

def get_agent(model_name:str|None=None):
    """
    Return cached LangGraph agent for selected model.
    If not created yet, create it once and reuse it.
    """

    selected_model = normalize_model_name(model_name)

    if selected_model not in _AGENT_CACHE:
        _AGENT_CACHE[selected_model] = build_agent(selected_model)

    return _AGENT_CACHE[selected_model]
