import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# riskchange Expert m04, Proof of Use. Digest section 16 only, as the five
# lessons of m04 teach it: applications and outcomes, the reuse record,
# embedding as earned, the two exits and what an application must carry.
# 15 questions.

q(3, "An application of a lesson carries one of three outcomes. Which outcomes does the engine count as having changed something?",
 "\"Adopted\" and \"Adapted\".",
 ["\"Adopted\" only, since an adaptation changes the lesson itself.",
  "\"Adopted\", \"Adapted\" and \"Rejected\".",
  "\"Adapted\" only."],
 "Both \"Adopted\" and \"Adapted\" count as applied and both can earn \"Embedded\". A rejection is a real record of a decision, and it embeds nothing because nothing changed.")

q(1, "Of the eight application targets, which two are Suite registers that carry a real key?",
 "\"Risk register\" and \"Management of change\", whose rows another engine in this course decides about.",
 ["\"Procedure\" and \"Training\", the two targets that name a document or a course somebody can open and read.",
  "\"Risk register\" and \"Design standard\".",
  "\"Management of change\" and \"Maintenance plan\"."],
 "An application into either Suite register names a risk row or a change record, each with its own state. The other six targets, \"Procedure\", \"Training\", \"Design standard\", \"Contract or tender\", \"Maintenance plan\" and \"Other\", name things outside the Suite registers.")

q(0, "What does the engine hold as the difference between an \"Adopted\" and an \"Adapted\" application?",
 "No rule beyond counting each separately in the reuse record; the difference is the organisation's own reading of the words.",
 ["An \"Adapted\" application counts as applied and cannot earn \"Embedded\".",
  "An \"Adopted\" application must name its target, and an \"Adapted\" one may leave it out.",
  "An \"Adapted\" application counts half toward the applied total."],
 "Both count as applied, both can earn \"Embedded\", and the reuse record keeps them in separate columns. The engine holds no rule that tells them apart, so taking a lesson as written and changing it to fit differ only in how the organisation reads them.")

q(2, "ON-01's application log holds AA-01 (\"Adopted\"), AA-02 (\"Adapted\") and AA-03 (\"Rejected\"). What does its reuse record read for total, applied, adopted, adapted and rejected?",
 "3, 2, 1, 1 and 1.",
 ["3, 3, 1, 1 and 1, since every application counts as applied.",
  "2, 2, 1, 1 and 0, since a rejection is left out of the record.",
  "3, 1, 1, 0 and 1, since an adaptation is not an application."],
 "Total is every application, applied is adopted plus adapted, and rejected is the rest: 1 adopted and 1 adapted make 2 applied, and AA-03 is the 1 rejected. The record is arithmetic on the log.")

q(2, "What is ON-01's last applied date in its reuse record?",
 "2026-07-14, the date of AA-02, its \"Adapted\" application into a procedure.",
 ["2026-08-01, the date of AA-03, its latest application of any outcome on the log.",
  "2026-05-02, the date of AA-01, since only an adoption sets the last applied date.",
  "null, because its latest application is a rejection."],
 "A rejection applied nothing, so AA-03 on 2026-08-01 is later and does not move the date. Both \"Adopted\" and \"Adapted\" are applications that changed something, and AA-02 is the later of the two.")

q(3, "ON-03 has one application, AA-05, a rejection dated 2026-07-01. What is its last applied date?",
 "null.",
 ["2026-07-01, the date of its one application.",
  "2026-06-05, the event date of the lesson itself.",
  "2026-10-31, the review date it carries."],
 "There is no date on which ON-03 was applied to anything, because its only application is a rejection. ON-04 also reads null, with no application at all behind it.")

q(1, "ON-03, whose one application is a rejection, is asked to move to \"Embedded\". What does the engine return?",
 "Refused: \"This lesson has been considered 1 time and adopted nowhere. Record where it was applied before calling it embedded.\"",
 ["Allowed, because the lesson has an application on its log and is \"Published\".",
  "Refused: \"Record where this lesson was applied first: the risk it raised, the change it caused, the procedure or the course it altered.\"",
  "Refused: \"Say why it was not adopted.\""],
 "The engine counts the consideration, which is honest, and still refuses the status, which is correct. The sentence that lists the risk, the change, the procedure or the course belongs to ON-04, which has no application at all.")

q(0, "ON-04 is \"Published\" and has no application at all. Asked to mark it \"Embedded\", how does the engine's refusal end?",
 "\"A lesson that changed nothing has not been learned.\"",
 ["\"Record where it was applied before calling it embedded.\"",
  "\"Somebody other than its author has to accept it before it is published to everyone.\"",
  "\"Name the lesson that replaces this one.\""],
 "The full refusal reads: \"Record where this lesson was applied first: the risk it raised, the change it caused, the procedure or the course it altered. A lesson that changed nothing has not been learned.\" The sentence about calling it embedded is ON-03's.")

