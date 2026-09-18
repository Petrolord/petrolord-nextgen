import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# compliance Expert final exam. Draws on all six modules of the tier (digest
# SECTIONS 18 to 24, with the root cause lists of SECTION 1) and asks across
# them: a question marked [two modules] needs two modules' readings at once.
# As-of date 2026-10-15. Written last. 42 questions.

# [two modules: m01, m05]
q(2, "Which single addition to the ORASHI record would clear the blocking item about a clause marked conformant with no evidence reference?",
 "An evidence reference recorded on clause 5.2",
 ["An assessor's name recorded on clause 6.1.3",
  "An internal audit examination of clause 7.5.3",
  "A written justification recorded on clause 4.4"],
 "Clause 5.2 claims conformity with its evidence record false, and missingEvidenceParts prints evidence reference for it. Its date and assessor are already there, since it reads assessed true.")

q(0, "An assessor finds clause 7.2 failing and has no document to point to. Can the verdict go on the register?",
 "Yes: Nonconformant with a date and an assessor is allowed with no evidence reference.",
 ["No: every clause verdict needs evidence, a date and an assessor before it stands.",
  "Only as Partially conformant, which asks for less on the record than Nonconformant.",
  "Only once an audit finding has been raised and recorded against the clause."],
 "The digest prints Nonconformant with a date and an assessor: ALLOWED. Partially conformant asks for all three, as Conformant does. A problem needs less on the record than a claim of conformity.")

q(3, "An ISO 45001:2018 register sets a clause to Not applicable on both fields and gives no reason. What does the refusal name?",
 "ISO 45001:2018, in the shape of the ISO 14001:2015 sentence",
 ["§4.3 of ISO 45001:2018, as the ISO 9001:2015 sentence cites its own clause",
  "No standard at all, since only ISO 9001:2015 is ever named in the refusal",
  "ISO 14001:2015, as the standard the ORASHI register itself is kept against"],
 "\"Say why this requirement of ISO 45001:2018 does not apply. A requirement determined not applicable keeps its justification on record.\" Rule R5: a sentence names the register's own standard.")

# [two modules: m01, m03]
q(0, "Clause 7.5.3 carries evidence, a date and an assessor behind its Conformant status. Which gate did it pass, and which count still leaves it out?",
 "It passed canSetClauseStatus, and coverage still reads it never examined.",
 ["It passed the lead auditor check, and the evidenced count still leaves it out.",
  "It passed canReportAudit, and the conformant count still leaves it out.",
  "It passed canSetClauseStatus, and the evidenced count leaves it out."],
 "The register verdict is the owner's assessment; coverage asks whether a counting internal audit examined the clause. ISA-2025-003 examined 7.5.3 on 2025-11-12 and was Cancelled, so it reads never.")

q(2, "At 2026-10-15, which ORASHI clause reads review overdue true?",
 "4.3, next review 2026-10-01, -14 days from the as-of date",
 ["6.1.2, next review 2026-11-02, 18 days from the as-of date",
  "7.2, next review 2027-01-31, still Not assessed",
  "6.1.3, next review 2027-06-12, 240 days from the as-of date"],
 "Clause 4.3 is the one row with a review date behind the as-of date. 6.1.2 reads review due soon true, and 7.2 and 6.1.3 read both flags false. The summary prints reviews overdue 1.")

q(2, "Who may lead the planned internal audit over 8.1, 8.2, 9.1.1 and 9.2 with the scope left as it is?",
 "u-chidi, or an external lead auditor named in text",
 ["u-tari, whose one clause in the scope is Conformant",
  "u-nneka, since clause 9.2 is the internal audit clause",
  "u-kalu, once another examiner records 8.1 and 8.2"],
 "Both of those rows read ALLOWED. u-tari owns 9.1.1, u-nneka 9.2 and u-kalu 8.1 and 8.2, and each is refused for owning a clause in the scope, whatever that clause's status.")

