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

# SC5 Expert m01, Contract Strategy. 15 questions.
# Lessons: What a contract strategy decides; Delivery models and make or buy; Packaging the work; Choosing the price basis for the risk; A strategy for an Ekene campaign.
# Topics: T03, T11.
# Every key rests on a PACK.md passage named in its src list; the
# explanation cites the SOURCE by name and locator (an Act and its section,
# a guidance and its paragraph), never a passage id or a pack section.

q(2, "EKC-06 is the synthetic instrument maintenance service with supplier IM-F (synthetic). The team writing the renewal strategy proposes to settle the price basis and packaging now and to leave the question of how the contract will be managed until after award. On the Sourcing Playbook (June 2023), a UK text used as published good practice, what should the team do?",
  "Treat how the contract will be managed as a strategic decision taken early, and write it into the contract itself",
  ["Leave the management arrangements to the contract manager after award, since a strategy settles price and packaging only",
   "Wait for the first quarterly review under the new contract, and then decide how IM-F's performance will be managed",
   "Keep the management arrangements in an internal memo outside the contract, so they can be changed without IM-F agreeing"],
  "The Sourcing Playbook (June 2023), Chapter 12, p.68, says how a contract will be managed is a key strategic decision that needs consideration early in the procurement process and shall be reflected in the contractual agreement. Leaving it until after award or until the first review puts it too late, and an arrangement held only in an internal memo is missing from the contractual agreement the Playbook names.",
  ['P011'])

q(0, "EKC-03 is the synthetic camp catering and facility services contract with supplier CF-C (synthetic). A delivery model assessment compares keeping camp maintenance with the market against taking it in-house. Ekene has no maintenance supervisor who knows the camp contract. Which point from the Sourcing Playbook (June 2023), UK good practice, bears on the market option?",
  "Outsourced services need a robust contractual relationship, overseen by a qualified contract manager who understands how the contract operates",
  ["Outsourced services need no contract manager where the supplier reports its own performance each month against the service levels",
   "A market option wins wherever the fee is fixed, since a fixed monthly fee moves the performance risk onto the supplier",
   "The contract manager's skills matter only for in-house delivery, since a supplier on the market is managed by its own staff"],
  "The Sourcing Playbook (June 2023), Chapter 12, p.68, says all outsourced services should be built on a robust contractual relationship overseen by an appropriately qualified contract manager with a clear operational understanding of the contract. A market option Ekene cannot staff with such a manager is weaker than it looks. Supplier self-reporting does not replace that manager, a fixed fee does not settle the choice, and the Playbook's point is about the outsourced option.",
  ['P010'])

q(1, "A synthetic Ekene strategy note for EKC-06, the instrument maintenance service with IM-F (synthetic), chooses a lump sum for the renewal with one reason: the previous maintenance contract at another field was a lump sum. Read against the World Bank Procurement Regulations for IPF Borrowers (Seventh Edition, September 2025), taught by concept as published practice, what is missing from the reasoning?",
  "The link between the contract type and what is bought, how risky and complex it is, and value for money",
  ["A statement that the World Bank Regulations bind the Ekene renewal",
   "The approval of the Bureau of Public Procurement, which the Regulations require before any lump sum is chosen",
   "A reference to the lowest evaluated cost at the tender, which the Regulations treat as the reason for the type"],
  "The World Bank Regulations, Section V para 5.27, tie the choice of contract type to what is being bought, its risk and complexity, and value for money; a precedent from another field is none of those. The Regulations do not bind an Ekene contract, they give the Bureau no role in it, and the lowest evaluated cost belongs to tender evaluation, which the procurement course teaches.",
  ['P144'])

q(3, "Ekene's synthetic contracts lead asks what the contracting strategy inside a procurement strategy should cover, as the World Bank Procurement Regulations for IPF Borrowers (Seventh Edition, September 2025) describe it by concept. Which answer matches their description?",
  "How the work is packaged into contracts and which types of contract are used",
  ["Which bidder is expected to win each package and the price it is likely to offer at the tender",
   "The dispute clause for each contract, including the seat of any arbitration and the number of arbitrators",
   "Only the payment schedule for each contract, since the Regulations leave the contract type to the award stage"],
  "The World Bank Regulations, Annex V para 3.19(e), list the contracting strategy among the contents of a procurement strategy and describe it as how the work is packaged and which types of contract are used. Predicting winners and prices is no part of it, the dispute clause is a drafting matter the Regulations place elsewhere, and the type of contract is a strategy decision taken before award.",
  ['P145'])

