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

# SC5 Expert m04, Termination, Step-In and Exit. 15 questions.
# Lessons: Grounds for termination; Step-in and other interventions; Exit planning and handover to a successor; A supplier in distress.
# Topics: T09, T14.
# Every key rests on a PACK.md passage named in its src list; the
# explanation cites the SOURCE by name and locator (an Act and its section,
# a guidance and its paragraph), never a passage id or a pack section.

q(2, "EKC-06 is the synthetic instrument maintenance service with IM-F (synthetic). Repeat failures have risen for two months. The contract offers a formal notice and a performance improvement plan, and neither has been used. The operations manager asks for early termination now. What does GovS 008 (version 2.2, issued 1 April 2026), UK good practice used as a model, say at 5.4.7?",
  "Early termination should be a last resort, used only after other provisions, including remedies for improving performance, are exhausted",
  ["Early termination is the first remedy to use whenever a KPI is missed for two months in a row on any contract",
   "Early termination may be used at once, provided the contract manager records the reason in the contract file",
   "Early termination is barred for maintenance contracts, which may only end on expiry of their stated term"],
  "GovS 008 (version 2.2), 5.4.7, says early termination of a contract should be a last resort only enacted after other provisions for delivery, including contractual remedies for improving performance, have been exhausted. The formal notice and improvement plan are still unused. GovS 008 sets no two-month trigger, a recorded reason does not make termination the first step, and nothing in it bars termination of a maintenance contract.",
  ['P182'])

q(0, "EKC-02 is the synthetic platform supply vessel time charter with MV-B (synthetic). An Ekene manager says the UK Procurement Act 2023, s.78, gives Ekene an implied right to terminate MV-B's charter. How should the contract manager answer?",
  "Section 78 implies a termination term into UK public contracts; the Ekene charter's grounds come from the charter itself",
  ["Section 78 applies to every contract for services worldwide, so the Ekene charter carries the implied term whatever it says",
   "Section 78 lets any buyer terminate at will and without notice, whatever the charter says about grounds",
   "Section 78 is part of the content Act, which binds the charter as an oil and gas contract in Nigeria"],
  "The UK Procurement Act 2023, s.78(1), makes it an implied term of every public contract that the contracting authority can terminate it if a termination ground applies. It is a UK statute for UK public contracts, so it binds no Ekene contract; for Ekene the grounds are written in the charter, with the UK rule serving only as a published model. It gives no worldwide or at-will right and it is no part of the content Act.",
  ['P176'])

q(3, "EKC-07 is the synthetic environmental monitoring consultancy with EM-G (synthetic). Ekene decides to use the UK Contract Terminations guidance (Procurement Act 2023) as a model of fair process before terminating under its own contract. What does the guidance, para 15, require of an authority before it relies on the implied term?",
  "Tell the supplier it intends to terminate, say which ground applies and why, and give it a reasonable opportunity to respond",
  ["Publish a contract termination notice first, and then tell the supplier the ground only once that notice has run for 30 days",
   "Obtain the supplier's written consent to the termination, since the implied term works only where the supplier agrees",
   "Give no warning at all, since the implied term takes effect the moment a termination ground first applies to the contract in hand"],
  "The UK Contract Terminations guidance (Procurement Act 2023), para 15 (s.78(7)), says that before relying on the implied term the authority must tell the supplier it intends to terminate, state the ground and why, and give a reasonable opportunity to respond. The termination notice under s.80 is published after termination, supplier consent is no condition, and the term does not take effect without that warning. For Ekene this is a model of fair process only.",
  ['P178'])