# [two modules: m02, m03]
q(0, "The planner drops 8.1 and 8.2 from the planned audit's scope so that u-kalu can lead it. What happens to clause 8.1's coverage row?",
 "Nothing moves: 8.1 keeps last examined 2024-05-16 from ISA-2024-001, since a planned audit does not count.",
 ["8.1 reads never, because a clause taken out of an audit's scope loses its examination history.",
  "8.1 reads stale, because a clause dropped from a planned scope lapses to before the cycle.",
  "8.1 reads covered by the new audit as soon as it is planned, whether or not it is in scope."],
 "Coverage reads the latest examination by a Reported or Closed internal audit, and Planned is neither. At a cycle of 3 years 8.1 reads covered true from ISA-2024-001. ISA-2026-002, In progress, shows the same: its 2026-10-06 examination of 5.2 moves no date.")

q(1, "A member of an audit team is refused by canExamineClause. What does that refusal ask for?",
 "That another member of the audit records the result for that clause.",
 ["That the scope drop the clause the member owns before the audit starts.",
  "That the lead auditor countersign the result before it is recorded.",
  "That the clause owner in the register be changed to somebody else first."],
 "The examiner refusal ends \"so somebody else on the audit has to record this result.\" It offers no change of scope; that remedy is the lead auditor refusal's, together with a change of auditor.")

q(0, "Which of these pairings of an app with the name its independence check reads is correct?",
 "Audit & Findings Manager: the lead auditor against the auditee",
 ["Document Control: the reviewer against the owner of the clause",
  "ISO register: the lead auditor against the auditee of the audit",
  "Audit & Findings Manager: each examiner against the clause owner"],
 "Three records, three names: clause owners for the ISO register, the auditee for the Audit & Findings Manager, the revision's author for Document Control. u-adaeze, author of rev-0019-10, is refused as its reviewer.")

# [two modules: m02, m03]
q(2, "The certification body's surveillance audit examined clause 6.1.2 in 2026. Why is 6.1.2 still among the clauses never examined?",
 "Only Internal audits count, and no internal audit has examined 6.1.2.",
 ["Its surveillance result was Conformant, and only a Nonconformant result counts as an examination.",
  "6.1.2 is Partially conformant, and coverage leaves out any clause without a full verdict recorded.",
  "The surveillance audit is still waiting for its report, so its results do not count yet."],
 "COVERING_AUDIT_TYPES holds the one word Internal. ISA-2026-S01 examined 6.1.2, Conformant on 2026-07-22, and the coverage row for 6.1.2 still reads last examined never, by audit none.")

q(3, "Which ORASHI audits count towards coverage?",
 "ISA-2023-002, ISA-2024-001 and ISA-2026-001",
 ["ISA-2026-001 and ISA-2026-S01",
  "ISA-2026-001 and ISA-2026-002, the two still open",
  "All five of the Internal audits, whatever their status"],
 "Two Closed internal audits and one Reported one. ISA-2026-S01 fails on its type, ISA-2026-002 (In progress) and ISA-2025-003 (Cancelled) on their status.")

q(1, "What separates a stale clause from a never examined one?",
 "A stale clause had a counting examination before the cycle began; a never examined clause had none at all.",
 ["A stale clause was examined by a Surveillance audit; a never examined clause by nobody at any time.",
  "A stale clause failed its last examination; a never examined clause was not reached by its audit.",
  "A stale clause is past its review date; a never examined clause has no review date on the register."],
 "Clause 4.3, last examined 2023-09-20, reads stale true. Clauses 6.1.2, 7.2 and 7.5.3 read never with stale false. The list ranks them apart: never examined blocking, stale serious.")

q(1, "A register mixes ISO 14001:2015 and ISO 45001:2018 clauses. Which call reads each clause against its own standard's cycle?",
 "clauseCoverageByStandard",
 ["clauseCoverage",
  "certificationReadiness",
  "missingEvidenceParts"],
 "clauseCoverage is run over the register at one cycle, 3 years, and again at 1, 2 and 4. clauseCoverageByStandard reads ISO 14001:2015 at 3 years and ISO 45001:2018 at 1 year, so two clauses last examined 2025-10-14 read covered and stale.")

