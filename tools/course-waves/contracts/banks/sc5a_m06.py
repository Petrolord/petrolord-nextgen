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

# SC5 Expert m06, Integrity, Governance and the Written Case. 15 questions.
# Lessons: Conflicts of interest and gifts; Fraud and corruption in execution; Governance and assurance of the contract portfolio; Reading the sources as they change; The written case brief.
# Topics: T01, T10, T11, T12, T14, T15, T16.
# Every key rests on a PACK.md passage named in its src list; the
# explanation cites the SOURCE by name and locator (an Act and its section,
# a guidance and its paragraph), never a passage id or a pack section.

q(0, "A synthetic Ekene integrity briefing borrows a definition of a conflict of interest from the UK Conflicts of Interest guidance (Procurement Act 2023), para 2, used as published good practice. Which definition does the guidance give?",
  "A conflict between the interests of a person acting in relation to a procurement and those of the procurement itself",
  ["Any friendship between an employee of the buyer and any employee of any supplier, whether or not it touches a decision",
   "A disagreement between two suppliers about which of them should be awarded the next contract of the same kind",
   "A dispute between the buyer and a supplier about a claim that the contract manager has assessed and rejected"],
  "The UK Conflicts of Interest guidance (Procurement Act 2023), para 2, says a conflict of interest arises in a procurement context where there is a conflict between the interests of a person acting in relation to a procurement and those of the procurement itself. A friendship that touches no decision, rivalry between suppliers, and a disputed claim are other things.",
  ['P212'])

q(2, "EKC-04 is the synthetic casing and tubulars frame agreement with TB-D (synthetic). The contract manager is found to have sent TB-D a copy of a rival mill's confidential price offer. Taking the Public Procurement Act 2007 as published practice for an operator, how does s.57(12) treat this?",
  "It lists passing confidential information to a supplier or contractor among the things that count as a conflict of interest",
  ["It treats the matter as a commercial choice for the contract manager, since price information is shared freely in a frame agreement",
   "It treats the matter as a breach of the content Act, since s.57(12) of that Act governs any price information about foreign mills",
   "It says nothing on information, since s.57(12) lists only shareholdings held by an officer or by a member of the officer's family"],
  "The Public Procurement Act 2007, s.57(12), lists what counts as a conflict of interest, including a direct or indirect interest in or relationship with a supplier that could bring personal gain, taking personal advantage of an opportunity belonging to the entity, and passing confidential information to a supplier or contractor. That Act binds federal procuring entities and serves Ekene as published practice. Section 57(12) is a provision of that Act, and its list is wider than shareholdings.",
  ['P203'])

q(3, "EKC-01 is the synthetic well services call-off framework with WS-A (synthetic). The contract manager is about to take a paid consultancy role with a company that owns part of WS-A. On the Public Procurement Act 2007, s.57(10), used as published practice for an operator, what should the contract manager do?",
  "Declare the actual or potential interest to the authorities immediately",
  ["Declare it at the next annual review, once the role has actually started",
   "Declare nothing until the role has earned money, since a potential interest is exempt",
   "Declare it only to WS-A, since the supplier is the party best placed to manage it"],
  "The Public Procurement Act 2007, s.57(10), says any person engaged in public procurement who has assumed or is about to assume a financial or other business relationship that might involve a conflict of interest must immediately declare any actual or potential interest to the authorities. The duty is immediate, covers potential interests and a role about to start, and runs to the authorities. Ekene uses that Act as published practice.",
  ['P202'])

