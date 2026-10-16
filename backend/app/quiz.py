"""Source-linked educational quizzes, with explicit explanations and no personal risk scoring."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/quiz", tags=["Interactive science quizzes"])
BANK = {
 "genetics": [
  {"id":"g1","question":"What does a gene contain?","options":["Instructions used to make functional products","A complete prediction of your future","A tiny organ"],"correct":0,"explanation":"Genes are segments of DNA that contain instructions for functional products. Genes do not determine every trait on their own.","source":"https://medlineplus.gov/genetics/understanding/basics/gene/"},
  {"id":"g2","question":"Where are most human genes found?","options":["On chromosomes in the cell nucleus","Only in red blood cells","Only in the bloodstream"],"correct":0,"explanation":"Most genes are located on chromosomes in the nucleus; mitochondrial DNA also carries genes.","source":"https://medlineplus.gov/genetics/understanding/basics/dna/"}
 ],
 "twins": [
  {"id":"t1","question":"How do fraternal twins usually develop?","options":["One embryo splits","Two eggs are fertilized separately","A gene guarantees twins"],"correct":1,"explanation":"Fraternal twins typically develop when two separate eggs are fertilized.","source":"https://medlineplus.gov/genetics/understanding/traits/twins/"},
  {"id":"t2","question":"Can conception timing guarantee twins?","options":["Yes","No","Only on certain calendar dates"],"correct":1,"explanation":"Timing intercourse cannot guarantee a twin pregnancy.","source":"https://medlineplus.gov/genetics/understanding/traits/twins/"}
 ],
 "fertility": [
  {"id":"f1","question":"Can a calendar precisely confirm ovulation?","options":["Always","No, timing varies","Only for 28-day cycles"],"correct":1,"explanation":"Calendar calculations are estimates; ovulation timing varies.","source":"https://medlineplus.gov/ency/article/007015.htm"}
 ],
 "pregnancy": [
  {"id":"p1","question":"What is the usual reference point for pregnancy dating?","options":["Last menstrual period","First ultrasound image only","Baby's first kick"],"correct":0,"explanation":"Gestational age is commonly counted from the first day of the last menstrual period, with clinical assessment as needed.","source":"https://medlineplus.gov/ency/article/002367.htm"}
 ],
 "periods": [
  {"id":"m1","question":"Can follicular and menstrual phases overlap?","options":["Yes","Never","Only during pregnancy"],"correct":0,"explanation":"The follicular phase begins at the start of the menstrual cycle and can overlap with menstruation.","source":"https://medlineplus.gov/menstruation.html"}
 ],
 "chromosomes": [
  {"id":"c1","question":"What carries many genes in the cell nucleus?","options":["Chromosomes","Platelets","Hormones"],"correct":0,"explanation":"Chromosomes package DNA and carry many genes.","source":"https://medlineplus.gov/genetics/understanding/basics/chromosome/"}
 ]
}
class Submission(BaseModel):
    topic: str
    question_id: str = Field(min_length=2, max_length=20)
    choice: int = Field(ge=0, le=4)

@router.get("/{topic}")
def questions(topic: str):
    if topic not in BANK:
        raise HTTPException(404, "Topic not found")
    return {"topic":topic,"questions":[{"id":q["id"],"question":q["question"],"options":q["options"]} for q in BANK[topic]],"notice":"For learning only, not clinical guidance."}

@router.post("/check")
def check(data: Submission):
    item = next((q for q in BANK.get(data.topic,[]) if q["id"]==data.question_id),None)
    if item is None:
        raise HTTPException(404, "Question not found")
    return {"correct":data.choice==item["correct"],"correct_choice":item["correct"],"explanation":item["explanation"],"source":item["source"]}