q(3, "At a cycle of 1 year, what does the ORASHI coverage table print?",
 "covered 6, stale 3, never examined 3",
 ["covered 8, stale 1, never examined 3",
  "covered 9, stale 0, never examined 3",
  "covered 6, stale 0, never examined 6"],
 "The rows read 1 year: 6, 3, 3; 2 years: 6, 3, 3; 3 years: 8, 1, 3; 4 years: 9, 0, 3. Never examined does not move with the cycle.")

q(3, "Clause 5.2's latest counting result is an Observation. Does 5.2 read covered?",
 "Yes: the examination on 2026-06-09 is inside the cycle, whatever it found.",
 ["No: an Observation records a remark and is not a verdict on the clause.",
  "No: the clause stays uncovered until the observation is closed as a finding.",
  "Yes, though only once ISA-2026-002 reports its later Conformant result."],
 "Coverage records that a counting audit looked at the clause inside the cycle, and the result is read elsewhere. An Observation on 5.2 and a Nonconformant result on 6.1.3 both read covered true.")

q(2, "Which ORASHI finding does canCloseFinding allow at 2026-10-15?",
 "ISF-2026-003, which may close with nothing more recorded",
 ["ISF-2026-005, which may close on its action ac3",
  "ISF-2026-001, which may close a second time",
  "ISF-2026-002, which may close again once voided"],
 "ISF-2026-005 is refused for want of its correction, ISF-2026-004 for its open action, ISF-2026-001 as already closed and ISF-2026-002 as already voided. An Opportunity for improvement is no nonconformity.")

q(3, "A corrective action on a Major nonconformity is checked and found not to have worked. What does the engine ask for?",
 "Another corrective action, raised in place of closing over the one that failed.",
 ["The correction recorded again, since the instance has come back.",
  "The root cause changed to Other, since the first cause was wrong.",
  "The finding downgraded to a Minor nonconformity so it can close."],
 "\"A corrective action here was checked and found not to have worked. Raise another one rather than closing over it.\" Only a corrective action verified effective closes a Major nonconformity.")

q(3, "On an NCR in the quality module, which record plays the part a correction plays on a finding?",
 "The disposition agreed on the nonconforming item",
 ["The corrective action, which deals with the cause",
  "The root cause, which names the category of failure",
  "The effectiveness check, which proves the fix worked"],
 "The quality module pairs the two in its refusal: a disposition deals with the item and a corrective action with the cause. On a finding a correction deals with the instance, so the disposition is its counterpart on an NCR.")

q(3, "A cause recorded as Measurement or inspection on an NCR and one recorded as Measurement or monitoring on a finding: how should a reader count them?",
 "As two categories from two lists, each quoted in its own list's words.",
 ["As one category, since both of them describe a measurement failure.",
  "As the ISO category, since the quality list is a subset of the ISO list.",
  "As Other, since neither list holds the other list's word for it."],
 "Measurement or inspection is only in the quality list of 9; Measurement or monitoring and Management system are only in the ISO list of 10. The quality list is no subset of the ISO list.")

q(3, "ISF-2026-001 was raised 2026-02-03 and closed 2026-04-21. What happens to its age as the as-of date moves later?",
 "It stays fixed, since it answers how long the finding took to close.",
 ["It grows by one each day, in the same way an open finding's age grows.",
  "It resets to zero at closure.",
  "It grows until its due date, 2026-04-30."],
 "A closed or voided finding stops ageing at its closed date. The three open findings, raised 2026-06-12, read 125 at 2026-10-15 and keep growing.")

