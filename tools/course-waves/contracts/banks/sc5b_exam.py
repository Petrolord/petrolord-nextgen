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

# SC5 Associate final exam. 42 scenario questions, seven drawn from the material
# of each module, each on a fact the module banks do not key. Passing it at
# the existing pass mark issues the Associate certificate.
# Topics: T01, T02, T03, T04, T05, T08, T10, T15.
# Every key rests on a PACK.md passage named in its src list; the
# explanation cites the SOURCE by name and locator (an Act and its section,
# a guidance and its paragraph), never a passage id or a pack section.
# FILLED AT THE BANK STAGE (Associate bank writer). Questions 1 to 7 draw on
# module 1, 8 to 14 on module 2, 15 to 21 on module 3, 22 to 28 on module 4,
# 29 to 35 on module 5 and 36 to 42 on module 6.

# Module 1: contract management and its sources.
q(1, "EKC-07 is a synthetic environmental monitoring consultancy with EM-G (synthetic). Three Ekene departments use its reports, and each assumes one of the others manages the contract. Which practice from the World Bank Contract Management Practice guidance (Second Edition, 2024) addresses this?",
 "Appointing a contract manager for each contract, EKC-07 among them.",
 ["Letting EM-G's key person act as the manager for all three departments.",
  "Rotating the job monthly among the three departments that use it.",
  "Leaving management to whichever department last received a quarterly report."],
 "The World Bank guidance, taught by concept, treats appointing a contract manager for each contract as good practice. A manager drawn from the supplier cannot hold Ekene's side, and a rotating or default arrangement leaves no one accountable from month to month.",
 ['P006'])

q(2, "On EKC-05, the synthetic FW-E flowline replacement, the works are finished and the defects period is running. A colleague wants to close the file of Nigerian labour hours kept during the works. Why does that record stay live?",
 "It feeds the operator's annual content report, filed under s.60 within sixty days of the new year.",
 ["It has to be returned to FW-E so that FW-E can file the annual content report itself.",
  "It is needed only if FW-E asks for a price increase, so it can be destroyed now.",
  "It stays live for ten years under the Public Procurement Act 2007, s.16(12)."],
 "Under the Nigerian Oil and Gas Industry Content Development Act 2010 (the content Act), s.60, each operator files its annual Nigerian Content Performance Report within sixty days of the beginning of each year, covering all its projects. A contract's content record is therefore read after the work is done. The annual report is the operator's duty, and the printed Public Procurement Act 2007 garbles its retention period in s.16(12), so no ten year period is taught from it.",
 ['P127', 'P052'])

q(3, "EM-G (synthetic) proposes to replace the named key person on EKC-07, the synthetic environmental monitoring consultancy. On the course's split of roles, whom should the contract manager tell?",
 "The contract owner, since the change touches the outcome the contract buys.",
 ["Nobody, since a supplier may change its own staff without telling the buyer.",
  "The Board, since every change of consultant must be approved under the content Act.",
  "The procurement team that ran the tender, as it still owns the relationship."],
 "The contract owner is accountable for the outcome the contract buys; the UK Government Functional Standard GovS 008 (version 2.2) at 4.6.5 has the senior business owner own the justification for the contract. A named key person goes to that outcome, so the owner is told and the manager records the decision. The contract names the key person, so a silent swap is not the supplier's to make, the Board plays no part, and the tender team has handed over.",
 ['P002'])

q(2, "On EKC-05, the synthetic FW-E flowline replacement, the manager checks that the performance security matches the contract before any money moves. At which lifecycle stage does this check sit?",
 "Mobilisation, the start-up phase before money moves to the supplier.",
 ["Steady running, alongside the certification of the second milestone.",
  "Close, when the final account is settled and the file archived.",
  "Tender evaluation, before the award decision is taken."],
 "The World Bank Contract Management Practice guidance (pp.13 to 14), taught by concept, places the check of a performance security's amount, validity and wording at contract start-up, before an advance is paid. Certification of milestones belongs to steady running, archiving to close, and tender evaluation to the procurement course.",
 ['P022'])