q(1, "EKC-02 is the synthetic platform supply vessel time charter with MV-B (synthetic). Responsibility for the charter passes from the procurement team to a new contract manager, and nobody refreshes the conflicts assessment made at the tender. On the UK Conflicts of Interest guidance (Procurement Act 2023), used as published good practice, what should happen?",
  "Refresh the conflicts assessment when people or the contract change, such as this handover to a contract manager",
  ["Keep the tender assessment unchanged, since conflicts are assessed once at the tender and at no later point in execution",
   "Refresh the assessment only when the charter is amended by a formal change notice, since handovers are outside its reach",
   "Close the assessment at award, since the duty to keep it under review ends when the contract is signed by both parties"],
  "The UK Conflicts of Interest guidance (Procurement Act 2023), para 24, says the assessment should be refreshed when people or the contract change, for example when responsibility passes from the procurement team to a contract management team, or a contract is amended without a change notice; para 22 says the duty to keep it under review runs until a contract termination notice is published. The duty neither ends at award nor waits for a change notice.",
  ['P213', 'P214'])

q(2, "A synthetic Ekene integrity briefing borrows from the World Bank Procurement Regulations for IPF Borrowers (Seventh Edition, September 2025), taught by concept, to say whose conduct the Bank's ethical standard covers and for how long. What do the Regulations, Annex IV para 2.1, require?",
  "Borrowers, bidders, contractors, suppliers, sub-contractors, agents and all their personnel keep the highest ethical standard through procurement and contract execution",
  ["Only the borrower's procurement staff keep the ethical standard, and only until the contract is awarded to the winning bidder",
   "Only the lead contractor keeps the ethical standard, since sub-contractors and agents fall outside the Bank's requirements",
   "Suppliers keep the ethical standard during the tender only, since execution is governed by the contract's own terms alone"],
  "The World Bank Regulations, Annex IV para 2.1, require borrowers, bidders, consultants, contractors, suppliers, their sub-contractors and agents, and all of their personnel, to observe the highest ethical standard during procurement, selection and the execution of Bank-financed contracts, and to refrain from fraud and corruption. The standard is not confined to the buyer's staff, the lead contractor or the tender. For Ekene it is a published model; Ekene's own policy applies to its contracts.",
  ['P207'])

q(0, "EKC-06 is the synthetic instrument maintenance service with IM-F (synthetic). A review finds change orders raised with no contractual justification, a specification changed without reason, and two invoices for the same work. On the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, how should the contract manager read these?",
  "As red flags of fraud and corruption in execution, to be recorded and reported through the organisation's route",
  ["As ordinary administrative slips, which the supplier corrects in its next monthly invoice without any report or record being made",
   "As matters for the tender team alone, since the guidance places fraud risk only at the tender and award stages",
   "As proof of fraud by IM-F, so the contract manager should terminate the service at once without further inquiry"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), Fraud and Corruption, p.41, lists red flags during execution: poor quality materials or workmanship, change orders without contractual justification, unjustified changes in specification or conditions, payments that do not follow the contract, and false or duplicate invoices. They are red flags, which call for a record and a report; they are no proof, and the risk sits in execution as well as the tender.",
  ['P211'])

q(1, "A synthetic Ekene integrity briefing uses the Public Procurement Act 2007, s.58(4), as published practice. Which conduct does s.58(4) list among its offences?",
  "Altering procurement documents, using fake documents, and refusing the Bureau access to procurement records",
  ["Late payment of a supplier's invoice by more than sixty days, and failure to publish a KPI report on time each year",
   "Sharing a supplier's performance review with it, and holding a quarterly review without the Board",
   "Choosing a unit price contract where a lump sum was possible, and splitting the work honestly by its interfaces"],
  "The Public Procurement Act 2007, s.58(4), lists offences including collusive pricing, procurement fraud by corrupt acts, bribery or undue influence, splitting tenders to dodge thresholds, bid-rigging, altering procurement documents, using fake documents and refusing the Bureau access to procurement records. Late payment is dealt with by interest under s.37, and the other distractors describe ordinary management choices.",
  ['P204'])

