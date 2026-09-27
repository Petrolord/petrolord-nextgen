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

# SC5 Professional m06, Poor Performance and Remedies. 15 questions.
# Lessons: From concern to formal notice; Remedies the contract gives; Recording poor performance; Preparing for the Professional exam.
# Topics: T06, T07, T14.
# Every key rests on a PACK.md passage named in its src list; the
# explanation cites the SOURCE by name and locator (an Act and its section,
# a guidance and its paragraph), never a passage id or a pack section.
# ---- questions (Professional bank writer) ----
q(3,
  "CF-C (synthetic) has failed its EKC-03 improvement plan at the checkpoint, and the contract manager is ready to escalate. GovS 008 (version 2.2), clause 5.4.3, read as practice, says corrective action is taken within the terms of the contract. What does that phrase mean for the formal notice?",
  "It is given under the contract's own notice clause, in the form and by the route the contract sets",
  ["It can take any form the contract manager prefers, since the standard lists notice only as one example",
   "It is sent by the contract owner's personal email, since a notice from a senior person needs no clause",
   "It is issued under the UK Procurement Act 2023, since the standard's remedies come from that Act"],
  "GovS 008 at 5.4.3 says preventative and/or corrective action should be taken within the terms of the contract, such as through formal notice or a performance improvement plan. A formal notice therefore follows the contract's notice clause. Seniority does not replace the clause, the manager's preference does not set its form, and an Ekene contract is not governed by the UK Act.",
  ['P067'])

q(2,
  "Twelve months into EKC-05 (synthetic), FW-E's flowline works are far behind programme. The Ekene team has warned FW-E many times, all of it by telephone and at site meetings with no minutes. What does a World Bank case study in the Contract Management Practice guidance, taught by concept, show about this position?",
  "With no written record of the warnings, the employer's next step against the contractor was delayed by months",
  ["Spoken warnings count as formal notice, provided enough of them were given over the period of delay",
   "Twelve months of slow progress entitles the employer to end the contract at once, whatever the record",
   "The contractor bears every consequence, since it was told of the problem even if nothing was written"],
  "The World Bank guidance tells of an employer who moved against two slow road contracts after twelve months and found every earlier warning had been verbal; with nothing in writing, termination was delayed by months. Spoken warnings are not formal notice, time alone does not create a right to end a contract, and a warning that cannot be proved protects nobody.",
  ['P184'])

q(0,
  "For two quarters the named key person on EKC-07 (synthetic) missed the sampling rounds, and the contract manager raised it with EM-G by telephone each time. In the first written step, what does the World Bank's Contract Management Practice guidance, taught by concept, suggest the file should hold?",
  "The facts of performance, each communication, the dates, and who was involved",
  ["A summary opinion of EM-G's attitude, with the telephone calls left unrecorded",
   "Only the final outcome, since the history of the calls is of no later use",
   "A copy of EM-G's accounts, since poor work usually comes from distress"],
  "The World Bank guidance lists what a contract manager records: how the supplier performed and delivered, every communication and notice, the dates, and who was involved. The first letter states the facts with dates and records the earlier calls. An opinion without facts, an outcome without its history, and a set of accounts do not make the record the guidance describes.",
  ['P160'])

q(1,
  "The Ekene contract team (synthetic) borrows the logic of the UK guidance on Contract Performance Notices, para 28, for its own performance records on EKC-06. What must a UK authority show before it publishes a notice about a supplier not performing to its satisfaction?",
  "That the supplier was given a proper opportunity to improve performance and failed to do so",
  ["That the supplier's parent company has been told in writing of the planned notice and its content",
   "That the Board has first confirmed the supplier's breach of its Nigerian content plan",
   "That the supplier has been paid in full for every invoice raised before the notice"],
  "The UK guidance on Contract Performance Notices, para 28, says the supplier must have been given proper opportunity to improve performance, and must have failed to do so, before such a notice is published. That binds UK contracting authorities; for Ekene the logic is practice, and an improvement plan with a closure test proves the opportunity. Parent company notice, Board confirmation and full payment are not the conditions it sets.",
  ['P070'])

