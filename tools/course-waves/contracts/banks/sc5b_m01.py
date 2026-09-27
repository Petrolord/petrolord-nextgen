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

# SC5 Associate m01, Contract Management and Its Sources. 15 questions.
# Lessons: What contract management is; The contract lifecycle from award to close; Owners, managers and the supplier; The sources and the dates they were checked; A practice course and its written work.
# Topics: T01, T15.
# Every key rests on a PACK.md passage named in its src list; the
# explanation cites the SOURCE by name and locator (an Act and its section,
# a guidance and its paragraph), never a passage id or a pack section.
# FILLED AT THE BANK STAGE (Associate bank writer).

q(2, "EKC-06 is a synthetic instrument maintenance contract with supplier IM-F (synthetic). A new engineer asks what contract management is for. Which aim do the World Bank Procurement Regulations for IPF Borrowers (Seventh Edition, September 2025) give it?",
 "That Ekene and IM-F each meet what they owe under the contract.",
 ["That IM-F's hourly rate falls at every renewal.",
  "That IM-F meets its own duties, since the buyer's part of the bargain is finished once the contract is signed.",
  "That the contract is brought into line with the latest UK government commercial standard each year."],
 "The World Bank Regulations give contract management one aim: every party meets what it owes under the contract (Section V, para 5.97). The buyer is a party too, so its own duties, timely payment among them, stay live after signature. Squeezing a rate is a commercial choice the Regulations do not name as the aim, and a UK standard does not govern an Ekene contract.",
 ['P008'])

q(0, "Under the UK Government Functional Standard GovS 008: Commercial (version 2.2), who is accountable to the senior business owner for the day-to-day delivery of a contract?",
 "The contract manager, who also produces and maintains the contract management plan.",
 ["The commercial specialist who ran the tender, until the first review.",
  "The supplier's account lead, since delivery is the supplier's duty.",
  "The senior business owner personally, with the contract manager acting only as its note taker."],
 "GovS 008 at 4.6.6 makes the contract manager accountable to the senior business owner for managing day-to-day delivery, including producing and maintaining the contract management plan. The tender specialist hands over at award, the supplier answers for its own delivery inside its own organisation, and the senior business owner sits above the manager with a different job (4.6.5).",
 ['P001'])

q(3, "Ekene is naming the contract owner for EKC-05, a synthetic flowline replacement lump sum with FW-E (synthetic). Which description matches the senior business owner role set out in the UK Government Functional Standard GovS 008 (version 2.2) at 4.6.5?",
 "Owns the case for the contract and keeps specialists involved across its life.",
 ["Signs every milestone certificate for the flowline works and every monthly invoice FW-E submits.",
  "Chairs the tender evaluation panel and then steps away once the contract is awarded.",
  "Supervises the site crew and keeps the daily inspection log."],
 "GovS 008 at 4.6.5 places a senior business owner above the contract: that person owns the justification for it, is accountable for parts of its governance and management, and keeps commercial and other specialists involved across the whole life cycle. Certifying milestones and keeping daily logs are the contract manager's and the site team's work, and the owner's role runs past award.",
 ['P002'])

q(1, "A question arrives on EKC-07, a synthetic environmental monitoring consultancy with EM-G (synthetic): may EM-G bill a site visit that no approved timesheet shows? According to the World Bank Contract Management Practice guidance (Second Edition, 2024), where does the answer start?",
 "In the EM-G contract itself, since a contract is managed on its own terms.",
 ["In whatever the previous consultant was allowed to bill.",
  "In the UK Procurement Act 2023, which fixes consultancy pay.",
  "In a quick call with EM-G's key person, whose word settles the billing basis."],
 "The World Bank guidance reminds its reader that a contract is managed according to its own terms (Introduction, p.1), so the fee and timesheet clauses of the EM-G contract answer the question. Past custom and a phone call are no substitute for the terms, and the UK Procurement Act 2023 binds UK contracting authorities only.",
 ['P007'])

q(1, "The World Bank Procurement Regulations for IPF Borrowers (Seventh Edition, September 2025), Annex XI para 2.1, describe contract management done systematically. Which set of verbs do they use?",
 "Planned, carried out, monitored and evaluated.",
 ["Tendered, awarded, signed and filed away until the contract's expiry date.",
  "Negotiated, renegotiated and settled whenever the supplier asks for it.",
  "Delegated in full to the supplier, then audited once after the final payment."],
 "Annex XI para 2.1 calls for contract management that is planned, carried out, monitored and evaluated systematically, so that performance is optimised and risks are managed. Tender and award are the procurement course's ground, renegotiation on request is not a system, and a single audit after the final payment leaves the whole life of the contract unwatched.",
 ['P009'])