q(3, "An Ekene manager notices that the Guidelines for NCDMB Approvals of Nigerian Oil and Gas Industry Contracting Processes carry a 2025 update. What did that update bring the guidelines into line with?",
 "The industry service level agreement of September 2023 and the Presidential Directives of February 2024.",
 ["The UK Procurement Act 2023, which the Board adopted in full as the rulebook for Nigerian operators and their contractors.",
  "The World Bank Regulations, Seventh Edition, which bind the Board's approvals.",
  "The Public Procurement Act 2007, which the update replaced for the oil industry."],
 "The Board's contracting process guidelines (2025 update) update the PCAD guidelines last issued in April 2018 to reflect the industry service level agreement of September 2023 and the Presidential Directives of February 2024. The update does not adopt UK law or the World Bank Regulations, and a guideline cannot replace an Act.",
 ['P139'])

q(2, "An Ekene officer who approved a payment under a written delegation later tells an auditor that only the accounting officer answers for it. Taking Nigeria's Public Procurement Act 2007, s.16(21), as a model of public practice, who answers?",
 "The accounting officer and the officer with the delegated responsibility.",
 ["The accounting officer alone, since delegation passes the task and keeps the blame at the top.",
  "The supplier, since the contract makes it answerable for every act of the buyer's staff.",
  "Nobody personally, since a delegation makes every decision the entity's own."],
 "Under s.16(21) responsibility and accountability attach both to the accounting officer and to any officer who holds delegated responsibility, for acts done and for acts omitted. Ekene reads this federal rule as public practice: whoever acts under a delegation answers personally for the act. Suppliers do not answer for the buyer's staff, and a delegation does not dissolve personal accountability.",
 ['P012'])

q(1, "Why, on Annex XI para 2.1 of the World Bank's Regulations for IPF Borrowers, should managing a contract follow a system?",
 "Optimising performance and managing the contract's risks.",
 ["Reducing the number of suppliers on the approved list each year.",
  "Ensuring that every contract is renewed with the same supplier.",
  "Letting the buyer change the scope without the supplier's agreement."],
 "Annex XI para 2.1, taught by concept, calls for contract management that is planned, carried out, monitored and evaluated systematically, so that performance is optimised and risks are managed. Shrinking a supplier list, renewing by default and changing scope unilaterally are not purposes it states.",
 ['P009'])

# Module 2: award handover and mobilisation.
q(1, "The UK Sourcing Playbook (June 2023), Chapter 12, singles out one period as a key phase in setting up an outsourced contract for success. Which period?",
 "The period after award and before the contract start date: mobilisation.",
 ["The last quarter of the contract, when the exit plan is tested and the successor is brought in.",
  "The tender period, while bids are being clarified.",
  "The first price review, usually a year after the start."],
 "The Sourcing Playbook, Chapter 12, says that immediately following contract award and prior to the contract start date, mobilisation is a key phase in setting up an outsourcing project for success. It is UK practice. The tender period is the procurement course's ground, and exit and price reviews come later.",
 ['P017'])

q(1, "On EKC-01, the synthetic WS-A well services framework, an agreed change order adds nitrogen lifting to the services. Under which heading of its contract management plan, from the World Bank list (Annex XI para 3.1), should the manager update the plan?",
 "Key deliverables, kept up to date as change orders are agreed.",
 ["Key contacts, which is where every new service is first entered.",
  "Local labour monitoring, which records each new kind of service.",
  "Communication and reporting, since each order is a message to WS-A."],
 "The World Bank Regulations list key deliverables, kept up to date for change orders, among what a contract management plan summarises (Annex XI para 3.1, taught by concept). An agreed change order that adds a service changes the deliverables. Contacts, labour monitoring and reporting are other headings with other jobs.",
 ['P020'])

q(0, "At the EKC-07 kick-off, the synthetic EM-G consultancy, both sides list their people by name but say nothing about what each may approve. What does the World Bank Contract Management Practice guidance (p.11) ask the manager to confirm at the start?",
 "That each party has its authorisations and delegations in place.",
 ["That EM-G's staff hold UK security clearance for work on the Ekene site.",
  "That every person on the list has signed the contract in their own name.",
  "That the Board has approved each name on the attendance list."],
 "The World Bank guidance, taught by concept, asks the contract manager to confirm at the start that each party has put its authorisations and delegations in place, since a contracting decision is valid and enforceable only when the person taking it holds the authority. A kick-off that lists names without what each may decide has done half the job. Signatures, clearances and Board approval of attendees are not what the guidance asks.",
 ['P021'])

