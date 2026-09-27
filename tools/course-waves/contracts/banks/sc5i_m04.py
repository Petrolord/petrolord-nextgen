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

# SC5 Professional m04, Supplier Risk and Resilience. 15 questions.
# Lessons: Risks a supplier carries into your operation; Financial standing and early warnings; Single sources and continuity plans; Resolution planning for critical contracts.
# Topics: T09.
# Every key rests on a PACK.md passage named in its src list; the
# explanation cites the SOURCE by name and locator (an Act and its section,
# a guidance and its paragraph), never a passage id or a pack section.
# ---- questions (Professional bank writer) ----
q(2,
  "EM-G (synthetic) runs EKC-07, the Ekene environmental monitoring consultancy. The contract team is listing compliance risk: how a supplier's conduct could expose the operator under Nigerian law. Under the content Act, s.68, what is the stated consequence for an operator, contractor or sub-contractor who carries out a project contrary to that Act?",
  "An offence, with a fine of five per cent of the project sum for each project, or cancellation of the project",
  ["A written warning from the Board, followed by a fine of one per cent of the contract sum if repeated",
   "Debarment from all public procurement for a fixed period, with a fine set by the Bureau of Public Procurement",
   "Nothing for the contractor, because the content Act places every duty and penalty on the operator alone"],
  "The content Act (Act No. 2 of 2010), s.68, says an operator, contractor or sub-contractor who carries out a project contrary to its provisions commits an offence and is liable on conviction to a fine of five per cent of the project sum for each project, or cancellation of the project. One per cent is the Fund deduction under s.104(2), debarment is a Public Procurement Act 2007 sanction for public procurement, and s.68 names contractors and sub-contractors expressly.",
  ['P133'])

q(1,
  "Before any crisis, the Ekene contract manager (synthetic) checks which supply chain protections EKC-01, the well services framework with WS-A, actually holds. Which tools does the Sourcing Playbook (June 2023), Chapter 5, read as UK practice, list?",
  "Step-in rights, approval of key sub-contractors, and assignment and novation provisions",
  ["Service credits, liquidated damages and a parent company guarantee written into every contract",
   "A second framework supplier, buffer stock at the base and a fixed price for five years",
   "Board approval of each call-off and a one per cent deduction held at source by Ekene"],
  "The Sourcing Playbook, Chapter 5, on protecting against supply chain risk, lists step-in rights, the approval of key sub-contractors, and assignment and novation provisions. Whether EKC-01 holds any of them is read from its own terms. Service credits and damages are remedies for poor performance, a second source and stock are sourcing and inventory decisions for other courses, and the Board does not approve call-offs.",
  ['P187'])

q(0,
  "The synthetic Ekene team keeps supplier risks for EKC-05, the flowline works, in a risk register. How does the World Bank's Contract Management Practice guidance, taught by concept, expect that register to be used while the works run?",
  "Reviewed regularly while the contract runs, with input from the parties where that is appropriate",
  ["Written once at award and then filed, since the risks were all known before the flowline works started",
   "Kept by FW-E alone, since the contractor carries every risk there is under a lump sum works contract",
   "Reviewed only at completion, as part of the lessons learned for the next flowline job"],
  "The World Bank guidance expects the contract manager to review the risk register regularly while the contract runs, with input from the parties where that is appropriate. A register filed at award goes stale as facts change, a lump sum does not transfer the operator's own risk management to the contractor, and a review only at completion comes too late to act. Risk registers as a discipline belong to the risk, change and learning course.",
  ['P099'])

q(3,
  "Ekene's contract team (synthetic) wants a policy line on watching the finances of the suppliers behind its most important contracts. Which commitment in the Sourcing Playbook (June 2023), Chapter 11, read as UK practice, does that line follow?",
  "Monitor key suppliers' financial standing on an ongoing basis",
  ["Check each supplier's finances once, at the award stage only",
   "Leave supplier finances to the supplier's own external auditors",
   "Review finances only when a supplier asks for payment in advance"],
  "The Sourcing Playbook, Chapter 11, commits UK government to monitor the financial standing of its key suppliers on an ongoing basis. A check at award goes out of date, an auditor's opinion comes late and serves the supplier's shareholders, and waiting for an advance payment request means reacting to one warning sign after it appears. Ekene reads the commitment as practice for its own key suppliers.",
  ['P090'])

