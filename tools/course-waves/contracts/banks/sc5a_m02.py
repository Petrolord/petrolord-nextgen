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

# SC5 Expert m02, Claims. 15 questions.
# Lessons: What a claim is; Notice and its timing; Entitlement and evidence; Assessing a claim fairly.
# Topics: T05, T12.
# Every key rests on a PACK.md passage named in its src list; the
# explanation cites the SOURCE by name and locator (an Act and its section,
# a guidance and its paragraph), never a passage id or a pack section.

q(1, "EKC-05 is the synthetic flowline replacement works contract with supplier FW-E (synthetic), a lump sum paid against milestones. FW-E writes that its costs went up during the last month and asks for more money. The letter names no clause and no event. On the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, what should the reply ask FW-E to state first?",
  "The breach of contract or the other legal basis the claim relies on",
  ["The name of the arbitrator FW-E proposes to appoint for the matter",
   "Its revised lump sum, so that Ekene can pay the difference at once",
   "Its consent to treat the letter as a dispute under the dispute clause"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), p.51, says a claim should state the breach of contract or the other legal basis it relies on; a letter that says only that costs went up states neither. An arbitrator belongs at the top of a dispute ladder, paying a revised sum before any basis is shown skips the assessment, and a claim becomes a dispute only when it has been answered and the parties still disagree.",
  ['P153'])

q(3, "EKC-03 is the synthetic camp catering and facility services contract with CF-C (synthetic). CF-C writes proposing to add a laundry service to the scope from next month for an extra monthly fee. How should the contract manager route the letter, on GovS 008 (version 2.2, issued 1 April 2026), UK good practice used here as a model?",
  "As a change request through change control, with the cost justified and approval obtained before the laundry service starts",
  ["As a claim for money under the contract, assessed for entitlement, cost incurred and causation before any reply is sent to CF-C",
   "As a dispute, sent at once to senior representatives, since CF-C is asking for money the contract does not already provide for",
   "As a supplier's offer that the contract manager may accept by email, since a small addition to scope needs no record or approval"],
  "CF-C proposes to alter the work, which makes it a change request. GovS 008 (version 2.2), 5.4.5, expects change control with an audit trail in a change register, a cost of change justified against the business case and approvals obtained before implementation. A claim says the contract already entitles the supplier to more for something that happened, nothing here has been answered and disagreed, and an unrecorded email acceptance defeats the audit trail.",
  ['P078'])

q(0, "EKC-05 is the synthetic flowline replacement works contract with FW-E (synthetic). FW-E's crew stood idle because Ekene gave access to the manifold two days late, and FW-E has claimed for the delay. In the portfolio review, which buyer-side practice from the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, would have prevented this claim?",
  "Giving the supplier timely access to the site",
  ["Holding a larger retention from FW-E",
   "Adding more KPIs for FW-E's crew",
   "Calling the performance security whenever FW-E reports a delay on site"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), p.50, says good practice prevents many claims: understand the contract, pay on time, define scope and specifications properly, give timely access to site, and answer contractor notices on time. The late access was Ekene's own act. Retention, extra KPIs and calling the security act on the supplier and do nothing to remove a cause that sat with Ekene.",
  ['P157'])

q(2, "EKC-07 is the synthetic environmental monitoring consultancy with supplier EM-G (synthetic). The contract requires written notice of any event for which EM-G will seek extra fees within a period the contract states. EM-G's written notice about extra sampling trips arrived well after that period. What do the sources support the contract manager doing?",
  "Read the contract's notice clause for what it says follows from a late notice, and reply on that basis",
  ["Treat the notice as valid in full, since a notice period in a consultancy is only an administrative reminder with no effect",
   "Reject the claim outright under the World Bank guidance, which bars every late claim whatever the contract says about it",
   "Ignore the notice and wait for EM-G to escalate it, since answering a late notice would waive Ekene's position on timing"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), p.51, stresses that a claim is notified and submitted on time because a late notice or submission can carry consequences under the contract. What those consequences are is written in the contract, so the contract manager reads the clause. The guidance sets no bar of its own, the period is a term of the contract, and answering notices on time is itself one of the guidance's claim-prevention practices (p.50).",
  ['P152'])

q(1, "EKC-02 is the synthetic platform supply vessel time charter with MV-B (synthetic). A new contract manager sets up a notice register for the charter. On the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, what should the record capture?",
  "How MV-B performed and delivered, every communication and notice, the dates, and who was involved",
  ["Only MV-B's written notices, since calls and meetings are no part of a charter's record",
   "Ekene's own letters to MV-B alone, since the supplier keeps its own record of anything it sends to the operator",
   "Notices that later become disputes, and no others"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), Figure XIV, p.38, lists what to record: how the supplier performed and delivered, every communication and notice, the dates, and who was involved. A register that drops calls, meetings, the supplier's own notices or notices settled early cannot later show whether a notice was given, when, and whether it was answered.",
  ['P160'])