q(2, "Ekene's finance team wants to sit on an advance for a month although FW-E (synthetic) has lodged an acceptable advance payment guarantee under EKC-05, the synthetic flowline job. What start-up practice does World Bank guidance describe?",
 "Pay the advance on time now that an acceptable guarantee is in.",
 ["Hold it until the first milestone is certified, since an advance is really a reward for progress made.",
  "Pay half now and half at close, to keep leverage over FW-E.",
  "Hold it until FW-E asks twice, which shows it really needs the money."],
 "The World Bank guidance, taught by concept, has the employer make the advance on time once an acceptable advance payment guarantee is in, and check the required insurances. The buyer has duties too. An advance paid at the first milestone is not an advance at all, and splitting or delaying it to gain leverage breaks the contract's terms.",
 ['P022'])

q(3, "On a synthetic Ekene contract, the Board's contracting process guidelines (2025 update) add a Nigerian Content Compliance Commitment at award. What does that commitment record?",
 "The Nigerian content targets the operator and its contractor agree for execution.",
 ["The bid prices of every tenderer, so that the Board can check the award price against the wider market.",
  "The contractor's audited annual accounts for each of the three years before the contract was awarded.",
  "The penalty the Board will impose if the contract finishes late."],
 "The Board's guidelines (2025 update), taught by concept, add a Nigerian Content Compliance Commitment at award, recording the Nigerian content targets the operator and its contractor agree for the execution phase. It passes to the contract team as part of handover. It holds no bid prices, accounts or lateness penalty.",
 ['P137'])

q(0, "Apart from its employment estimate, what else did Ekene file with the Board ahead of awarding the synthetic WS-A framework (EKC-01), under s.22 of the content Act?",
 "The selected contractor, the designated sub-contractors, and the commencement and completion dates.",
 ["The supplier's bank details and payment terms, so that the Board could pay the contractor directly if Ekene fell behind.",
  "A copy of every call-off Ekene expected to place in the first year.",
  "The names of the tender panel members, for the Board's conflict check."],
 "Section 22 of the content Act has the operator tell the Board, ahead of award, who the chosen contractor is, which sub-contractors are designated and when work starts and ends, plus Nigerian content estimates for each bidder. Payment details, forecast orders and panel lists do not appear in it.",
 ['P108'])

q(1, "Ekene is mobilising a simple, low cost synthetic contract for office water deliveries at the shore base. What does the UK Government Functional Standard GovS 008 (version 2.2) at 5.4.1 say about commercial specialist support on a contract like this?",
 "A simple, low cost contract may need no commercial specialist support.",
 ["Every contract needs a full team of commercial specialists from award to close.",
  "A low cost contract must be managed by the senior business owner in person.",
  "A simple contract needs no named contract manager at all."],
 "GovS 008 at 5.4.1 scales support to the contract: a simple, low cost purchase may run without commercial specialists, and a complex one confirms its management roles as it mobilises. This is UK guidance offered as practice. Someone still looks after the water deliveries, and nobody needs a full specialist team for them.",
 ['P016'])

# Module 3: reading the contract you manage.
q(2, "The UK Contract Management Framework Summary (Area 8, item 10) lists contractual terms that contract management staff should understand. Which set is on its list?",
 "Contract extension, warranties, indemnities, insurance, security, confidentiality and dispute resolution.",
 ["Tender evaluation weights, bid scoring rules and the award decision memo.",
  "Staff salaries, office rents and the supplier's own profit and loss account.",
  "Only the price schedule, since every other term is the legal team's concern."],
 "The UK Contract Management Framework Summary, Area 8, item 10, says contract management staff understand the contractual terms including contract extension, termination warranties, indemnities, insurance, security and confidentiality and dispute resolution. It is UK practice. Tender weights belong to the procurement course, and a manager who reads only the price schedule cannot use the clauses a contract depends on.",
 ['P025'])

