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

# SC5 Expert final exam: THE WRITTEN-CASE BANK. 42 scenario questions, seven
# drawn from the material of each module, each set in one of the synthetic
# Ekene contracts the pack registers: a short case (the facts, the clause or
# the record, what has happened) and a question on what the sources support.
# Auto-graded multiple choice, no numeric field. It replaces the capstone of
# an app or engine course and issues the Expert certificate at the existing
# final exam pass mark.
# Topics: T01, T03, T05, T07, T09, T10, T11, T12, T13, T14, T15, T16.
# Every key rests on a PACK.md passage named in its src list; the
# explanation cites the SOURCE by name and locator (an Act and its section,
# a guidance and its paragraph), never a passage id or a pack section.

# ---- Cases 1 to 7: contract strategy (Expert m01) ----

q(1, "Case. EKC-07 is the synthetic environmental monitoring consultancy with supplier EM-G (synthetic), paid a time-based fee against approved timesheets. The contract ends next year. The contract owner favours bringing the quarterly sampling in-house and asks for a recommendation by Friday. Ekene's contract manager holds four years of timesheets, report acceptance records and the change register, and nobody has looked at them. The owner says the decision is obvious and needs no paperwork. Question: on the Sourcing Playbook (June 2023), a UK text used as published good practice, what should the recommendation rest on?",
  "An evidenced delivery model assessment that uses those records and weighs in-house, market and hybrid options",
  ["The owner's preference for in-house delivery, since the Playbook leaves the choice to the most senior person in the room",
   "A market test alone, since the Playbook treats a price from the market as the only evidence that matters to the choice",
   "The supplier's own view of whether it should keep the work, since EM-G knows the sampling best of anyone involved"],
  "The Sourcing Playbook (June 2023), Chapter 3, p.22, describes a delivery model assessment as an analytical, evidenced approach to recommend in-house delivery, procurement from the market or a hybrid. The contract manager's records are the evidence it needs. A senior preference, a price alone, or the incumbent's view is none of that evidenced analysis.",
  ['P142'])

q(3, "Case. EKC-03 is the synthetic camp catering and facility services contract with supplier CF-C (synthetic). For the renewal, Ekene expects to add new accommodation blocks during the term, though nobody yet knows how many or when. The draft keeps one fixed monthly fee said to cover all camp services whatever buildings are added later. Question: what do the UK pricing guidance and the World Bank Regulations, used as published practice, suggest about that fee?",
  "A fixed fee fits the defined scope of today's camp, and the unknown additions need a basis or a priced change route of their own",
  ["Keep the single fixed fee for everything, since a fixed price protects the buyer best exactly when the scope is still unknown as a matter of course",
   "Move the whole contract to cost plus, since the UK note says any uncertainty at all makes cost plus the only option to use",
   "Keep the fee and add the new buildings at no charge, since a lump sum covers any work the buyer adds during the term"],
  "The UK Risk Allocation and Pricing Approaches guidance note (January 2026), Appendix II, p.34, ties fixed price to fixed scope: where scope floats or is still unknown a fixed price does not fit, and cost plus may be the only option where base prices cannot be estimated at all. The World Bank Procurement Regulations for IPF Borrowers (Seventh Edition, September 2025), Annex VIII para 3.2, describe a lump sum as a fixed amount for a defined scope, so undefined buildings sit outside it. Today's camp can stay on a fixed fee; the additions need their own basis.",
  ['P029', 'P026'])

q(0, "Case. EKC-05 is the synthetic flowline replacement works contract with supplier FW-E (synthetic). Overnight a flowline at the Ekene manifold ruptured, and repair must start at once. Nobody can yet say how much line is damaged or what the repair will involve. The project engineer proposes asking FW-E for a lump sum by tomorrow morning. Question: which price basis do the World Bank Procurement Regulations for IPF Borrowers (Seventh Edition, September 2025), taught by concept, match to this situation, and on what condition?",
  "Reimbursable cost, with open records and incentives that limit cost",
  ["A lump sum, since a fixed amount protects Ekene best when scope is unknown",
   "Unit price, since quantities are uncertain and the work is fully defined",
   "Performance-based pay, since the repair's outputs are clearly measured"],
  "The World Bank Regulations, Annex VIII paras 3.3, 3.7 and 3.13, match reimbursable cost to emergency repairs, with open records and cost-limiting incentives; lump sum fits scope that can be clearly specified, and unit price fits well defined work with uncertain quantities. Here the work itself is undefined. The UK Risk Allocation and Pricing Approaches note (January 2026), p.34, agrees that a fixed price does not fit a scope that is unknown.",
  ['P146', 'P029'])

q(2, "Case. A synthetic Ekene development needs flowline fabrication and labour worth well over $100 million (USD) in one contract. A planner proposes splitting it into two contracts of just under that figure, with a single supplier and one continuous scope, so that neither contract needs the labour clause. The planner gives no other reason for the split. Question: what do the sources support the strategy lead doing?",
  "Reject a split made to avoid the content Act s.34 labour clause, cut the work only for real reasons, and record them",
  ["Approve the split, since the content Act s.34 labour clause is a matter of form that any operator may arrange around freely",
   "Approve the split, since a labour clause is required only where the Board has first certified the whole package before the award",
   "Reject the split, since the content Act s.34 forbids any contract above $1,000,000 (USD) from being divided at all"],
  "The content Act, s.34, provides that projects or contracts whose total budget exceeds $100 million (USD) shall contain a Labour Clause mandating a minimum percentage of Nigerian labour in cadres the Board stipulates. A split with no reason but avoiding it defeats that duty, and the Public Procurement Act 2007, s.58(4), used as published practice, lists splitting tenders to dodge thresholds as an offence. The section needs no prior certification, and $1,000,000 is the s.24(1) listing figure.",
  ['P118', 'P204'])