q(2,
  "EM-G's (synthetic) junior staff member has been doing the EKC-07 sampling in place of the named key person, and the work is poor. Following the World Bank's Contract Management Practice guidance on a consultant's unsatisfactory performance, taught by concept, what does the client do first?",
  "Use the contract to ask EM-G to correct the problem or replace the staff concerned",
  ["End the consultancy at once and engage another firm for the next sampling round",
   "Withhold the whole quarterly fee until the named key person returns to the site in person",
   "Refer the matter to arbitration, since staffing questions fall outside the contract"],
  "The World Bank guidance says that where a consultant's team performs poorly, the client uses the contract to ask for correction or replacement of staff; only if the consultant fails to act does the client move to further remedies under the contract. Ending the contract first skips that step, withholding the whole fee is not the first remedy described, and the key person term sits inside the contract.",
  ['P075'])

q(0,
  "FW-E (synthetic) has left defects unremedied on EKC-05. The World Bank's Contract Management Practice guidance, taught by concept, lists typical employer remedies under a works contract in rising order. Which comes first?",
  "A notice to correct the default",
  ["Calling the performance security",
   "Deducting delay damages for late completion",
   "Termination for a contractual termination event"],
  "The World Bank guidance lists the usual employer remedies under a works contract in rising order: a notice to correct a default, withholding payment, calling the performance security, delay damages for late completion, and termination when a contractual termination event occurs. The order guides proportion, so the notice to correct comes first and the other three sit higher on the ladder.",
  ['P076'])

q(3,
  "After two missed service levels on EKC-03 (synthetic), an Ekene manager proposes ending CF-C's catering contract early to make an example of it. What does GovS 008 (version 2.2), clause 5.4.7, read as practice, say about early termination?",
  "It is a last resort, used only after other provisions, including remedies for improving performance, are exhausted",
  ["It is the preferred first step, because it sends the clearest message to every supplier on the register",
   "It is allowed at any time without cause, because GovS 008 gives every buyer that right in its contracts",
   "It is required after two missed levels, because the standard sets that count as the trigger for ending"],
  "GovS 008 at 5.4.7 calls early termination of a contract a last resort, only enacted after other provisions for delivery, including contractual remedies for improving performance, have been exhausted. EKC-03's own remedy for a missed level is its service credit. The standard does not favour termination first, grants no right to end without cause, and sets no count of misses as a trigger.",
  ['P182'])

q(1,
  "An Ekene manager (synthetic) wants to appoint a Remedial Advisor on EKC-06 after IM-F's repeat failures, citing principle 3 of the UK Contract Management Principles. EKC-06 says nothing about remedial advisors. What is the position?",
  "The option exists on EKC-06 only if the contract's terms include it",
  ["The option applies to every service contract once repeat failures occur",
   "The option is implied into EKC-06 by the content Act for all field services",
   "The option can be added by a letter from the manager without a change"],
  "Principle 3 of the UK Contract Management Principles asks contract managers to understand and use contractual options such as appointment of a Remedial Advisor, Rectification Plans and Step In rights. They are contractual: the World Bank's Contract Management Practice guidance, taught by concept, reminds that a contract is managed by its own terms. The content Act implies no such option, and adding one needs a change to the contract.",
  ['P068', 'P007'])

q(1,
  "EKC-05 (synthetic) provides for delay damages with an aggregate limit stated in the contract. An Ekene manager says the limit is 10% of the contract price because the World Bank guidance says so. How should the World Bank figure be read?",
  "As an illustration in guidance; the Ekene limit is whatever EKC-05 itself states",
  ["As a binding limit for every works contract in Nigeria, whatever EKC-05 states",
   "As a minimum, so any contract limit below 10% is raised to it by operation of law",
   "As the content Act's limit, since that Act adopts the World Bank's figures"],
  "The World Bank's Contract Management Practice guidance, taught by concept, describes delay damages as usually subject to an aggregate limit and gives 10% of the contract price as an illustration. It is guidance, and it binds nobody's contract. EKC-05's own stated limit applies. No law raises a contract's limit to the illustration, and the content Act says nothing on delay damages.",
  ['P186'])

q(3,
  "CF-C (synthetic) missed the EKC-03 meal service level twice this month. Ekene also paid CF-C's last two invoices late. Before relying on CF-C's failure, what does a World Bank case study in the Contract Management Practice guidance, taught by concept, suggest?",
  "Ekene checks and puts right its own obligations, timely payment first",
  ["Ekene's late payment is irrelevant, since the service level is the supplier's duty alone",
   "Ekene should end the contract now, before CF-C can raise its late payment in reply",
   "Ekene may hold back the next fee too, since CF-C has already failed the service level"],
  "The World Bank guidance tells of an employer whose own late payments forced a contractor to suspend work, which made termination for the contractor's default indefensible. The lesson is that an employer meets its own obligations, including timely payment, before relying on the contractor's default. Ekene applies EKC-03's service credits as stated and puts its payments right; withholding more or ending the contract would compound its own failure.",
  ['P185'])