q(3, "EKC-05, the synthetic flowline replacement with FW-E (synthetic), has been completed, and the defects period is over. The UK Government Functional Standard GovS 008 (version 2.2) at 5.4.7 describes what happens to the contract documentation on closure. What does it say?",
 "It is archived under the organisation's retention policy.",
 ["It is returned to FW-E, which becomes responsible for keeping the only complete copy.",
  "It is destroyed once the final account is paid, so that no stale file can mislead anyone.",
  "It stays open on the manager's desk until the next contract with FW-E is signed."],
 "GovS 008 at 5.4.7 says that on closure information systems should be updated, staff and facilities reassigned and the contract documentation archived in accordance with the organisation's information retention policy and procedures. Handing the only copy to the supplier or destroying the file would leave nothing for an auditor or a successor to read, and an open file on a desk is not an archive.",
 ['P195'])

q(0, "When EKC-01, a synthetic well services framework with WS-A (synthetic), reaches completion, what do the World Bank Procurement Regulations for IPF Borrowers (Seventh Edition, September 2025) expect at Annex XI para 2.4?",
 "An evaluation of how the contract was carried out, to assess performance and draw lessons.",
 ["A new tender for the same scope, started on the day the framework expires.",
  "An automatic extension for WS-A if every call-off it received was fully paid.",
  "A public notice naming WS-A's weakest quarter so that other operators are warned."],
 "Annex XI para 2.4 requires an evaluation of contract performance made at completion, to assess how the contract was carried out and, where it applies, to draw lessons for later contracts. Retendering and extension are decisions the evaluation may inform, and the Regulations set no public shaming notice.",
 ['P190'])

q(2, "Two Ekene engineers both think they approve variations on EKC-03, the synthetic camp catering contract with CF-C (synthetic). Which UK Contract Management Principle speaks directly to that problem?",
 "Principle 2: be clear about accountability, roles and responsibilities.",
 ["Principle 7, which asks the team to use a balanced scorecard for every supplier.",
  "Principle 4, which directs the strongest resource to the contracts with the highest risks.",
  "Principle 1, which asks for resource to be appointed before award."],
 "The UK Contract Management Principles (Crown Commercial Service), principle 2, say: \"Be clear about accountability, roles and responsibilities.\" Two people who each believe they approve variations is exactly the gap it closes. Principle 7 is about measurement, principle 4 about where to put resource, and principle 1 about resourcing and handover before award.",
 ['P003'])

q(0, "An Ekene contract manager wants to cite Nigeria's Public Procurement Act 2007, s.16(21), which makes an accounting officer and any officer with delegated responsibility accountable for what they do or omit. On what basis may the manager use it on an Ekene contract?",
 "As published public practice: the 2007 Act binds federal procuring entities.",
 ["As binding law on Ekene as a federal procurement.",
  "As a World Bank rule copied from the Nigerian text.",
  "As a UK government standard that Nigerian operators have agreed to follow on every contract."],
 "The Public Procurement Act 2007 binds federal procuring entities. For an operator such as Ekene, s.16(21) is a published statement of public practice, and its lesson carries over: a delegation is personal, and so is the accountability. It does not bind Ekene as law, and it is neither a World Bank nor a UK text.",
 ['P012'])

q(1, "EKC-02 is a synthetic platform supply vessel charter with MV-B (synthetic). A colleague drafts a note telling MV-B that the World Bank Regulations require monthly performance reporting. Which statement fixes the note?",
 "The charter answers to its own terms and to the content Act; World Bank texts are practice here.",
 ["The note is sound, because World Bank rules apply to any contract signed in a member country.",
  "The note should cite the UK Procurement Act 2023, which binds every vessel charter in Nigerian waters.",
  "The note should cite GovS 008 instead, since UK guidance overrides the World Bank on offshore charters."],
 "The Nigerian Oil and Gas Industry Content Development Act 2010 (the content Act), s.6, requires Ekene's contracts to conform to it, and the charter is managed on its own terms. The World Bank Regulations bind borrowers on Bank-financed contracts, so the note may say what World Bank practice recommends and then point to the reporting duty the charter itself states. UK texts bind UK contracting authorities only.",
 ['P102', 'P007'])