q(2, "EKC-03 is the synthetic camp catering contract with CF-C (synthetic). Camp maintenance has missed its service level for two quarters, and a manager asks for a delivery model assessment of that element. Using the Sourcing Playbook (June 2023), a UK text, what outcomes can such an assessment recommend?",
  "Delivery in-house, procurement from the market, or a hybrid of the two",
  ["Termination of CF-C or renewal with CF-C, the two outcomes the Playbook names for a service",
   "Delivery in-house only, once a supplier has failed",
   "Procurement from the market only, since the Playbook assumes an operator has no staff for services"],
  "The Sourcing Playbook (June 2023), Chapter 3, p.22, defines a delivery model assessment, formerly a make versus buy assessment, as an evidenced approach to recommend whether to deliver a service or part of it in-house, procure it from the market or adopt a hybrid. It is no choice between terminating and renewing one supplier, and it favours neither outcome in advance.",
  ['P142'])

q(1, "EKC-07 is the synthetic environmental monitoring consultancy with supplier EM-G (synthetic). The contract ends in five weeks. The contract owner now asks for a delivery model assessment of a service of middling complexity before any renewal is decided. What does the UK Delivery model assessments guidance note (May 2021), used as published good practice, say about the time needed?",
  "It depends on complexity, data and resources, and 3-6 months is given as an indication for an initial assessment of mid-level complexity",
  ["It fixes six months as a legal minimum for every assessment, so the Ekene renewal would be void if the assessment were shorter",
   "It gives no indication of time at all, so the team can complete a sound and evidenced assessment in the five weeks that remain before the contract ends",
   "It gives 3-6 months only for highly complex services, so a service of middling complexity can be assessed in days"],
  "The UK Delivery model assessments guidance note (May 2021), para 2.2.1, says the time depends on service complexity, data and resources, and gives 3-6 months as an indication for an initial assessment of mid-level complexity. It is an indication in UK guidance, with no force over an Ekene contract and no legal minimum. The lesson for Ekene is to start early enough to finish before the contract ends.",
  ['P143'])

q(3, "EKC-04 is the synthetic casing and tubulars frame agreement with supplier TB-D (synthetic), the only qualified source for a premium connection, and the agreement is among Ekene's largest by spend. On the World Bank PPSD guidance (Fourth Edition, August 2025) supply positioning model, taught by concept, where does such a purchase sit?",
  "Strategic Critical, the quadrant for high cost purchases with few suppliers",
  ["Tactical Advantage, the quadrant for high cost purchases that carry low supply risk",
   "Strategic Security, the quadrant for low cost purchases of strategic importance",
   "Tactical Acquisition, the quadrant for routine low value buys with many suppliers"],
  "The World Bank PPSD guidance (Fourth Edition, August 2025), Figure IV and Table IV, pp.17 to 18, places high cost purchases with few suppliers in Strategic Critical. Tactical Advantage is high cost with low risk and many suppliers, Strategic Security is low cost but strategically important, and Tactical Acquisition is routine and low value with many suppliers; a single qualified source at high spend fits none of those.",
  ['P058'])

q(0, "A synthetic Ekene strategy joins three workover services into one package whose total budget will exceed $100 million (USD). What should the strategy note record on the Nigerian Oil and Gas Industry Content Development Act 2010 (the content Act), s.34?",
  "That a contract over that budget must contain a Labour Clause mandating a minimum percentage of Nigerian labour in cadres the Board stipulates",
  ["That s.34 applies only to contracts, subcontracts and purchase orders above $1,000,000 (USD), so a package many times larger falls outside the section altogether",
   "That s.34 sets the Nigerian labour share in the package at 50%, the figure the content Act prints for the whole contract workforce, whatever cadre the work needs",
   "That the Labour Clause is a UK practice for public contracts above £5 million, with no force over an Ekene package"],
  "The content Act, s.34, provides that all projects or contracts whose total budget exceeds $100 million (USD) shall contain a Labour Clause mandating a minimum percentage of Nigerian labour in specific cadres as the Board may stipulate. The $1,000,000 figure belongs to the s.24(1) quarterly listing, the 50% belongs to s.41(2) on equipment owned by Nigerian subsidiaries, and the £5 million figure is the UK Procurement Act 2023's KPI threshold.",
  ['P118'])

