"""Source-grounded biology discovery. No paid LLM or medical personalization."""
from datetime import datetime, timezone
from functools import lru_cache
from html import unescape
import re
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from xml.etree import ElementTree
import json
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/api/discover", tags=["Science discovery"])
TOPICS = {
    "fertility": "fertility",
    "twins": "twins",
    "pregnancy": "pregnancy",
    "periods": "menstruation",
    "genetics": "genetics",
    "chromosomes": "chromosomes",
}
QUESTIONS = [
    {"question": "Why do identical twins happen?", "topic": "twins"},
    {"question": "What happens during ovulation?", "topic": "fertility"},
    {"question": "What do chromosomes do?", "topic": "chromosomes"},
    {"question": "How does pregnancy develop?", "topic": "pregnancy"},
]
def clean(value):
    return re.sub(r"\s+", " ", unescape(re.sub(r"<[^>]+>", " ", value or ""))).strip()

@lru_cache(maxsize=32)
def medline(topic):
    params = urlencode({"db": "healthTopics", "term": TOPICS[topic], "retmax": 6, "rettype": "brief", "tool": "MiniMeLab"})
    request = Request("https://wsearch.nlm.nih.gov/ws/query?" + params, headers={"User-Agent": "MiniMeLab/1.0"})
    with urlopen(request, timeout=8) as response:
        root = ElementTree.fromstring(response.read(250000))
    articles = []
    for doc in root.findall(".//document"):
        url = doc.attrib.get("url", "")
        if not url.startswith("https://medlineplus.gov/"):
            continue
        parts = {n.attrib.get("name", ""): "".join(n.itertext()) for n in doc.findall("content")}
        articles.append({"title": clean(parts.get("title")), "summary": clean(parts.get("snippet") or parts.get("FullSummary"))[:420], "url": url, "source": "MedlinePlus"})
    return articles

@lru_cache(maxsize=32)
def publications(topic):
    query = TOPICS[topic] + " AND (REVIEW_TYPE:review)"
    params = urlencode({"query": query, "format": "json", "pageSize": 5, "resultType": "lite"})
    req = Request("https://www.ebi.ac.uk/europepmc/webservices/rest/search?" + params, headers={"User-Agent": "MiniMeLab/1.0"})
    with urlopen(req, timeout=8) as response:
        raw = json.loads(response.read(300000))
    results = []
    for item in raw.get("resultList", {}).get("result", []):
        identifier = item.get("id", "")
        source = item.get("source", "")
        if not identifier or not source:
            continue
        results.append({"title": clean(item.get("title", "")), "year": item.get("pubYear"), "journal": item.get("journalTitle", ""), "url": "https://europepmc.org/article/" + source + "/" + identifier, "source": "Europe PMC"})
    return results

@router.get("/home")
def home(topic: str = Query("genetics")):
    if topic not in TOPICS:
        raise HTTPException(422, "Unsupported topic")
    errors = []
    try:
        articles = medline(topic)
    except Exception:
        articles = []
        errors.append("medlineplus")
    try:
        papers = publications(topic)
    except Exception:
        papers = []
        errors.append("europepmc")
    return {"topic": topic, "articles": articles, "papers": papers, "questions": QUESTIONS,
            "retrieval_status": "partial" if errors else "ok", "unavailable_sources": errors,
            "attribution": "MedlinePlus, U.S. National Library of Medicine; Europe PMC",
            "notice": "Educational material only; not a diagnosis or individual medical prediction."}

@router.get("/ask")
def ask(question: str = Query(..., min_length=5, max_length=200)):
    words = set(re.findall(r"[a-z]+", question.lower()))
    topic = max(TOPICS, key=lambda key: len(words.intersection(set(key.split())) | words.intersection(set(TOPICS[key].split()))))
    if not words.intersection({"fertility", "ovulation", "twins", "twin", "pregnancy", "pregnant", "period", "periods", "menstruation", "genetics", "gene", "chromosome", "chromosomes"}):
        return {"answer": None, "topic": None, "sources": [], "status": "unsupported",
                "message": "Try asking about fertility, twins, pregnancy, periods, genes, or chromosomes."}
    aliases = {"ovulation": "fertility", "twin": "twins", "pregnant": "pregnancy", "period": "periods", "menstruation": "periods", "gene": "genetics", "chromosome": "chromosomes"}
    for word, mapped in aliases.items():
        if word in words:
            topic = mapped
            break
    try:
        articles = medline(topic)
    except Exception:
        articles = []
    if not articles:
        return {"answer": None, "topic": topic, "sources": [], "status": "unavailable",
                "message": "Source information is temporarily unavailable. Please try again."}
    query_terms = words - {"what", "how", "why", "does", "the", "a", "is", "are", "can", "do", "about", "tell", "me"}
    ranked = sorted(articles, key=lambda a: sum(1 for term in query_terms if term in (a["title"] + " " + a["summary"]).lower()), reverse=True)
    chosen = ranked[:3]
    return {"answer": None, "topic": topic, "sources": chosen, "status": "retrieved",
            "message": "Here are relevant source excerpts and articles. This is retrieval, not an AI-generated medical answer."}