q(1, "The UK Sourcing Playbook (June 2023), Chapter 7, recommends its model services contract as a starting point. Which items does it list for users to tailor?",
 "Performance indicators, service credits, insurance, invoicing, indexation and financial distress.",
 ["The Nigerian content schedule, the labour clause and the Board's approvals for each award.",
  "Only the parties' names and addresses, since everything else in it is fixed.",
  "The FIDIC general conditions, which the model contract reproduces in full."],
 "The Sourcing Playbook, Chapter 7, lists what users should tailor: performance indicators and service credits, insurance and parent company guarantees, invoicing and indexation, pricing, benchmarking, financial distress, and the governance and contract management structure. It is a UK text, so Nigerian content terms are not on its list, and it is no FIDIC form.",
 ['P151'])

q(3, "A field engineer asks what the change control paragraph of the UK commercial standard (GovS 008, 5.4.5) demands of every contract change. Which answer states its purpose?",
 "Justified and controlled, to keep meeting business needs and fit financial processes.",
 ["Agreed by the supplier alone, since the supplier is the party that carries out and pays for the extra work.",
  "Avoided entirely, since any change voids a fixed-price contract.",
  "Made first and justified afterwards, once the cost is clear."],
 "GovS 008 at 5.4.5 says: \"Contract changes shall be justified and controlled to ensure the requirements continue to meet the organisation's business needs and align with the organisation's financial processes\". It is UK practice. At Associate level the manager knows where the change clause is and who may act under it. Changes are controlled by the buyer, are not forbidden, and are justified before they are made.",
 ['P077'])

q(2, "Ekene is a party to a synthetic agreement adapted from an AIPN model contract. What does the course teach a manager to read, as AIPN models are taught by concept?",
 "The version the parties signed, with its elections and amendments.",
 ["The latest AIPN model, which overrides the signed version once published.",
  "Only the model's guidance notes, which bind the parties more than the text.",
  "The UK LOGIC form on the same subject, which AIPN models follow."],
 "AIPN model contracts are taught by concept only. Many upstream parties adapt them, and elections and amendments change a model form's effect from deal to deal, so the manager reads the version the parties actually signed. A newer model does not rewrite a signed contract, guidance notes do not bind above the text, and LOGIC forms are a separate family.",
 ['P033'])

q(1, "The manager of EKC-04, the synthetic TB-D casing frame agreement, is mapping clauses. Why does the UK Cabinet Office guidance on contract terminations (para 18) matter at Associate level?",
 "It advises that contracts set out what happens on termination, so the manager knows where that clause is.",
 ["It requires the manager to terminate any frame agreement that misses a delivery date.",
  "It lets Ekene end the agreement without notice under Nigerian law.",
  "It makes TB-D liable for Ekene's costs whenever any order is late."],
 "The UK termination guidance (para 18) says contracting authorities should always set out in the contract what happens when it is terminated. At Associate level the manager locates that clause and notes it; using it belongs to the Expert tier. The guidance is UK practice, and it neither compels termination nor creates rights under Nigerian law or a liability for late orders.",
 ['P179'])

q(0, "A synthetic Ekene contract for an unfamiliar repair has a scope nobody can yet define, and base prices cannot be estimated. What does the UK Risk Allocation and Pricing Approaches guidance note (January 2026, Appendix II) say about the pricing approach?",
 "A cost plus approach may be the only option where base prices cannot be estimated.",
 ["A fixed price is always best, because it moves all risk to the supplier whatever the scope.",
  "A unit price is required, because the UK guidance forbids cost plus.",
  "No contract can be signed until the scope is fixed."],
 "The UK pricing guidance ties a fixed price to a fixed scope, and says that where base prices cannot be estimated at all a cost plus approach may be the only option. Choosing a price basis belongs to the procurement course; the manager reads the one the contract has. The guidance does not forbid cost plus or bar a contract with an open scope.",
 ['P029'])

