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

# SC5 Expert m05, Close-Out and Lessons Learned. 15 questions.
# Lessons: Completion and acceptance; The final account and releasing securities; Evaluating the supplier at close; Lessons learned that change the next contract.
# Topics: T05, T07, T15.
# Every key rests on a PACK.md passage named in its src list; the
# explanation cites the SOURCE by name and locator (an Act and its section,
# a guidance and its paragraph), never a passage id or a pack section.

q(1, "A synthetic Ekene contract manager reads the UK Contract Terminations guidance (Procurement Act 2023) to see how that guidance uses the word termination for its notices. Which list does para 8 give?",
  "Discharge, expiry, termination by a party, rescission, or being set aside by a court",
  ["Termination by the buyer for the supplier's default, and nothing else",
   "Expiry only, since a contract that is performed in full never terminates",
   "Rescission and court orders only, since both parties' consent ends nothing"],
  "The UK Contract Terminations guidance (Procurement Act 2023), para 8 (s.80(3)), gives termination a broad meaning for the termination notice, in a list that is not exhaustive: discharge (for example, obligations fulfilled, payments made and any disputes settled, by mutual agreement or frustration), expiry, termination by a party, rescission, or being set aside by a court. Each distractor keeps only part of that list.",
  ['P198'])

q(3, "EKC-07 is the synthetic environmental monitoring consultancy with EM-G (synthetic). Ekene models its close-out on the UK Procurement Act 2023 regime and wants to know how quickly that regime has a contract termination notice published once a public contract ends. What does the UK Contract Terminations guidance, para 26, say?",
  "The notice must be published before the end of the period of 30 days beginning with the day the contract is terminated",
  ["The notice must be published before the contract ends, so that the market has warning of the termination date",
   "The notice must be published within twelve months of termination, alongside the last annual KPI assessment",
   "The notice is published only where the contract ended for default by the supplier, since expiry on its term needs no notice at all"],
  "The UK Contract Terminations guidance (Procurement Act 2023), para 26, says the notice must be published before the end of the period of 30 days beginning with the day on which the public contract is terminated (section 80(1)). It follows termination, it is tied to no KPI cycle, and expiry is itself one of the ways a contract terminates for the notice. For an Ekene contract this UK duty is a model only.",
  ['P181', 'P198'])

q(0, "EKC-07 is the synthetic environmental monitoring consultancy with EM-G (synthetic). The last quarterly report has been accepted. The contract owner wants to file the contract away with no review. On the World Bank Procurement Regulations for IPF Borrowers (Seventh Edition, September 2025), taught by concept as published practice, what should happen at completion?",
  "An evaluation of how the contract was carried out, to assess performance and draw lessons for later contracts",
  ["A new tender for the same service, since the Regulations treat completion as the start of the next procurement",
   "No review, since the Regulations ask for an evaluation only where the supplier failed its KPIs of the consultancy",
   "A review by the supplier alone, since the consultant is best placed to judge its own reports"],
  "The World Bank Regulations, Annex XI para 2.4, require an evaluation of how the contract was carried out, made at completion, to assess performance and, where it applies, draw lessons for later contracts. For Ekene this is published practice. The Regulations do not make completion a trigger for retendering, the evaluation is due whatever the KPI results, and it is the buyer's evaluation.",
  ['P190'])

q(2, "EKC-01 is the synthetic well services call-off framework with WS-A (synthetic), with a Nigerian content plan and quarterly reporting. As the framework closes, WS-A asks Ekene to issue it a Nigerian Content Compliance Certificate. What do the NCDMB Guidelines for NCDMB Approvals of Nigerian Oil and Gas Industry Contracting Processes (2025 update) provide?",
  "The certificate is issued by NCDMB's Monitoring and Evaluation Directorate once the contract is performed and the commitments recorded at award are met",
  ["The certificate is issued by the operator's contract manager on the day the last call-off is paid, with no further evidence of what was achieved",
   "The certificate is issued by the Bureau of Public Procurement after an audit of the operator's records for the financial year of completion",
   "The certificate is issued automatically at award, so WS-A already holds it and nothing about content needs checking at close-out"],
  "The NCDMB Guidelines (2025 update), Purpose (vii) and Step 5, add a Nigerian Content Compliance Commitment at award and provide that a Nigerian Content Compliance Certificate is issued by the Monitoring and Evaluation Directorate once the contract is performed and the commitments are met. The operator does not issue it, the Bureau has no role in it, and it follows performance, so close-out gathers the evidence.",
  ['P137'])

q(1, "EKC-03 is the synthetic camp catering contract with CF-C (synthetic), which has expired. The contract manager draws up the closure steps from GovS 008 (version 2.2, issued 1 April 2026), UK good practice used as a model. Which steps does 5.4.7 name on contract closure?",
  "Update information systems, reassign staff and facilities, and archive the documentation under the organisation's retention policy",
  ["Delete the contract records once the final payment clears, since a closed contract needs no documentation kept",
   "Hand every contract document to the supplier, since the supplier holds the record of a service it delivered",
   "Keep the file open indefinitely, since GovS 008 says no contract is ever closed while the supplier still trades with the organisation"],
  "GovS 008 (version 2.2), 5.4.7, says that on contract closure information systems should be updated, staff and facilities (if any) reassigned and the contract documentation archived in accordance with the organisation's information retention policy and procedures. Deleting records, handing them to the supplier, or never closing the file all depart from that step.",
  ['P195'])