q(1, "Case. EKC-06 is the synthetic instrument maintenance service with supplier IM-F (synthetic). For the renewal, the strategy team proposes paying IM-F by the share of field instruments available and within calibration each month, with no hourly rates at all. The operations lead asks what kind of contract that is and what it asks of Ekene. Question: on the World Bank Procurement Regulations for IPF Borrowers (Seventh Edition, September 2025), taught by concept, what is described?",
  "A performance-based contract, which ties payment to measured outputs meeting needs of quality, quantity and reliability",
  ["A unit price contract, which pays for each instrument serviced at a stated rate whatever the result achieved in the month",
   "A lump sum contract, which pays a fixed amount for a defined scope with no measure of outputs at any stage",
   "A reimbursable contract, which pays the supplier's hours and materials at cost under an open book arrangement with Ekene's auditors"],
  "The World Bank Regulations, Annex VIII para 3.4, describe a performance-based contract as tying payment to measured outputs that meet functional needs of quality, quantity and reliability. Paying by instruments available is that model, and it asks Ekene to measure the outputs reliably. Unit price pays quantities delivered, lump sum pays a fixed amount for a defined scope, and reimbursable pays cost.",
  ['P028'])

q(3, "Case. Ekene's synthetic portfolio has two contract managers. The strategy for next year gives the senior manager the camp catering contract, EKC-03 with CF-C (synthetic), because it generates the most complaints, and gives a new graduate part-time charge of EKC-04, the casing and tubulars frame agreement with TB-D (synthetic), the only qualified source of a premium connection. Question: what do the UK Contract Management Principles, used as published good practice, suggest?",
  "Direct the strongest resource to the contracts where risk and reward are highest, which points the senior manager at TB-D",
  ["Keep the allocation, since the Principles direct the strongest resource to the contract with the most complaints from users",
   "Share every contract equally between both managers, since the Principles treat all contracts as needing equal effort and attention",
   "Leave TB-D unmanaged, since a single-source frame agreement runs itself once its unit prices have been agreed"],
  "The UK Contract Management Principles, principle 4, advise a differentiated approach based on risk, distinguishing tactical and strategic contracts and directing the most or strongest resource to contracts where the risks and rewards are highest. A single qualified source for a critical item carries the higher risk. Complaint volume is not the Principles' test, and they reject equal effort for all contracts.",
  ['P004'])

q(2, "Case. EKC-04 is the synthetic casing and tubulars frame agreement with supplier TB-D (synthetic). TB-D is the Nigerian agent of a foreign mill. The draft renewal leaves out every Nigerian content term, and a reviewer argues that a contract with a foreign mill's agent falls outside the content Act. Question: what do the sources support?",
  "The content Act, s.6, requires the renewal to conform to it, and s.2 has every contractor in the industry consider Nigerian content",
  ["The content Act applies only to operators, so a contractor such as TB-D carries no content duties under its agreement with the operator",
   "The content Act applies only to contracts above $100 million (USD), so the frame agreement needs no content terms",
   "The content Act binds only where the Public Procurement Act 2007 also applies, so an operator's contract is outside it in every respect"],
  "The content Act, s.6, provides that all subsequent oil and gas contracts relating to any operation in the Nigerian oil and gas industry shall be in conformity with it, and s.2 has all regulatory authorities, operators, contractors, subcontractors and others consider Nigerian content an important element of project execution. Contractors are covered, $100 million is the s.34 labour clause line, and the content Act stands on its own.",
  ['P102', 'P100'])

# ---- Cases 8 to 14: claims (Expert m02) ----

q(0, "Case. EKC-03 is the synthetic camp catering and facility services contract with supplier CF-C (synthetic), for a fixed monthly fee. Ekene closed the camp kitchen for a week to refurbish it. CF-C kept its cooks on standby and now claims their wages for the week on top of the fixed fee, attaching payslips. Ekene's procurement lead wants the payslips checked first. Question: on the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, what should the contract manager test first?",
  "Whether the contract entitles CF-C to payment beyond the fixed fee for a closure of this kind",
  ["Whether the payslips are genuine, since evidence of cost is tested before anything else in a claim",
   "Whether the refurbishment was needed, since an unneeded closure proves CF-C's claim at once in full",
   "Whether CF-C gave notice by email, since a claim's form decides it before its substance is read"],
  "Entitlement is the gate. The World Bank Contract Management Practice guidance (Second Edition, 2024), p.51, looks first at whether the contract gives CF-C a right to be paid for a kitchen closure on top of its fixed fee; only after that at whether the wages were really paid and reasonable, and whether Ekene's closure caused them. Payslips answer the second question. Whether the refurbishment was needed creates no right to payment, and the form of notice is a term to read once the right is known.",
  ['P154'])

q(3, "Case. EKC-04 is the synthetic casing and tubulars frame agreement with supplier TB-D (synthetic), priced at stated unit prices per item with no price adjustment clause. The mill's steel surcharge has risen, and TB-D writes that it will add the surcharge to every open order. The letter cites no clause of the agreement. Question: what do the sources support the contract manager doing?",
  "Ask TB-D to state the contractual or legal basis it relies on, having already mapped that cost risk to TB-D under fixed unit prices",
  ["Pay the surcharge at once, since a supplier's rising costs create an entitlement under any frame agreement without a clause of any kind",
   "Accept the surcharge as a variation, since a supplier's cost increase is a change to the scope that Ekene has requested",
   "Refer the letter to arbitration, since a claim that cites no clause becomes a formal dispute on the very day Ekene receives it"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024) says a claim should state the breach of contract or other legal basis it relies on (p.51), and expects the contract manager to know in advance which costs sit with the contractor (p.20). Under fixed unit prices with no adjustment clause, cost risk stays with TB-D unless a clause moves it. Rising costs are no scope change, and a claim becomes a dispute only when answered and still disagreed.",
  ['P153', 'P159'])

q(2, "Case. A synthetic Ekene works contract for a second manifold is written on conditions based on FIDIC's general conditions, and names Ekene's lead engineer as the Engineer. The supplier gives notice and then full particulars of a claim for extra time. Ekene's budget holder tells the Engineer to reject the claim because the project is over budget. Question: how do the FIDIC conditions, taught by concept, frame the Engineer's task?",
  "The Engineer makes a fair determination of the claim under the contract, whatever the budget position",
  ["The Engineer rejects any claim that would take the project over budget, as the owner directs in writing",
   "The Engineer passes the claim straight to arbitration, since the Engineer is employed by Ekene as its staff",
   "The Engineer accepts the claim in full, since notice and particulars were both given on time"],
  "The FIDIC conditions (Second Edition 2017, reprinted 2022), licensed and taught by concept, define what counts as a claim, set a notice and particulars procedure, and have the Engineer, or the Employer's Representative in EPC forms, make a fair determination under the contract. The budget does not decide it, the determination comes before any arbitration, and timely notice does not by itself prove the claim.",
  ['P161'])