q(3, "A colleague writes that the UK Government Functional Standard GovS 008 (version 2.2) obliges Ekene to have its contract management plan approved by a senior business owner. How should the course's sources be applied to that claim?",
 "GovS 008 binds UK bodies; Ekene may adopt its practice by choice.",
 ["Sound, because GovS 008 was adopted into Nigerian law with the content Act in 2010.",
  "It holds for offshore contracts only, since GovS 008 governs work on any continental shelf.",
  "The claim is unsound, because GovS 008 says nothing at all about approving a contract management plan."],
 "GovS 008 at 5.4.2 does say the plan is produced by the contract manager and approved by the senior business owner, so a reply that calls GovS 008 silent on approval misreads it. It is a UK government standard that binds UK contracting authorities; an Ekene contract is not governed by it, and the course teaches it as openly licensed good practice that Ekene can choose to follow. It forms no part of Nigerian law.",
 ['P015'])

q(2, "A trainee asks whether contract management and supplier relationship management are the same job. How do professional bodies such as CIPS treat them, as this course teaches that material by concept?",
 "As separate but linked: one protects the contract's promises, the other develops value with key suppliers.",
 ["As one discipline under two names, so a contract manager can use either term for any task.",
  "As rival approaches, so an operator picks one and drops the other for its whole supply base.",
  "As stages in sequence, with relationship management starting only after the contract has closed."],
 "CIPS study material, taught by concept only, treats contract management and supplier relationship management as separate but linked: the first protects what the contract promises, the second develops value with the suppliers that matter most. They run side by side, and the Professional tier takes up the second.",
 ['P066'])

q(1, "The new manager of EKC-01, the synthetic well services framework with WS-A (synthetic), finds that its KPIs, quarterly review and reporting duties were written in before award. What point does the UK Sourcing Playbook (June 2023), Chapter 12, make about this?",
 "How a contract will be managed is decided early in procurement and written into the agreement.",
 ["Management arrangements are best left out of a contract, so the manager can set them after award.",
  "A framework's review and reporting terms lapse unless the supplier renews them at each call-off.",
  "The manager must rewrite the reporting terms in the first month so they match the plan."],
 "The Sourcing Playbook, Chapter 12, says how a contract will be managed is a key strategic decision that needs consideration early in the procurement process and shall be reflected in the contractual agreement. So the manager inherits reporting, indicators and remedies already in the contract, and works to them. The terms do not lapse at each call-off, and the manager has no power to rewrite them alone.",
 ['P011'])

q(0, "An Ekene manager wants to know which published NCDMB text sets out who does what at each stage of tendering and contract execution on an oil and gas contract. Which one is it?",
 "The Guidelines for NCDMB Approvals of Nigerian Oil and Gas Industry Contracting Processes, 2025 update.",
 ["The World Bank Contract Management Practice guidance, whose Second Edition was written for NCDMB.",
  "The UK Contract Management Framework Summary, which NCDMB adopted in its 2018 guidelines.",
  "The Public Procurement Act 2007, s.16, which lists each Board approval an operator must obtain."],
 "The Board's Guidelines for NCDMB Approvals of Nigerian Oil and Gas Industry Contracting Processes (2025 update) set out the roles of operators, service providers and NCDMB at each stage of tendering and contract execution, updating the guidelines last issued in April 2018. The World Bank and UK texts are not NCDMB documents, and s.16 of the Public Procurement Act 2007 governs federal procuring entities.",
 ['P139'])

q(2, "EKC-02, the synthetic vessel charter with MV-B (synthetic), is handed to a new manager hired from outside the marine team. What does the UK Sourcing Playbook (June 2023), Chapter 12, ask of whoever oversees an outsourced service?",
 "An appropriately qualified contract manager who understands how the contract operates.",
 ["A manager drawn from the supplier's own staff, since MV-B knows the vessel best.",
  "A legal adviser in place of a manager, since a charter is mostly a legal document.",
  "A committee of every department that uses the vessel, with no single named manager."],
 "The Sourcing Playbook, Chapter 12, asks for outsourced services to be built on a robust contractual relationship overseen by an appropriately qualified contract manager with a clear operational understanding of the contract. It is UK practice, and the point for Ekene is a named, competent manager on the buyer's side. A supplier's employee, a lawyer alone or a committee with no named manager does not meet it.",
 ['P010'])

emit(Q, '/root/cat-wip-contracts/banks/sc5b_m01.json', expect_n=15)
finish()