q(2, "EKC-05 is the synthetic flowline replacement works contract with FW-E (synthetic). For the next phase a planner proposes cutting one continuous flowline job into four packages so that each stays under Ekene's internal approval threshold, with no other reason given. Taking the Public Procurement Act 2007 as published practice for an operator, what do the sources support?",
  "Cut the work by interfaces, risk and management capacity and record the reason, since s.58(4) lists splitting tenders to dodge thresholds as an offence",
  ["Accept the four packages, since that Act lists only bid-rigging and bribery as offences and says nothing about the way work is divided",
   "Accept the four packages, since a threshold set by Ekene's own internal policy is outside anything a published procurement law could ever address or describe",
   "Merge every Ekene contract into one package, since that Act treats any division of work into several contracts as an offence"],
  "The Public Procurement Act 2007, which binds federal procuring entities and serves an operator as published practice, lists splitting tenders to dodge thresholds among its offences at s.58(4), alongside bid-rigging, bribery and others. The lesson for Ekene is to cut packages for honest reasons and record them. The Public Procurement Act 2007 does not forbid dividing work into several contracts, so merging everything is no answer.",
  ['P204'])

q(3, "EKC-05 is the synthetic flowline replacement works contract with FW-E (synthetic). The next phase replaces a set length of buried flowline whose ground conditions are well described, but the length needing replacement will be known only as the lines are exposed. Which price basis do the World Bank Procurement Regulations for IPF Borrowers (Seventh Edition, September 2025), taught by concept, match to this state of knowledge?",
  "A unit price contract, which pays the quantities actually delivered at stated unit prices",
  ["A lump sum, which the Regulations match to work whose quantities are uncertain at award",
   "Reimbursable cost, which the Regulations reserve for any work lasting longer than a year",
   "A performance-based contract, which the Regulations prescribe for all pipeline replacement"],
  "The World Bank Regulations, Annex VIII paras 3.6, 3.3, 3.7 and 3.13, match unit price to work that is well defined with uncertain quantities, lump sum to scope that can be clearly specified and tied to milestones, and reimbursable cost to emergency repairs with open records. They set no duration rule for reimbursable cost and prescribe no type for pipelines; performance-based contracts tie payment to measured outputs.",
  ['P027', 'P146'])

q(1, "EKC-07 is the synthetic environmental monitoring consultancy with EM-G (synthetic). Ekene wants EM-G to trial a sampling method never used on the field, and neither side can predict how the work or its cost will evolve. What does the UK Risk Allocation and Pricing Approaches guidance note (January 2026), used as published good practice, say about cost plus for such work?",
  "It suits novel work of this kind, and it demands open book transparency and a real effort to police allowable costs",
  ["It should be avoided for novel work, which the note matches to a fixed price so that the supplier carries the uncertainty",
   "It pays the supplier a fixed amount per sample whatever the cost, so no review of costs or margin is needed afterwards",
   "It suits novel work, and it lets the supplier keep its cost records private once the margin has been agreed at award"],
  "The UK Risk Allocation and Pricing Approaches guidance note (January 2026), Appendix II, p.38, describes cost plus as paying allowable costs plus a margin, particularly suited to novel or first generation contracts, and demanding open book transparency and effort to police allowable costs. The same note ties fixed price to fixed scope (p.34). A fixed amount per sample is a unit price, and private cost records defeat the open book cost plus needs.",
  ['P147'])

q(0, "For a synthetic Ekene service where outputs are known but delivery methods are not yet fixed, the team considers a guaranteed maximum price with target cost. What does the UK Risk Allocation and Pricing Approaches guidance note (January 2026), used as published good practice, describe for this basis?",
  "Savings below target are shared, overruns above target are shared equally up to a cap, and the model services contract sets the cap 10% above the target price",
  ["The supplier keeps every saving below target and the buyer pays every overrun above it, since the price named as a maximum is only a guide for the buyer's budget holders",
   "Savings and overruns stay with the buyer in full, while the supplier is paid its costs plus a margin fixed at 10% of the target price for the whole term",
   "Overruns above target are shared equally up to a cap, which the model services contract sets 50% above the target price where the circumstances were unforeseeable at award"],
  "The UK Risk Allocation and Pricing Approaches guidance note (January 2026), Appendix II, p.43, says savings below target are shared, overruns above target are shared equally up to a cap, and the model services contract sets that cap 10% above the target price; it suits work where outputs are known and methods are not yet fixed. Costs plus a margin describes cost plus, and 50% is the UK modification guidance's figure for unforeseeable circumstances.",
  ['P148'])

