import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
TRACE=[]
def q(k,p,c,ds,e,src):
    # k the key's index (0 to 3), p the prompt, c the correct option, ds the
    # three distractors, e the explanation, src the PACK.md passage ids (P001
    # style) the key rests on: at least one, read by gate_source_trace.py and
    # never printed to a learner.
    Q.append((k,p,c,ds,e)); TRACE.append(list(src))

# SC5 Professional m02, Supplier Performance Reviews. 15 questions.
# Lessons: The review cycle; The scorecard and its evidence; Running the review meeting; Improvement plans that close.
# Topics: T04, T07.
# Every key rests on a PACK.md passage named in its src list; the
# explanation cites the SOURCE by name and locator (an Act and its section,
# a guidance and its paragraph), never a passage id or a pack section.
# ---- questions (Professional bank writer) ----
q(3,
  "EKC-01, the synthetic Ekene well services framework with WS-A, states a quarterly performance review. In the third quarter the drilling programme is at its busiest, and the Ekene drilling lead asks to skip the review until the new year. What do the sources support?",
  "Hold the review this quarter, because the framework states a quarterly review and is managed by its terms",
  ["Skip it, since a review is a courtesy that either party may postpone whenever its own workload rises sharply",
   "Replace it with an informal phone call, since a call satisfies any review a framework states",
   "Skip it, provided the missed quarter is covered at a longer annual review held in the new year"],
  "The World Bank's Contract Management Practice guidance, taught by concept, reminds its reader that a contract is managed according to its own terms, and EKC-01's terms set a quarterly review. A stated review is not a courtesy, a phone call leaves none of the record a review should leave, and folding a quarter into a later annual meeting changes the cycle the framework sets without any change to the framework.",
  ['P007'])

q(0,
  "At the start of EKC-06, the synthetic Ekene instrument maintenance service with IM-F, the contract manager writes a calendar of monthly report checks, contractual reviews and a yearly look by the contract owner. Which World Bank expectation, taught by concept, does a calendar written at the start best show?",
  "That contract management is planned, carried out, monitored and evaluated systematically",
  ["That the Bank's prior review is sought and received before any review meeting is held on it",
   "That the World Bank sets the dates of every review meeting for each contract that it finances",
   "That each review is held within a set number of days of the contract start"],
  "The World Bank Procurement Regulations (Seventh Edition, September 2025), Annex XI, taught by concept, call for contract management that is planned, carried out, monitored and evaluated systematically, and a calendar set at the start is the simplest evidence of that. The Bank's prior review applies to decisions such as large variations, it does not fix review dates for its borrowers, and no text sets a day count for a first review.",
  ['P009'])

q(2,
  "An Ekene contract manager (synthetic) reads the UK Procurement Act 2023 as enacted, s.71(2), on assessing supplier performance against KPIs at least once in every twelve months and on termination. How does that duty bear on EKC-01, the Ekene well services framework?",
  "It binds UK contracting authorities; for Ekene it is published practice that suggests a yearly assessment and one at the end as a sensible least",
  ["It binds EKC-01 directly, because every oil and gas framework is a public contract under the UK Procurement Act 2023",
   "It replaces EKC-01's quarterly review, because the UK Act sets a single yearly assessment for every framework",
   "It has no bearing at all, because a UK Act can offer nothing of use to a contract managed in Nigeria"],
  "Section 71(2) of the UK Procurement Act 2023 binds UK contracting authorities to assess performance at least once in every twelve months and on termination. An Ekene contract is not a UK public contract, so the section is read as published practice. It does not displace the quarterly review EKC-01 states, and a yearly assessment with one at the end remains a sensible floor for any contract team.",
  ['P069'])

q(1,
  "The synthetic Ekene team is redesigning the EKC-03 scorecard for CF-C's camp catering. Following principle 7 of the UK Contract Management Principles as practice, what should the scorecard measure?",
  "Hard data such as KPI and service level results alongside softer measures such as user satisfaction",
  ["Service level results alone, because a satisfaction measure cannot be written down, dated or checked later",
   "User satisfaction alone, because service levels are already covered by the service credits",
   "The number of complaints alone, since complaints are the one measure every supplier accepts"],
  "Principle 7 of the UK Contract Management Principles asks for a balanced scorecard measuring hard data such as KPI performance alongside soft measures such as customer satisfaction and relationship management, with a focus on outcomes. Each single-measure option drops half of that balance, and service credits are a remedy for a missed level; they do not replace measuring it.",
  ['P041'])

