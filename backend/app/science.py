from functools import lru_cache
from html import unescape
import re
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from xml.etree import ElementTree
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/api/science", tags=["Science library"])
BASE = "https://wsearch.nlm.nih.gov/ws/query"
TOPICS = {
    "fertility": "fertility",
    "pregnancy": "pregnancy",
    "menstruation": "menstruation",
    "genetics": "genetics",
    "twins": "twins",
    "chromosomes": "chromosomes",
}
GENES = {
    "BRCA1": "https://medlineplus.gov/genetics/gene/brca1/",
    "CFTR": "https://medlineplus.gov/genetics/gene/cftr/",
    "FMR1": "https://medlineplus.gov/genetics/gene/fmr1/",
    "HBB": "https://medlineplus.gov/genetics/gene/hbb/",
    "F5": "https://medlineplus.gov/genetics/gene/f5/",
}

@lru_cache(maxsize=32)
def fetch_xml(db: str, term: str):
    url = BASE + "?" + urlencode({"db": db, "term": term, "retmax": 8, "tool": "MiniMeLab"})
    req = Request(url, headers={"User-Agent": "MiniMeLab/0.1 (educational project)"})
    with urlopen(req, timeout=8) as response:
        return ElementTree.fromstring(response.read(200000))

@router.get("/topics")
def topics():
    return {"topics": [{"id": k, "title": k.title()} for k in TOPICS]}

@router.get("/search")
def search(topic: str = Query("genetics", min_length=2, max_length=40)):
    term = TOPICS.get(topic.lower())
    if term is None:
        raise HTTPException(status_code=422, detail="Choose a supported science topic.")
    try:
        root = fetch_xml("healthTopics", term)
        records = []
        for doc in root.findall(".//document"):
            title_node = doc.find("./content[@name='title']")
            title = re.sub(r"\\s+", " ", unescape("".join(title_node.itertext()) if title_node is not None else "")).strip()
            url = doc.get("url", "")
            if url.startswith("https://medlineplus.gov/"):
                records.append({"title": title or term.title(), "url": url, "source": "MedlinePlus / US National Library of Medicine"})
        return {"topic": topic, "articles": records, "source": "MedlinePlus", "notice": "Educational resources; not medical advice."}
    except Exception:
        raise HTTPException(status_code=503, detail="Scientific source temporarily unavailable.")

@router.get("/genes")
def genes():
    return {"genes": [{"symbol": symbol, "url": url, "source": "MedlinePlus Genetics"} for symbol, url in GENES.items()],
            "notice": "These are examples for education, not personal genetic testing or risk assessment."}

@router.get("/genetics/search")
def genetics_search(term: str = Query("chromosomes", min_length=2, max_length=60)):
    """Search NLM's real genetics index; never infer personal genetic risk."""
    try:
        root = fetch_xml("ghr", term)
        records = []
        for doc in root.findall(".//document"):
            url = doc.get("url", "")
            if not url.startswith("https://medlineplus.gov/genetics/"):
                continue
            node = doc.find("./content[@name='title']")
            title = re.sub(r"\\s+", " ", unescape("".join(node.itertext()) if node is not None else "")).strip()
            records.append({"title": title or term, "url": url, "source": "MedlinePlus Genetics"})
        return {"term": term, "results": records, "source": "MedlinePlus Genetics", "notice": "Reference material, not a genetic test or personalized prediction."}
    except Exception:
        raise HTTPException(status_code=503, detail="Genetics source temporarily unavailable.")