q(1, "Case. EKC-01 is the synthetic well services call-off framework with supplier WS-A (synthetic). An Ekene rig was not ready, and WS-A's nitrogen unit waited on location. WS-A claims six days of idle equipment. WS-A's own daily reports show the unit was moved to another operator's job on the third day and returned on the sixth. Ekene accepts that the delay was its fault. Question: on the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, how should the idle equipment line be assessed?",
  "Allow idle equipment only for the days the unit could not be released or redeployed, which the daily reports limit",
  ["Allow all six days in full, since Ekene has accepted fault and the idle days follow automatically from that acceptance",
   "Disallow the whole line, since equipment that was later redeployed cannot have been idle on any day at all of the delay",
   "Allow six days at market rates, since an accepted delay claim is priced at market before any contract rate is considered"],
  "For delay claims the World Bank Contract Management Practice guidance (Second Edition, 2024), p.52, tests idle labour and equipment by asking whether they could have been released or redeployed, and prices accepted costs at contract rates first, then historical costs, then market rates. Accepted fault establishes entitlement and still leaves the extent to prove. Days before the move may be allowed; days the unit worked elsewhere are not idle.",
  ['P158', 'P156'])

q(3, "Case. EKC-07 is the synthetic environmental monitoring consultancy with supplier EM-G (synthetic). Six months ago EM-G's project lead emailed an Ekene engineer to give notice of extra sampling trips. The engineer has since left, the email was never logged, and EM-G now presses a claim that relies on that notice. Ekene cannot say whether or when the notice was answered. Question: which practice from the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, would have protected Ekene?",
  "Record every communication and notice with its date and the people involved, and answer supplier notices on time",
  ["Accept notices only by registered post, so that emails from a supplier's staff cannot count as notices of any kind",
   "Keep notices in each engineer's personal mailbox, since the person who received a notice is best placed to hold it",
   "Delete notices once a claim is paid, since the record of a notice has no further use once its claim is settled"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), Figure XIV, p.38, lists what to record: how the supplier performed and delivered, every communication and notice, the dates, and who was involved; and among its claim-prevention practices it names answering contractor notices on time (p.50). What counts as notice is set by the contract, and a personal mailbox or deleted record leaves Ekene unable to show what happened.",
  ['P160', 'P157'])

q(0, "Case. EKC-01 is the synthetic well services call-off framework with supplier WS-A (synthetic). The framework pays standby for a coiled tubing crew on days when an Ekene work permit is issued late. WS-A claims crew standby for twelve days in May, with a cost analysis and crew timesheets. Ekene's permit log shows late permits on only six of those twelve days. Question: on the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, how should the claim be treated?",
  "Pay standby only on the days the permit log shows a late Ekene permit caused it, and ask WS-A for evidence on the others",
  ["Pay all twelve days, since a right to standby and a cost analysis together prove that Ekene caused every day of it on the site",
   "Refuse all twelve days, since six days with permits issued on time show that none of the standby was really lost to the crew",
   "Pay six of the twelve days by agreement, since the guidance divides any partly proved claim evenly between the parties on the facts"],
  "Here the framework grants the right, so the World Bank Contract Management Practice guidance (Second Edition, 2024), p.51, turns to whether the cost was incurred and reasonable and whether Ekene's default caused it, and expects the claim to rest on a cost analysis and records. The permit log supports causation on six days only; the other six need WS-A's evidence. The guidance neither pays everything once a right exists nor refuses a claim wholesale, and it prints no rule for splitting a claim.",
  ['P154', 'P155'])

q(2, "Case. A synthetic review of all Ekene claims over two years finds that most arose from one cause: supplier notices of problems sat unanswered for weeks, and the problems grew into claims. The contract owner asks what single practice the next round of contracts should fix. Question: which practice does the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, name among those that prevent claims?",
  "Answering contractor notices on time",
  ["Adding a service credit to each KPI",
   "Raising retention on each invoice paid",
   "Moving every claim straight to mediation"],
  "Among the buyer-side habits the World Bank Contract Management Practice guidance (Second Edition, 2024), p.50, credits with preventing claims is a timely answer to each contractor notice, and the review traced Ekene's claims to exactly that gap. Service credits, higher retention and early mediation appear nowhere among those habits, and none of them would have stopped a problem growing while a notice sat unanswered.",
  ['P157'])

# ---- Cases 15 to 21: disputes (Expert m03) ----

q(1, "Case. EKC-02 is the synthetic platform supply vessel time charter with supplier MV-B (synthetic). The charter requires mediation before arbitration. After senior meetings on a disputed off-hire period failed, MV-B sent Ekene a written invitation to mediate, stating no time for acceptance. Ekene's reply has sat in a draft folder for six weeks. Question: under the Arbitration and Mediation Act 2023 (Nigeria), s.70(1) and (2), what is MV-B's position?",
  "MV-B may treat the invitation as rejected, since no acceptance came within the 30 days that apply by default",
  ["Ekene's draft reply keeps the invitation open, since an invitation to mediate stays live until it is answered in writing",
   "A court must now reissue the invitation, since s.70 routes an invitation left unanswered through a court process",
   "Silence counts as consent under s.70, so MV-B may appoint the mediator alone and open the mediation"],
  "Under the Arbitration and Mediation Act 2023 (Nigeria), s.70(1) and (2), an invitation to mediate that meets no acceptance within 30 days of being sent, or within any other period the invitation itself sets, may be treated by the party who sent it as rejected. MV-B set no period, so 30 days ran and Ekene's draft reply came too late. Nothing in s.70 keeps an invitation open indefinitely, routes it through the court, or turns silence into consent.",
  ['P170'])

