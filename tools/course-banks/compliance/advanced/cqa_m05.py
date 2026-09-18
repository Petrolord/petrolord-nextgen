import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# compliance Expert m05, Certification readiness. Digest SECTION 22 (the
# ORASHI readiness list, its counts, the certificate edge table, the empty
# register, the audits against the as-of date and summarise), with the owner
# decision Q6 and rule R3 of SECTION 23 that l03 reads. As-of date 2026-10-15.
# No question prints the ORASHI certificateDays figure: it sits within ten
# grading tolerances of a graded value in another tier, which bankleak refuses.
# 15 questions.

q(3, "certificationReadiness for ISO 14001:2015 at ORASHI returns ready false. What else does it return?",
 "A list of items, each with a severity, a count and a sentence, and a table of counts.",
 ["A readiness percentage weighted by severity, with the items that pulled it down.",
  "A single blocking reason, the first requirement that fails, as the earlier gates do.",
  "A score for each clause, with the certificate as a gate the rest of the list sits behind."],
 "The list has eleven items across blocking, serious and watch, and a table of counts beside it. It carries no percentage and no score, because any weighting of one item against another is somebody's opinion.")

q(1, "Under which severity does the item \"3 applicable clauses have never been examined by an internal audit.\" sit?",
 "blocking, beside the open major nonconformity",
 ["serious, beside the clause last audited before this cycle began",
  "watch, beside the clause review that is past due",
  "serious, beside the one clause never assessed at all"],
 "The four blocking items are the open major nonconformity, the 3 never examined clauses, the conformant clause with no evidence reference and the clause assessed nonconformant. The stale clause and the unassessed clause are serious.")

q(0, "ac1 is Corrective, In progress, due 2026-10-02, and reads overdue true. How does the readiness list carry it?",
 "As a serious item: 1 corrective or preventive action is past its due date.",
 ["As a watch item, beside the finding on the same Major that is past its due date.",
  "As a blocking item, being the corrective action on the open Major nonconformity.",
  "Not at all, since the open Major nonconformity already stands for it on the list."],
 "The serious items are the stale clause, the clause never assessed and the overdue action. \"1 finding is past its due date.\" is a watch item, and it is ISF-2026-004.")

q(2, "The certificate expiry is moved to 2026-10-14 and nothing else changes. What does the certificate item become?",
 "A serious item: the certificate expired 1 day ago, and a recertification audit is needed.",
 ["A watch item saying the certificate expires today and the audit should be booked now.",
  "A blocking item, because an expired certificate stops the rest of the list behind it.",
  "No item at all, because certificateExpiring reads false once the date has passed."],
 "At certificateDays -1 the item reads: \"The certificate expired 1 day ago. The organization cannot claim certification, and a surveillance audit is no longer possible: it needs a recertification audit.\" certificateExpired reads true.")

q(0, "Reading the edge table from a certificate far from expiry towards expiry, at which expiry date does the certificate item first appear?",
 "2027-01-13, at certificateDays 90, as a watch item",
 ["2027-01-14, at certificateDays 91, as the watch item",
  "2026-10-15, at certificateDays 0, as a watch item",
  "2026-10-14, at certificateDays -1, as a serious item"],
 "isoCompliance.CERTIFICATE_LEAD_DAYS is 90. At 91 days the row prints certificateExpiring false and no item; at 90 the watch item appears.")

q(2, "The expiry is moved to 2026-10-15, the as-of date itself. What do the two certificate flags read?",
 "certificateExpiring true, with certificateExpired false, on the expiry date itself",
 ["certificateExpiring false and certificateExpired true, once the expiry date is reached",
  "both flags true, since the certificate both expires and is still expiring on that day",
  "both flags false, until the expiry date has fully passed"],
 "certificateDays reads 0 and the watch item reads \"The certificate expires today. Book the recertification audit now.\" The today in it is the as-of date the engine was given.")

q(1, "The certificate expiry is recorded as the text tbc. What does the readiness list say about the certificate?",
 "Nothing: certificateDays reads null, both flags read false and no item is listed.",
 ["A serious item, because an expiry that cannot be read is treated as expired.",
  "A watch item asking for the expiry date to be recorded before the audit.",
  "A blocking item, since readiness cannot be judged without an expiry date."],
 "The rows for tbc and for null both print certificateDays null, certificateExpiring false, certificateExpired false and no item. An empty certificate line can mean the date is missing, and a reader has to know that.")