q(1,
  "EKC-02, MV-B's platform supply vessel charter (synthetic), is on Ekene's register as critical. Using the UK guidance note on economic and financial standing (2026 edition) as practice, how often should MV-B's financial standing be reviewed?",
  "At least once a year, and more often for a critical supplier or one with more than a low risk of failure",
  ["Once, at award, since a charter's day rate already reflects the owner's financial strength in full",
   "Every five years, in line with the review cycle the note sets for Gold and Silver contract suppliers alike",
   "Only after the vessel goes off-hire, since off-hire is the first sign of any financial distress"],
  "The UK guidance note, paras 4.2.1 to 4.2.2, says Key Suppliers' economic and financial standing should be reviewed at least once per year, and more often for critical suppliers or those with more than a low risk of failure. A single check at award goes stale, the note sets no five-year cycle, and off-hire is a charter remedy for breakdown that says nothing reliable about finances.",
  ['P093'])

q(3,
  "An Ekene manager (synthetic) says MV-B must tell Ekene of any Financial Distress Event, as UK practice under the Model Services Contract expects. EKC-02, the charter, contains no such clause. What is the position?",
  "The duty exists only if the contract's terms include it; Ekene can still ask MV-B and record the answer",
  ["The duty applies to MV-B automatically, because the UK Model Services Contract governs all service contracts",
   "The duty applies to MV-B automatically, because the content Act adopts the UK distress reporting scheme in full",
   "The duty can be imposed by a letter from the contract manager, which amends the charter from its date"],
  "The UK guidance note on economic and financial standing, paras 4.6.1 to 4.6.2, describes the Model Services Contract's duty to report a Financial Distress Event promptly. It is a contractual duty, so it binds MV-B only if EKC-02 includes it; the World Bank's Contract Management Practice guidance, taught by concept, reminds that a contract is managed by its own terms. The UK model does not govern Ekene, the content Act adopts nothing of it, and a letter cannot amend a contract.",
  ['P094', 'P007'])

q(2,
  "TB-D (synthetic), the sole qualified supplier of a premium connection on EKC-04, sent Ekene audited accounts last month showing a healthy balance sheet. The Ekene drilling lead says there is therefore nothing to watch. What does the UK Corporate Financial Distress guidance note (2025 edition) warn?",
  "Financial decline can arise quickly, so recent financial statements may show no sign of distress",
  ["Audited accounts are a guarantee of solvency for the twelve months after the date they are signed",
   "Accounts are the only reliable evidence, so non-financial signs of distress are best set aside",
   "A sole supplier cannot fail financially, because its customers have nowhere else to go for it"],
  "The UK Corporate Financial Distress guidance note, section 2.4, warns that financial decline can arise quickly, so an entity's financial statements may not include signs of distress. Audited accounts give no forward guarantee, the same note lists non-financial warning signs precisely because accounts lag, and being a sole source protects a supplier's sales without protecting it from failure.",
  ['P095'])

q(0,
  "In one month FW-E (synthetic) asks to be paid for the next EKC-05 milestone before reaching it, and Ekene's inspector reports that FW-E's pipe coating sub-supplier has stopped delivering to site. How does the UK Corporate Financial Distress guidance note (2025 edition) classify these two facts?",
  "As warning signs of two kinds: the advance payment request a financial one, the refusal to keep trading a non-financial one",
  ["As proof that FW-E is insolvent, so the performance security is to be called on the same day",
   "As ordinary site events of no financial significance, so neither is worth recording in the file",
   "As a claim by FW-E for more money, so both are passed to the claims register for assessment"],
  "The UK Corporate Financial Distress guidance note, section 2.3.2, lists key supply chain partners refusing to keep trading among the non-financial signs that can show distress before accounts do, and its Appendix 1, Table 1, places requests for payments in advance among the financial signs, under liquidity and solvency. The two facts are warning signs to record, date and pass to the contract owner. They prove nothing on their own, they are significant, and neither is a request for more time or money under the contract.",
  ['P096'])

q(3,
  "Following FW-E's request to be paid for an EKC-05 milestone before reaching it, the Ekene contract manager (synthetic) drafts a reply. What do the sources support?",
  "The request is answered under the contract's milestone terms, and the warning sign is recorded without concluding that FW-E is failing",
  ["The payment is made early, since refusing it could push a supplier that is already under strain into failure",
   "The contract is ended at once, since a request for early payment shows that FW-E has abandoned the works",
   "The request is ignored with no reply, since answering it might suggest the milestone terms can be changed"],
  "The World Bank's Contract Management Practice guidance, taught by concept, reminds that a contract is managed by its own terms, so a milestone is paid when it is reached. The UK Corporate Financial Distress guidance note treats a request for advance payment as a warning sign to look into, which is not a finding of failure. Paying early departs from the contract, ending the contract is far out of proportion, and silence leaves no record.",
  ['P096', 'P007'])