q(3, "EKC-01 is the synthetic well services call-off framework with WS-A (synthetic). A claim by WS-A has become a dispute, and the parties agree to mediate in Nigeria. WS-A's lawyer worries that the limitation period for the claim will run out while the mediation goes on. What does the Arbitration and Mediation Act 2023 (Nigeria) provide?",
  "Under s.71(1), once the mediation proceedings commence, the running of the limitation period for the claim they concern is suspended",
  ["Under s.71(1), the limitation period keeps running during mediation, so WS-A must start court proceedings at once to protect itself",
   "Under s.55(4), the limitation period for the claim is extended by three months from the day the mediator is appointed by the parties",
   "Under s.82(2), the limitation period ends on the day mediation starts, since a mediated settlement replaces the claim in every case"],
  "The Arbitration and Mediation Act 2023 (Nigeria), s.71(1), provides that when the mediation proceedings commence, the running of the limitation period regarding the claim that is the subject of the mediation is suspended. Section 55(4) concerns applications to set aside an arbitral award, and s.82(2) makes a settlement agreement binding; neither ends or extends a limitation period.",
  ['P171'])

q(2, "EKC-06 is the synthetic instrument maintenance service with IM-F (synthetic), reimbursed at hourly rates. IM-F claims waiting time for technicians, with full timesheets. The contract manager finds that the contract pays hours worked on tasks and says nothing that pays waiting time. On the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, how does this affect the claim?",
  "It fails the first check, entitlement under the contract, however good the timesheet evidence is",
  ["It succeeds, since full timesheets prove both that the time was spent and that Ekene caused it",
   "It must be paid in full and argued later, since a reimbursable contract pays any hour recorded",
   "It moves straight to causation, since entitlement is tested only once the cost has been proved"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), p.51, sets three checks: the contract gives an entitlement to the time or cost claimed; the extra time or cost was actually incurred and is reasonable; and the buyer's default actually caused the loss. A claim that fails the first check fails whatever its evidence. Timesheets show time spent and prove no cause, a reimbursable contract pays what its terms pay, and entitlement comes first.",
  ['P154'])

q(0, "EKC-04 is the synthetic casing and tubulars frame agreement with TB-D (synthetic), priced at stated unit prices per item. A new contract manager asks when to work out which possible extra costs sit with TB-D and which sit with Ekene. What does the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, expect?",
  "In advance, so that the allocation is known before any claim arrives",
  ["After the first claim arrives on an order",
   "At close-out only, when the final account shows which costs each party finally carried over the agreement",
   "Never, since an arbitrator fixes it"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), Cost Control, p.20, expects the contract manager to know in advance which costs, possible extra costs included, sit with the contractor and which sit elsewhere. Mapping the allocation only after a claim, at close-out or in arbitration leaves the first check on entitlement unanswered when it is needed.",
  ['P159'])

q(3, "EKC-03 is the synthetic camp catering contract with CF-C (synthetic). CF-C sends a one-page claim for extra meals served during a plant shutdown, giving a single total and no breakdown. On the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, what should the contract manager ask IM-F to provide?",
  "An analysis of the costs claimed, backed by documents such as meal counts, reports and invoices",
  ["A letter from CF-C's managing director confirming that the total claimed is accurate for the shutdown",
   "Nothing further, since a claim under a fixed-fee contract is paid on the total the supplier states",
   "A proposal for a mediator"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), p.51, expects a claim to be backed by an analysis of its costs and by documents such as invoices, reports and records. A director's letter is an assertion with no records behind it, a contract pays only what its terms and the records support, and a claim lacking evidence is incomplete, which calls for the missing records before anything else.",
  ['P155'])

q(1, "EKC-01 is the synthetic well services call-off framework with WS-A (synthetic). WS-A claims standby costs after pulling its crew off an Ekene well. Ekene wants to resist the claim, arguing that WS-A abandoned the work. The records show Ekene paid WS-A's last three invoices months late, and WS-A had written that it could not keep the crew on site unpaid. What should the contract manager check before relying on WS-A's default?",
  "That Ekene met its own obligations, including timely payment, since the late payments may have caused the withdrawal",
  ["That WS-A's crew list is complete, since the payment history has no bearing on a supplier's duty to stay on site",
   "That the claim was sent to the right address, since an address error would defeat the claim whatever Ekene did",
   "That the framework names WS-A as a strategic supplier, since only strategic suppliers may claim for standby costs"],
  "WS-A's own letter ties the withdrawal to Ekene's late invoices. The World Bank Contract Management Practice guidance (Second Edition, 2024) records a case (Figure XVI, p.40) in which a buyer who paid late could not later hold the contractor to its default, so Ekene first checks its own payment record against the framework's terms. A crew list, an address or a supplier's segment says nothing about who caused the withdrawal.",
  ['P185'])

