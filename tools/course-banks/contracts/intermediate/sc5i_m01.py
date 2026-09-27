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

# SC5 Professional m01, Segmenting Suppliers. 15 questions.
# Lessons: Why suppliers get different attention; Profit impact and supply risk; Tiering contracts by risk and value; Relationship models for each segment; Segmenting the Ekene suppliers.
# Topics: T06.
# Every key rests on a PACK.md passage named in its src list; the
# explanation cites the SOURCE by name and locator (an Act and its section,
# a guidance and its paragraph), never a passage id or a pack section.
# ---- questions (Professional bank writer) ----
q(1,
  "Two synthetic Ekene contracts compete for one monthly relationship meeting with a senior manager present: EKC-03, camp catering from CF-C with service credits, and EKC-04, casing from TB-D, the only supplier qualified for a premium connection the Ekene well designs use. Reading principle 4 of the UK Contract Management Principles as published practice, which contract gets the meeting?",
  "EKC-04, because a sole qualified source for a connection the wells rely on carries the higher risk and reward",
  ["EKC-03, because its fee is paid every month and so it touches the operating budget far more often",
   "Both in turn, since the principles give every supplier the same share of senior time whatever it happens to supply",
   "Neither yet, because a relationship meeting is only held after a supplier has missed one of its KPIs"],
  "Principle 4 of the UK Contract Management Principles directs the most and strongest resource to the contracts where risks and rewards are highest, and a single qualified source for a connection the wells depend on is that case. How often an invoice arrives says nothing about risk, an equal share of senior time is the opposite of a differentiated approach, and the principle does not wait for a missed KPI. EKC-03 keeps its ordinary contract management.",
  ['P004'])

q(3,
  "The synthetic Ekene contract team is drafting its supplier segmentation policy and wants to follow GovS 008 (version 2.2, issued 1 April 2026), clause 6.3, as published good practice. On what basis does that clause say suppliers should be segmented?",
  "According to their commercial and business impact",
  ["According to the date each contract was signed, oldest first",
   "According to each supplier's annual turnover and headcount",
   "According to how attractive the supplier finds the buyer's business"],
  "GovS 008 at 6.3 says suppliers should be segmented according to their commercial and business impact. Contract age and supplier size are not the test it sets. How attractive the buyer's business looks to a supplier is the supplier preferencing view in the World Bank's PPSD guidance, which describes the supplier's side of the relationship and is a different tool.",
  ['P061'])

q(0,
  "Alongside its seven synthetic contracts, Ekene buys printer paper and toner from a low cost, low risk catalogue. Reading GovS 008 (version 2.2), clause 6.2, as practice, how much supplier relationship management does the catalogue supplier need?",
  "Possibly none at all, which the standard accepts for low cost, low risk catalogue buying",
  ["Quarterly strategic reviews with a named senior owner, the same as for every other Ekene supplier",
   "A yearly financial standing review, since every supplier with a purchase order counts as a key supplier",
   "A collaborative partnership charter agreed before the next catalogue order is placed"],
  "GovS 008 at 6.2 accepts that some suppliers need no relationship management at all, typically where purchases are low cost, low risk and bought from a catalogue or common framework. A senior strategic review and a partnership charter spend scarce time where the risk is lowest. The UK financial standing guidance reserves its annual review for key suppliers of Gold and Silver contracts, which a catalogue supplier is not.",
  ['P062'])

q(2,
  "A new analyst in the synthetic Ekene contracts team asks how contract management differs from supplier relationship management. Taking the CIPS view by concept, which description fits?",
  "Contract management protects what the contract promises; relationship management develops more value with the suppliers that matter most",
  ["They are one discipline under two names, so every supplier receives both of them in the same measure all year",
   "Relationship management replaces contract management once a supplier has been placed in the strategic segment",
   "Contract management covers purchases of goods, and relationship management covers purchases of services alone"],
  "Professional bodies such as CIPS teach the two as separate but linked disciplines: the first protects what the contract promises and the second develops value with the suppliers that matter most. They are not one discipline, a strategic label adds relationship work on top of contract management without removing it, and neither discipline is limited to goods or to services.",
  ['P066'])

q(2,
  "The synthetic Ekene team wants to sort what it buys using Kraljic's portfolio idea (Harvard Business Review, 1983), taught by concept. Which two questions does that idea ask of each item?",
  "How far the item affects profit, and how risky or complex its supply market is",
  ["How long its contract runs, and how many KPIs that contract states",
   "Whether its supplier is a Nigerian company, and whether it holds a JQS registration",
   "How quickly its supplier invoices, and how often deductions are disputed"],
  "Kraljic's portfolio idea sorts purchased items by their effect on profit and by the risk or complexity of the supply market, giving four groups: strategic, bottleneck, leverage and non-critical. Contract length and KPI counts are features of a contract, Nigerian registration belongs to the content Act's qualification system, and invoicing habits are payment records. None of them is one of the two portfolio questions.",
  ['P056'])

