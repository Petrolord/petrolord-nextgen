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

# SC5 Associate m03, Reading the Contract You Manage. 15 questions.
# Lessons: Scope and specification; The price basis and what it asks of you; The order of precedence between documents; Clauses a contract manager uses every week.
# Topics: T03, T08.
# Every key rests on a PACK.md passage named in its src list; the
# explanation cites the SOURCE by name and locator (an Act and its section,
# a guidance and its paragraph), never a passage id or a pack section.
# FILLED AT THE BANK STAGE (Associate bank writer).

q(3, "EKC-03 is a synthetic camp catering and facility services contract: CF-C (synthetic) is paid a fixed monthly fee. The base manager asks CF-C to deep-clean a newly opened second accommodation block, and the signed scope lists the buildings to be cleaned without it. How should the request be treated?",
 "As a change, routed through the change clause before CF-C starts.",
 ["As included work, because a fixed monthly fee covers anything the base manager needs cleaned during the month.",
  "As a gift CF-C should absorb, since goodwill is part of any facility services contract.",
  "As a service credit, deducted from CF-C's fee if it refuses to do the cleaning for free."],
 "The UK Risk Allocation and Pricing Approaches guidance note (January 2026, Appendix II) ties a fixed price to a fixed scope, so the fixed fee pays for the scope as written. The World Bank Contract Management Practice guidance reminds its reader that a contract is managed on its own terms. A building outside the written scope is a change for the change clause. A service credit applies only to a stated service level missed, and goodwill is not a payment term.",
 ['P029', 'P007'])

q(1, "Nigeria's Public Procurement Act 2007, s.16(28), requires warranties in every procurement contract of a federal procuring entity. Which three does it name?",
 "Durability of goods, requisite skill in services, and genuine materials and inputs.",
 ["Lowest price, fastest delivery and a local office in each state.",
  "A parent company guarantee, a bank bond and a retention held until close.",
  "Insurance, indemnity and confidentiality, each for the full contract period."],
 "Section 16(28) requires every procurement contract to carry warranties of durability of goods, requisite skill in service provision, and genuine materials and inputs in execution. It binds federal procuring entities, and for an operator such as Ekene it is published public practice showing that reading the scope includes reading the warranty clause. Guarantees, bonds, insurance and price terms are other parts of a contract.",
 ['P030'])

q(0, "EKC-04, the synthetic casing frame agreement with TB-D (synthetic), states unit prices per item. On the World Bank description of a unit price contract (Procurement Regulations, Seventh Edition, Annex VIII para 3.6), what does Ekene pay for?",
 "The quantities actually delivered, at the stated unit prices.",
 ["The estimated quantities in the agreement, whether or not TB-D delivers them in the end.",
  "A fixed total for the year, paid in equal parts.",
  "TB-D's own costs plus a fee, since casing prices move with the steel market."],
 "Annex VIII para 3.6, taught by concept, describes a unit price contract as stating estimated quantities and a unit price for each item and paying the quantities actually delivered at those prices. The estimates guide planning and are not the payment basis. A fixed yearly total is a lump sum, and cost plus a fee is a different basis again.",
 ['P027'])

q(2, "EKC-05 is a synthetic flowline replacement: FW-E (synthetic) is paid a lump sum against milestones. On the World Bank description of a lump-sum contract (Annex VIII para 3.2), what does the lump sum pay for?",
 "The defined scope, for a fixed contract amount.",
 ["Every hour FW-E's crew works, at a rate agreed at award.",
  "Whatever FW-E spends on the works, with a fixed fee on top for its overheads and profit.",
  "The quantities of pipe laid, measured each month and multiplied by a rate per metre."],
 "Annex VIII para 3.2, taught by concept, describes a lump-sum contract as one where the contractor performs the defined scope for a fixed contract amount. So the manager checks that each milestone is complete. Hourly rates, cost plus a fee and measured quantities describe other price bases, each asking different checks of the manager.",
 ['P026'])

q(0, "EKC-03, the synthetic camp catering contract with CF-C, deducts a service credit when a stated service level is missed. Which World Bank price basis (Annex VIII para 3.4) does this link between payment and measured service resemble?",
 "A performance-based contract, which ties payment to measured outputs.",
 ["A unit price contract, paying a price per plate.",
  "A lump-sum contract with no link at all between the fee and the service delivered.",
  "A cost plus contract, which repays CF-C's costs whatever the level of service."],
 "Annex VIII para 3.4, taught by concept, describes a performance-based contract as one that ties payment to measured outputs meeting functional needs of quality, quantity and reliability. Service credits build that link into a fixed fee. A price per plate is a unit price, and cost plus pays costs whatever the service.",
 ['P028'])