q(1, "EKC-05 is the synthetic flowline replacement works contract with FW-E (synthetic). An audit finds that the flowline project was carried out contrary to the Nigerian Oil and Gas Industry Content Development Act 2010 (the content Act). What does s.68 provide for an operator, contractor or sub-contractor who does so?",
  "An offence, with liability on conviction to a fine of five per cent of the project sum for each project or cancellation of the project",
  ["An administrative warning from the Board, with no fine at all, since the content Act sets no penalty for breaches committed during execution",
   "A fine of one per cent of the contract sum, deducted at source and paid into the Nigerian Content Development Fund each year",
   "Debarment from all public procurement for not less than 5 calendar years and a fine of 25% of the value of the procurement"],
  "The content Act, s.68, provides that an operator, contractor or sub-contractor who carries out any project contrary to the content Act commits an offence and is liable on conviction to a fine of five per cent of the project sum for each project or cancellation of the project. One per cent is the s.104(2) deduction for the Fund, and debarment with a 25% fine is the Public Procurement Act 2007, s.58(6), a different Act.",
  ['P133'])

q(1, "EKC-01 is the synthetic well services call-off framework with WS-A (synthetic). For a year Ekene's supervisors warned WS-A about slow mobilisation in meetings and by phone, and nothing was written down. Ekene now wants to terminate. What does a World Bank case study in the Contract Management Practice guidance (Second Edition, 2024), taught by concept, show about this position?",
  "With no written record of the earlier warnings, termination is likely to be delayed, so the record comes first",
  ["Verbal warnings given over a full year are as good as written ones, so Ekene may terminate WS-A's framework at once",
   "The warnings do not matter, since termination depends only on the length of the delay",
   "A year of slow mobilisation ends the framework by itself, with no notice needed at all"],
  "In the World Bank case study (Contract Management Practice guidance, Second Edition, 2024, Figure XV, p.39), an employer tried to terminate two slow contracts after twelve months and found every earlier warning had been verbal; with no written record, termination was delayed by months. The case shows the written record carries the decision. Nothing in the source says a delay ends a contract by itself.",
  ['P184'])

q(0, "EKC-03 is the synthetic camp catering contract with CF-C (synthetic). CF-C withdrew half its staff last month. Ekene wants to terminate for abandonment. The file shows Ekene paid CF-C's monthly fee three months late in a row, and CF-C wrote that it could not pay its staff. What does the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, point to?",
  "Termination for abandonment may be indefensible where Ekene's own late payment forced the withdrawal",
  ["Ekene's termination is secure, since any withdrawal of staff is abandonment whatever caused it",
   "Once the service credits for the missing staff are deducted in full, termination is secure",
   "The law bars termination on any contract where the buyer has ever paid one invoice late"],
  "A World Bank case study (Contract Management Practice guidance, Second Edition, 2024, Figure XVI, p.40) describes an employer whose own late payments forced the contractor to suspend work, which made termination for abandonment indefensible. The employer meets its own obligations, including timely payment, before relying on the contractor's default. Cause matters, service credits do not cure Ekene's default, and the source states no legal bar.",
  ['P185'])

q(2, "EKC-02 is the synthetic platform supply vessel time charter with MV-B (synthetic). The vessel has broken down three times. The charter contains a rectification plan clause and no step-in right. The marine superintendent proposes that Ekene step in and run the vessel with its own crew. What do the UK Contract Management Principles, used as published good practice, point to?",
  "Step-in is a contractual option, so Ekene may use it only where the charter grants it; the rectification plan clause is available",
  ["Step-in is available on every contract once three breakdowns occur, whether or not the charter itself mentions a step-in right anywhere",
   "Step-in is implied by the content Act into every oil and gas charter, since the Board may direct an operator to take control",
   "Step-in is the first remedy the Principles name, so it comes before any rectification plan whatever the charter itself provides"],
  "The UK Contract Management Principles, principle 3, say to understand and use contractual options such as appointment of a Remedial Advisor, Rectification Plans and Step In rights. They are contractual options, so each exists on an Ekene contract only if the contract grants it. The charter grants a rectification plan and no step-in. No breakdown count, content Act provision or order of listing creates a step-in right.",
  ['P068'])