q(3, "Case. EKC-03 is the synthetic camp catering and facility services contract with supplier CF-C (synthetic). A mediation in Nigeria ended in a signed settlement under which CF-C would refund two months of service credits. CF-C has not paid. Ekene's lawyers want to put the settlement before the court to enforce it. CF-C's lawyer says the Arbitration and Mediation Act 2023 bars any use of mediation material. Question: what does that Act provide?",
  "Section 76 lets a party disclose what is needed to implement or enforce the settlement, and s.82(2) makes the settlement enforceable in court",
  ["Section 76 bars every disclosure without exception, so Ekene must start the whole dispute again from the first rung of the ladder",
   "Section 76 lets Ekene publish the whole mediation file to anyone, since a party in breach of a settlement loses all confidentiality in any circumstances",
   "Section 76 permits disclosure only to the Board, since the mediation of any oil and gas contract is reported to the Board alone"],
  "Confidentiality under the Arbitration and Mediation Act 2023 (Nigeria), s.76, has named exceptions, and disclosure needed to implement or enforce the settlement is one of them, beside disclosure required by law, disclosure to prevent or reveal a crime or a threat, and disclosure to protect public order as the law prescribes. Section 82(2) makes the settlement binding and enforceable in court as a contract, consent judgment or consent award. So Ekene may use what enforcement needs, and no more: the exception does not open the whole file to the public, and the Board has no part in it.",
  ['P172', 'P173'])

q(0, "Case. EKC-07 is the synthetic environmental monitoring consultancy with supplier EM-G (synthetic), whose contract holds an arbitration clause seated in Nigeria. EM-G sued Ekene in court over withheld fees. Ekene's lawyers filed a full defence on the merits last month without mentioning arbitration, and now wish to ask the court to refer the matter to arbitration. Question: what does the Arbitration and Mediation Act 2023 (Nigeria), s.5(1), make the key issue?",
  "Timing, since the court must refer only where the request comes no later than the party's first statement on the substance",
  ["Nothing, since the court must refer an arbitrable matter whenever a party asks, at any stage before a final judgment is given",
   "The fee amount, since s.5(1) allows referral only where the sum in dispute is above a threshold the section prints for referral",
   "EM-G's consent, since s.5(1) allows referral only where the party that started the suit also agrees to arbitrate"],
  "Section 5(1) of the Arbitration and Mediation Act 2023 (Nigeria) obliges the court to send the parties to arbitration only where the request comes no later than the requesting party's first statement on the substance, the exceptions being an agreement that is void, inoperative or incapable of being performed. Ekene argued the merits first, so its late request is the difficulty. The section prints no money threshold, and the party that brought the suit need not consent.",
  ['P168'])

q(2, "Case. EKC-02 is the synthetic platform supply vessel time charter with supplier MV-B (synthetic). A tribunal seated in Lagos decided an off-hire dispute for MV-B, and Ekene's legal department logged receipt of the award the day it arrived. The department now proposes to hold back any challenge until MV-B moves to enforce, which may be a year away. Question: under the Arbitration and Mediation Act 2023 (Nigeria), s.55(4), what is wrong with holding back?",
  "The time to apply to set the award aside ends three months after Ekene received it, whatever MV-B does",
  ["Nothing, since a challenge to an award may wait until the winning party applies to a court to enforce it",
   "Nothing, since the time for any challenge starts only when MV-B serves its notice of enforcement",
   "The award lapses unless Ekene challenges it within 30 days of the tribunal's final hearing"],
  "Section 55(4) of the Arbitration and Mediation Act 2023 (Nigeria) bars an application for setting aside once three months have elapsed from the date the applicant received the award. Receipt was logged, so the period is already running, and MV-B's timing on enforcement does not pause it. The section does not make an award lapse, and 30 days is the s.70 period for an unanswered invitation to mediate.",
  ['P174'])

q(1, "Case. EKC-04 is the synthetic casing and tubulars frame agreement with supplier TB-D (synthetic). Ekene and TB-D disagree whether a batch of casing met the specification's hardness test, a question an independent metallurgist could settle in days. The agreement's dispute clause runs from senior meetings straight to arbitration, with no expert rung. Question: what do the sources support?",
  "An expert whose decision binds both sides can be added now only by agreement with TB-D, and the renewal should build an expert rung into the contract",
  ["Ekene may appoint an expert alone and bind TB-D to the finding, since a technical question overrides the dispute clause as written",
   "The matter must go to arbitration at once, since the sources forbid any expert where the contract omits an expert rung from its ladder",
   "The renewal should leave out any expert rung, since the World Bank guidance says experts work best when chosen later"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), p.36, says alternative mechanisms such as a dispute review expert should be set up on time, since creating one after a dispute starts tends to fail, and a contract is managed on its own terms (p.1). The current clause has no expert, so an expert whose decision binds both sides can be added only by agreement with TB-D, and the renewal should build that rung in.",
  ['P163', 'P007'])

q(3, "Case. EKC-05 is the synthetic flowline replacement works contract with supplier FW-E (synthetic). FW-E disputes the valuation of two variations. The contract's dispute clause provides a meeting of senior representatives, then mediation, then arbitration. FW-E's director writes that meetings waste time and he will start arbitration next week. Question: what do the sources support Ekene's reply saying?",
  "The contract's ladder applies, with senior meetings and mediation before arbitration, since arbitration is the last resort",
  ["Arbitration may start next week, since a party may pick any rung of a dispute clause whenever it prefers to begin the process",
   "Litigation should start first, since the guidance ranks a court case ahead of arbitration for works",
   "Ekene will accept FW-E's valuation, since a threat to arbitrate settles the dispute in the supplier's favour"],
  "FW-E's contract sets a ladder of senior meeting, then mediation, then arbitration, and a contract is run on its own terms, as the World Bank Contract Management Practice guidance (Second Edition, 2024) reminds its reader (p.1). The same guidance places arbitration and litigation at the end, as the last resort (p.35). A preference for speed does not let one party skip the rungs, a court case is no higher step, and a threat to arbitrate concedes nothing.",
  ['P162', 'P007'])

q(0, "Case. EKC-04 is the synthetic casing and tubulars frame agreement with supplier TB-D (synthetic). A tribunal seated abroad, under the agreement's arbitration clause, has made an award in Ekene's favour. TB-D refuses to pay and says a foreign award has no effect in Nigeria. Question: what does the Arbitration and Mediation Act 2023 (Nigeria), s.57(1) and (3), provide for Ekene?",
  "Ekene may apply in writing to the Court to enforce the award, which the 2023 Act treats as binding wherever made",
  ["The award binds only in the country of the seat, so Ekene must bring a fresh claim before a Nigerian court",
   "TB-D must first sign a consent to the award, since a foreign award has effect in Nigeria only with the loser's consent",
   "A Nigerian judge must rehear the whole dispute and decide it afresh before anything can be enforced"],
  "Under the Arbitration and Mediation Act 2023 (Nigeria), s.57(1) and (3), the country where an award was made does not decide its force: the award is recognised as binding, and the Court enforces it when Ekene applies in writing. TB-D's argument therefore fails. Ekene need not bring a fresh claim, obtain TB-D's consent or have the dispute heard again.",
  ['P175'])