q(3, "Which record appears on the list under both blocking and watch?",
 "ISF-2026-004, as the open major nonconformity and as the finding past its due date",
 ["Clause 4.3, as a clause never examined and as the clause review past its due date",
  "Clause 7.2, as the unevidenced claim and as the clause never assessed at all",
  "ac1, as the overdue action and as the finding that is past its due date"],
 "Clause 4.3 raises the serious stale item and the watch review item. Clause 7.2 raises the blocking never-examined item and the serious never-assessed item. Each item asks a separate question, and one record can fail more than one.")

q(0, "Clause 4.3 raises two items at 2026-10-15. Which two?",
 "last audited before this cycle began, serious; its review past due, watch",
 ["never examined by an internal audit, blocking; and its review past due, watch",
  "last audited before this cycle began, blocking; conformant without evidence, blocking",
  "its review past due, serious; a finding past its due date, watch"],
 "Clause 4.3 reads stale true, last examined 2023-09-20, and review overdue true, next review 2026-10-01. Its evidence record reads true, so the unevidenced item is clause 5.2.")

q(1, "The blocking item \"1 clause is marked conformant with no evidence reference recorded.\" points at which record, and what does that record lack?",
 "Clause 5.2, which lacks its evidence reference and has its date and assessor",
 ["Clause 7.5.3, which lacks an internal audit examination and already has its evidence",
  "Clause 6.1.3, which lacks an evidence reference and reads Nonconformant in the register",
  "Clause 7.2, which lacks evidence, a date and an assessor, and reads Not assessed"],
 "missingEvidenceParts for 5.2 prints evidence reference, and its row reads assessed true and evidence record false. The readiness sentence names the part the claim lacks.")

q(2, "A standard with no clauses in the register is passed to certificationReadiness. What comes back?",
 "ready false, with one blocking item of count 0 saying there is nothing to be ready with",
 ["ready true, since no item on the list carries a count above 0",
  "no answer, the call refusing until at least one clause is added",
  "ready false, with one watch item asking for clauses to be registered"],
 "\"This standard has no applicable clauses in the register yet, so there is nothing to be ready with.\" The engine does not let the absence of problems pass for readiness when there is nothing to have problems with.")

q(3, "The summary prints open findings 3, and the readiness counts print openMajor 1 and openMinor 1. Which open finding sits in the first count and in neither of the other two?",
 "ISF-2026-003, the open Opportunity for improvement",
 ["ISF-2026-002, the Observation that was voided on 2026-06-13",
  "ISF-2026-001, the Major nonconformity closed on 2026-04-21",
  "ISF-2026-005, the open Minor nonconformity"],
 "The three open findings are ISF-2026-004, ISF-2026-005 and ISF-2026-003. openMajor counts ISF-2026-004 and openMinor ISF-2026-005. ISF-2026-001 and ISF-2026-002 read open false.")

q(1, "The summary prints audits open 2 and audits overdue 1. Which audit is open and not overdue?",
 "ISA-2026-001, Reported, since a Reported audit is delivered",
 ["ISA-2026-002, In progress, planned end 2026-10-09",
  "ISA-2025-003, Cancelled, since a cancelled audit stays open to the end",
  "ISA-2026-S01, as only Internal audits fall overdue"],
 "ISA-2026-001 reads open true and overdue false; ISA-2026-002 reads open true and overdue true. The other four read open false.")

q(0, "A report wants to state ORASHI's readiness from covered 8 and applicable 12. What does this module ask of it?",
 "Quote both counts and the list items beside them, and form no fraction or percentage.",
 ["Quote a percentage covered, rounded half up on the exact fraction as the engine does it.",
  "Quote covered on its own, since applicable follows from the certification cycle.",
  "Quote covered less the stale clause, as the effective coverage of the register."],
 "The digest prints no percentage from these counts and neither does the engine. The list already says 3 uncovered clauses are never examined and blocking and 1 is stale and serious; a percentage would average that away.")

q(2, "Suppose the ORASHI certificate ran to 2027-01-14 in place of 2027-01-08. How would the readiness list differ?",
 "The certificate item leaves the list, and the other ten items stay.",
 ["The list reads ready true, since the last watch item on it has gone.",
  "The certificate item moves from watch up to serious.",
  "Every watch item leaves the list with the certificate."],
 "At 91 days the row prints certificateExpiring false, certificateExpired false and no item. The digest does not print ready for the moved rows, and booking a recertification audit closes no open Major nonconformity.")

emit(Q, '/root/wt-as-compliance-nextgen/tools/course-banks/compliance/advanced/cqa_m05.json', expect_n=15)
finish()