q(0, "On EKC-05, the synthetic FW-E flowline replacement paid as a lump sum, FW-E's own labour costs for work inside the defined scope rise, and FW-E asks for more money. On the price basis alone, where does that cost sit?",
 "With FW-E, since a lump sum pays a fixed amount for the defined scope.",
 ["With Ekene, since a lump sum always moves labour cost risk to the buyer.",
  "With the Board, since labour is a Nigerian content matter.",
  "Split equally, since every lump sum shares overruns half and half."],
 "The World Bank Regulations (Annex VIII para 3.2, taught by concept) describe a lump-sum contract as the contractor performing the defined scope for a fixed amount, and the World Bank guidance expects the manager to know in advance which costs sit with the contractor. So cost inside the defined scope sits with FW-E, subject to anything the contract itself states. The Board plays no part, and no equal split applies by default.",
 ['P026', 'P159'])

# Module 4: KPIs and service levels.
q(2, "Ekene makes a one-off purchase of a batch of standard, off-the-shelf pressure gauges from a catalogue under a synthetic purchase order. Does the order need KPIs, on the practice the UK KPI guidance (para 10) describes?",
 "Probably not: an acceptance check on delivery may be all a one-off supply of off-the-shelf goods needs.",
 ["Yes: every purchase order needs at least three KPIs, whatever it buys and however little the order is worth in total.",
  "Yes: a one-off supply needs more KPIs than a service, since there is no second chance.",
  "No: KPIs are banned on any purchase made from a catalogue."],
 "Where a buyer judges that KPIs could not fairly measure performance, the UK guidance lets the duty lapse, and its illustration is a single delivery of catalogue goods (para 10). For Ekene's gauges, checking the batch on arrival against the order is the sensible control. The three-KPI floor is a UK rule for public contracts above £5 million, and no text bans indicators on a catalogue buy.",
 ['P037'])

q(1, "EKC-02 is a synthetic vessel charter with MV-B (synthetic), whose availability is measured from Ekene's daily log. A month after a disputed outage, MV-B sends an email describing the vessel as ready throughout. How much weight should the email carry against the log?",
 "Little, because the evidence should match the indicator's definition, which here points to the daily log.",
 ["Full weight, since a supplier's written statement always overrides a buyer's own operational log.",
  "Equal weight, so the manager splits the hours between the two sources.",
  "More weight than the log, since an email is a formal notice."],
 "A contract is managed on its own terms, as the World Bank Contract Management Practice guidance reminds its reader (p.1), and the same guidance, taught by concept, lists what to record: performance, communications and notices, dates and who was involved (Figure XIV). Where the indicator is measured from a daily log, the log is the evidence, and an email written a month later is a poor substitute. Splitting hours by source ignores the evidence.",
 ['P160', 'P007'])

q(0, "Under the UK KPI guidance (para 15), what separates the ratings Requires improvement and Inadequate in a published KPI assessment?",
 "Requires improvement is below the KPI, and Inadequate is significantly below it.",
 ["Requires improvement is for new suppliers, and Inadequate for suppliers of a year or more.",
  "Requires improvement triggers a credit, and Inadequate triggers automatic termination.",
  "They mean the same, and the authority picks either one."],
 "The UK KPI guidance (para 15 and its table, from regulation 39(5)) defines Requires improvement as below the KPI and Inadequate as significantly below it, with Good, Approaching target and Other completing the scale. The ratings describe performance only; they set no credit or termination, and they do not depend on how long a supplier has served.",
 ['P039'])

q(3, "Ekene adds a quarterly satisfaction survey of camp residents to its scorecard for EKC-03, the synthetic CF-C contract, beside the stated service levels. Which UK Contract Management Principle supports that pairing?",
 "Principle 7, which pairs customer satisfaction with hard KPI data.",
 ["Principle 2, since a resident survey assigns roles and responsibilities to each party.",
  "Principle 1, since a resident survey is part of the handover from sourcing to management.",
  "Principle 4, since surveys are used only on strategic contracts."],
 "Principle 7 of the UK principles pairs hard KPI data with soft measures, naming customer satisfaction as one, and points both at outcomes. A resident survey is that soft measure. Unless CF-C's contract states it, it stays a management measure with no remedy attached. Handover, roles and risk-based resourcing are principles 1, 2 and 4.",
 ['P041'])