q(0,
  "EKC-04 (synthetic) is Ekene's casing frame agreement with TB-D, the only supplier qualified for one premium connection. On which UK Contract Tiering Tool factor, as the Sourcing Playbook (June 2023) lists them, does a single source score worst by definition?",
  "The speed and ease of switching suppliers",
  ["The contract value and its yearly spend on casing",
   "The number of KPIs the frame agreement states",
   "The supplier's recent Nigerian content record"],
  "With TB-D the only qualified maker of the connection, Ekene has nowhere to move its orders quickly, and that is exactly what the switching factor in the Sourcing Playbook's tiering tool measures. The spend on a single source may well be small, so value need not score badly. The number of KPIs and a content record play no part in the tool.",
  ['P060'])

q(1,
  "An Ekene manager (synthetic) reads GovS 008 (version 2.2), clause 5.4.6, on contract risk management. What does it state for critical public services?",
  "That organisations shall have resolution plans for them",
  ["That each supplier is to hold a parent company guarantee",
   "That the contract is to be re-tendered every three years",
   "That every critical service is kept in house by the buyer"],
  "GovS 008 at 5.4.6 states that for critical public services organisations shall have resolution plans. It says nothing there about parent company guarantees, set re-tender cycles or keeping services in house. It is a UK text; for Ekene the principle is that the plan for a critical contract is written while it is not needed.",
  ['P098'])

q(2,
  "Under the Sourcing Playbook (June 2023), Chapter 11, read as UK practice, which contracts require resolution planning information from suppliers?",
  "All new critical service contracts",
  ["Every contract above one million pounds",
   "Contracts where a KPI was already missed",
   "Works contracts with a defects period"],
  "The Sourcing Playbook, Chapter 11, says all new critical service contracts require resolution planning information from suppliers. The requirement turns on criticality, with no general money threshold of one million pounds, it is set up in advance of any failure, and it is not limited to works. The Resolution Planning guidance note extends it to some other contracts, which a separate question covers.",
  ['P091'])

q(1,
  "A synthetic Ekene analyst reads the UK Resolution Planning guidance note (May 2021), paras 1.4.1 to 1.4.4. Besides new critical service contracts, which contracts does that note bring within resolution planning?",
  "Other outsourced service contracts worth more than £10m per year, and critical construction contracts",
  ["Every contract held with a public sector dependent supplier, whatever the contract's own value or nature",
   "Every goods contract bought from a catalogue or common framework open to the whole of the public sector",
   "Only contracts that have been tiered Bronze with the tiering tool and have a low risk of failure"],
  "The UK Resolution Planning guidance note applies to new critical service contracts, other outsourced service contracts worth more than £10m per year, and critical construction contracts. Being a public sector dependent supplier does not by itself bring every contract in, catalogue goods are the low risk case that needs little management, and Bronze or low risk contracts are the opposite of the target. The £10m figure is a UK figure that sets nothing for Ekene.",
  ['P097'])

q(3,
  "An Ekene manager (synthetic) proposes to treat MV-B as a public sector dependent supplier under the Sourcing Playbook's definition and to apply the UK's £50 million test to the Ekene register. What is the position?",
  "The test is a UK public sector definition; an Ekene contract has no such figure, and Ekene's own tiers decide criticality",
  ["The test binds Ekene, since every supplier with revenue above £50 million is dependent under Nigerian law as well",
   "The test binds Ekene, since the Board has adopted the UK definition for all vessel charters in Nigerian waters",
   "The test binds Ekene only for suppliers registered in the UK, whose group revenue is measured under UK accounting"],
  "The Sourcing Playbook defines public sector dependent suppliers as supplier groups with over £50 million a year of revenue, over 50% of it from public sector work. That is a UK public sector definition, and nothing in Nigerian law or the Board's guidelines adopts it. For Ekene, the tier the contract team gave a contract decides how critical it is, and the course sets no money threshold of its own.",
  ['P092'])

q(0,
  "EKC-02 (synthetic) is tiered critical. MV-B belongs to a group in which one company owns the vessel and another employs the crew. Following the UK Resolution Planning guidance note (May 2021) as practice, what should the Ekene contract ask MV-B to provide?",
  "Corporate resolution planning information and an insolvency continuity plan",
  ["A signed promise that no company in the group will become insolvent in future",
   "The personal guarantees of every director of each company in the MV-B group",
   "A copy of each group company's tax returns for the last ten years of trading"],
  "The UK Resolution Planning guidance note, paras 1.4.1 to 1.4.4, says such contracts should require the supplier to provide corporate resolution planning information and an insolvency continuity plan: how the group is put together and how the service continues through an insolvency. A promise not to fail is worthless, directors' guarantees and old tax returns do not show how the vessel would stay on hire. An Ekene contract carries the duty only if its terms include it.",
  ['P097'])
# ---- end of questions ----

emit(Q, '/root/cat-wip-contracts/banks/sc5i_m04.json', expect_n=15)
finish()