q(2,
  "A synthetic Ekene manager studies when a UK authority publishes a contract performance notice for a breach, as the UK guidance on Contract Performance Notices, para 26, describes. Which breaches trigger one?",
  "A breach that has led to partial termination, an award of damages, or a settlement agreement",
  ["Every breach of any kind, however minor, reported on the very day the breach is first noticed",
   "Only a breach that ends in full termination, reported in a separate performance notice of its own",
   "Only a breach that the supplier admits in writing within a set period after it is raised"],
  "The UK guidance on Contract Performance Notices, para 26, with s.71(3) of the UK Procurement Act 2023, says a breach triggers a performance notice only when it has led to partial termination, an award of damages, or a settlement agreement. A breach ending in full termination is reported in the contract termination notice. Minor breaches and admissions are not the triggers. The scheme binds UK authorities; no Ekene contract publishes such notices.",
  ['P071'])

q(0,
  "Under the UK guidance on Contract Performance Notices, para 34, read as the UK scheme, by when is a contract performance notice published?",
  "Within 30 days of the day on which section 71(5) first applies to the breach or failure to perform",
  ["Within 30 days of the contract's award, whether or not there has been any breach at all",
   "Within twelve months of the breach, at the next annual assessment of the supplier's KPIs",
   "Within sixty days of the beginning of the following year, together with the annual performance report"],
  "The UK guidance on Contract Performance Notices, para 34, says the notice is published within 30 days of the day on which section 71(5) first applies to a particular breach or failure to perform. Contract award does not start the clock, the yearly KPI assessment is a separate duty, and sixty days from the start of the year is the content Act's s.60 annual report. The scheme binds UK authorities only.",
  ['P072'])

q(3,
  "A synthetic Ekene analyst reads para 10 of the UK guidance on Contract Performance Notices. What consequence can a published notice have for the supplier?",
  "A discretionary exclusion ground in later procurements, if published within the preceding 5 years and the circumstances continue or are likely to recur",
  ["An automatic ban from every future public contract for life, whatever has happened since the notice appeared",
   "A fine of five per cent of the contract sum, collected by the contracting authority from the next invoice",
   "No consequence at all, since the notice is a private record held only by the authority that published it"],
  "The UK guidance on Contract Performance Notices, para 10, says a published notice creates a discretionary exclusion ground in later procurements, and the supplier is at risk only if the notice was published in the preceding 5 years and the circumstances are continuing or likely to recur. It is discretionary and time-limited, it imposes no fine (five per cent of the project sum is the content Act's s.68 penalty), and the notice is published.",
  ['P073'])

q(0,
  "On EKC-06 (synthetic), IM-F's repeat failures exceeded the KPI for four months; the improvement plan's closure test failed in month four; the contract manager wrote to IM-F on the fifth of the next month saying so. Following the logic of para 36 of the UK guidance on Contract Performance Notices, which date does the file record as the failure to improve?",
  "The date of the letter telling IM-F that improvement had not happened",
  ["The date the first KPI was missed, four months before the closure test",
   "The date the improvement plan was first agreed with IM-F in month two",
   "The date on which IM-F's contract is due to expire under its stated term"],
  "The UK guidance on Contract Performance Notices, para 36, suggests the date that counts for a failure to improve may be when a notice was issued saying improvement had not happened, or that an agreed rectification plan had not been implemented. The contract manager's letter on the fifth is that notice. The first miss and the plan's agreement come before any failure to improve, and the expiry date has nothing to do with it.",
  ['P074'])

q(2,
  "MV-B's (synthetic) vessel on EKC-02 breaks down and is out of service for three days. The charter pays a day rate with off-hire for breakdown. What remedy does Ekene apply first?",
  "Off-hire for the three days, as the charter provides",
  ["A service credit deducted from the month's charter hire",
   "A formal notice ending the charter because of the breakdown",
   "A claim against MV-B's parent for lost production"],
  "The World Bank's Contract Management Practice guidance, taught by concept, reminds that a contract is managed by its own terms, and EKC-02's terms put the vessel off-hire during breakdown, so the day rate is not paid for those days. EKC-02 states no service credit, a single breakdown is far from the last resort of termination, and nothing in the charter points to a claim against the parent.",
  ['P007', 'P076'])
# ---- end of questions ----

emit(Q, '/root/cat-wip-contracts/banks/sc5i_m06.json', expect_n=15)
finish()