q(3, "EKC-06 is a synthetic instrument maintenance contract: IM-F (synthetic) is paid stated hourly rates plus materials at cost. What does the World Bank Contract Management Practice guidance (Cost Control, p.20) expect the manager to know before costs arise?",
 "Which costs, possible extra costs included, sit with IM-F and which sit with Ekene.",
 ["Nothing in advance, since hourly rates put every overrun on the supplier.",
  "Only IM-F's profit margin, which the manager can reduce when a monthly invoice looks high.",
  "The open-market price of each part, so IM-F can be told where to buy."],
 "The World Bank guidance, taught by concept, expects the contract manager to know in advance which costs, possible extra costs included, sit with the contractor and which sit elsewhere. Under hourly rates plus materials at cost, Ekene carries the quantity, so the manager's checks move to hours and evidence. The supplier does not carry every cost on this basis, and cutting a margin or directing purchases is not the manager's to do unilaterally.",
 ['P159'])

q(1, "EKC-01, the synthetic WS-A framework, runs for several years with an index clause on its schedule of rates. What does the UK Risk Allocation and Pricing Approaches guidance note (para 6.1.6) say about indexation?",
 "It is advisable for contracts with considerable inflation uncertainty.",
 ["It is forbidden in any framework that is priced from a schedule of rates.",
  "It must be replaced each year by whatever increase the supplier proposes.",
  "It applies only where the supplier asks for it in writing."],
 "The UK pricing guidance says at para 6.1.6: \"For contracts with considerable inflation uncertainty, using indexation is advisable.\" It is UK practice. Where an Ekene contract carries an index clause, the manager applies it exactly as written, with the index and dates it names, which leaves no room for a supplier's own proposed increase.",
 ['P149'])

q(2, "Ekene is reviewing a synthetic contract with EM-G (synthetic) expected to run for three years, and asks whether a price adjustment clause is usual. What does the World Bank Contract Management Practice guidance (p.24) record?",
 "They are established practice for contracts running more than about 18 months.",
 ["They are never used on consultancy contracts, whatever the length of the term.",
  "They are required by the content Act on every Ekene contract.",
  "They are used only where the supplier is paid in a foreign currency."],
 "The World Bank guidance, taught by concept, records that price adjustment clauses are established practice for contracts running more than about 18 months, and recommends them for shorter contracts where inflation in key inputs is expected to be high. The content Act sets no such rule, and nothing in the guidance limits them to a type of service or to foreign currency.",
 ['P150'])

q(1, "A trainee notes that Nigeria's Public Procurement Act 2007, s.16(27), says values in procurement documents shall be stated in Nigerian currency. What does that mean for an Ekene contract manager?",
 "It is public practice; the manager reads each contract's own currency clause.",
 ["Every Ekene contract priced in dollars is void, since the 2007 Act binds all operators.",
  "Ekene must convert all its frame agreements to naira at the next price review.",
  "It applies only to UK contracting authorities buying goods in Nigeria."],
 "Section 16(27) binds federal procuring entities, and for an operator such as Ekene it is a published statement of public practice. So the manager reads the currency clause in each Ekene contract and works to it. The 2007 Act does not void an operator's contracts or force a conversion, and it has nothing to do with UK authorities.",
 ['P031'])

q(0, "EKC-02 is a synthetic vessel charter with MV-B (synthetic). MV-B's technical proposal, bound into the charter as an appendix, shows a smaller crew than the charter's crew complement schedule, and MV-B mobilises the smaller crew. What settles which document governs?",
 "The charter's order of precedence clause, read with the documents it ranks.",
 ["The proposal, because MV-B wrote it and it describes the vessel in more detail.",
  "Whichever document was signed last, whatever the charter's own clauses say.",
  "The smaller figure, since a crew number in doubt is always read down."],
 "An order of precedence clause ranks which document prevails where they conflict, and the World Bank Contract Management Practice guidance (p.82, item 3) lists understanding which document takes priority over which among the aims of the kick-off walk-through. If the clause ranks the charter's schedules above the bound-in proposal, the crew schedule governs. Authorship, signing order and reading figures down are not rules the contract states.",
 ['P024'])