q(3, "A synthetic Ekene training note uses the Public Procurement Act 2007 as published practice and asks what s.58(6) sets for a supplier convicted of an offence under that Act. Which answer matches the section?",
  "Debarment from all public procurements for not less than 5 calendar years and a fine equivalent to 25% of the value of the procurement in issue",
  ["A fine of five per cent of the project sum for each project, or cancellation of the project, as the only penalties the section provides",
   "Deduction at source of one per cent of every contract the supplier holds, paid into a fund for as long as the conviction stands",
   "A written warning from the Bureau for a first offence, with debarment reserved for a supplier convicted of repeated offences"],
  "The Public Procurement Act 2007, s.58(6), provides debarment from all public procurements for a period not less than 5 calendar years and a fine equivalent to 25% of the value of the procurement in issue. Five per cent of the project sum or cancellation is the content Act, s.68; one per cent at source is the content Act, s.104(2); and s.58(6) sets no warning stage.",
  ['P205'])

q(2, "Ekene's synthetic assurance lead wants to know what inspection rights over records the Bank writes into the contracts it finances, as a model for Ekene's own audit clause. What do the Bank's Procurement Regulations for IPF Borrowers (Seventh Edition, September 2025), read by concept, require?",
  "A clause letting the Bank inspect all accounts, records and documents and have them audited, with impeding those rights an obstructive practice",
  ["A clause letting the supplier withhold its accounts from any auditor, since the Regulations protect a contractor's commercial data in full at all times",
   "A clause giving the Bank access to records only after a dispute reaches arbitration, and at no point during the contract's execution",
   "No clause on records, since the Regulations leave inspection and audit to the national law of the borrowing country alone"],
  "The World Bank Regulations, Annex IV para 2.2 e, require Bank-financed contracts to include a clause letting the Bank inspect all accounts, records and documents on procurement and contract execution and have them audited by auditors it appoints; impeding those rights is itself an obstructive practice. For Ekene the Bank rule is a published model, and on its own contracts the reporting route is Ekene's policy.",
  ['P209'])

q(0, "EKC-07 is the synthetic environmental monitoring consultancy with EM-G (synthetic). Its new contract manager drafts the contract management plan and signs it off as approved himself. On GovS 008 (version 2.2, issued 1 April 2026), UK good practice used as a model, who should approve the plan?",
  "The senior business owner, with the contract manager producing it",
  ["The contract manager alone, since the plan is a day-to-day document",
   "The supplier, since the plan sets out what EM-G must deliver",
   "The Board, since every plan for an Ekene works contract is filed with it"],
  "GovS 008 (version 2.2), 5.4.2, says the plan should be produced by the contract manager and approved by the senior business owner, and 4.6.6 makes the contract manager accountable to the senior business owner for day-to-day delivery. The supplier does not approve the buyer's plan, and the Board's approvals under the content Act concern Nigerian content.",
  ['P015', 'P001'])

q(3, "A synthetic Ekene governance review borrows from the Public Procurement Act 2007, used as published practice, to explain personal accountability. What does s.16(21) provide?",
  "The accounting officer of a procuring entity and any officer to whom responsibility is delegated are responsible and accountable for actions taken or omitted",
  ["Only the Bureau is accountable for actions of a procuring entity, since the officers act on the Bureau's instructions throughout the procurement",
   "Only the supplier is accountable for any act under the contract, since officers of a procuring entity carry no personal responsibility under that statute",
   "Officers are accountable only for actions they took in writing, and an omission to act carries no responsibility for any officer of the entity"],
  "The Public Procurement Act 2007, s.16(21), makes the accounting officer of a procuring entity and any officer to whom responsibility is delegated responsible and accountable for any actions taken or omitted to be taken, in compliance with or in contravention of that Act. Accountability sits with those officers, and it covers omissions as well as actions.",
  ['P012'])