q(2, "Which ORASHI finding sorts first in findingByUrgency, and at which rank?",
 "ISF-2026-004 at rank 0, an open Major nonconformity that is overdue",
 ["ISF-2026-003 at rank 0, the open finding with the earliest raised date",
  "ISF-2026-001 at rank 1, the Major nonconformity raised earliest of all",
  "ISF-2026-005 at rank 2, the open finding whose due date falls latest"],
 "Rank 0 is an open Major nonconformity that is overdue, and ISF-2026-004, due 2026-09-30, is the only finding reading overdue true. ISF-2026-003 and ISF-2026-005 both rank 3, and ISF-2026-001 ranks 4.")

q(1, "An audit reads Fieldwork complete and its planned end has passed. Is it overdue?",
 "Yes, in both modules",
 ["No, as its fieldwork is done",
  "Only in auditManagement",
  "No, only Planned and In progress are"],
 "isAuditOverdue reads Fieldwork complete true in isoCompliance and in auditManagement. AUDIT_UNDELIVERED_STATUSES holds Planned, In progress and Fieldwork complete; an audit is overdue only while it is undelivered.")

q(0, "A certificate has 91 days left to run. What do its two flags read, and what does the list carry for it?",
 "Both flags false, and no certificate item on the list.",
 ["certificateExpiring true, and a watch item on the list.",
  "certificateExpiring true, and no item on the list yet.",
  "Both flags false, and a watch item counting the days."],
 "The lead window is 90 days, so a certificate one day beyond it raises neither flag. Moved one day nearer, to 2027-01-13, the row reads certificateExpiring true with a watch item.")

q(1, "A certificate reads certificateDays -15. Which flag reads true?",
 "certificateExpired alone, since rule R3 keeps the two apart",
 ["certificateExpiring alone, until the recertification audit is booked",
  "certificateExpired and certificateExpiring, both of them",
  "Neither flag, since certificateDays below 0 reads null"],
 "Rule R3: expired and expiring are two separate flags, and a certificate at -15 reads certificateExpiring false and certificateExpired true. Under Q6 an expired certificate is a serious readiness item.")

q(0, "Which three items does the ORASHI readiness list rank serious?",
 "the stale clause, the clause never assessed and the overdue action",
 ["the open Major, the never examined clauses and the unevidenced claim",
  "the minor nonconformity, the past-due review and the overdue finding",
  "the stale clause, the overdue finding and the certificate item"],
 "The serious items read: 1 clause last audited before this certification cycle began, 1 applicable clause never assessed, and 1 corrective or preventive action past its due date.")

q(0, "Of the four blocking items on the ORASHI readiness list, which one comes from a finding?",
 "The item counting each Major finding still open",
 ["The clauses never examined by an internal audit",
  "The clause marked conformant with no evidence reference",
  "The clause assessed nonconformant and not yet resolved"],
 "\"1 major nonconformity is open. A certification body will not recommend certification over one.\" ISF-2026-004 is the one open Major. The other three blocking items count clauses: 3 never examined, 5.2 without its evidence reference and 6.1.3 assessed nonconformant.")

# [two modules: m04, m05]
q(1, "The watch item \"1 minor nonconformity is open.\" stands on the ORASHI list. Which finding is behind it, and what keeps that finding from closing?",
 "ISF-2026-005, which has no correction recorded yet",
 ["ISF-2026-003, with an action still open",
  "ISF-2026-004, which has no corrective action verified effective",
  "ISF-2026-002, which was voided before its correction was recorded"],
 "openMinor 1 is ISF-2026-005, due 2026-12-11. canCloseFinding refuses it with the correction sentence: \"Record the correction: what was done about the thing that was found.\" ISF-2026-004 is the open Major, a blocking item.")

# [two modules: m03, m05]
q(0, "The blocking item for never-examined clauses cites which requirement?",
 "ISO 14001:2015 §9.2: the organization audits its own system",
 ["ISO 19011, which bars an auditor from auditing their own work",
  "ISO 9001:2015 §4.3, which keeps a justification for an exclusion",
  "ISO 14001:2015 §9.2, which calls for certification body surveillance"],
 "\"3 applicable clauses have never been examined by an internal audit. ISO 14001:2015 §9.2 requires the organization to audit its own system.\" COVERING_AUDIT_TYPES holds Internal alone, so a surveillance audit moves no clause's date.")