q(0,
  "Ekene (synthetic) buys a small number of a specialised valve seal each year from the one maker qualified for it. The yearly spend is small, and qualifying another maker would take many months. Using Kraljic's four portfolio groups, where does the seal most likely sit?",
  "Bottleneck: a modest effect on the result, with supply that is hard to secure",
  ["Leverage: a strong effect on the result, with many capable suppliers competing for it",
   "Non-critical: easy to buy and of little consequence, since the yearly spend is small",
   "Strategic by rule, since any item from one maker is strategic"],
  "In Kraljic's portfolio idea, taught by concept, a bottleneck item matters less to the result while its supply is hard to secure, which fits a small spend from a single qualified maker. Leverage items face many competing suppliers, non-critical items are easy to buy, and a strategic item needs both a strong effect on the result and a difficult market. A single source alone does not make an item strategic.",
  ['P056'])

q(3,
  "An Ekene planner (synthetic) is reading the World Bank's PPSD guidance (Fourth Edition, August 2025), taught by concept, and its supply positioning model. By which two measures does that model place each procurement?",
  "By the relative supply risk and the value",
  ["By the buyer's value and appeal to the supplier",
   "By the KPI count and the length of review cycle",
   "By the content percentage and contract length"],
  "The World Bank's supply positioning model places each procurement by its relative supply risk and its value. The value and attractiveness of the buyer's business to the supplier are the two dimensions of supplier preferencing, a different tool in the same guidance. KPI counts, review cycles, Nigerian content percentages and duration are not the model's axes.",
  ['P057'])

q(1,
  "An Ekene analyst (synthetic) notes that the World Bank's PPSD guidance usually counts a contract as high cost when its estimate reaches 1 percent of the project's total estimated procurement cost. How should that figure be used on the Ekene contract register?",
  "As World Bank practice for Bank-financed projects, which sets no threshold binding an Ekene contract",
  ["As a binding Nigerian threshold, since the content Act adopts the World Bank's segmentation figures in full",
   "As the UK tiering tool's published dividing line between Gold contracts and Silver contracts",
   "As the value above which the Board has to approve each operator's own supplier segmentation register each year"],
  "The 1 percent figure is the World Bank PPSD guidance's usual test of a high cost contract on Bank-financed projects, taught by concept, and it binds no Ekene contract. The content Act adopts no World Bank figure, the UK tiering tool does not use it to divide Gold from Silver, and no text gives the Board a role in approving a segmentation register. Ekene sets its own register rules.",
  ['P058'])

q(0,
  "EKC-02, the synthetic Ekene platform supply vessel charter with MV-B, is modest in value, yet the team tiers it as critical because the offshore operation relies on the vessel every day. Which reading of the UK Contract Tiering Tool factors listed in the Sourcing Playbook (June 2023) supports that tier?",
  "Value is one of four factors, and impact of failure, continuity and ease of switching can rank a modest contract high",
  ["Value alone settles the tier, so a modest charter can only be tiered as routine under the tool's published scale",
   "The tool reads only the supplier's balance sheet, so daily reliance on the vessel plays no part in its tier",
   "The tool counts the KPIs each contract states, and a charter with one service level scores lowest"],
  "The Sourcing Playbook's definitions note lists the tool's factors as the potential impact of service failure, service continuity, the speed and ease of switching suppliers, and the contract value. Three of the four ask what happens when the supplier stops, so daily reliance can make a modest contract critical. Value is not the only factor, and the tool looks at the service as well as the supplier's finances; KPI counts are not among its factors.",
  ['P060'])

q(2,
  "The synthetic Ekene team adopts the UK guidance note on assessing and monitoring suppliers' economic and financial standing (2026 edition) as practice. Under that note, which suppliers are Key Suppliers?",
  "Suppliers of Gold (critical) and Silver (important) contracts, found with the tiering tool",
  ["Only the suppliers whose annual turnover is larger than the buyer's own turnover in the same year",
   "Every supplier holding a signed contract, whatever tier that contract has been given",
   "The suppliers the Board has registered on the Joint Qualification System that year"],
  "The UK guidance note identifies Key Suppliers with the Contract Tiering Tool, and they include all suppliers of Gold (critical) and Silver (important) contracts. Supplier turnover is not the test, and a Bronze or untiered contract does not make its supplier key. The Joint Qualification System is the Board's registration and pre-qualification system under the content Act, s.56, and has nothing to do with the UK tiers.",
  ['P093'])