q(3, "CF-C (synthetic) disputes a cleanliness score on EKC-03, the synthetic camp services contract. The manager and CF-C have different figures for the month. What is the first step?",
 "Go back to how the contract defines the indicator.",
 ["Average the two figures and record the result as agreed.",
  "Accept CF-C's figure, since the supplier did the cleaning and knows the facts.",
  "Refer the score straight to formal dispute resolution under the contract."],
 "A contract is managed on its own terms, as the World Bank Contract Management Practice guidance reminds its reader, so a contested score starts with the indicator's definition in the contract, then compares both sides' records for the period (Figure XIV). Averaging or deferring to one side skips the evidence, and a score the evidence can settle need never go further.",
 ['P007', 'P160'])

q(2, "When does the UK Procurement Act 2023, s.52(1), require a contracting authority to set its key performance indicators for a public contract worth more than £5 million?",
 "Before it enters into the contract.",
 ["Within twelve months after the contract starts.",
  "Only when the supplier first misses a service level.",
  "At the end of the contract, for the final assessment."],
 "The UK Act fixes the moment: KPIs are set before the authority enters into a public contract worth over £5 million, so the supplier signs up to them. Assessment at least once in every twelve months is a later, separate duty under the UK Act, s.71, as the KPI guidance (para 14) explains. None of this governs an Ekene contract; it is UK law used as practice.",
 ['P035'])

q(3, "CF-C (synthetic) offers to run an extra weekend barbecue for residents if Ekene waives this month's service credit on EKC-03, the synthetic camp services contract. What should the manager do?",
 "Apply the credit as the contract states and treat the offer separately.",
 ["Accept, since a service credit is a matter for the manager's discretion.",
  "Accept, and record the barbecue as the service level being met.",
  "Refuse the barbecue and double the credit as a warning."],
 "A service credit is applied the way the contract says, with its evidence, and the manager does not negotiate it away informally or add to it. The UK Government Functional Standard GovS 008 (version 2.2) at 5.4.4 asks for payments that reflect the contract terms and service levels received. An extra service is outside the scope the fee pays for and goes through the change clause on its own merits.",
 ['P054'])

# Module 5: payment, records and the audit trail.
q(0, "EKC-04 is a synthetic casing frame agreement with TB-D (synthetic). A premium connection delivery arrives two weeks late and three joints fail inspection. Which set of records lets an auditor follow it a year from now?",
 "The order, delivery note, inspection report, notice to TB-D with any reply, and the checked invoice.",
 ["The invoice alone, since it shows what was finally paid.",
  "A summary written at year end by whoever remembers the delivery.",
  "TB-D's own delivery report, since the supplier keeps the official record."],
 "The World Bank Contract Management Practice guidance (Figure XIV), taught by concept, lists what to record: how the supplier performed and delivered, every communication and notice, the dates, and who was involved. For this delivery that means the order with its lead time, the delivery note, the inspection report, the notice and any reply, and the invoice check. An invoice alone, a later summary or the supplier's own report leave the story untold.",
 ['P160'])

q(3, "Among the functions the content Act, s.70(k), gives the Board, which one bears on the records an Ekene contract keeps?",
 "Making auditing procedures and running regular audits of compliance with the content Act.",
 ["Setting the unit prices for casing and tubulars supplied to operators.",
  "Approving each invoice before an operator pays its contractor.",
  "Keeping the only copy of every operator's contract file."],
 "The Nigerian Oil and Gas Industry Content Development Act 2010 (the content Act), s.70(k), lists among the Board's functions to make auditing procedures and conduct regular audits for monitoring and implementing compliance with the content Act. So the content record must be kept to an auditable standard. The Board sets no prices, approves no invoices and holds no operator's file for it.",
 ['P136'])

q(0, "FW-E (synthetic) has shipped line pipe and valves to the EKC-05 site ahead of laying them. On the World Bank's works payment practice (Annex IX para 2.14), what may a contract allow for material of this kind?",
 "Advances against the plant and materials the contractor brings to site.",
 ["Payment of the full price on signature, before any work starts.",
  "Retention kept by the employer after the contractor has met its obligations.",
  "Payment only on completion, with nothing paid as progress is made."],
 "Among the payment tools the Regulations let a works contract use where they fit, one is an advance secured on plant and materials the contractor has brought in; others are a mobilisation advance, progress payments and a retention. Whether EKC-05 uses it depends on its own terms. Paying everything at signature, keeping retention for good or paying only at the end fits none of them.",
 ['P055'])