# ---- Cases 22 to 28: termination, step-in and exit (Expert m04) ----

q(2, "Case. EKC-01 is the synthetic well services call-off framework with supplier WS-A (synthetic), with a KPI for non-productive time caused by the supplier. WS-A has missed that KPI for three quarters. Nobody has issued a formal notice or asked for an improvement plan, though the framework provides both. The drilling manager asks for the framework to be terminated this month. Question: on GovS 008 (version 2.2, issued 1 April 2026), UK good practice used as a model, what should the contract manager recommend?",
  "Use the framework's formal notice and improvement plan first, since early termination is a last resort after remedies are exhausted",
  ["Terminate this month, since three missed quarters of a KPI make termination the remedy that GovS 008 names first for poor performance",
   "Terminate this month, since a KPI miss carries a right to terminate whether or not the framework states a remedy for it",
   "Do nothing until the framework expires, since GovS 008 forbids any action on performance during a framework's term"],
  "Two parts of GovS 008 (version 2.2, issued 1 April 2026) meet here. Section 5.4.3 asks for preventive or corrective action within the terms of the contract when performance falls short, naming formal notice and a performance improvement plan as examples. Section 5.4.7 keeps early termination for last, after the contract's other provisions and its remedies for improving performance have run out. WS-A's framework holds both remedies and neither has been tried. GovS 008 names no count of missed quarters as a trigger and does not stop a buyer acting during the term.",
  ['P182', 'P067'])

q(1, "Case. EKC-03 is the synthetic camp catering and facility services contract with supplier CF-C (synthetic), which expires next month. The incoming caterer (synthetic) plans to bring its own foreign staff to fill the cook, steward and cleaner posts that CF-C's Nigerian staff hold today, and says the content Act has nothing to say about a new contract's staffing. Question: what does the Nigerian Oil and Gas Industry Content Development Act 2010 (the content Act) provide?",
  "Nigerians get first consideration for employment and training under s.28(1), and junior and intermediate cadres are for Nigerians only under s.35",
  ["The content Act binds only the outgoing contract, so a successor's staffing is free of it until the operator's next annual report",
   "Expatriates may fill any post for four years under s.31 of the content Act, so the foreign staff may take the posts from the first day",
   "Section 32 of the content Act caps expatriates at five per cent of all staff, so a handful of foreign cooks raises no issue at all"],
  "The content Act, s.28(1), provides that Nigerians shall be given first consideration for employment and training in any project executed by an operator, and s.35 requires operators and companies in the industry to employ only Nigerians in their junior and intermediate cadre. A successor contract carries both duties from its first day under s.6. Section 31 is a succession plan in which Nigerians understudy an expatriate for at most four years, and s.32 allows up to five per cent of management positions as expatriate positions with the Board's approval.",
  ['P112', 'P119'])

q(3, "Case. EKC-07 is the synthetic environmental monitoring consultancy with supplier EM-G (synthetic), with a named key person. The key person left four months ago, and the replacement lacks the stated qualifications. Ekene's managers complained in two meetings, but nothing was written and no request was made under the contract to replace the person. The asset manager now wants to terminate. Question: what do the sources support doing first?",
  "Use the contract to ask in writing for a suitable replacement, and build the written record before any termination",
  ["Terminate now, since complaints made in two meetings are as effective as a written notice under the contract itself",
   "Terminate now, since a key person's departure ends a consultancy contract by itself without any further step by Ekene",
   "Withhold every fee until the contract expires, since withholding needs no written record or contractual basis at all"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024) says that where a consultant's team performs poorly the client uses the contract to ask for correction or replacement of staff, moving to further remedies only if the consultant fails to act (p.83), and its case study shows that verbal warnings with no written record delayed termination by months (Figure XV, p.39). A departure does not end the contract by itself, and withholding follows the contract's terms.",
  ['P075', 'P184'])

q(0, "Case. EKC-04 is the synthetic casing and tubulars frame agreement with supplier TB-D (synthetic). The agreement provides delay damages for late deliveries up to an aggregate limit, and TB-D's lateness has now reached that limit. Three orders remain, TB-D is the only qualified source for the premium connection, and a replacement supplier would take many months to qualify. Question: what does the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, say about reaching the limit?",
  "Reaching the limit usually permits termination, though continuing may still be the better option, as the agreement's terms allow",
  ["Reaching the limit ends the agreement automatically, so Ekene has no choice left about the remaining three orders still to deliver",
   "Reaching the limit obliges Ekene to terminate within 30 days, or it loses every right to damages already accrued",
   "Reaching the limit has no consequence, since the World Bank guidance treats delay damages as having no bearing on termination at all"],
  "Reaching the aggregate cap on delay damages, in the World Bank Contract Management Practice guidance (Second Edition, 2024), p.38, usually opens the way to termination, while the guidance adds that carrying on may still serve the employer better. With TB-D the only qualified source and a replacement many months away, the agreement's own terms and the need for supply decide the choice. The guidance describes no automatic ending and no deadline that forfeits damages already accrued.",
  ['P186'])

q(2, "Case. EKC-02 is the synthetic platform supply vessel time charter with supplier MV-B (synthetic). The charter expires in four months and Ekene will charter another vessel. The charter says nothing about the final months or the handover, and MV-B has started moving its best crew to other charters. Nobody at Ekene has an exit plan. Question: what do the UK texts, used as published good practice, support?",
  "Plan the exit now with the contract manager's input, and write terms into the new charter that keep resources and performance up to the end",
  ["Wait until the last week, since exit planning in good time signals weakness to MV-B and raises the charter's cost",
   "Leave the exit to the incoming owner, since a new charterer is best placed to plan how the old charter ends",
   "Terminate the charter now, since a supplier moving crew is itself a termination ground under the UK Act"],
  "The UK Contract Management Framework Summary, Area 11, item 15, expects exit planning to be put in place in a timely manner with input from the contract manager, and the Sourcing Playbook (June 2023), Chapter 13, key point 2, p.73, says the contract should hold sufficient means to incentivise the incumbent to maintain resources and performance up to the end. The UK Procurement Act 2023 binds no Ekene charter.",
  ['P200', 'P197'])