q(3, "A synthetic Ekene strategy team wants its next services contracts to protect against failure in the supplier's own supply chain. Which protections does the Sourcing Playbook (June 2023), a UK text used as published good practice, list for this?",
  "Step-in rights, the approval of key sub-contractors, and assignment and novation provisions",
  ["A higher retention on every invoice, and a ban on sub-contracting any part of the work to others",
   "Weekly price reviews, and a right to cancel any order without notice or payment of sums owed",
   "Delay damages at a rate set by the Playbook, and termination of the contract for the first missed KPI"],
  "The Sourcing Playbook (June 2023), Chapter 5, p.41, lists protections against supply chain risk: step-in rights, the approval of key sub-contractors and assignment and novation provisions. It does not list retention increases, sub-contracting bans, weekly price reviews or cancellation without payment, and it sets no rate of delay damages.",
  ['P187'])

q(2, "EKC-05 is the synthetic flowline replacement works contract with FW-E (synthetic). The scenario adds its own fact: one section of the flowline will be finished well after the time the contract stipulates. The World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, gives an example list of employer remedies under a works contract, each beside the situation that may trigger it (Figure XII, p.37). Which remedy does that list tie to this situation?",
  "Delay damages, which the list ties to works or a section not completed within the stipulated time",
  ["Termination, which the list ties to any section finished late, whatever termination events the contract specifies",
   "Calling the environmental and social performance security, which the list ties to late completion of a section",
   "A referral to the dispute review board, which the list ties to every delay on a major works contract"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), Figure XII, p.37, gives as an example employer remedies with their triggers: delay damages when the works or a section are not completed within the stipulated time; termination on a termination event the contract specifies; calling the environmental and social performance security when the contractor breaches its environmental and social obligations; and, on major works, referrals of sexual exploitation and abuse or harassment concerns to the dispute review board. The list is an example and states no order of severity; the Ekene contract's own terms decide which remedies it holds.",
  ['P076'])

q(0, "A synthetic Ekene draft works contract copies a delay damages limit of 10% of the contract price, and the drafter says the World Bank requires that figure. What does the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, say about the 10%?",
  "It is an illustration of an aggregate limit; each contract states its own rate and limit, if it has any",
  ["It is a mandatory cap on delay damages in every works contract financed or modelled on the Bank's texts",
   "It is the minimum rate of delay damages per day that the Bank requires for late completion of works",
   "It is the Nigerian statutory cap under the Public Procurement Act 2007 for delay damages in all contracts"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), Delay Damages, p.38, explains that delay damages usually carry an aggregate limit and gives 10% of the contract price as an illustration; reaching the limit usually permits termination, though continuing may still be the better option. It is no mandate, no daily rate and no figure from the Public Procurement Act 2007.",
  ['P186'])

q(3, "EKC-03 is the synthetic camp catering contract with CF-C (synthetic). It expires in eight months, and Ekene will retender the service. Nobody has yet planned the exit. What does the UK Contract Management Framework Summary, published as good practice, expect?",
  "Exit planning and a strategy for when the contract ends, put in place in a timely manner with input from the contract manager",
  ["Exit planning left to the incoming supplier, since the new caterer takes over the camp and knows best what it will need from CF-C",
   "Exit planning done in the last week before expiry, since planning any earlier signals to CF-C that the contract will end soon",
   "Exit planning done by the procurement team alone, since the contract manager's role ends once the work is put out to retender"],
  "The UK Contract Management Framework Summary, Area 11, item 15, expects exit planning and a strategy for when the contract ends to be put in place in a timely manner with input from the contract manager. Leaving it to the incoming supplier, to the last week, or to procurement without the contract manager misses both the timing and the input the standard names.",
  ['P200'])

q(1, "EKC-06 is the synthetic instrument maintenance service with IM-F (synthetic). IM-F will not be renewed, and in the last months its best technicians are being moved to other clients. What does the Sourcing Playbook (June 2023), a UK text used as published good practice, say a contract should hold for this stage?",
  "Sufficient means to incentivise the incumbent supplier to maintain both resources and performance up to the end",
  ["A clause releasing the incumbent from its KPIs in the final quarter, since performance naturally falls near expiry",
   "A right for the incumbent to reduce its resources once a successor is named, with no change in the fee paid",
   "Nothing for the final months, since a supplier's duties end once the buyer decides the contract will not be renewed"],
  "The Sourcing Playbook (June 2023), Chapter 13, key point 2, p.73, says there should be sufficient means within the contract to incentivise the incumbent supplier to maintain both resources and performance up to the end of the contract. Releasing KPIs, allowing reduced resources at full fee, or ending duties on a non-renewal decision all cut against that point.",
  ['P197'])