q(1, "Ekene's synthetic contract portfolio has run for two years without any check that payments match what the contracts say. What does GovS 008 (version 2.2, issued 1 April 2026), UK good practice used as a model, say at 5.4.4?",
  "Payments should be audited periodically to ensure they reflect the contract terms and the service levels received",
  ["Payments need no audit once each invoice has been approved by the contract manager, since approval is a full check",
   "Payments should be audited only at close-out, when the final account shows the whole of what was paid under a contract",
   "Payments should be audited by the supplier's own auditors, since the supplier holds the records of its invoices"],
  "GovS 008 (version 2.2), 5.4.4, says payments should be audited periodically to ensure they reflect the contract terms and service levels received from suppliers. Invoice approval does not replace a periodic audit, waiting until close-out is not periodic, and the standard places the audit with the paying organisation.",
  ['P054'])

q(2, "EKC-06 is the synthetic instrument maintenance service with IM-F (synthetic). The Board's agent asks to see IM-F's timesheets and payroll to check the Nigerian content IM-F reported. IM-F refuses, saying the records are commercially confidential. What does the Nigerian Oil and Gas Industry Content Development Act 2010 (the content Act) provide?",
  "Under s.64, operators and contractors provide the Board or its agent with access to facilities and the documentation substantiating the content reported",
  ["Under s.64, contractors may refuse the Board any record they mark confidential, and only the operator's own records are open to its agents",
   "Under s.60, the Board sees only the operator's annual report, so a contractor's timesheets fall outside anything the Board may examine",
   "Under s.34, only contracts above $100 million are open to the Board, so IM-F's maintenance contract falls outside its audit powers"],
  "The content Act, s.64, provides that all operators and contractors shall provide the Board or its designated agent with access to their facilities and all documentation and information required for substantiating the Nigerian content reported, and s.70(k) gives the Board the function of making auditing procedures and conducting regular audits. Section 60 concerns the operator's annual report and s.34 the labour clause; neither limits s.64.",
  ['P130', 'P136'])

q(0, "EKC-01 is the synthetic well services call-off framework with WS-A (synthetic). WS-A's content plan for the renewal cites NCDMB's contracting-process guidelines of April 2018 as the current text. What does NCDMB's 2025 update of those guidelines say about the 2018 edition?",
  "The 2025 update revises them to reflect the industry service level agreement of September 2023 and the Presidential Directives of February 2024",
  ["The 2025 update confirms the 2018 guidelines unchanged, so a plan citing April 2018 already reflects the current approval steps and roles in full detail",
   "The 2025 update withdraws all NCDMB guidelines, so a content plan for the renewal need cite no NCDMB text at any stage of the contract",
   "The 2025 update applies only to tenders let by federal procuring entities, so WS-A may keep citing the 2018 text for any operator's own work"],
  "The NCDMB Guidelines (2025 update), Purpose (ii), update the PCAD guidelines last issued in April 2018 to reflect the industry service level agreement of September 2023 and the Presidential Directives of February 2024, and they set roles for operators, service providers and NCDMB through tendering and execution. The update revises the 2018 text, withdraws nothing, and is written for the oil and gas industry.",
  ['P139'])

q(3, "A synthetic Ekene procedure relies on the UK Procurement Act 2023 for a model KPI rule. The copy the team read is the UK Act as enacted on 26 October 2023. What should the procedure record about that text?",
  "Its edition and the date read, with a note that later amendments are not reflected in the copy, and a fresh check before relying on it",
  ["Nothing about edition, since an Act of Parliament is fixed once enacted and cannot be changed by later amending legislation",
   "Only the date the procedure was approved, since the edition of a UK Act has no bearing on how a model rule is applied at Ekene",
   "That the UK Act binds Ekene's contracts from its enactment date, since a UK statute governs any contract that borrows one of its rules as a model"],
  "The UK Procurement Act 2023 was read as enacted, 26 October 2023, and later amendments are not reflected in that copy. Each source is recorded with its edition and the date read and checked again before a decision relies on it. An enacted Act can be amended, the edition matters to what the rule says, and a UK statute binds no Ekene contract even when Ekene borrows one of its rules as a model.",
  ['P035'])

emit(Q, '/root/cat-wip-contracts/banks/sc5a_m06.json', expect_n=15)
finish()