q(1, "Case. EKC-06 is the synthetic instrument maintenance service with supplier IM-F (synthetic). The contract holds a financial distress clause modelled on the UK Model Services Contract. This quarter IM-F's technicians report late wages and a sub-supplier has stopped extending credit to IM-F, yet IM-F has reported nothing under the clause. Ekene last looked at IM-F's finances at award. Question: what do the UK texts on supplier financial standing, used as published good practice, expect?",
  "IM-F should promptly report a distress event or anything that could cause one, and Ekene should monitor IM-F's standing on an ongoing basis",
  ["IM-F need report only once formal insolvency proceedings begin, since the clause covers nothing short of a court process",
   "Ekene should look at IM-F's finances again only at renewal, since the UK texts confine financial checks to the award stage",
   "IM-F's board confirms its solvency once at award, and nothing more is expected of either party until the contract ends"],
  "The UK Economic and Financial Standing guidance note (2026 edition), paras 4.6.1 to 4.6.2, explains that under the Model Services Contract suppliers should promptly report a Financial Distress Event or anything that could cause one, with an annual board confirmation for critical service contracts. The Sourcing Playbook (June 2023), Chapter 11, p.65, commits to monitoring the financial standing of key suppliers on an ongoing basis. Reporting starts well before insolvency, and monitoring does not stop at award.",
  ['P094', 'P090'])

q(3, "Case. EKC-01 is the synthetic well services call-off framework with supplier WS-A (synthetic). WS-A's coiled tubing unit has failed twice on the same well. Ekene's well site leader proposes that Ekene's own crew take over WS-A's unit and run the job. The framework contains a rectification plan clause and nothing about step-in. Question: what do the sources support?",
  "Ekene holds no step-in right under this framework, so it relies on the rectification plan clause and the framework's remaining terms",
  ["Step-in is open to any operator once equipment fails twice, whether or not the framework grants that right",
   "The content Act implies step-in into every Nigerian framework, so Ekene's crew may take the unit",
   "Use step-in before any rectification plan, since the Principles list it as the first contractual option"],
  "The UK Contract Management Principles, principle 3, name Remedial Advisors, Rectification Plans and Step In rights as contractual options, and the Sourcing Playbook (June 2023), Chapter 5, p.41, lists step-in rights among the protections a contract may include. Each exists only where the contract grants it, and corrective action is taken within the contract's terms. No failure count or Act supplies a step-in right the framework omits.",
  ['P068', 'P187'])

# ---- Cases 29 to 35: close-out and lessons learned (Expert m05) ----

q(2, "Case. EKC-01 is the synthetic well services call-off framework with supplier WS-A (synthetic), which is closing. Reconciling call-offs for the final account, the contract manager finds that one nitrogen call-off in the second year was paid at a rate above the schedule of rates. Accounts want to release the final payment on Monday as drafted and chase the difference later. Question: on the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, what should happen?",
  "Put the overpayment right in the final account before the final payment goes out",
  ["Release the payment as drafted and recover the difference in a later framework next year",
   "Release the payment as drafted, since a call-off once paid is closed for good",
   "Adjust it only if WS-A signs a letter admitting that the rate it billed was wrong"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), in its section on price adjustment (p.21), has a mistake in what was paid put right when it surfaces ahead of the last payment. WS-A's call-off was billed above the schedule, and that is known today, so the final account nets it off. Carrying it into some later framework, calling a settled call-off closed, or making the fix depend on WS-A's confession would all wave a known overpayment through.",
  ['P194'])

q(0, "Case. EKC-01 is the synthetic well services call-off framework with supplier WS-A (synthetic), which closes on 31 December. WS-A's content data for the year, hours worked by Nigerian and foreign staff and locally made and imported materials, sits in WS-A's own systems, and WS-A's project staff will disperse in January. Ekene's content team will prepare the operator's annual report. Question: what does the Nigerian Oil and Gas Industry Content Development Act 2010 (the content Act) set for that report?",
  "Within sixty days of the beginning of the year, covering all of Ekene's projects, with spend, employment and procurement achievement",
  ["Within 30 days after the end of each quarter, covering only contracts above $1,000,000 (USD) awarded during that quarter",
   "Within three months of the end of the financial year, sent to the Bureau of Public Procurement for its procurement records",
   "Only when the Board asks for one, since the content Act leaves the annual report to the operator's choice"],
  "The content Act, s.60, requires each operator to submit its annual Nigerian Content Performance Report within sixty days of the beginning of each year, covering all its projects and activities for the year under review, and s.61 has it show content by category of spend, employment as hours or days worked by Nigerian and foreign workers, and procurement as quantity and tonnage of local and foreign materials. So WS-A's data is gathered before close. The quarterly listing is s.24(1), and copies to the Bureau within three months belong to the Public Procurement Act 2007, s.16(13).",
  ['P127', 'P128'])

q(3, "Case. EKC-05 is the synthetic flowline replacement works contract with supplier FW-E (synthetic), with a retention held from each milestone payment until completion and a defects period. The scenario adds its own facts: the contract ties release of retention to FW-E meeting its obligations, the defects period has months to run, and FW-E has handed over the last flowline and asks for the whole retention now. Question: on the World Bank Procurement Regulations for IPF Borrowers (Seventh Edition, September 2025), taught by concept, when is a reasonable retention released?",
  "Once the contractor has met its obligations, read here from the contract's own release terms",
  ["On handover of the last item, since handover is itself proof that all obligations are met",
   "At the end of the financial year, since retention is an annual reserve held by the employer",
   "Never, since the Regulations treat retention as the employer's to keep on every works contract"],
  "The World Bank Regulations, Annex IX para 2.14, provide for a reasonable retention that is released once the contractor has met its obligations. The contract states what those obligations are, and the defects period may be among them. Handover is a claim of completion, retention is no annual reserve, and the Regulations provide for its release.",
  ['P055'])