q(0, "A synthetic Ekene team drafts the termination terms for a new services contract, using the UK Contract Terminations guidance (Procurement Act 2023), para 18, as a model. Which practical terms does the guidance name for inclusion?",
  "The notice period, transfer of assets and data, help with re-procurement, payment of sums owed, and any breakage costs",
  ["Only the list of termination grounds, since the guidance treats what follows a termination as a matter for the courts to decide",
   "A penalty of 25% of the contract value payable by the supplier, the figure the guidance prints for any termination",
   "A waiver of sums owed to the supplier, since the guidance treats unpaid invoices as cancelled when a contract ends early"],
  "The UK Contract Terminations guidance (Procurement Act 2023), para 18, says contracting authorities should always set out in the contract what happens when it is terminated, and names practical terms: the notice period, transfer of assets and data, help with re-procurement, payment of sums owed and any breakage costs for early termination. The guidance leaves nothing to the courts here, prints no 25% penalty (that figure is the Nigerian Public Procurement Act 2007, s.58(6), fine) and does not cancel sums owed.",
  ['P179', 'P180'])

q(2, "EKC-04 is the synthetic casing and tubulars frame agreement with TB-D (synthetic). TB-D's latest audited accounts look healthy, but TB-D now asks to be paid in advance, is factoring its invoices, and its mill has stopped deliveries pending payment. What does the UK Corporate Financial Distress guidance note (2025 edition), used as published good practice, support?",
  "Treat these as warning signs of distress that can show before published accounts do, and record and escalate them",
  ["Disregard the signs, since healthy audited accounts show that TB-D cannot be in any financial distress during this year",
   "Pay in advance at once, since advance payment is the guidance's own remedy for a key supplier under cash-flow pressure",
   "Terminate the agreement at once, since the guidance treats any request for advance payment as an event of insolvency"],
  "The UK Corporate Financial Distress guidance note (2025 edition), section 2.4, p.8, warns that financial decline can arise quickly, so financial statements may not show it, and section 2.3.2 and Appendix 1 list non-financial warning signs including requests to be paid in advance, invoice discounting or factoring, and key supply chain partners refusing to keep trading. A request for advance payment is itself a warning sign, and the guidance calls none of these an insolvency event.",
  ['P095', 'P096'])

q(3, "Ekene's synthetic contracts lead asks which UK contracts the Resolution Planning guidance note (May 2021), used as published good practice, applies to, and what such contracts should require of the supplier. Which answer matches the guidance?",
  "New critical service contracts, other outsourced service contracts worth more than £10m per year, and critical construction contracts; resolution planning information and an insolvency continuity plan",
  ["Every contract of any value let by any public body; a parent company guarantee from the supplier's owner and a bond of 10% of the contract value lodged with the buyer",
   "Only contracts with public sector dependent suppliers; a monthly set of management accounts and a board confirmation of solvency sent with every invoice to the buyer",
   "Only contracts let under the content Act; a Nigerian Content Plan with resolution targets filed with the Board before the first payment under the contract"],
  "The UK Resolution Planning guidance note (May 2021), paras 1.4.1 to 1.4.4, applies to new critical service contracts, other outsourced service contracts worth more than £10m per year, and critical construction contracts, and has them require corporate resolution planning information and an insolvency continuity plan. Its reach is narrower than every public contract, wider than dependent suppliers alone, and unconnected with the content Act; for Ekene it suggests a written plan for a critical supplier's failure.",
  ['P097'])

emit(Q, '/root/cat-wip-contracts/banks/sc5a_m04.json', expect_n=15)
finish()