q(1, "A federal agency's contractor asks which papers start the clock on a delayed payment (Public Procurement Act 2007, s.37(2)). Which submission starts it?",
 "The invoice, the valuation certificate and the procuring body's confirmation.",
 ["The contract's signature, whatever happens after it is signed.",
  "The contractor's first reminder letter about the unpaid sum.",
  "The Bureau's approval of the procurement plan for that year."],
 "The clock in s.37(2) starts when the contractor submits its invoice and valuation certificate and the agency confirms or authenticates them; that is why a certificate matters for timing as well as for approval. Signature, reminder letters and the Bureau's plan approval are not the trigger. Ekene reads this federal rule as practice.",
 ['P047'])

q(2, "On EKC-01, the synthetic WS-A framework, the manager finds a change order issued with no contractual justification and a quiet change to a service specification. How does the World Bank Contract Management Practice guidance (p.41) class these?",
 "As red flags of fraud and corruption during execution.",
 ["As routine flexibility that needs no record, since frameworks change often.",
  "As proof that WS-A has breached the framework and must be removed.",
  "As matters for the Board, since change orders are content reports."],
 "The World Bank guidance, taught by concept, lists change orders without contractual justification and unjustified changes in specification or conditions among the red flags of fraud and corruption in execution. A red flag is a signal to check and record, which is different from proof of breach, and change orders are not content reports for the Board.",
 ['P211'])

q(2, "IM-F (synthetic) on EKC-06, the synthetic instrument maintenance contract, starts extra work the manager approves verbally, with the paperwork to follow. What does the UK Government Functional Standard GovS 008 (version 2.2) at 5.4.5 expect of approvals?",
 "That they are obtained before the change is implemented.",
 ["That they follow within the next billing cycle, once the hours are known.",
  "That the supplier approves its own changes, since it does the work.",
  "That approvals are needed only for price rises."],
 "GovS 008 at 5.4.5 expects change control to give an audit trail in a change register, approvals obtained before implementation, and retained evidence. It is UK practice and a sound habit. A verbal go-ahead with paperwork later reverses the order, and neither the supplier nor the size of the price change decides whether approval is needed.",
 ['P078'])

q(3, "EKC-02, the synthetic MV-B vessel charter, requires notices in writing to a named address. The manager needs to tell MV-B that the vessel was off-hire for a breakdown. How should it be done?",
 "In writing, as the notice clause says, and filed with its date.",
 ["By radio to the vessel's master, since that is quickest at sea.",
  "In a conversation at the next monthly meeting, recorded in no minutes.",
  "Through the ship's agent, whatever address the charter names."],
 "The World Bank Contract Management Practice guidance (Figure XIV), taught by concept, lists every communication and notice, with its date and who was involved, among what a manager records. Contracts usually say how notices must be given, and the manager follows that clause every time. A radio call, an unminuted conversation or a wrong address leaves no record the charter recognises.",
 ['P160'])

# Module 6: Nigerian content in execution.
q(0, "Under the content Act, s.66, what must Ekene as operator do about its Nigerian content policies with its contractors?",
 "Communicate them to its contractors and subcontractors, and monitor and enforce their compliance.",
 ["Keep them confidential from contractors, which learn of them only from the Board.",
  "Leave compliance to each contractor, since the content Act binds operators alone.",
  "Post them to the Bureau, which enforces them on contractors."],
 "The Nigerian Oil and Gas Industry Content Development Act 2010 (the content Act), s.66, says operators shall effectively communicate their Nigerian content policies and procedures to contractors and subcontractors and monitor and enforce their compliance. Monitoring and enforcing is contract management work. The content Act binds contractors too (s.2), and the Bureau has no role.",
 ['P132'])

