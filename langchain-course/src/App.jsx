import { useState } from "react";

const modules = [
  {
    id: 1,
    icon: "⚙️",
    tag: "BASICS",
    level: "Beginner",
    duration: "20 min",
    title: "Setup & Installation",
    color: "#00ff88",
    sections: [
      {
        type: "concept",
        title: "What is LangChain?",
        body: `LangChain is an open-source Python & JS framework that makes it easy to build applications powered by Large Language Models (LLMs). Instead of writing boilerplate code to call APIs, parse responses, and manage state, LangChain gives you composable building blocks.

Think of it like LEGO for AI apps — you snap together Models, Prompts, Chains, Memory, and Agents.

WHY USE LANGCHAIN?
→ Standardized interface for 50+ LLM providers
→ Composable pipelines with one line of code  
→ Built-in memory, retrieval (RAG), and agents
→ Production-ready streaming, batching, async support`,
      },
      {
        type: "arch",
        title: "Core Architecture",
        items: [
          {
            name: "Models",
            desc: "LLMs, Chat Models, Embeddings — the AI brain",
            icon: "🧠",
          },
          {
            name: "Prompts",
            desc: "Reusable templates to guide model behavior",
            icon: "📝",
          },
          {
            name: "Chains",
            desc: "Sequences of operations via LCEL pipe syntax",
            icon: "⛓️",
          },
          {
            name: "Memory",
            desc: "Persist conversation history across calls",
            icon: "💾",
          },
          {
            name: "Retrievers",
            desc: "Fetch relevant documents for RAG apps",
            icon: "🔍",
          },
          {
            name: "Agents",
            desc: "LLMs that choose which tools to call",
            icon: "🤖",
          },
        ],
      },
      {
        type: "code",
        title: "Installation & First Call",
        explanation:
          "Install LangChain and its OpenAI integration. Always store your API key in a .env file — never hardcode it in source code.",
        code: `# Step 1: Install
pip install langchain langchain-openai python-dotenv

# Step 2: .env file
OPENAI_API_KEY=sk-your-key-here

# Step 3: First app
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

llm = ChatOpenAI(
    model="gpt-4o-mini",   # cheap + fast
    temperature=0.7,        # 0=deterministic, 1=creative
    max_tokens=300
)

# Single call
response = llm.invoke("What is LangChain?")
print(response.content)     # the text
print(response.usage_metadata)  # token usage

# Batch (multiple inputs at once)
results = llm.batch(["Explain Python", "Explain JS"])
for r in results:
    print(r.content)

# Streaming (token by token)
for chunk in llm.stream("Count from 1 to 5"):
    print(chunk.content, end="", flush=True)`,
        output: `LangChain is a framework for building LLM-powered apps
with composable components for chains, memory, and agents.

{'input_tokens': 15, 'output_tokens': 32}

Python is a versatile high-level programming language...
JavaScript is the language of the web...

1... 2... 3... 4... 5...`,
      },
      {
        type: "tips",
        title: "Key Takeaways",
        items: [
          "Always use python-dotenv — never hardcode API keys",
          "temperature=0 for factual tasks, 0.7+ for creative tasks",
          "gpt-4o-mini is 10x cheaper than gpt-4o — perfect for dev",
          "llm.invoke() returns AIMessage — use .content for the string",
          "Use .batch() for parallel calls to save time",
        ],
      },
    ],
  },
  {
    id: 2,
    icon: "📝",
    tag: "BASICS",
    level: "Beginner",
    duration: "25 min",
    title: "Prompt Templates",
    color: "#00d4ff",
    sections: [
      {
        type: "concept",
        title: "Why Templates?",
        body: `Hardcoding prompts is fragile and not reusable. PromptTemplates let you define a prompt ONCE with variables, then fill them at runtime.

BENEFITS:
→ Reusability — define once, use everywhere
→ Composability — templates slot into LCEL chains
→ Type safety — know exactly what inputs are needed
→ Versioning — easy to A/B test different prompts

THREE TEMPLATE TYPES:
1. PromptTemplate         → single string with variables
2. ChatPromptTemplate     → role-based messages (System/Human/AI)
3. FewShotPromptTemplate  → include examples for in-context learning`,
      },
      {
        type: "code",
        title: "PromptTemplate & ChatPromptTemplate",
        explanation:
          "PromptTemplate uses {variable} placeholders. ChatPromptTemplate defines role-based messages — this is the most common pattern in production apps.",
        code: `from langchain_core.prompts import (
    PromptTemplate,
    ChatPromptTemplate,
    MessagesPlaceholder
)
from langchain_core.messages import HumanMessage, AIMessage
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model="gpt-4o-mini")

# ── 1. Basic PromptTemplate ──────────────────────────
t = PromptTemplate.from_template(
    "Write a {tone} description for: {product}"
)
print(t.input_variables)  # ['tone', 'product']
chain = t | llm | StrOutputParser()
result = chain.invoke({"product": "wireless earbuds", "tone": "exciting"})
print(result)

# ── 2. ChatPromptTemplate ────────────────────────────
chat = ChatPromptTemplate.from_messages([
    ("system", "You are a {role}. Respond in {language}."),
    ("human",  "{question}"),
])
chain2 = chat | llm | StrOutputParser()
result2 = chain2.invoke({
    "role": "Python expert", "language": "simple English",
    "question": "What is a decorator?"
})
print(result2)

# ── 3. MessagesPlaceholder (inject history) ──────────
history_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are helpful."),
    MessagesPlaceholder("history"),
    ("human", "{input}")
])
chain3 = history_prompt | llm | StrOutputParser()
result3 = chain3.invoke({
    "history": [
        HumanMessage("My name is Alice"),
        AIMessage("Nice to meet you, Alice!"),
    ],
    "input": "What's my name?"
})
print(result3)  # "Your name is Alice!"

# ── 4. Partial — pre-fill a variable ────────────────
base = PromptTemplate.from_template("Translate '{text}' to {lang}")
to_spanish = base.partial(lang="Spanish")
result4 = (to_spanish | llm | StrOutputParser()).invoke({"text": "Hello"})
print(result4)  # Hola`,
        output: `['tone', 'product']

Experience crystal-clear sound with these incredible 
wireless earbuds — your music, reimagined!

A decorator is a function that wraps another function 
to add extra behaviour without changing its code.

Your name is Alice!

Hola`,
      },
      {
        type: "code",
        title: "Few-Shot Prompting",
        explanation:
          "Give the LLM examples of the task so it learns the pattern. This dramatically improves output quality and consistency for structured tasks.",
        code: `from langchain_core.prompts import (
    FewShotPromptTemplate, PromptTemplate,
    FewShotChatMessagePromptTemplate, ChatPromptTemplate
)
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# ── Few-Shot with string prompts ─────────────────────
examples = [
    {"word": "happy",    "antonym": "sad"},
    {"word": "bright",   "antonym": "dark"},
    {"word": "enormous", "antonym": "tiny"},
]
example_fmt = PromptTemplate(
    input_variables=["word", "antonym"],
    template="Word: {word}\\nAntonym: {antonym}\\n"
)
few_shot = FewShotPromptTemplate(
    examples=examples,
    example_prompt=example_fmt,
    prefix="Give the antonym of each word:",
    suffix="Word: {input}\\nAntonym:",
    input_variables=["input"]
)
result = (few_shot | llm | StrOutputParser()).invoke({"input": "fast"})
print(result)  # slow

# ── Few-Shot with Chat model (better approach) ────────
chat_examples = [
    {"input": "2 + 2",  "output": "4"},
    {"input": "10 / 2", "output": "5"},
]
example_prompt = ChatPromptTemplate.from_messages([
    ("human", "Calculate: {input}"),
    ("ai",    "{output}"),
])
few_shot_chat = FewShotChatMessagePromptTemplate(
    examples=chat_examples, example_prompt=example_prompt
)
final_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a calculator."),
    few_shot_chat,
    ("human", "Calculate: {input}")
])
result2 = (final_prompt | llm | StrOutputParser()).invoke({"input": "144 / 12"})
print(result2)  # 12`,
        output: `slow

12`,
      },
      {
        type: "tips",
        title: "Key Takeaways",
        items: [
          "Use ChatPromptTemplate for all modern chat models",
          "MessagesPlaceholder is essential for multi-turn conversations",
          "partial() pre-fills variables — great for specialized chains",
          "Few-shot examples dramatically improve output consistency",
          "Keep system prompts clear: role + constraints + format",
        ],
      },
    ],
  },
  {
    id: 3,
    icon: "🔄",
    tag: "BASICS",
    level: "Beginner",
    duration: "30 min",
    title: "Output Parsers",
    color: "#ffaa00",
    sections: [
      {
        type: "concept",
        title: "The Output Parsing Problem",
        body: `LLMs return raw text strings. But your app usually needs structured data — JSON, typed objects, lists. Output parsers solve this by:

1. Injecting format instructions into your prompt automatically
2. Parsing the raw LLM text into Python objects
3. Validating the output matches your expected schema

AVAILABLE PARSERS:
→ StrOutputParser       — plain string (most common)
→ JsonOutputParser      — dict/list from JSON text
→ PydanticOutputParser  — validated Python dataclass (best for production)
→ CommaSeparatedListOutputParser — ["a", "b", "c"]`,
      },
      {
        type: "code",
        title: "StrOutputParser & JsonOutputParser",
        explanation:
          "StrOutputParser just extracts .content from AIMessage. JsonOutputParser instructs the LLM to return JSON and parses it automatically — no manual json.loads() needed.",
        code: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import (
    StrOutputParser,
    JsonOutputParser,
    CommaSeparatedListOutputParser
)

llm = ChatOpenAI(model="gpt-4o-mini")

# ── 1. StrOutputParser ───────────────────────────────
chain = (
    ChatPromptTemplate.from_template("Say hello in {language}")
    | llm | StrOutputParser()
)
result = chain.invoke({"language": "Japanese"})
print(type(result))   # <class 'str'>
print(result)         # こんにちは！

# ── 2. JsonOutputParser ──────────────────────────────
json_prompt = ChatPromptTemplate.from_template("""
Extract info from text as JSON with keys: name, age, job
Text: {text}
Return ONLY valid JSON, no explanation.
""")
chain2 = json_prompt | llm | JsonOutputParser()
result2 = chain2.invoke({
    "text": "Sarah Chen is 29 years old, works as a data scientist."
})
print(type(result2))  # <class 'dict'>
print(result2)        # {'name': 'Sarah Chen', 'age': 29, 'job': '...'}
print(result2["name"])

# ── 3. CommaSeparatedListOutputParser ───────────────
list_parser = CommaSeparatedListOutputParser()
chain3 = (
    ChatPromptTemplate.from_template(
        "List 5 Python libraries for {use_case}. "
        "Return only comma-separated names."
    )
    | llm | list_parser
)
result3 = chain3.invoke({"use_case": "data science"})
print(type(result3))  # <class 'list'>
print(result3)`,
        output: `<class 'str'>
こんにちは！ (Konnichiwa!)

<class 'dict'>
{'name': 'Sarah Chen', 'age': 29, 'job': 'data scientist'}
Sarah Chen

<class 'list'>
['pandas', 'numpy', 'scikit-learn', 'matplotlib', 'scipy']`,
      },
      {
        type: "code",
        title: "Pydantic Output Parser",
        explanation:
          "PydanticOutputParser uses Python dataclasses for schema definition. It auto-generates format instructions AND validates types. This is the most robust approach for production apps.",
        code: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# ── 1. Define your schema ────────────────────────────
class MovieReview(BaseModel):
    title: str      = Field(description="Movie title")
    year: int       = Field(description="Release year")
    rating: float   = Field(description="Rating from 0.0 to 10.0")
    genres: List[str] = Field(description="List of genres")
    summary: str    = Field(description="One sentence summary")
    recommended: bool = Field(description="Should people watch it?")

# ── 2. Create parser ─────────────────────────────────
parser = PydanticOutputParser(pydantic_object=MovieReview)

# Parser auto-generates format instructions for the prompt
prompt = ChatPromptTemplate.from_messages([
    ("system", "You extract structured data from text."),
    ("human", "{format_instructions}\\n\\nAnalyze:\\n{movie}")
])

# ── 3. Build + run chain ─────────────────────────────
chain = prompt | llm | parser

result = chain.invoke({
    "format_instructions": parser.get_format_instructions(),
    "movie": "Inception (2010) by Nolan — mind-bending sci-fi thriller. IMDb: 8.8"
})

# result is a REAL Python object, fully validated!
print(type(result))           # <class 'MovieReview'>
print(result.title)           # Inception
print(result.year)            # 2010
print(result.rating)          # 8.8
print(result.genres)          # ['sci-fi', 'thriller']
print(result.recommended)     # True

if result.recommended:
    print(f"✅ Watch: {result.title} ({result.year}) — {result.rating}/10")`,
        output: `<class '__main__.MovieReview'>
Inception
2010
8.8
['sci-fi', 'thriller', 'mystery']
True

✅ Watch: Inception (2010) — 8.8/10`,
      },
      {
        type: "tips",
        title: "Key Takeaways",
        items: [
          "Use PydanticOutputParser for complex structured data in production",
          "get_format_instructions() auto-generates the JSON schema for the prompt",
          "JsonOutputParser is lighter — good for simple one-off dicts",
          "Pydantic validates types — it will error if LLM returns wrong type",
          "Set temperature=0 when using parsers for consistent formatting",
        ],
      },
    ],
  },
  {
    id: 4,
    icon: "⛓️",
    tag: "INTERMEDIATE",
    level: "Intermediate",
    duration: "40 min",
    title: "Chains & LCEL",
    color: "#a855f7",
    sections: [
      {
        type: "concept",
        title: "What is LCEL?",
        body: `LCEL (LangChain Expression Language) is a declarative way to compose components using the | pipe operator. Every component implements the Runnable interface, making them composable.

THE RUNNABLE INTERFACE (every component has this):
→ invoke(input)   — single synchronous call
→ batch([...])    — parallel calls on a list
→ stream(input)   — iterate over output chunks
→ ainvoke()       — async invoke

KEY LCEL UTILITIES:
→ RunnablePassthrough  — passes input unchanged downstream
→ RunnableParallel     — runs multiple chains in parallel
→ RunnableLambda       — wraps any Python function as Runnable
→ itemgetter           — extracts a specific key from a dict`,
      },
      {
        type: "code",
        title: "Basic to Sequential Chains",
        explanation:
          "LCEL chains flow left to right with |. The output of one step feeds into the next. You can chain any number of steps together.",
        code: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from operator import itemgetter

llm = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

# ── 1. Simple 3-step chain ───────────────────────────
prompt = ChatPromptTemplate.from_template(
    "What is the capital of {country}?"
)
chain = prompt | llm | parser
print(chain.invoke({"country": "Japan"}))  # Tokyo

# Visualize the chain
chain.get_graph().print_ascii()

# ── 2. Sequential chaining ───────────────────────────
# Step 1: Generate a fact
fact_prompt = ChatPromptTemplate.from_template(
    "Give one interesting fact about {subject}. One sentence."
)
# Step 2: Translate the fact
trans_prompt = ChatPromptTemplate.from_template(
    "Translate to {language}: {fact}"
)

fact_chain  = fact_prompt  | llm | parser
trans_chain = trans_prompt | llm | parser

# Compose: subject → fact → translated
full_chain = (
    {"fact": fact_chain, "language": itemgetter("language")}
    | trans_chain
)
result = full_chain.invoke({
    "subject": "black holes",
    "language": "French"
})
print(result)

# ── 3. RunnablePassthrough ───────────────────────────
# Pass original input alongside LLM output
chain_with_input = (
    RunnablePassthrough.assign(
        answer=prompt | llm | parser
    )
)
result = chain_with_input.invoke({"country": "Brazil"})
print(result["country"])   # Brazil (original)
print(result["answer"])    # Brasília (LLM output)`,
        output: `Tokyo

PromptTemplate → ChatOpenAI → StrOutputParser

Les trous noirs peuvent déformer l'espace-temps lui-même.

Brazil
Brasília`,
      },
      {
        type: "code",
        title: "Parallel Chains & RunnableLambda",
        explanation:
          "RunnableParallel runs multiple chains simultaneously — halving latency. RunnableLambda wraps any Python function into the chain pipeline for preprocessing or postprocessing.",
        code: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import (
    RunnableParallel, RunnablePassthrough, RunnableLambda
)
import time

llm = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

# ── 1. RunnableParallel ──────────────────────────────
pros_p = ChatPromptTemplate.from_template("List 3 pros of {tech}, briefly.")
cons_p = ChatPromptTemplate.from_template("List 3 cons of {tech}, briefly.")

# Both chains run at the same time!
analysis = RunnableParallel({
    "pros": pros_p | llm | parser,
    "cons": cons_p | llm | parser,
    "topic": RunnablePassthrough() | (lambda x: x["tech"])
})
result = analysis.invoke({"tech": "GraphQL"})
print("Topic:", result["topic"])
print("Pros:", result["pros"])
print("Cons:", result["cons"])

# ── 2. RunnableLambda ────────────────────────────────
def preprocess(data: dict) -> dict:
    """Clean input text and add metadata."""
    text = data["text"].strip()
    return {"text": text, "word_count": len(text.split())}

def add_metadata(response: str) -> dict:
    return {"response": response, "length": len(response)}

prompt = ChatPromptTemplate.from_template(
    "Summarize ({word_count} words): {text}"
)
chain = (
    RunnableLambda(preprocess)
    | prompt | llm | parser
    | RunnableLambda(add_metadata)
)
result2 = chain.invoke({
    "text": "  LangChain is a great framework for LLM apps.  "
})
print(result2)

# ── 3. Conditional routing ───────────────────────────
def route(data):
    if len(data.get("question", "")) < 10:
        return "Too short — please ask a complete question."
    return data

smart = RunnableLambda(route) | llm | parser
print(smart.invoke({"question": "hi"}))`,
        output: `Topic: GraphQL
Pros: 1. Fetch exactly the data you need
2. Single endpoint  3. Strongly typed schema
Cons: 1. Complex caching  2. Steep learning curve
3. Potential N+1 query issues

{'response': 'LangChain is a framework for LLM apps.', 'length': 43}

Too short — please ask a complete question.`,
      },
      {
        type: "tips",
        title: "Key Takeaways",
        items: [
          "| is the LCEL pipe — output of left feeds input of right",
          "RunnableParallel runs branches simultaneously — saves latency",
          "RunnableLambda turns any function into a composable component",
          "itemgetter() extracts dict keys — crucial for multi-input chains",
          "Use .get_graph().print_ascii() to debug complex pipelines",
        ],
      },
    ],
  },
  {
    id: 5,
    icon: "💾",
    tag: "INTERMEDIATE",
    level: "Intermediate",
    duration: "35 min",
    title: "Memory & Chat History",
    color: "#f59e0b",
    sections: [
      {
        type: "concept",
        title: "The Stateless Problem",
        body: `LLMs are stateless — each call is independent. They don't remember anything unless you send the history explicitly. LangChain Memory manages this automatically.

MODERN APPROACH (LangChain v0.2+):
→ Use RunnableWithMessageHistory (old Memory classes are deprecated)

STORAGE BACKENDS:
→ InMemoryChatMessageHistory  — dict in RAM (dev/testing)
→ FileChatMessageHistory      — JSON file (simple persistence)
→ SQLChatMessageHistory       — SQLite / PostgreSQL (production)
→ RedisChatMessageHistory     — Redis (high-scale production)

KEY CONCEPTS:
→ session_id — identifies a conversation (one per user/thread)
→ History    — list of HumanMessage + AIMessage pairs`,
      },
      {
        type: "code",
        title: "RunnableWithMessageHistory",
        explanation:
          "Wrap any chain with RunnableWithMessageHistory. Provide a function to get/create session storage, and LangChain automatically injects history into every call.",
        code: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model="gpt-4o-mini")

# ── 1. Storage (one entry per session_id) ────────────
store = {}

def get_session_history(session_id: str):
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

# ── 2. Prompt with MessagesPlaceholder ───────────────
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant. Be concise."),
    MessagesPlaceholder("history"),   # ← auto-injected
    ("human", "{input}")
])
chain = prompt | llm | StrOutputParser()

# ── 3. Wrap with history ──────────────────────────────
chat = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="history"
)
config = {"configurable": {"session_id": "alice_001"}}

# Turn 1
r1 = chat.invoke({"input": "My name is Alice."}, config=config)
print("T1:", r1)

# Turn 2 — remembers Alice!
r2 = chat.invoke({"input": "What's my name?"}, config=config)
print("T2:", r2)

# Turn 3 — builds further context
r3 = chat.invoke({"input": "I love Python. Suggest a project."}, config=config)
print("T3:", r3)

# ── 4. Inspect history ────────────────────────────────
history = get_session_history("alice_001")
print(f"\\nStored {len(history.messages)} messages")
for msg in history.messages:
    role = "Human" if msg.type == "human" else "AI"
    print(f"  [{role}]: {msg.content[:60]}")`,
        output: `T1: Nice to meet you, Alice!

T2: Your name is Alice!

T3: Since you love Python, try building a web scraper 
with BeautifulSoup + Requests — great for beginners!

Stored 6 messages
  [Human]: My name is Alice.
  [AI]: Nice to meet you, Alice!
  [Human]: What's my name?
  [AI]: Your name is Alice!
  [Human]: I love Python. Suggest a project.
  [AI]: Since you love Python, try building a web scraper...`,
      },
      {
        type: "tips",
        title: "Key Takeaways",
        items: [
          "Use RunnableWithMessageHistory — old Memory classes are deprecated",
          "InMemoryChatMessageHistory for dev, SQLChatMessageHistory for prod",
          "Always use session_id to keep different users' histories separate",
          "Use trim_messages() to avoid hitting context window limits",
          "MessagesPlaceholder in your prompt is where history gets injected",
        ],
      },
    ],
  },
  {
    id: 6,
    icon: "🔍",
    tag: "ADVANCED",
    level: "Advanced",
    duration: "50 min",
    title: "RAG — Retrieval Augmented Generation",
    color: "#10b981",
    sections: [
      {
        type: "concept",
        title: "What is RAG and Why?",
        body: `LLMs are trained on public data up to a cutoff date. They know nothing about your private documents or recent events. RAG fixes this.

HOW RAG WORKS:
1. Split your documents into chunks
2. Convert chunks to embeddings (vectors)  
3. Store vectors in a vector database
4. At query time: find the most similar chunks
5. Inject those chunks as context into the LLM prompt

RAG PIPELINE:
Documents → Loader → Splitter → Embedder → VectorStore
Query     → Embedder → VectorStore.search → LLM + context → Answer

WHEN TO USE RAG:
→ Chatbot over your company's internal docs
→ Q&A over uploaded PDFs
→ Customer support with product documentation
→ Research assistant with papers/reports`,
      },
      {
        type: "code",
        title: "Document Loading & Splitting",
        explanation:
          "First step of RAG: load your documents and split them into chunks. chunk_size and chunk_overlap are critical — too small loses context, too large reduces precision.",
        code: `from langchain_community.document_loaders import (
    TextLoader, PyPDFLoader, WebBaseLoader, DirectoryLoader
)
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

# ── 1. Load from different sources ───────────────────
text_loader = TextLoader("policy.txt")
docs = text_loader.load()

pdf_loader  = PyPDFLoader("report.pdf")
pdf_docs    = pdf_loader.load()   # one doc per page

web_loader  = WebBaseLoader("https://docs.langchain.com/")
web_docs    = web_loader.load()

# Directory of files
dir_loader  = DirectoryLoader("data/", glob="*.txt")
all_docs    = dir_loader.load()

# Each Document has:
print(docs[0].page_content[:200])  # the text content
print(docs[0].metadata)            # source, page, etc.

# ── 2. Split into chunks ──────────────────────────────
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,      # target size in characters
    chunk_overlap=50,    # overlap preserves context at boundaries
    separators=[
        "\\n\\n",  # try paragraphs first
        "\\n",     # then lines
        " ",       # then words
        ""         # then characters (last resort)
    ]
)
chunks = splitter.split_documents(docs)
print(f"Original: {len(docs)} → Chunks: {len(chunks)}")
print(f"Sample: {chunks[0].page_content[:100]}")

# ── 3. Create documents manually ─────────────────────
custom_docs = [
    Document(
        page_content="LangChain was created by Harrison Chase in 2022.",
        metadata={"source": "about.txt", "topic": "history"}
    ),
    Document(
        page_content="LCEL uses the | pipe operator to compose chains.",
        metadata={"source": "lcel.txt", "topic": "technical"}
    ),
]`,
        output: `Our company policy states that all employees must...

{'source': 'policy.txt', 'language': 'en'}

Original: 1 → Chunks: 23
Sample: Our company policy states that all employees must 
complete annual security training before December...`,
      },
      {
        type: "code",
        title: "Vector Store + Full RAG Chain",
        explanation:
          "FAISS stores vectors in memory (great for prototyping). The retriever finds relevant chunks. The RAG chain: retrieve → format as context → inject into prompt → get answer.",
        code: `from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.documents import Document

llm = ChatOpenAI(model="gpt-4o-mini")
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# ── 1. Create vector store ────────────────────────────
docs = [
    Document("LangChain was created by Harrison Chase in 2022.",
             metadata={"source": "about.txt"}),
    Document("LCEL uses the | pipe operator to compose chains.",
             metadata={"source": "lcel.txt"}),
    Document("Agents use LLMs to decide which tools to call.",
             metadata={"source": "agents.txt"}),
    Document("RAG retrieves relevant docs and injects as context.",
             metadata={"source": "rag.txt"}),
    Document("LangSmith provides tracing and monitoring for LLM apps.",
             metadata={"source": "tools.txt"}),
]
vectorstore = FAISS.from_documents(docs, embeddings)
# Save: vectorstore.save_local("faiss_index")
# Load: FAISS.load_local("faiss_index", embeddings)

# ── 2. Similarity search ──────────────────────────────
results = vectorstore.similarity_search("What is LCEL?", k=2)
for r in results:
    print(r.page_content)

# ── 3. Build RAG chain ────────────────────────────────
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

def format_docs(docs):
    return "\\n\\n".join(
        f"[{d.metadata['source']}] {d.page_content}" for d in docs
    )

rag_prompt = ChatPromptTemplate.from_messages([
    ("system", """Answer using ONLY the context below.
If not in context, say "I don't have that information."
Context: {context}"""),
    ("human", "{question}")
])

rag_chain = (
    {"context": retriever | format_docs,
     "question": RunnablePassthrough()}
    | rag_prompt | llm | StrOutputParser()
)

# ── 4. Ask questions ──────────────────────────────────
qs = ["Who created LangChain?", "What is the capital of France?"]
for q in qs:
    print(f"Q: {q}\\nA: {rag_chain.invoke(q)}\\n")`,
        output: `LCEL uses the | pipe operator to compose chains.
LangChain was created by Harrison Chase in 2022.

Q: Who created LangChain?
A: LangChain was created by Harrison Chase in 2022.

Q: What is the capital of France?
A: I don't have that information.`,
      },
      {
        type: "tips",
        title: "Key Takeaways",
        items: [
          "chunk_size=500, chunk_overlap=50 is a solid starting point",
          "FAISS for prototyping, Chroma for local persistence, Pinecone for cloud",
          "Use MMR search (search_type='mmr') for diverse, non-redundant results",
          "Always cite sources — use metadata to track which doc answered",
          "Bad retrieval = bad answers — test retrieval quality separately",
        ],
      },
    ],
  },
  {
    id: 7,
    icon: "🤖",
    tag: "ADVANCED",
    level: "Advanced",
    duration: "55 min",
    title: "Agents & Tools",
    color: "#ef4444",
    sections: [
      {
        type: "concept",
        title: "What are Agents?",
        body: `An Agent is an LLM that doesn't just generate text — it decides which tools to use, calls them, observes results, and continues reasoning until it solves the task.

THE ReAct LOOP:
Thought → Action (call tool) → Observation → Thought → ... → Answer

KEY COMPONENTS:
→ LLM           — the brain (decides what to do next)
→ Tools         — Python functions the LLM can call
→ AgentExecutor — the loop that runs Thought → Action → Observation
→ Memory        — optional history for multi-turn agents

WHEN AGENTS SHINE:
→ Tasks requiring multiple steps & decisions
→ Research: search web → read page → synthesize
→ Data analysis: query DB → compute → report
→ Coding: write code → run → debug → fix`,
      },
      {
        type: "code",
        title: "Creating Custom Tools",
        explanation:
          "Tools are Python functions decorated with @tool. The DOCSTRING is the tool's description — the LLM reads it to decide when and how to call the tool. Write clear, detailed docstrings!",
        code: `from langchain_core.tools import tool
import math

# ── @tool decorator turns functions into LLM-callable tools
@tool
def calculator(expression: str) -> str:
    """Evaluate a mathematical expression.
    Use for any arithmetic, algebra, or calculation.
    Input must be a valid Python math expression.
    Examples: '2 + 2', 'math.sqrt(144)', '100 * 0.15'
    """
    try:
        result = eval(expression, {"math": math, "__builtins__": {}})
        return f"Result: {result}"
    except Exception as e:
        return f"Error: {str(e)}"

@tool
def get_weather(city: str) -> str:
    """Get current weather for a city.
    Use when user asks about weather conditions anywhere.
    Input: a city name like 'London' or 'New York'.
    """
    data = {
        "London": "15°C, Cloudy",
        "New York": "22°C, Sunny",
        "Tokyo": "28°C, Humid"
    }
    return data.get(city, f"No data for {city}")

@tool
def unit_converter(value: float, from_unit: str, to_unit: str) -> str:
    """Convert between units: km/miles, kg/lbs, celsius/fahrenheit.
    Input: numeric value, source unit, target unit.
    """
    conversions = {
        ("km","miles"): lambda x: x * 0.621371,
        ("miles","km"): lambda x: x * 1.60934,
        ("kg","lbs"):   lambda x: x * 2.20462,
        ("lbs","kg"):   lambda x: x * 0.453592,
        ("celsius","fahrenheit"): lambda x: x * 9/5 + 32,
        ("fahrenheit","celsius"): lambda x: (x - 32) * 5/9,
    }
    fn = conversions.get((from_unit.lower(), to_unit.lower()))
    if fn:
        return f"{value} {from_unit} = {fn(value):.2f} {to_unit}"
    return f"Unsupported conversion: {from_unit} → {to_unit}"

# Test tools directly
print(calculator.invoke("math.sqrt(256) + 100 * 0.15"))
print(get_weather.invoke("London"))
print(unit_converter.invoke({"value": 75, "from_unit": "kg", "to_unit": "lbs"}))

# Tool metadata (the LLM sees this to decide when to call)
print(f"\\nName: {calculator.name}")
print(f"Args: {calculator.args}")`,
        output: `Result: 31.0

15°C, Cloudy

75 kg = 165.35 lbs

Name: calculator
Args: {'expression': {'title': 'Expression', 'type': 'string'}}`,
      },
      {
        type: "code",
        title: "Building a ReAct Agent",
        explanation:
          "create_react_agent from LangGraph is the modern recommended approach. The agent reasons, calls tools, observes results, and iterates until it has a complete answer.",
        code: `from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent  # pip install langgraph
from langchain_core.messages import HumanMessage
import math

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# Define tools
@tool
def calculator(expression: str) -> str:
    """Evaluate math. Input: valid Python expression like 'math.sqrt(16)'"""
    try: return str(eval(expression, {"math": math, "__builtins__": {}}))
    except Exception as e: return f"Error: {e}"

@tool
def population_lookup(country: str) -> str:
    """Get population of a country. Input: country name."""
    data = {"India":"1.44 billion","China":"1.41 billion",
            "USA":"335 million","Japan":"124 million"}
    return data.get(country, "Not found")

# Create agent
agent = create_react_agent(
    model=llm,
    tools=[calculator, population_lookup],
    state_modifier="Use tools when needed. Show reasoning step by step."
)

def ask(question: str):
    result = agent.invoke({
        "messages": [HumanMessage(content=question)]
    })
    print(f"Q: {question}")
    print(f"A: {result['messages'][-1].content}\\n")

ask("What is 15% of 840?")
ask("How many people in India? Express as millions.")
ask("I'm 175cm tall and 75kg. Calculate my BMI (kg/m²) and tell me if healthy.")

# ── With memory across turns ──────────────────────────
from langgraph.checkpoint.memory import MemorySaver

memory  = MemorySaver()
agent_m = create_react_agent(llm, [calculator], checkpointer=memory)
config  = {"configurable": {"thread_id": "user_123"}}

r1 = agent_m.invoke({"messages":[HumanMessage("I earn $5000/month")]}, config=config)
r2 = agent_m.invoke({"messages":[HumanMessage("What is 30% of my salary?")]}, config=config)
print(r1["messages"][-1].content)
print(r2["messages"][-1].content)`,
        output: `Q: What is 15% of 840?
A: 15% of 840 = 126.0

Q: How many people in India? Express as millions.
A: India has 1.44 billion people = 1,440 million people.

Q: I'm 175cm tall and 75kg. Calculate my BMI and tell me if healthy.
A: BMI = 75 / (1.75²) = 75 / 3.0625 ≈ 24.49
This is in the Normal range (18.5–24.9). You're healthy!

Noted! You earn $5,000/month.
30% of $5,000 = $1,500/month.`,
      },
      {
        type: "tips",
        title: "Key Takeaways",
        items: [
          "Docstrings are the tool's manual — the LLM reads them to decide when to call it",
          "Use temperature=0 for agents — you want deterministic tool selection",
          "MemorySaver enables persistent multi-turn agent conversations",
          "langgraph's create_react_agent is preferred over legacy AgentExecutor",
          "Stream agent events to show tool calls + thinking in your UI",
        ],
      },
    ],
  },
  {
    id: 8,
    icon: "🔬",
    tag: "ADVANCED",
    level: "Advanced",
    duration: "45 min",
    title: "LangSmith & Production",
    color: "#8b5cf6",
    sections: [
      {
        type: "concept",
        title: "Why LangSmith?",
        body: `When your LangChain app gives wrong answers, debugging is hard because you can't easily see what prompt was sent, what was retrieved, or which tool was called.

LANGSMITH SOLVES THIS WITH:
→ Traces     — full visibility into every chain step
→ Datasets   — collect inputs/outputs for evaluation
→ Evals      — test your app with LLM-as-judge
→ Monitoring — latency, tokens, costs in production

JUST 3 ENV VARS NEEDED — NO CODE CHANGES:
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=ls__your_key
LANGCHAIN_PROJECT=my-project`,
      },
      {
        type: "code",
        title: "Enable Tracing & Custom Callbacks",
        explanation:
          "Set 3 environment variables and LangSmith automatically traces everything. Custom Callbacks let you build your own monitoring — cost tracking, Slack alerts, or custom dashboards.",
        code: `# ── 1. LangSmith setup (.env) ─────────────────────────
# LANGCHAIN_TRACING_V2=true
# LANGCHAIN_API_KEY=ls__your_key
# LANGCHAIN_PROJECT=langchain-course

import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"]     = "ls__your_key"
os.environ["LANGCHAIN_PROJECT"]     = "my-app"

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

llm   = ChatOpenAI(model="gpt-4o-mini")
chain = (
    ChatPromptTemplate.from_template("Explain {topic} simply.")
    | llm | StrOutputParser()
)
# This call is now fully traced in LangSmith!
result = chain.invoke({"topic": "quantum computing"})

# ── 2. Custom Callback Handler ────────────────────────
from langchain_core.callbacks import BaseCallbackHandler
from langchain_core.outputs import LLMResult
import time

class CostTracker(BaseCallbackHandler):
    def __init__(self):
        self.calls, self.tokens, self.latency = 0, 0, 0
        self._start = None

    def on_llm_start(self, serialized, prompts, **kwargs):
        self._start = time.time()
        print(f"🚀 LLM call #{self.calls + 1}")

    def on_llm_end(self, response: LLMResult, **kwargs):
        lat = time.time() - self._start
        tok = response.llm_output.get("token_usage", {}).get("total_tokens", 0)
        self.calls += 1; self.tokens += tok; self.latency += lat
        print(f"✅ {tok} tokens | {lat:.2f}s")

    def summary(self):
        avg = self.latency / max(self.calls, 1)
        cost = self.tokens * 0.00015 / 1000
        print(f"\\n📊 SUMMARY: {self.calls} calls | "
              f"{self.tokens} tokens | avg {avg:.2f}s | ~\${cost:.4f}")

# Use callback
tracker = CostTracker()
tracked_llm = ChatOpenAI(model="gpt-4o-mini", callbacks=[tracker])
tracked_chain = (
    ChatPromptTemplate.from_template("Summarize: {text}")
    | tracked_llm | StrOutputParser()
)
tracked_chain.invoke({"text": "LangChain simplifies LLM apps"})
tracked_chain.invoke({"text": "Agents can use tools to take actions"})
tracker.summary()`,
        output: `🚀 LLM call #1
✅ 45 tokens | 0.82s

🚀 LLM call #2
✅ 38 tokens | 0.74s

📊 SUMMARY: 2 calls | 83 tokens | avg 0.78s | ~\$0.0000`,
      },
      {
        type: "tips",
        title: "Key Takeaways",
        items: [
          "Set LANGCHAIN_TRACING_V2=true for zero-code full tracing",
          "LangSmith shows the full prompt tree — invaluable for debugging RAG",
          "Use Callbacks for custom monitoring, cost tracking, alerting",
          "Build evaluation datasets early — test every model/prompt change",
          "Track token costs from day one — LLM bills can surprise you",
        ],
      },
    ],
  },
];