q(3, "EKC-06 is the synthetic instrument maintenance service with IM-F (synthetic), reimbursed at hourly rates plus materials at cost. While preparing the final account, the contract manager finds that a materials line was overpaid in month four. The final payment has not yet been made. What does the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, say?",
  "Payment errors found before the final payment is made should be corrected",
  ["Errors in earlier months are closed once paid, so the final account starts from the paid figures",
   "Leave the error to the next contract's first invoice, so the final payment is not delayed",
   "Correct errors only if the supplier agrees in writing that its earlier invoice was wrong"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), Price Adjustment, p.21, says payment errors found before the final payment is made should be corrected. Treating earlier payments as closed, carrying the error to another contract, or making correction depend on the supplier's agreement all leave a known error in the final account.",
  ['P194'])

q(0, "EKC-05 is the synthetic flowline replacement works contract with FW-E (synthetic). FW-E's final account lists four variations. The change register shows three approved variations and no approval for the fourth, which the site team says was agreed orally. On GovS 008 (version 2.2, issued 1 April 2026), UK good practice used as a model, how should the fourth be treated?",
  "Query it, since change control expects an audit trail in a change register with approval obtained before implementation",
  ["Pay it, since an oral agreement by the site team is enough wherever the work has been done and the cost looks reasonable",
   "Pay it at half its value, since GovS 008 splits the cost of an unapproved variation equally between the parties",
   "Remove it from the account without a word to FW-E, since an unapproved variation is void and needs no reply or record of any kind"],
  "GovS 008 (version 2.2), 5.4.5, expects change control to give an audit trail in a change register, a cost of change justified against the business case and approvals obtained before implementation. A variation with no approval in the register is queried against the records. GovS 008 does not accept oral agreement as approval, splits nothing, and removing the line without a reply leaves no record of the decision.",
  ['P078'])

q(2, "EKC-02 is the synthetic platform supply vessel time charter with MV-B (synthetic), which has ended. Among the value for money checks in the World Bank Procurement Regulations for IPF Borrowers (Seventh Edition, September 2025), taught by concept as published practice, what does the borrower confirm about the final price?",
  "That the final price compares well with comparable benchmarks",
  ["That the final price equals the award price to the day and cent",
   "That the final price is the lowest any vessel owner charged that year",
   "That the final price was approved by the Board before payment"],
  "The World Bank Regulations, Annex XI para 3.3(f), list among the value for money checks that the final price compares well with comparable benchmarks. Changes during the contract mean the final price may differ from the award price, the check is a comparison with benchmarks, and the Board's role under the content Act concerns Nigerian content.",
  ['P191'])

q(1, "WS-A's synthetic call-off framework for well services on the Ekene wells (EKC-01) is closing, and its change register shows many call-offs ordered for services the rates never covered. What does the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, ask for at close-out?",
  "Evaluate the changes made during the contract for their effect on cost, schedule and performance, and keep them as lessons",
  ["Close the change register without review, since a change that has been paid is settled and holds no further lesson",
   "Send the change register to WS-A to evaluate, since the supplier knows best why each call-off fell outside the schedule of rates",
   "Evaluate only the changes that led to disputes, since the guidance treats an agreed change as needing no evaluation"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), Change Management Procedures, item 14, p.30, asks for the changes made during the contract to be evaluated at close-out for their effect on cost, schedule and performance and kept as lessons for the future. Paid or agreed changes are included, and the evaluation is the buyer's.",
  ['P192'])

q(3, "EKC-02 is the synthetic platform supply vessel time charter with MV-B (synthetic), an upstream service contract. Closing the charter's account, the contract manager looks for evidence of the Nigerian Content Development Fund deduction. What does s.104(2) of the content Act (the Nigerian Oil and Gas Industry Content Development Act 2010) provide?",
  "One per cent of every contract awarded in the upstream sector is deducted at source and paid into the Fund",
  ["Ten per cent of the contract value is retained in a Nigerian bank account and paid into the Fund at completion",
   "Five per cent of the project sum is paid into the Fund as a completion fee once the certificate is issued",
   "No deduction applies to service contracts, since s.104(2) covers only supply of goods upstream"],
  "The content Act, s.104(2), provides that one per cent of every contract awarded to any operator, contractor, subcontractor, alliance partner or other entity in the upstream sector shall be deducted at source and paid into the Fund. Ten per cent is the s.52(3)(f) share of revenue kept in a Nigerian bank account, five per cent is the s.68 fine, and s.104(2) covers every contract awarded in the upstream sector, services included.",
  ['P134'])