q(2, "Which readiness count and summary count print the same figure for the same thing under two names?",
 "covered 8 and clauses covered 8",
 ["openMajor 1 and open findings 3",
  "evidenced 9 and unevidenced claims 1",
  "staleAudited 1 and reviews overdue 1"],
 "Never audited 3 and neverAudited 3 are another such pair. staleAudited 1 is clause 4.3's coverage and reviews overdue 1 is clause 4.3's review: equal figures, two different counts.")

q(2, "Owner decisions Q4, Q5 and Q6 each show up in one module of this tier. Which pairing is right?",
 "Q4 coverage, Q5 independence, Q6 readiness",
 ["Q4 independence, Q5 coverage, Q6 findings",
  "Q4 findings, Q5 coverage, Q6 the claim register",
  "Q4 readiness, Q5 findings, Q6 independence"],
 "Q4: ISO coverage counts only Reported or Closed audits. Q5: every examiner is checked for independence. Q6: an expired certificate is a serious readiness item, one inside the lead window a watch item.")

q(3, "An app shows no overdue review for a document. Which held limit should stop a reader taking that at face value?",
 "An unreadable today is refused in one module only, so a clean screen elsewhere proves nothing.",
 ["A templated audit with no checklist items passes the unanswered-items rule vacuously.",
  "A complete programme containing a cancelled audit reads below one hundred percent.",
  "A missing review period makes nextReviewDate return a date 24 months after issue."],
 "Of the four held limits this is the one a screen hides: an empty overdue list looks the same whether today was read or not. The other three concern a missing review period, a templated audit and a programme with a cancelled audit.")

q(0, "Rule R1 puts one rule behind three exports. What does that rule decide?",
 "Whether an audit is outstanding, for programmeProgress, summarise and canCompleteProgramme alike",
 ["Whether an audit is overdue, for isoCompliance and auditManagement alike",
  "Whether a percent rounds up, for each of the three exports that print one",
  "Whether a sentence names its standard, for every refusal that is returned"],
 "On four audits with one cancelled and no reason, programmeProgress counts 2 outstanding and summarise counts 2. The overdue rule for audits is the ASC-1 rule, a separate one.")

q(0, "An obligation with no lead time set reads Due soon. What does its reason say?",
 "That it is inside the default lead time, and that none is set for this obligation.",
 ["That it is due soon, with nothing said about which lead time was applied.",
  "That a lead time must be recorded before any status can be derived.",
  "That it reads On track, since only a recorded lead time starts Due soon."],
 "The ASC-1 rule: the Due soon reason says when the default lead time applies, as REG-2026-012's reason does. complianceStatus.DEFAULT_LEAD_TIME_DAYS is the default it names.")

q(1, "A golden figure sits beside an engine figure and the two agree. What has that shown?",
 "Two methods agreeing, one of them an independent Python oracle.",
 ["That the engine was run twice with one result.",
  "That the refusal sentence beside the figure is correct word for word.",
  "That the figure matches a published standard's own worked example."],
 "Each golden file is written by an independent stdlib Python oracle from the rules as the modules and the status document state them. The oracles check a gate's verdict and never its wording.")

q(2, "The oracle table gives sort cases a column of their own. Which module's golden file carries 3 of them?",
 "complianceStatus, of 171 golden cases",
 ["qualityAssurance, of 422 golden cases",
  "auditManagement, of 181 golden cases",
  "documentControl, of 130 golden cases"],
 "The sort cases column reads complianceStatus 3, documentControl 2, qualityAssurance 2, auditManagement 2, isoCompliance 1 and calendar 0. A sort case counts as a case for the sort it names.")