q(0,
  "The UK Procurement Act 2023 as enacted, s.52(4), defines a key performance indicator. Taking that definition as practice, which item on the draft EKC-06 scorecard for IM-F (synthetic) fits it most closely?",
  "Planned work completed each month, a measure against which IM-F's performance can be assessed while the contract runs",
  ["The hourly rate IM-F charges, since the rate is a factor that appears on every invoice IM-F sends",
   "The number of IM-F staff on the Ekene site, since headcount is a fact Ekene can easily count",
   "The date the contract was signed, since it anchors every later review of IM-F's work"],
  "Section 52(4) of the UK Procurement Act 2023 defines a key performance indicator as a factor or measure against which a supplier's performance of a contract can be assessed during its life-cycle. Planned work completed measures performance. An hourly rate is a price term, headcount is an input that says nothing on its own about performance, and a signature date is a fixed fact of the contract.",
  ['P036'])

q(3,
  "The Ekene operations team (synthetic) wants IM-F scored on how quickly its technicians answer the telephone at night. EKC-06 states KPIs for planned work completed and repeat failures, and says nothing about night calls. How should the night-call line appear on the scorecard?",
  "As a management measure for discussion, with no contractual remedy",
  ["As a KPI, since any measure agreed by the operations team becomes a KPI",
   "As a KPI with a service credit, applied from the date the line was added",
   "As grounds for a formal notice whenever the night target is not met"],
  "A KPI is a measure the contract states, as the UK Procurement Act 2023, s.52(4), frames it, and the World Bank's Contract Management Practice guidance, taught by concept, says a contract is managed by its own terms. A measure EKC-06 does not state is a management measure: useful at a review and carrying no remedy. Making it a KPI, attaching a credit or giving notice under it would need a change to the contract first.",
  ['P036', 'P007'])

q(1,
  "Drafting the scorecard for EKC-02, the synthetic Ekene supply vessel charter with MV-B, the logistics team proposes thirty KPIs for the one vessel. What does the Sourcing Playbook (June 2023), Chapter 5, read as UK practice, warn?",
  "That more than 10 to 15 KPIs per service leads to overcomplicated contracts and ambiguity with suppliers",
  ["That a vessel charter needs at least thirty KPIs so that every single part of the vessel's service is covered",
   "That the number of KPIs has no effect at all, provided each one carries its own service credit in the charter",
   "That KPIs are for services, so a vessel charter should state no KPIs and rely on off-hire alone"],
  "The Sourcing Playbook, Chapter 5, warns that having too many KPIs, more than 10 to 15 per service, leads to overcomplicated contracts and ambiguity with suppliers. Thirty KPIs for one vessel is the case it warns against. Nothing in the Playbook asks for a minimum of thirty, attaching credits does not cure complexity, and a charter with availability as its service level is a service with measures.",
  ['P040'])

q(2,
  "The synthetic Ekene team borrows the five ratings that the UK guidance on Key Performance Indicators describes for published KPI assessments. In one quarter WS-A's mobilisation on time sits significantly below the EKC-01 KPI. Which rating fits?",
  "Inadequate",
  ["Requires improvement",
   "Approaching target",
   "Other, since no rating fits"],
  "The UK guidance on Key Performance Indicators, para 15, describes five ratings set by regulation: Good (meeting or exceeding the KPI), Approaching target, Requires improvement (below the KPI), Inadequate (significantly below the KPI) and Other (none fits). Significantly below is Inadequate. Requires improvement is for performance below the KPI without the word significantly, Approaching target is near the KPI, and Other is kept for cases no description fits.",
  ['P039'])

q(2,
  "At the EKC-06 quarterly review (synthetic), IM-F reports 96 planned jobs completed and the Ekene work order system shows 88. What should happen before the review rates that scorecard line?",
  "Both records are examined, since each line should point to evidence of what was performed and delivered",
  ["IM-F's figure is used, since the supplier's monthly service report is the contract's only record of work",
   "Ekene's figure is used, since the operator's own system is always taken as correct in any dispute over data",
   "The two figures are averaged to 92, so that neither party's record is preferred over the other"],
  "The World Bank's Contract Management Practice guidance, taught by concept, lists what a contract manager records: how the supplier performed and delivered, every communication and notice, the dates and who was involved. A line is rated on that evidence, so the review looks at both records to find why they differ. Taking either figure on trust or averaging them rates the line without resolving the difference.",
  ['P160'])

q(0,
  "At the second quarterly review of EKC-01 (synthetic), WS-A has missed its KPI on non-productive time caused by the supplier. The Ekene drilling lead wants to write the actions straight away. Following the World Bank's Contract Management Practice guidance, taught by concept, what comes first?",
  "Finding the underlying cause of the miss, then dealing with it through an action plan",
  ["Issuing a formal notice, since any missed KPI is a breach that needs one issued at once",
   "Writing the actions now and asking WS-A to explain the cause at the next review",
   "Deducting a service credit, since every missed KPI carries one under the framework"],
  "The World Bank's Contract Management Practice guidance, taught by concept, expects the underlying cause of a missed KPI to be found and the problems dealt with through an action plan. Actions written before the cause is known may not address it. A formal notice is a later step in proportion to the failure, and EKC-01 states KPIs without service credits, so there is no credit to deduct.",
  ['P042'])