q(3,
  "WS-A (synthetic) holds EKC-01, the Ekene well services framework that Ekene treats as strategic. WS-A also serves three larger operators, and Ekene's call-offs are small and irregular. Using supplier preferencing from the World Bank's PPSD guidance, taught by concept, how does WS-A probably see Ekene?",
  "As a nuisance account, since its small, irregular business is of low value to WS-A and costly to serve",
  ["As a core account, because Ekene has already placed the framework in its own strategic segment",
   "As a development account, because every framework customer is placed in that segment by default",
   "As an exploitable account, because Ekene's call-offs are of high value to WS-A's business"],
  "Supplier preferencing places the buyer in one of four segments (Development, Core, Nuisance, Exploitable) by the value of the buyer's business to the supplier and how attractive it is. Small, irregular call-offs from a buyer among larger customers are of low value and low appeal to the supplier, which is the nuisance segment; exploitable describes business of high value to the supplier that it finds unattractive. Ekene's own strategic label does not decide WS-A's view, and no segment applies to every framework customer by default.",
  ['P059'])

q(1,
  "The Sourcing Playbook (June 2023), Chapter 12, defines strategic supplier relationship management. Which proposal for EKC-01, the synthetic Ekene well services framework with WS-A, best fits that definition?",
  "Working with WS-A to raise value for both parties beyond what the framework already buys",
  ["Checking each call-off invoice line against the framework's schedule of rates before it is paid",
   "Applying the framework's KPIs at the quarterly review exactly as the framework itself states them",
   "Cutting contact with WS-A down to the contractual minimum so that Ekene staff time is saved"],
  "The Playbook defines strategic supplier relationship management as engaging more collaboratively with strategic suppliers to improve delivery and increase mutual value beyond that originally contracted. Checking invoices and applying the stated KPIs are sound contract management, which protects what the framework already promises. Cutting contact to the minimum is the approach for suppliers that need no relationship management.",
  ['P063'])

q(2,
  "On a complex synthetic Ekene project, the contract owner wants a partnership model with FW-E, the flowline works contractor. Which of these is among the critical success factors the Sourcing Playbook (June 2023), Chapter 12, reports for such a model?",
  "A shared understanding of how disputes will be resolved",
  ["A waiver of the works' retention and performance security",
   "An agreement that KPIs are set aside while the partnership lasts",
   "One person acting as contract owner and supplier representative"],
  "The Playbook reports that a partnership built on collaboration, openness, transparency and flexibility can help on complex projects, and lists a shared focus on service delivery, clear roles, a shared understanding of how disputes are resolved and a collaborative culture as its critical success factors. Waiving securities or setting KPIs aside removes contract terms, and one person on both sides destroys the clear roles the Playbook asks for.",
  ['P064'])

q(0,
  "WS-A (synthetic) learns that Ekene has placed EKC-01, its well services framework, in the strategic segment, and asks for its non-productive time KPI to be relaxed as a sign of the new partnership. What does the strategic segment change?",
  "The effort and senior attention Ekene gives WS-A, while the KPIs apply as the framework states",
  ["The KPIs themselves, because a strategic segment brings automatic relief from performance measures",
   "Nothing whatever, because segmentation is a filing exercise with no effect on how Ekene works",
   "The price basis, which moves from the schedule of rates to reimbursable cost plus a fee"],
  "The World Bank's Contract Management Practice guidance, taught by concept, reminds its reader that a contract is managed by its own terms, so the KPIs stay as written unless the contract is changed. Principle 4 of the UK Contract Management Principles makes the segment a decision about where resource goes. It does not relieve a supplier of its KPIs, it is more than filing, and it does not alter the price basis.",
  ['P007', 'P004'])

q(3,
  "An Ekene manager (synthetic) proposes to organise the EKC-01 relationship with WS-A around ISO 44001:2017, which the course teaches by concept. Which description fits that standard?",
  "A management system for collaborative business relationships, running from awareness and partner choice to value creation and exit",
  ["A published model contract whose clauses Ekene can copy word for word into its well services framework",
   "A Nigerian content standard that the Board applies to every framework agreement in the oil and gas industry",
   "A rating scheme for KPIs with five published ratings, used in UK public contract performance notices"],
  "ISO 44001:2017 sets out a management system for collaborative business relationships between organisations, from operational awareness through partner selection and working together to value creation, staying together and an exit strategy. It is not a model contract (and a licensed standard is never copied), it is not issued by the Board, and the five KPI ratings belong to the UK Procurement Act 2023 guidance on Key Performance Indicators.",
  ['P065'])
# ---- end of questions ----

emit(Q, '/root/cat-wip-contracts/banks/sc5i_m01.json', expect_n=15)
finish()