q(3, "An Ekene contract's order of precedence clause ranks a supplier's schedule first, and that schedule conflicts with a duty in the Nigerian Oil and Gas Industry Content Development Act 2010 (the content Act). Which statement is sound?",
 "The content Act, s.6, requires the contract to conform to the content Act.",
 ["The schedule wins, because the parties chose the ranking and signed it freely.",
  "The conflict goes to the UK courts, since a precedence clause is a UK law concept.",
  "The contract is void, and every term is renegotiated."],
 "The content Act, s.6, provides that all later oil and gas arrangements, agreements and contracts relating to any operation in the Nigerian oil and gas industry shall be in conformity with the provisions of this Act. No precedence clause can rank a schedule above the law. The content Act does not declare the whole contract void, and UK courts play no part in an Ekene contract.",
 ['P102'])

q(2, "Ekene takes over a synthetic supply contract written on a LOGIC standard form with agreed amendments. What does the course teach about reading it, as LOGIC forms are taught by concept?",
 "Read the edition and the agreed amendments in the signed contract before relying on a clause.",
 ["Read the latest LOGIC edition online, which replaces whatever the parties signed.",
  "Ignore the amendments, since a standard form cannot be changed by the parties.",
  "Quote the LOGIC clause word for word in every letter, as the form requires."],
 "LOGIC standard contracts are industry forms used on the UK continental shelf, taught here by concept only. A contract manager reads the edition and any agreed amendments in the signed contract before relying on a clause, because the version the parties signed is the contract. A newer edition does not replace it, and the course never quotes a licensed form.",
 ['P034'])

q(0, "Ekene joins a synthetic works contract built on FIDIC general conditions with project particular conditions. In what order does a reader work through the documents, on the course's concept-only teaching of FIDIC?",
 "In the order the contract itself sets for the agreement, particular and general conditions.",
 ["General conditions first in every case, since they are the internationally agreed text.",
  "Whichever document favours Ekene on the point in question, clause by clause.",
  "The World Bank Regulations first, since they sit above any FIDIC-based contract."],
 "FIDIC conditions are taught by concept: a reader works through the agreement, the particular conditions and the general conditions in the order the contract itself sets, and checks the role the contract gives to the Engineer or the Employer's Representative. Picking the favourable document is no method, and the World Bank Regulations bind borrowers on Bank-financed contracts and do not rank above a signed contract's own order.",
 ['P032'])

q(1, "WS-A (synthetic) asks why EKC-01, its synthetic well services framework, obliges it to report Nigerian content information to Ekene. Which provision is the reason the clause is there?",
 "The content Act, s.65: the operator must bind its contractors by contract to report.",
 ["The Public Procurement Act 2007, s.16(27), which requires every report in naira.",
  "The UK Procurement Act 2023, s.52(1), which sets three KPIs for every framework.",
  "The content Act, s.34, which applies only to contracts of more than $100 million (USD)."],
 "The Nigerian Oil and Gas Industry Content Development Act 2010 (the content Act), s.65, requires the operator to ensure its partners, contractors and subcontractors are contractually bound to report Nigerian content information to the operator and, if the Board asks, directly to the Board. Section 34 is the labour clause for large contracts, and the other two provisions deal with currency and UK KPIs.",
 ['P131'])

q(2, "Ekene is checking whether a synthetic contract must carry a labour clause under the content Act, s.34. What fact must the manager check in the contract file?",
 "Whether the project or contract has a total budget above $100 million (USD).",
 ["Whether the supplier employs any expatriate staff on the work.",
  "Whether the contract runs longer than 18 months, when indexation becomes usual.",
  "Whether the supplier has any Nigerian labour at all on the day of award."],
 "The content Act, s.34, requires that all projects or contracts whose total budget exceeds $100 million (USD) contain a labour clause mandating a minimum percentage of Nigerian labour in specific cadres as the Board may stipulate. So the budget is the fact to check. The 18 month figure is the World Bank's note on price adjustment, and the other two tests appear nowhere in s.34.",
 ['P118', 'P150'])

emit(Q, '/root/cat-wip-contracts/banks/sc5b_m03.json', expect_n=15)
finish()