q(2, "Which of these does this course own?",
 "Audit independence and the root cause categories",
 ["Risk scores, risk bands and heat maps",
  "The Management of Change approval gates",
  "How a lesson learned is written and approved"],
 "This course owns audit independence in both forms, the audit and finding lifecycles and the root cause categories. The other three belong to riskchange, \"Risk, Change & Learning\".")

# [two modules: m01, m02]
q(1, "Clause 7.2 is set to Nonconformant with no date. What does canSetClauseStatus ask for?",
 "A date for the assessment and the assessor's name.",
 ["The evidence, the date it was assessed and who assessed it.",
  "Why the requirement does not apply, kept on record.",
  "The applicability and the status set together."],
 "The refusal reads \"Record the date this was assessed and who assessed it.\" A Nonconformant verdict is allowed with no evidence reference. The sentence naming all three belongs to Conformant and Partially conformant requests.")

# [two modules: m03, m05]
q(1, "Which clause does the serious item \"1 clause was last audited before this certification cycle began.\" point at, and what was its last counting examination?",
 "4.3, examined 2023-09-20 by ISA-2023-002",
 ["8.1, examined 2024-05-16 by ISA-2024-001",
  "6.1.2, examined 2026-07-22 by ISA-2026-S01",
  "7.5.3, examined 2025-11-12 by ISA-2025-003"],
 "Clause 4.3 reads stale true, at -1121 days. 8.1 is covered at 3 years, and 6.1.2 and 7.5.3 were examined only by audits that do not count, so both read never.")

# [two modules: m04, m05]
q(0, "ac4 is Preventive, Complete, with no effectiveness verdict. Where does it show in the ORASHI counts?",
 "In the summary's awaiting an effectiveness check 1",
 ["In the summary's overdue actions 1, as its due date 2026-09-01 has passed",
  "In the summary's open actions 2, counted beside ac1",
  "Nowhere, since a Complete action leaves every count"],
 "The summary's open actions 2 are ac1 and ac3, and overdue actions 1 is ac1. ac4 reads open false and overdue false, and the digest names it as the action awaiting an effectiveness check.")

# [m04, the shared functions of SECTION 1]
q(3, "How does canCloseFinding in the Audit & Findings Manager relate to canCloseFinding in the ISO register?",
 "They are one function, so a finding closes by one rule in both apps.",
 ["The Audit & Findings Manager's copy skips the effectiveness check on a Major.",
  "They agree on Majors and differ on Minors.",
  "The ISO version asks for an independent examiner before it closes a finding."],
 "One function object serves both apps, so the Major walk, with its correction, root cause, corrective action and effectiveness check, is the same walk in each. isoCompliance.isActionOverdue is likewise the quality module's isCapaOverdue.")

q(1, "What does rule R5 guarantee a reader of a refusal or of a readiness sentence?",
 "That it names the standard of the register it was read against.",
 ["That it cites a numbered clause of whichever standard it names.",
  "That the oracle has checked its wording word for word.",
  "That it names ISO 19011 whenever a person is refused."],
 "The ORASHI list carries 1 item naming ISO 14001:2015 and 0 naming ISO 9001. Only the ISO 9001:2015 Not applicable refusal cites a numbered clause, §4.3.")

# [two modules: m01, m05]
q(1, "Which one action on the record would remove the serious item about a clause never assessed at all?",
 "Assessing clause 7.2 and recording a verdict that canSetClauseStatus allows",
 ["Auditing clause 7.2 in an internal audit and reporting the audit that examined it",
  "Recording an evidence reference against clause 5.2 in the register",
  "Setting 7.2 to Not applicable while its applicability reads Applicable"],
 "Clause 7.2 reads Not assessed, and notAssessed 1 is the count behind the serious item. An internal audit would clear its blocking never-examined item and leave the register verdict missing, and setting Not applicable with applicability unchanged is refused.")

emit(Q, '/root/wt-as-compliance-nextgen/tools/course-banks/compliance/advanced/cqa_exam.json', expect_n=42)
finish()