q(3, "FW-E (synthetic) has completed EKC-05, the synthetic flowline replacement, and met its Nigerian content commitments. Under the Board's contracting process guidelines (2025 update), what is then issued?",
 "A Nigerian Content Compliance Certificate.",
 ["A refund of the five per cent fine under s.68.",
  "A new Certificate of Authorization for the next project.",
  "An interim performance certificate under s.35(2)."],
 "The Board's guidelines (2025 update), taught by concept, say a Nigerian Content Compliance Certificate is issued once the contract is performed and the commitments recorded at award are met. The s.68 fine is a criminal penalty on conviction, which a certificate does not refund, and an interim performance certificate belongs to the Public Procurement Act 2007.",
 ['P137'])

q(1, "The Board asks WS-A (synthetic) on EKC-01, the synthetic well services framework, to send its Nigerian content information to the Board directly. What does the content Act, s.65, say about this?",
 "Contractors are bound to report to the operator and, if the Board requests, directly to the Board.",
 ["Refusal is open to WS-A, since contractors report only to the operator.",
  "WS-A must stop reporting to Ekene once the Board has asked.",
  "Ekene's written consent is needed first under the framework."],
 "The content Act, s.65, requires the operator to ensure its partners, contractors and subcontractors are contractually bound to report Nigerian content information to the operator and, if so requested by the Board, directly to the Board. Both routes run together, and the Board's request needs no consent from Ekene.",
 ['P131'])

q(2, "A synthetic Ekene contract has a total budget above $100 million (USD) and so carries a labour clause under the content Act, s.34. Who sets the minimum percentage of Nigerian labour for its cadres?",
 "The Board, as it may stipulate; this course states no percentage.",
 ["The supplier, which chooses a figure in its bid and keeps to it throughout.",
  "The content Act itself, in a figure printed in s.34.",
  "The contract manager, who sets it at the kick-off meeting with the supplier."],
 "The content Act, s.34, requires the labour clause to mandate a minimum percentage of Nigerian labour in specific cadres as may be stipulated by the Board. The percentage is the Board's to stipulate, and the course states none. The supplier and the manager do not set it.",
 ['P118'])

q(0, "Under the content Act, s.12, a Nigerian Content Plan sets out how the operator and its contractors will give first consideration to what?",
 "Nigerian goods and services, with examples of how that is assessed in bid evaluation.",
 ["Foreign goods and services wherever they are cheaper than Nigerian ones on a like-for-like quote.",
  "The operator's own staff, ahead of contractors' staff.",
  "UK suppliers registered for continental shelf work."],
 "The content Act, s.12, requires the plan to set out how the operator and its contractors will give first consideration to Nigerian goods and services, including specific examples of how first consideration is assessed in the evaluation of bids. How that is weighed at the tender belongs to the procurement course. The other options invert or ignore the section.",
 ['P107'])

q(3, "Ekene's quarterly listing to the Board under the content Act, s.24(1), covers contracts above $1,000,000 (USD). Can that threshold differ?",
 "Yes: s.24(1) allows such other limit as the Board may determine.",
 ["No: the content Act fixes that figure for all time, and nobody may change it.",
  "Yes: each operator may set its own limit, provided it tells the Board first.",
  "No: the Bureau alone may change it by circular."],
 "The $1,000,000 (USD) figure in s.24(1) carries its own qualifier: the Board may determine another limit. So the threshold can move, by the Board's decision alone. An operator cannot pick its own, and the Bureau of Public Procurement has no role under the content Act.",
 ['P109'])

q(2, "CF-C (synthetic) on EKC-03, the synthetic camp catering contract, argues that only Ekene, as operator, could ever commit an offence under the content Act. What does s.68 say about who can?",
 "An operator, contractor or sub-contractor who carries out a project contrary to the content Act.",
 ["The operator alone, since contractors act under its licence.",
  "Only the Board's own officers, if they fail to audit a project.",
  "Foreign companies alone, since the content Act protects Nigerian firms."],
 "The content Act, s.68, says an operator, contractor or sub-contractor who carries out any project contrary to its provisions commits an offence. So CF-C can commit it too, which is why it supplies the content information its contract asks for. The section is not limited to operators, Board officers or foreign firms.",
 ['P133'])

emit(Q, '/root/cat-wip-contracts/banks/sc5b_exam.json', expect_n=42)
finish()