q(2, "EKC-05 is the synthetic flowline replacement works contract with FW-E (synthetic), a lump sum. FW-E claims the cost of an extra coating on each weld as additional work. The specification in the contract already requires that coating on every weld. What question does the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, put first?",
  "Whether the so-called extra work was already in scope and has been labelled extra by mistake",
  ["Whether FW-E's market rate for coating is lower than the rate a second contractor would charge",
   "Whether FW-E gave notice of the coating within the period the arbitration clause of the contract states",
   "Whether FW-E's crew was released to other work during the time the coating was being applied"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), p.52, asks first whether the extra work was already in scope and mislabelled as extra; only after that are the costs checked for relevance and reasonableness. Here the specification already requires the coating. Market rates come later in the pricing order, notice periods sit in the claims clause, and redeployment is a delay-claim test.",
  ['P156'])

q(0, "EKC-01 is the synthetic well services call-off framework with WS-A (synthetic), priced from a schedule of rates. Ekene accepts that WS-A is entitled to payment for extra pumping hours. The schedule of rates holds a pumping rate, but WS-A has priced the hours at a higher market rate. On the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, how should the hours be priced?",
  "At the contract's own rates first, then recorded historical costs, then market rates",
  ["At the current market rate for pumping",
   "At the average of WS-A's rate and the market rate, since the guidance splits the difference between parties",
   "At the lowest rate any other supplier quoted Ekene, since the guidance asks for the cheapest price on the market"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), p.52, sets the order for pricing claimed costs: the contract's unit rates first, then recorded historical costs, then market rates. The schedule of rates holds a pumping rate, so that rate applies. The guidance sets no market-rate default, no splitting of the difference and no lowest-quote rule.",
  ['P156'])

q(3, "EKC-07 is the synthetic environmental monitoring consultancy with EM-G (synthetic). Ekene postponed site access for a month, and EM-G's delay claim includes a line for head office overheads that EM-G says went unabsorbed, with no evidence for the line. How should the contract manager treat it, on the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept?",
  "Test it against evidence that the head office overheads actually went unabsorbed during the delay",
  ["Accept it in full, since head office overheads are recovered automatically on every delay claim",
   "Reject it outright, since the guidance treats head office overheads as never recoverable on a delay",
   "Replace it with a fixed allowance, since the guidance prints a standard overhead percentage to use"],
  "For delay claims the World Bank Contract Management Practice guidance (Second Edition, 2024), p.52, has the contract manager test idle labour and equipment, unabsorbed site and head office overheads, and profit. Each line is tested against the contract and the records, so an overhead line with no evidence is incomplete. The guidance neither grants overheads automatically nor bars them, and it prints no standard overhead percentage.",
  ['P158'])

q(1, "EKC-06 is the synthetic instrument maintenance service with IM-F (synthetic). Ekene accepts a delay claim from IM-F caused by a late Ekene shutdown, and IM-F adds a profit margin to its cost. What decides whether the margin is payable, on the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept?",
  "Whether the contract allows cost only or cost plus profit for this kind of event",
  ["Whether IM-F's profit margin is within the range the guidance prints for maintenance work",
   "Whether IM-F made a loss on the contract overall, since profit is paid only to a supplier in loss",
   "Whether the claim reached mediation, since profit becomes payable only in a mediated settlement"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), p.52, has the contract manager check profit on a delay claim by asking whether the contract allows cost only or cost plus profit. The answer is in the contract. The guidance prints no margin range, profit does not turn on the supplier's overall result, and mediation has no bearing on what the contract allows.",
  ['P158'])

q(2, "EKC-04 is the synthetic casing and tubulars frame agreement with TB-D (synthetic). Ekene and TB-D settle a claim, and the settlement raises two unit prices for the rest of the agreement. What should happen to the settlement in Ekene's records, on the World Bank Contract Management Practice guidance (Second Edition, 2024) and GovS 008 (version 2.2, issued 1 April 2026), used as published practice?",
  "Enter it in the change register with the approval that authorised it, and track the increase for the rest of the agreement",
  ["Keep it out of the change register, since a claim settlement is a separate matter from a change to the contract's prices",
   "File it with the correspondence only, since the approval for a settlement is given orally at the meeting that agrees it",
   "Record it once the agreement ends, since increases are counted only in the final account prepared at close-out"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), Cost Control, Figure VI, p.20, expects the contract manager to track and control every increase that is granted, and GovS 008 (version 2.2), 5.4.5, expects an audit trail in a change register with approvals obtained before implementation. A settlement that changes prices changes the contract, oral approval leaves no audit trail, and waiting for the final account loses control of the increase while it runs.",
  ['P088', 'P078'])

emit(Q, '/root/cat-wip-contracts/banks/sc5a_m02.json', expect_n=15)
finish()