q(0, "EKC-04 is the synthetic casing and tubulars frame agreement with TB-D (synthetic), and Ekene is preparing a replacement agreement. What do the NCDMB Guidelines for NCDMB Approvals of Nigerian Oil and Gas Industry Contracting Processes (2025 update) ask for, at the Nigerian Content Plan stage of a replacement contract?",
  "Evidence that the prior contract met its content commitments, such as the 1% Nigerian Content Development Fund remittance and the human capital development execution",
  ["Evidence of the prior contract's lowest evaluated cost, so that NCDMB can compare the tender prices of the old agreement and the new one before it approves",
   "Nothing about the prior contract, since each award is assessed on its own and closing out the old agreement has no bearing on the replacement",
   "A copy of the prior contract's arbitration award, since NCDMB approves a replacement only where the old agreement ended in a dispute"],
  "The NCDMB Guidelines (2025 update), notes to the NC Plan stage, ask for evidence that the prior contract met its Nigerian content commitments, such as the 1% Nigerian Content Development Fund remittance and the human capital development execution. Closing out one contract's commitments therefore affects the next award. Tender costs belong to the procurement course, and the guidelines do not tie approval to a dispute.",
  ['P140'])

q(2, "EKC-01 is the synthetic well services call-off framework with WS-A (synthetic). At close the mobilisation KPI was met every quarter, yet wells still started late. Which question does the Sourcing Playbook (June 2023), a UK text used as published good practice, ask in its lessons learned analysis?",
  "Did the KPIs drive the required behaviours and outcomes from the contract?",
  ["Did the supplier sign every KPI report on time, whatever the outcome achieved?",
   "Were more KPIs added each year, to show the contract was improving over time?",
   "Were the KPIs kept secret from the supplier, so it could not game the measures?"],
  "The Sourcing Playbook (June 2023), Chapter 13, p.72, says sufficient time should be allocated to knowledge transfer and lessons learned analysis and asks whether the KPIs drove the required behaviours and outcomes from the contract. A KPI met every quarter while wells started late fails that test. The Playbook asks nothing about signatures, KPI growth or secrecy, and its KPI chapter warns against too many KPIs.",
  ['P196'])

q(1, "EKC-03 is the synthetic camp catering contract with CF-C (synthetic). At close, meal service ran significantly below its KPI throughout the final year. Ekene uses the UK Procurement Act 2023 KPI guidance, para 15, only as a model of a small fixed rating scale. Which rating on that scale fits performance significantly below the KPI?",
  "Inadequate",
  ["Requires improvement",
   "Approaching target",
   "Other"],
  "The UK KPI guidance (Procurement Act 2023), para 15 and table (regulation 39(5)), uses five ratings: Good (meeting or exceeding the KPI), Approaching target, Requires improvement (below the KPI), Inadequate (significantly below the KPI) and Other (none of those descriptions fits). Significantly below the KPI reads as Inadequate; Requires improvement is the rating for below the KPI, and Other is kept for performance none of the descriptions fits. The UK scale binds no Ekene contract and serves only as a model here.",
  ['P039'])

q(3, "EKC-06 is the synthetic instrument maintenance service with IM-F (synthetic). Ekene models its close on the UK Procurement Act 2023 regime. Under the UK Contract Performance Notices guidance, para 21, which comes first when a contract ends, and why?",
  "The final KPI performance notice, because the termination notice closes the contract's record on the central platform",
  ["The contract termination notice, because a final KPI notice cannot be published until the contract's record has closed",
   "Either notice may come first, since the guidance treats their order as a matter for the contracting authority's convenience",
   "Neither notice, since the guidance requires no publication at all when a contract ends by expiry on its term"],
  "The UK Contract Performance Notices guidance (Procurement Act 2023), para 21, says that when a contract ends the final KPI performance notice is published before the contract termination notice, because the termination notice closes the contract's record on the central digital platform. The order is fixed for that reason, and expiry is itself one of the ways a contract terminates for the notice. This UK rule is a model for Ekene only.",
  ['P199'])

q(2, "EKC-06 is the synthetic instrument maintenance service with IM-F (synthetic). The close evaluation has IM-F's KPI results. The operations team also rates IM-F's technicians highly for their work with Ekene staff. What do the UK Contract Management Principles, used as published good practice, advise about using both?",
  "Use a balanced scorecard, measuring hard data such as KPI performance alongside soft measures such as satisfaction and relationship management",
  ["Use the KPI data alone, since soft measures such as satisfaction are opinions that have no proper place in a supplier's close evaluation",
   "Use the soft measures alone, since KPI data in a maintenance contract reflects the state of the equipment more than it reflects the supplier",
   "Average the KPI results and the team's rating into a single score, since the Principles print a formula for that calculation"],
  "The UK Contract Management Principles, principle 7, advise using a balanced scorecard to measure hard data such as KPI performance alongside soft measures such as customer satisfaction and relationship management, with a focus on outcomes. Dropping either side departs from that advice, and the Principles print no averaging formula.",
  ['P041'])

emit(Q, '/root/cat-wip-contracts/banks/sc5a_m05.json', expect_n=15)
finish()