q(1, "ON-10 is \"Published\". Somebody asks to archive it and gives no reason. What comes back?",
 "Refused: \"Say why this lesson is being archived. \"Archived, nobody said why\" is how a lessons database becomes a folder of PDFs.\"",
 ["Allowed, because archiving is open from every live status.",
  "Refused: \"An archived lesson is final.\"",
  "Refused: \"Name the lesson that replaces this one.\", since archiving needs a successor as superseding does."],
 "Archiving is open from every live status, and the engine still asks why. A lesson that disappears without a reason leaves the next reader unable to tell whether it was wrong, out of date or tidied away. With a reason, the archive of ON-10 is allowed.")

q(3, "ON-10 is asked to be superseded, naming ON-10 itself as the successor. What does the engine return?",
 "\"A lesson cannot supersede itself.\", the refusal for a successor that makes no sense.",
 ["\"Name the lesson that replaces this one.\", since a lesson naming itself names no successor.",
  "Allowed, because a successor has been named and the engine checks for one.",
  "\"A lesson that is published can only move to Embedded, Archived.\""],
 "The engine refuses the move with no successor named, and refuses the one successor that makes no sense in its own words. Superseding is open from \"Published\", so the move itself is legal for ON-10.")

q(0, "From which lesson statuses may a lesson be superseded?",
 "\"Published\" and \"Embedded\", the two visible statuses.",
 ["Every live status, as archiving is, since both are exits from use.",
  "\"Embedded\" only, once the lesson has proved it changed something.",
  "\"Validated\" and \"Published\"."],
 "The legal table gives \"Superseded\" from \"Published\" and from \"Embedded\" only, and archiving from every live status. Neither exit has a way back: \"Archived\" and \"Superseded\" list no next status.")

q(2, "A rejection is recorded against the risk register with its reason and no risk named. What does the engine return?",
 "Refused: \"Name the risk. A lesson pushed into the register points at the row it raised or changed, so the trail runs both ways.\"",
 ["Allowed, because a rejection changes nothing, so the target it names does not matter.",
  "Refused: \"Say why it was not adopted.\", since the reason is checked before the target.",
  "Allowed, because the reason alone is what a rejection has to carry, and this one carries it in full."],
 "The target checks come before the outcome check, so a rejection carries the same trail as an adoption, plus its reason. The reason here is given, and the missing risk is what is refused.")

q(0, "Somebody logs that a lesson was turned down for a procedure, names the procedure, and writes nothing about why. What does the engine say?",
 "\"Say why it was not adopted. A rejection is a decision, and the next person to read this lesson needs the reasoning.\"",
 ["\"Was the lesson adopted, adapted, or rejected?\", because a rejection with no reason is an outcome the register does not know.",
  "\"Pick what this lesson was applied to.\", since a rejection has no target in the engine's reading of it.",
  "Nothing: a rejection changes nothing, so the engine records it as it stands with no reason attached to it."],
 "A rejection must carry its reason. With the reason, the course records the rejection as ALLOWED. The question about adopted, adapted or rejected is the refusal for an outcome the register does not know.")

q(1, "The ONNE summary counts applications 6, applied 4 and rejected 2. Which applications make up the 4?",
 "AA-01, AA-02, AA-04 and AA-06.",
 ["AA-01, AA-02, AA-03 and AA-04, the first four on the log.",
  "AA-02, AA-03, AA-05 and AA-06, the ones applied after 2026-06-10.",
  "AA-01, AA-04, AA-05 and AA-06, the ones on single-application lessons."],
 "applied counts the \"Adopted\" and \"Adapted\" applications. AA-03 and AA-05 are the two rejections. intoRiskRegister 1 and intoMoc 1 are AA-01 and AA-04, the two applications into the Suite registers.")

q(3, "ON-01's reuse record lists the targets it changed. Which are they?",
 "\"Risk register\" and \"Procedure\"; its \"Training\" application was a rejection.",
 ["\"Risk register\", \"Procedure\" and \"Training\".",
  "\"Risk register\" only.",
  "\"Procedure\" and \"Training\"."],
 "The targets changed column lists only the targets of applications that changed something. AA-03 into \"Training\" was \"Rejected\", so training is absent. ON-03, whose only application was rejected, reads none.")

emit(Q, '/root/wt-as-riskchange-nextgen/tools/course-banks/riskchange/advanced/asrca_m04.json', expect_n=15)
finish()