q(1, "Case. EKC-07 is the synthetic environmental monitoring consultancy with supplier EM-G (synthetic). The final quarterly report has been accepted, but one invoice is still disputed and unpaid. The contract owner wants the contract recorded as discharged and the file archived today. Ekene uses the UK Contract Terminations guidance (Procurement Act 2023), para 8, as a model of how a contract ends. Question: can the contract be treated as discharged today?",
  "No: on that model a contract is discharged when, for example, obligations are fulfilled, payments made and disputes settled; a disputed invoice is still open",
  ["Yes: discharge follows acceptance of the final report, since payments and disputes play no part in how a contract ends on that model",
   "Yes: discharge follows the owner's decision, since the guidance lets the contract owner declare any contract discharged whenever it wishes",
   "No: discharge needs a court order in every case, since only a court may bring any public or private contract to an end before its term"],
  "The UK Contract Terminations guidance (Procurement Act 2023), para 8 (s.80(3)), lists, without claiming to be exhaustive, the ways a contract ends, including discharge, which it illustrates as obligations or deliverables fulfilled, payments made and any disputes settled, by mutual agreement or frustration. The disputed invoice means payments and disputes are still open. Discharge does not rest on acceptance alone or on an owner's declaration, and a court order is only one of the other listed routes.",
  ['P198'])

q(2, "Case. EKC-03 is the synthetic camp catering and facility services contract with supplier CF-C (synthetic). At close, the record shows CF-C missed the cleanliness service level in four months, three of them months when Ekene's water supply to the camp failed. Camp residents' surveys rate CF-C's staff well. The contract manager must write the close evaluation. Question: what do the sources support the evaluation doing?",
  "Assess performance against the service levels and the residents' views together, recording the misses Ekene's water failures caused",
  ["Record all four misses as CF-C's failures, since a service level missed is the supplier's failure whatever caused it in any given month",
   "Leave the surveys out, since only hard KPI data may appear in a close evaluation under the UK Principles",
   "Skip the evaluation, since a contract that has ended needs no assessment of how the supplier performed"],
  "The World Bank Procurement Regulations for IPF Borrowers (Seventh Edition, September 2025), Annex XI para 2.4, taught by concept, require an evaluation of how the contract was carried out, made at completion, to assess performance and draw lessons, and the UK Contract Management Principles, principle 7, advise a balanced scorecard of hard KPI data alongside soft measures such as satisfaction. A fair evaluation separates what CF-C controlled from what Ekene caused.",
  ['P190', 'P041'])

q(0, "Case. EKC-04 is the synthetic casing and tubulars frame agreement with supplier TB-D (synthetic), which has ended. Its KPIs covered delivery against order lead times and first-time acceptance of pipe at inspection. For the review after the agreement ends, the category lead plans to interview the drilling engineers and leave the KPI records aside. Question: what does the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, ask of that review?",
  "Use the KPIs in the review after the contract ends, and record the lessons for future operations",
  ["Leave the KPI records aside, since the guidance builds a post-contract review on interviews alone",
   "Hold no review, since a frame agreement that has ended leaves no lesson worth recording for anyone",
   "Hand the review to TB-D, since the supplier holds the delivery records the KPIs were measured on"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), KPIs: Good Practice, item 13, p.94, asks for the KPIs to be used in the review after the contract ends and for the lessons to be recorded for future operations. Interviews can add to the KPI record, and they cannot replace it. The review belongs to the buyer, and an ended agreement is exactly when the lessons are drawn.",
  ['P193'])

q(3, "Case. EKC-02 is the synthetic platform supply vessel time charter with supplier MV-B (synthetic), which has ended. Over three years the charter's final cost rose well above the award price through twenty change orders, most for extra standby days. The contract owner asks what the close-out review should examine about the price. Question: what do the World Bank texts, taught by concept as published practice, support?",
  "Benchmark the final price against comparable charters, and weigh what the twenty changes did to cost, schedule and performance",
  ["Compare the final price with the award price only, and treat every change order as settled and closed without review of any kind",
   "Review only the change orders MV-B disputed, since agreed changes carry no lesson for the next charter or its terms",
   "Leave price out of the review, since a time charter paid by the day has no final price that can be benchmarked"],
  "Two World Bank texts, taught by concept, frame the review. The Procurement Regulations for IPF Borrowers (Seventh Edition, September 2025), Annex XI para 3.3(f), include among value for money checks a comparison of the final price with comparable benchmarks. The Contract Management Practice guidance (Second Edition, 2024), p.30, has the changes made during a contract judged at close-out for what they did to cost, schedule and performance, and kept as lessons. The award price alone is no benchmark, agreed changes still carry lessons, and a day-rate charter still has a final price.",
  ['P191', 'P192'])

# ---- Cases 36 to 42: integrity, governance and the sources (Expert m06) ----

q(1, "Case. EKC-05 is the synthetic flowline replacement works contract with supplier FW-E (synthetic). Ekene appoints a new contract manager for the defects period. In her first week she finds that her husband holds shares in FW-E's fabrication sub-contractor, whose welds she must now inspect. The conflicts record was last completed by the procurement team at the tender. Question: what do the sources support her doing?",
  "Declare the interest at once, and have the conflicts assessment refreshed for the handover to contract management",
  ["Say nothing, since the shares belong to her husband and a relative's interest falls outside the conflict rules entirely",
   "Declare the interest at the next annual review, since a conflict needs declaring only once a decision is due from her",
   "Rely on the tender record, since the procurement team's assessment covers every person for the whole contract term"],
  "The Public Procurement Act 2007, s.57(10), used as published practice, requires anyone engaged in procurement to declare immediately any actual or potential interest that might involve a conflict, and s.57(12) counts indirect interests; the UK Conflicts of Interest guidance (Procurement Act 2023), para 24, says the assessment should be refreshed when responsibility passes to a contract management team. The duty is immediate, covers indirect interests, and moves with the people.",
  ['P202', 'P213'])

q(3, "Case. EKC-01 is the synthetic well services call-off framework with supplier WS-A (synthetic). An internal check of framework payments turns up three things: extra call-offs issued with no clause to support them, a pump specification rewritten so that only WS-A's equipment now qualifies, and one nitrogen job billed on two separate invoices. Question: on the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, how should the contract manager proceed?",
  "Treat them as fraud warning signs: keep the records intact, hold the disputed sums under the payment terms and report through Ekene's integrity route",
  ["Treat them as clerical errors and let WS-A correct them on its next invoice, since the guidance places fraud risk at the tender stage only",
   "Confront WS-A's staff with the findings and settle the matter privately, since the guidance leaves suspected fraud to the contract manager",
   "Terminate the framework at once, since the guidance treats these findings as proof of fraud that ends any contract by itself"],
  "These are the warning signs the World Bank Contract Management Practice guidance (Second Edition, 2024) names for the execution stage (Fraud and Corruption, p.41): unsupported change orders, unjustified specification changes, payments outside the contract and duplicate invoices. On Bank-financed work suspected fraud is reported promptly (p.40); Ekene's own integrity route plays that part here. The signs justify a report and an investigation by those Ekene's policy names. They prove nothing on their own, and the risk does not stop at the tender.",
  ['P211', 'P210'])