q(3, "EKC-01 is the synthetic well services call-off framework with WS-A (synthetic), priced from a schedule of rates. The next framework will run three years, and the cost of nitrogen and fuel is expected to move sharply. The draft holds every rate fixed for the full term. What do the sources suggest the strategy add?",
  "A price adjustment or indexation clause, which both the UK pricing guidance and the World Bank guidance support for a contract of this kind",
  ["Nothing, since a schedule of rates adjusts itself to inflation through the quantities called off under the framework each quarter",
   "A clause letting WS-A reprice any call-off at the current market rate on the day it is placed, which the World Bank guidance treats as the standard approach for frameworks",
   "A shorter framework of six months with fixed rates, since the UK guidance forbids indexation in contracts that run over a year"],
  "The UK Risk Allocation and Pricing Approaches guidance note (January 2026), para 6.1.6, says that for contracts with considerable inflation uncertainty, using indexation is advisable, and the World Bank Contract Management Practice guidance (Second Edition, 2024), p.24, records price adjustment clauses as established practice for contracts running more than about 18 months. Quantities do not adjust rates, market repricing at the supplier's choice is no adjustment formula, and neither text forbids indexation.",
  ['P149', 'P150'])

q(1, "Ekene's synthetic strategy team uses the UK Model Services Contract as a starting point for a new facility services contract. Which items does the Sourcing Playbook (June 2023), a UK text used as published good practice, list among those users should tailor?",
  "Performance indicators and service credits, invoicing and indexation, financial distress, and the governance and contract management structure",
  ["Only the price schedule, since the Playbook says the rest of the model contract must be kept exactly as it is published",
   "The tender evaluation weights and the award decision, since the Playbook treats the model contract as a guide to supplier selection at the tender",
   "The statutory duties of the content Act, since the Playbook tells users to rewrite the host country's own law inside the model's clauses"],
  "The Sourcing Playbook (June 2023), Chapter 7, p.48, recommends the Model Services Contract as a starting point and lists what to tailor: performance indicators and service credits, insurance and parent company guarantees, invoicing and indexation, pricing, benchmarking, financial distress, and the governance and contract management structure. It does not freeze the rest, it is no guide to tender evaluation, and it says nothing about Nigerian law, which binds an Ekene contract on its own terms.",
  ['P151'])

q(2, "A synthetic Ekene campaign strategy covers three contracts: EKC-01 with WS-A, EKC-02 with MV-B and EKC-04 with TB-D (all synthetic). The draft sets price bases and KPIs but says nothing about Nigerian content, on the view that content is settled at the tender. What do the content Act and the NCDMB contracting-process guidelines (2025 update) support?",
  "Each contract must conform to the content Act under s.6, and the strategy names the content commitments each carries into execution under the NCDMB guidelines",
  ["Content duties end at the tender under s.16 of the content Act, so a strategy for execution has no content section to write for any of the three",
   "Only the vessel charter needs content terms, since the content Act s.34 labour clause attaches to every marine contract whatever its budget",
   "Content commitments are a matter for NCDMB alone, since the guidelines keep the operator and its contractors out of the execution stage"],
  "The content Act, s.6, provides that all subsequent oil and gas contracts in the Nigerian industry shall conform with its provisions, and the NCDMB Guidelines for NCDMB Approvals of Nigerian Oil and Gas Industry Contracting Processes (2025 update), Purpose (vii) and Step 5, add a Nigerian Content Compliance Commitment at award recording the targets the operator and contractor agree for execution. Content does not end at the tender, s.34 turns on a budget above $100 million, and the guidelines set roles for operators and contractors.",
  ['P102', 'P137'])

emit(Q, '/root/cat-wip-contracts/banks/sc5a_m01.json', expect_n=15)
finish()