q(3,
  "At the EKC-03 monthly meeting (synthetic), CF-C has passed every cleanliness audit, yet the scores have fallen for three months in a row toward the pass line. Reading GovS 008 (version 2.2), clause 5.4.3, as practice, what does the standard allow?",
  "Preventative action now, since the clause covers performance unlikely to meet the contract",
  ["No action at all until CF-C actually fails a cleanliness audit and a service credit is applied",
   "An immediate formal notice of breach, because a falling trend is itself a breach of the contract",
   "A reduction in the monthly fee, because a falling trend entitles Ekene to reprice the service"],
  "GovS 008 at 5.4.3 says that where performance is unlikely to, or does not, meet the requirements of the contract, preventative and/or corrective action should be taken within the terms of the contract. The words unlikely to let a review act on a trend before a level is missed. A trend within the levels is not a breach, and the contract gives no right to reprice for it.",
  ['P067'])

q(1,
  "Ekene's contract team (synthetic) is setting the standing agenda for every EKC-01 quarterly review with WS-A and asks why Nigerian content belongs on it. Which provision of the content Act answers that?",
  "The content Act, s.66: operators communicate their Nigerian content policies to contractors, and monitor and enforce compliance",
  ["The content Act, s.60: the operator's annual performance report falls due at each quarterly review, so the review is where it gets filed",
   "The UK Procurement Act 2023, s.52: three KPIs above £5 million, one of them on Nigerian content",
   "The content Act, s.104(2): the quarterly review is the moment at which one per cent of each call-off's value is deducted at source and paid"],
  "The content Act (Act No. 2 of 2010), s.66, requires operators to communicate their Nigerian content policies and procedures to their contractors and subcontractors and to monitor and enforce compliance; the review is where that monitoring happens. Section 60 sets an annual report within sixty days of the beginning of each year, the UK Act does not bind Ekene and says nothing on Nigerian content, and s.104(2) concerns deductions into the Fund.",
  ['P132'])

q(3,
  "An Ekene manager (synthetic) says the UK Procurement Act 2023 obliges Ekene to set at least three KPIs on EKC-05, the flowline works, because its value is above £5 million. On the sources, what is the position?",
  "Section 52(1) binds UK contracting authorities; Ekene may adopt it only as practice",
  ["The duty binds EKC-05, since any contract above £5 million falls under the UK Act",
   "The duty binds EKC-05, but only once the Board has confirmed the contract's value",
   "The duty applies, with at least three KPIs for each million pounds of contract value"],
  "Section 52(1) of the UK Procurement Act 2023 requires a contracting authority to set at least three KPIs before entering into a public contract worth more than £5 million. It binds UK contracting authorities, and an Ekene contract is governed by its own terms within Nigerian law. The Board has no role under the UK Act, and the section sets three KPIs in all, with no count per million.",
  ['P035'])

q(0,
  "A synthetic Ekene team member reads that the UK duty to set at least three KPIs can fall away. According to the UK guidance on Key Performance Indicators, para 10, when is that?",
  "Where performance could not appropriately be assessed through KPIs, such as a one-off delivery of off-the-shelf goods",
  ["Whenever the supplier asks in writing that its contract carries no KPIs",
   "Whenever the contract runs for less than twelve months from its award",
   "Whenever the contract includes service credits in place of performance measures"],
  "The UK guidance on Key Performance Indicators, para 10, says the duty falls away where the authority considers performance could not appropriately be assessed through KPIs, giving a one-off delivery of off-the-shelf goods as its example. A supplier's request, a short term or the presence of service credits is not the test. For Ekene, which the UK Act does not bind, the example is still a useful guide to where KPIs add little.",
  ['P037'])

q(2,
  "CF-C (synthetic) agrees an improvement plan on EKC-03 after failing the cleanliness audit in three months of four. Which closure test lets the plan close on evidence?",
  "Pass the cleanliness audit in each of an agreed number of months",
  ["Make every reasonable effort to raise the cleanliness standard at the camp",
   "Improve cleanliness to the satisfaction of the Ekene logistics team",
   "Show a clear commitment to cleanliness at the next quarterly review"],
  "The World Bank's Contract Management Practice guidance, taught by concept, expects a missed measure to be addressed through an action plan after its cause is found, and GovS 008 at 5.4.3 expects corrective action within the terms of the contract. A plan closes only when a stated measure shows the failure is fixed. Effort, satisfaction and commitment cannot be tested at a checkpoint, while audits passed over an agreed run of months can.",
  ['P042', 'P067'])
# ---- end of questions ----

emit(Q, '/root/cat-wip-contracts/banks/sc5i_m02.json', expect_n=15)
finish()