q(0, "Case. EKC-03 is the synthetic camp catering and facility services contract with supplier CF-C (synthetic). CF-C disputes three months of service credits, and the contract manager must decide them this month. CF-C's regional manager offers to cater the contract manager's daughter's wedding free of charge. Question: using the World Bank Procurement Regulations for IPF Borrowers (Seventh Edition, September 2025), taught by concept as published practice, how should the offer be treated?",
  "Declined and recorded, since offering anything of value to influence a decision improperly is corrupt",
  ["Accepted, since catering is a service in kind and only a cash payment counts as something of value",
   "Put off until the credit decision is made and accepted afterwards, since a later gift influences nothing",
   "Shared out among the contract team, since spreading a gift across several people removes its purpose"],
  "The World Bank Regulations, Annex IV para 2.2 a.i, define a corrupt practice as offering, giving, receiving or soliciting anything of value, directly or indirectly, to influence another party's actions improperly. A free wedding offered while a decision is pending falls within it; catering has value, timing does not cure it, and sharing it more widely does not change its purpose. Ekene's own policy sets any gift limits.",
  ['P208'])

q(2, "Case. EKC-06 is the synthetic instrument maintenance service with supplier IM-F (synthetic). NCDMB's monitoring team asks IM-F for its site attendance records and payroll to verify the Nigerian employment hours IM-F reported. IM-F refuses, and its contract with Ekene contains no clause on content reporting. Question: what does the content Act provide, and what does the gap in the contract show?",
  "The Board may inspect contractors' records under s.64, and s.65 has the operator bind contractors to report content",
  ["Contractors may refuse any request from the Board, since s.64 gives the Board access only to the operator's own records",
   "The Board may see content records only in the operator's annual report under s.60, so IM-F's refusal stands in full",
   "The contract's silence frees IM-F, since the content Act reaches a contractor only through its contract with an operator"],
  "The content Act, s.64, requires all operators and contractors to provide the Board or its designated agent with access to their facilities and the documentation required to substantiate the Nigerian content reported, and s.65 requires the operator to ensure its contractors are contractually bound to report content information. IM-F's duty under s.64 stands on its own, and the missing clause is a gap in Ekene's own compliance under s.65.",
  ['P130', 'P131'])

q(1, "Case. Ekene's synthetic contract portfolio (EKC-01 to EKC-07) has run for three years. No payment has ever been audited against the contract terms. The largest spend is on EKC-06, the reimbursable instrument maintenance service with IM-F (synthetic), paid on hours and materials at cost. The contract owner asks where assurance should start. Question: what do the UK texts, used as published good practice, support?",
  "Audit payments periodically against the contract terms and service levels, starting where risk is highest, such as the reimbursable contract",
  ["Audit nothing, since three years without a complaint from a supplier shows that payments match the contract terms",
   "Audit the smallest contract first, since the UK Principles direct assurance to low-risk contracts where it is quickest",
   "Audit only at the end of each contract, since the UK standard treats close-out as the one proper moment for assurance"],
  "GovS 008 (version 2.2, issued 1 April 2026), 5.4.4, says payments should be audited periodically to ensure they reflect the contract terms and service levels received, and the UK Contract Management Principles, principle 4, direct the strongest resource where risks and rewards are highest. A reimbursable contract with large spend is a natural first target. Supplier silence is no assurance, and close-out alone is not periodic.",
  ['P054', 'P004'])

q(3, "Case. EKC-02 is the synthetic platform supply vessel time charter with supplier MV-B (synthetic). A newly appointed contract manager writes the contract management plan for the charter and signs it as approved himself, saying the senior business owner is too busy. The plan names no roles for MV-B. Question: on GovS 008 (version 2.2, issued 1 April 2026), UK good practice used as a model, what is wrong?",
  "The plan should be produced by the contract manager and approved by the senior business owner, and should define each party's roles",
  ["Nothing, since the contract manager both writes and approves the plan for any contract he runs day to day",
   "The plan should be written by MV-B and approved by the contract manager, since the supplier delivers the service",
   "The plan should be approved by the Board, since GovS 008 places all plans for Nigerian contracts under the Board"],
  "GovS 008 (version 2.2), 5.4.2, says a contract management plan should define the roles and responsibilities of each party and be reviewed periodically, and that the plan should be produced by the contract manager and approved by the senior business owner. Self-approval, supplier authorship and Board approval all depart from that; GovS 008 is a UK standard and says nothing about the Board.",
  ['P015', 'P014'])

q(0, "Case. EKC-07 is the synthetic environmental monitoring consultancy with supplier EM-G (synthetic). Ekene's draft records procedure states that contract records must be kept for ten years because the Public Procurement Act 2007, s.16(12), says so, and it cites the World Bank's 10% delay damages limit as a rule every contract must follow. Question: what should the reviewer do with these two statements?",
  "Correct both: the printed s.16(12) period is garbled and needs an official copy, and the 10% is only a World Bank illustration",
  ["Keep both as written, since each rests on a published text and a procedure may cite any published figure as a firm rule",
   "Retain the ten years and remove the 10%, since s.16(12) plainly prints a ten-year period in the gazetted copy of that Act",
   "Drop the ten years and keep the 10%, since the World Bank guidance makes its delay damages limit binding on all works"],
  "The printed Public Procurement Act 2007, s.16(12), gives its retention period as 'often years from the date of the award', which looks like a misprint, so no period is taught until an official copy confirms one; records are archived under the organisation's retention policy (GovS 008, 5.4.7). The World Bank Contract Management Practice guidance (Second Edition, 2024), p.38, gives 10% of the contract price only as an illustration of a delay damages limit.",
  ['P052', 'P186', 'P195'])

emit(Q, '/root/cat-wip-contracts/banks/sc5a_exam.json', expect_n=42)
finish()