const levelColor = {
  Beginner: "#00ff88",
  Intermediate: "#ffaa00",
  Advanced: "#ef4444",
};
const tagColor = {
  BASICS: "#00ff88",
  INTERMEDIATE: "#ffaa00",
  ADVANCED: "#ef4444",
};

export default function App() {
  const [activeMod, setActiveMod] = useState(0);
  const [activeSec, setActiveSec] = useState(0);
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebar] = useState(true);

  const mod = modules[activeMod];
  const sec = mod.sections[activeSec];

  const totalSecs = modules.reduce((a, m) => a + m.sections.length, 0);
  const doneSecs =
    modules.slice(0, activeMod).reduce((a, m) => a + m.sections.length, 0) +
    activeSec;
  const progress = Math.round((doneSecs / totalSecs) * 100);

  const goNext = () => {
    if (activeSec < mod.sections.length - 1) setActiveSec((s) => s + 1);
    else if (activeMod < modules.length - 1) {
      setActiveMod((m) => m + 1);
      setActiveSec(0);
    }
  };
  const goPrev = () => {
    if (activeSec > 0) setActiveSec((s) => s - 1);
    else if (activeMod > 0) {
      setActiveMod((m) => m - 1);
      setActiveSec(modules[activeMod - 1].sections.length - 1);
    }
  };

  const copy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#08080f",
        color: "#dde2ef",
        fontFamily: "'JetBrains Mono',monospace",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:#2a2a4a; border-radius:3px; }
        .mod-item { transition: background 0.15s; cursor:pointer; }
        .mod-item:hover { background:#131325 !important; }
        .nav-btn { transition: all 0.15s; cursor:pointer; border:none; }
        .nav-btn:hover { filter:brightness(1.2); }
        .sec-dot { transition: all 0.2s; cursor:pointer; }
        .sec-dot:hover { transform:scale(1.3); }
      `}</style>

      {/* SIDEBAR */}
      {sidebarOpen && (
        <div
          style={{
            width: 260,
            minWidth: 260,
            background: "#0c0c1e",
            borderRight: "1px solid #1a1a35",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            height: "100%",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "18px 16px 14px",
              borderBottom: "1px solid #1a1a35",
            }}
          >
            <div
              style={{
                fontFamily: "'Syne',sans-serif",
                fontSize: 17,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.5px",
              }}
            >
              🔗 LangChain
            </div>
            <div style={{ fontSize: 10, color: "#5a5a8a", marginTop: 2 }}>
              COMPLETE COURSE · BASICS TO ADVANCED
            </div>
            {/* Progress */}
            <div style={{ marginTop: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 10,
                  color: "#5a5a8a",
                  marginBottom: 5,
                }}
              >
                <span>PROGRESS</span>
                <span style={{ color: "#00ff88" }}>{progress}%</span>
              </div>
              <div
                style={{ background: "#1a1a35", borderRadius: 2, height: 3 }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: 3,
                    background: "linear-gradient(90deg,#00ff88,#00d4ff)",
                    borderRadius: 2,
                    transition: "width 0.4s",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Module list */}
          <div style={{ overflowY: "auto", flex: 1, padding: "8px 0" }}>
            {modules.map((m, mi) => (
              <div
                key={m.id}
                className="mod-item"
                onClick={() => {
                  setActiveMod(mi);
                  setActiveSec(0);
                }}
                style={{
                  padding: "10px 14px",
                  background: mi === activeMod ? "#131325" : "transparent",
                  borderLeft:
                    mi === activeMod
                      ? `2px solid ${m.color}`
                      : "2px solid transparent",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 15 }}>{m.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 11,
                        color: mi === activeMod ? "#fff" : "#8888aa",
                        fontWeight: mi === activeMod ? 600 : 400,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {m.title}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        marginTop: 3,
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 9,
                          padding: "1px 5px",
                          borderRadius: 2,
                          background: tagColor[m.tag] + "22",
                          color: tagColor[m.tag],
                          fontWeight: 600,
                        }}
                      >
                        {m.tag}
                      </span>
                      <span style={{ fontSize: 9, color: "#44446a" }}>
                        {m.duration}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Section dots */}
                {mi === activeMod && (
                  <div
                    style={{
                      display: "flex",
                      gap: 5,
                      marginTop: 8,
                      paddingLeft: 23,
                    }}
                  >
                    {m.sections.map((_, si) => (
                      <div
                        key={si}
                        className="sec-dot"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSec(si);
                        }}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: si === activeSec ? m.color : "#2a2a4a",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          height: "100%",
          minHeight: "100vh",
        }}
      >
        {/* Topbar */}
        <div
          style={{
            background: "#0c0c1e",
            borderBottom: "1px solid #1a1a35",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setSidebar((v) => !v)}
            style={{
              background: "#1a1a35",
              border: "none",
              color: "#8888aa",
              padding: "5px 8px",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 18 }}>{mod.icon}</span>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  fontFamily: "'Syne',sans-serif",
                }}
              >
                {mod.title}
              </div>
              <div style={{ fontSize: 10, color: "#5a5a8a" }}>
                {mod.subtitle}
              </div>
            </div>
          </div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 10,
                padding: "3px 8px",
                borderRadius: 3,
                background: levelColor[mod.level] + "22",
                color: levelColor[mod.level],
                fontWeight: 600,
              }}
            >
              {mod.level}
            </span>
            <span style={{ fontSize: 10, color: "#44446a" }}>
              {mod.duration}
            </span>
            <span style={{ fontSize: 10, color: "#44446a", marginLeft: 8 }}>
              {activeSec + 1}/{mod.sections.length}
            </span>
          </div>
        </div>

        {/* Section content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 28px",
            minHeight: 0,
          }}
        >
          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 3,
                height: 20,
                background: mod.color,
                borderRadius: 2,
              }}
            />
            <h2
              style={{
                margin: 0,
                fontSize: 16,
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {sec.title}
            </h2>
          </div>

          {/* CONCEPT */}
          {sec.type === "concept" && (
            <div
              style={{
                background: "#0e0e22",
                border: "1px solid #1e1e38",
                borderRadius: 8,
                padding: 20,
              }}
            >
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  fontSize: 12,
                  lineHeight: 1.8,
                  color: "#b0b8d8",
                  fontFamily: "'JetBrains Mono',monospace",
                }}
              >
                {sec.body}
              </pre>
            </div>
          )}

          {/* ARCHITECTURE */}
          {sec.type === "arch" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 12,
              }}
            >
              {sec.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: "#0e0e22",
                    border: `1px solid ${mod.color}33`,
                    borderRadius: 8,
                    padding: 14,
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 8 }}>
                    {item.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: mod.color,
                      marginBottom: 4,
                    }}
                  >
                    {item.name}
                  </div>
                  <div
                    style={{ fontSize: 11, color: "#7878a8", lineHeight: 1.6 }}
                  >
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CODE */}
          {sec.type === "code" && (
            <div>
              {/* Explanation */}
              <div
                style={{
                  background: `${mod.color}11`,
                  border: `1px solid ${mod.color}33`,
                  borderRadius: 6,
                  padding: 14,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: mod.color,
                    marginBottom: 6,
                  }}
                >
                  💡 EXPLANATION
                </div>
                <div
                  style={{ fontSize: 12, color: "#a0aac8", lineHeight: 1.7 }}
                >
                  {sec.explanation}
                </div>
              </div>

              {/* Code block */}
              <div
                style={{
                  borderRadius: 8,
                  overflow: "hidden",
                  border: "1px solid #1e1e38",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    background: "#12122a",
                    padding: "8px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #1e1e38",
                  }}
                >
                  <div style={{ display: "flex", gap: 6 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#ff5f57",
                      }}
                    />
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#febc2e",
                      }}
                    />
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#28c840",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 10, color: "#5a5a8a" }}>python</span>
                  <button
                    className="nav-btn"
                    onClick={() => copy(sec.code)}
                    style={{
                      background: "#1e1e38",
                      color: copied ? "#00ff88" : "#7878a8",
                      padding: "3px 10px",
                      borderRadius: 4,
                      fontSize: 10,
                    }}
                  >
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                </div>
                <div
                  style={{
                    background: "#080818",
                    padding: "16px 18px",
                    overflowX: "auto",
                  }}
                >
                  <pre
                    style={{
                      margin: 0,
                      fontSize: 11.5,
                      lineHeight: 1.75,
                      color: "#c8d0e8",
                      whiteSpace: "pre",
                      fontFamily: "'JetBrains Mono',monospace",
                    }}
                  >
                    {sec.code}
                  </pre>
                </div>
              </div>

              {/* Output */}
              <div
                style={{
                  borderRadius: 8,
                  overflow: "hidden",
                  border: "1px solid #1a1a35",
                }}
              >
                <div
                  style={{
                    background: "#0d0d20",
                    padding: "7px 14px",
                    borderBottom: "1px solid #1a1a35",
                  }}
                >
                  <span style={{ fontSize: 10, color: "#5a5a8a" }}>
                    ▶ OUTPUT
                  </span>
                </div>
                <div style={{ background: "#06060f", padding: "14px 18px" }}>
                  <pre
                    style={{
                      margin: 0,
                      fontSize: 11,
                      lineHeight: 1.7,
                      color: "#68d391",
                      fontFamily: "'JetBrains Mono',monospace",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {sec.output}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TIPS */}
          {sec.type === "tips" && (
            <div>
              {sec.items.map((tip, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    marginBottom: 12,
                    background: "#0e0e22",
                    border: "1px solid #1e1e38",
                    borderRadius: 6,
                    padding: "12px 16px",
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: `${mod.color}22`,
                      color: mod.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div
                    style={{ fontSize: 12, color: "#a0aac8", lineHeight: 1.7 }}
                  >
                    {tip}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div
          style={{
            background: "#0c0c1e",
            borderTop: "1px solid #1a1a35",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <button
            className="nav-btn"
            onClick={goPrev}
            disabled={activeMod === 0 && activeSec === 0}
            style={{
              background:
                activeMod === 0 && activeSec === 0 ? "#0e0e22" : "#1a1a35",
              color: activeMod === 0 && activeSec === 0 ? "#33334a" : "#c0c8e0",
              padding: "8px 18px",
              borderRadius: 6,
              fontSize: 12,
              opacity: activeMod === 0 && activeSec === 0 ? 0.4 : 1,
            }}
          >
            ← Previous
          </button>

          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {mod.sections.map((_, i) => (
              <div
                key={i}
                className="sec-dot"
                onClick={() => setActiveSec(i)}
                style={{
                  width: i === activeSec ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === activeSec ? mod.color : "#2a2a4a",
                  transition: "all 0.2s",
                }}
              />
            ))}
          </div>

          <button
            className="nav-btn"
            onClick={goNext}
            disabled={
              activeMod === modules.length - 1 &&
              activeSec === mod.sections.length - 1
            }
            style={{
              background: mod.color,
              color: "#000",
              padding: "8px 18px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              opacity:
                activeMod === modules.length - 1 &&
                activeSec === mod.sections.length - 1
                  ? 0.4
                  : 1,
            }}
          >
            Next →
          </button>
        </div>

        {/* Footer Credit */}
        <div
          style={{
            padding: "12px 16px",
            textAlign: "center",
            borderTop: "1px solid #1a1a35",
            fontSize: 11,
            color: "#5a5a8a",
            background: "#08080f",
            flexShrink: 0,
          }}
        >
          Developed by{" "}
          <span style={{ color: "#00ff88", fontWeight: "600" }}>Banjara</span>
        </div>
      </div>
    </div>
  );
}
