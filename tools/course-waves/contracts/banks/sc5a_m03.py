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

# SC5 Expert m03, Disputes and Their Resolution. 15 questions.
# Lessons: The escalation ladder; Negotiation and mediation; Expert determination and adjudication; Arbitration and the courts.
# Topics: T13.
# Every key rests on a PACK.md passage named in its src list; the
# explanation cites the SOURCE by name and locator (an Act and its section,
# a guidance and its paragraph), never a passage id or a pack section.

q(3, "Ekene's synthetic contract portfolio (EKC-01 to EKC-07) has no written process for handling disputes with suppliers; each contract manager handles them as they arise. What does GovS 008 (version 2.2, issued 1 April 2026), the UK commercial functional standard used as published good practice, expect?",
  "A defined process for handling and resolving commercial or legal disputes, subject to governance controls",
  ["A dispute process written only after the first dispute reaches arbitration, so it reflects real cases",
   "No process at the portfolio level, since each contract's dispute clause is the whole of what is needed",
   "A process run by the supplier, since the supplier is the party that usually raises a dispute on a contract"],
  "GovS 008 (version 2.2), 6.3/6.4, says a process for handling and resolving commercial or legal disputes with suppliers should be defined and subject to governance controls in line with organisational policy. Writing it after the first arbitration comes too late, the contract clause does not replace an organisational process, and the standard gives the buying organisation the task.",
  ['P165'])

q(1, "EKC-03 is the synthetic camp catering contract with CF-C (synthetic). Its dispute clause runs from senior meetings straight to arbitration. A dispute over service credits has started, and the contract manager suggests creating a dispute review expert now by letter. What does the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, say about timing?",
  "The mechanism should be set up on time, since trying to create one after a dispute starts tends to fail",
  ["A review expert can be imposed by either party at any point, since the guidance treats it as a right of the buyer",
   "Timing does not matter, since a review expert is appointed by the arbitrator once arbitration has been started",
   "The mechanism is best created after a dispute starts, when both parties know what the expert has to decide"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), p.36, says alternative dispute resolution may use an adjudicator, a dispute review expert or a dispute review board depending on the contract, and stresses setting it up on time, because trying to create it after a dispute starts tends to fail. The guidance gives neither party a right to impose one, and it is no appointment made inside an arbitration.",
  ['P163'])

q(0, "EKC-05 is the synthetic flowline replacement works contract with FW-E (synthetic). After one inconclusive meeting over a disputed variation, the asset manager wants to start arbitration at once, although the contract's ladder provides a senior representatives' meeting first. What does the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, support?",
  "Treat arbitration and litigation as the last resort, and use the ladder's lower rungs first",
  ["Start arbitration now, since the guidance treats arbitration as the quickest way to settle a variation",
   "Go to court first, since the guidance ranks litigation ahead of arbitration for works contracts",
   "Skip the senior meeting, since a rung of the ladder is optional once one meeting has failed"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), p.35, treats arbitration and litigation as the last resort for resolving a dispute. The contract's own ladder puts a senior meeting next, and a contract is managed according to its own terms (p.1). The guidance ranks neither arbitration nor litigation as the quick first step, and it treats no rung as optional.",
  ['P162', 'P007'])

q(2, "A synthetic Ekene contracts lead asks what the Public Procurement Act 2007 (Act No. 14) says about dispute resolution in procurement contracts. The question is asked on the basis that this Act binds federal procuring entities and serves an operator as published practice. What does s.16(26) provide?",
  "All procurement contracts shall contain provisions for arbitral proceedings as the primary forms of dispute resolution",
  ["All procurement contracts shall send disputes to the Federal High Court as the first forum for any claim a supplier raises",
   "All procurement contracts shall use mediation under the Bureau as the only form of dispute resolution",
   "Procurement contracts may leave dispute resolution out, since the Bureau decides every contract dispute"],
  "The Public Procurement Act 2007, s.16(26), provides that all procurement contracts shall contain provisions for arbitral proceedings as the primary forms of dispute resolution. It binds federal procuring entities; for an operator such as Ekene it is published practice. It names neither the courts nor Bureau mediation as the primary route, and the Bureau's remedies under s.53(4) concern contraventions of that Act, which is a different matter.",
  ['P166'])

q(3, "EKC-07 is the synthetic environmental monitoring consultancy with EM-G (synthetic). In a negotiation over withheld fees, Ekene's site engineer offers EM-G a settlement on the spot. The engineer holds no delegated authority to settle. What does the World Bank Contract Management Practice guidance (Second Edition, 2024), taught by concept, point to?",
  "A contracting decision is valid only when the person taking it holds the authority to take it",
  ["An offer made by any Ekene employee in a meeting binds Ekene, since the supplier cannot check who holds authority",
   "Authority matters only for arbitration, since a negotiated settlement is an informal step with no legal effect",
   "The engineer's offer binds Ekene once EM-G accepts it in writing, whatever the delegations Ekene has in place"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), p.11, asks the contract manager to confirm that each party has its authorisations and delegations in place, because a contracting decision is valid and enforceable only when the person taking it holds the authority. A settlement is a contracting decision, so negotiation proceeds from knowing who holds authority to settle. Acceptance in writing does not supply authority the engineer never held.",
  ['P021'])

q(1, "EKC-01 is the synthetic well services call-off framework with WS-A (synthetic). The framework requires mediation before arbitration, and Ekene wants to start one. Under the Arbitration and Mediation Act 2023 (Nigeria), s.70(1) and (2), how does Ekene begin, and what happens if WS-A does not reply?",
  "Ekene proposes a mediation agreement in writing; with no acceptance within 30 days, or any other time the invitation states, Ekene may treat it as rejected",
  ["Ekene applies to the court for a mediator, and WS-A is bound to attend whatever it replies, since mediation under the framework is compulsory",
   "Ekene may begin by telephone, and a silence of any length counts as acceptance, since the 2023 Act presumes that the other party agrees to mediate",
   "Ekene proposes mediation in writing; with no reply within three months of sending it, the invitation lapses and the framework's arbitration clause falls away"],
  "The Arbitration and Mediation Act 2023 (Nigeria), s.70(1) and (2), has the party concerned propose a mediation agreement in writing where a contract requires mediation first; if no acceptance arrives within 30 days of sending the invitation, or any other time stated in it, the inviting party may treat it as rejected. Section 70 does not have the court appoint a mediator here, silence is no acceptance, and three months is the s.55(4) limit for setting aside an award.",
  ['P170'])

q(2, "EKC-06 is the synthetic instrument maintenance service with IM-F (synthetic). Ekene and IM-F mediate a KPI dispute in Nigeria. Afterwards a manager wants to show the mediator's notes to another supplier as an example. The parties made no agreement on confidentiality. What does the Arbitration and Mediation Act 2023 (Nigeria), s.76, provide?",
  "Everything about the mediation stays confidential, with exceptions only for disclosure required by law, disclosure to implement or enforce the settlement, and disclosure to prevent or reveal a crime or a threat",
  ["The notes become public once the mediation ends, since s.76 protects confidentiality only while the parties are still in the room with the mediator",
   "Either party may share the notes with other suppliers, since s.76 limits only what the mediator may disclose about the matter to third parties",
   "Confidentiality applies only to the settlement figure, since s.76 leaves the notes and the parties' statements open to any use by either party"],
  "The Arbitration and Mediation Act 2023 (Nigeria), s.76, provides that, unless the parties agree otherwise, everything about a mediation stays confidential, with exceptions for disclosure required by law, disclosure needed to implement or enforce the settlement, and disclosure needed to prevent or reveal a crime or a threat to a party. Showing the notes to another supplier fits none of those, and s.76 is neither time-limited, mediator-only nor limited to the figure.",
  ['P172'])

q(0, "EKC-02 is the synthetic platform supply vessel time charter with MV-B (synthetic). A mediation in Nigeria ends with a signed settlement agreement on disputed off-hire. MV-B later says the settlement was only advisory. What does the Arbitration and Mediation Act 2023 (Nigeria), s.82(2), provide?",
  "The settlement agreement is binding and enforceable in court as a contract, consent judgment or consent award",
  ["The settlement agreement is advisory until an arbitral tribunal confirms it in an award",
   "The settlement agreement binds MV-B only if the mediator also signs it as a party to the terms the parties reached",
   "The settlement agreement binds the parties for 30 days, after which either party may walk away from what it agreed"],
  "The Arbitration and Mediation Act 2023 (Nigeria), s.82(2), states that the settlement agreement resulting from the mediation is binding on the parties and enforceable in Court as a contract, consent judgment or consent award. It needs no arbitral confirmation, no signature by the mediator, and has no time limit; 30 days belongs to the s.70 rule on unanswered invitations.",
  ['P173'])

q(3, "A synthetic Ekene team studies a World Bank financed project elsewhere as a model for dispute clauses. On the World Bank Procurement Regulations for IPF Borrowers (Seventh Edition, September 2025), taught by concept, what do contracts under international competitive procurement on Bank-financed projects include?",
  "The applicable law and forum, independent dispute resolution through dispute review experts or boards, and normally international commercial arbitration in a neutral venue",
  ["A clause sending every dispute to the courts of the borrower's capital, since the Regulations rule out arbitration for Bank-financed contracts of any kind",
   "Mediation under the Bank's own rules as the final step, since the Regulations make every dispute on a Bank-financed contract end in mediation",
   "Nothing on disputes, since the Regulations leave the dispute clause to the borrower and the contractor to agree after the contract is signed"],
  "The World Bank Regulations, Annex IX paras 2.24 to 2.25, require such contracts to state the applicable law and forum, to include independent dispute resolution through Dispute Review Experts or Dispute Review Boards, and normally to provide international commercial arbitration in a neutral venue. That is a rule for Bank-financed contracts; for Ekene it is a published model, and the Regulations rule out none of the steps the distractors deny.",
  ['P164'])

q(1, "EKC-04 is the synthetic casing and tubulars frame agreement with TB-D (synthetic). Its dispute clause names an expert for technical questions. Before relying on it, the contract manager lists what to read in the clause. Which list matches the course's reading of the sources?",
  "Who decides and how they are appointed, which questions they decide, whether the decision binds, and what a party must do and by when to go further",
  ["Only the expert's fee, since the rest of the decision's force is set by the Arbitration and Mediation Act 2023 whatever the signed clause itself says",
   "Only the seat of arbitration, since an expert's decision is in every case a step inside an arbitration and follows the tribunal's rules",
   "Nothing in the clause, since the World Bank guidance fixes how an expert is appointed and whether the decision binds on any contract"],
  "The World Bank Contract Management Practice guidance (Second Edition, 2024), p.36, describes experts, adjudicators and boards as mechanisms whose use depends on the contract, and the same guidance reminds its reader that a contract is managed according to its own terms (p.1). So the force of the decision is read from the signed clause: who decides, on what, with what effect, and what follows. No Act or guidance fixes those points for an Ekene clause.",
  ['P163', 'P007'])

q(2, "EKC-07 is the synthetic environmental monitoring consultancy with EM-G (synthetic). Its arbitration clause is seated in Nigeria. A new contract manager asks what the arbitration Part of the Arbitration and Mediation Act 2023 (Nigeria) is for. What does s.1(1) state as its objective?",
  "To promote fair resolution of disputes by an impartial tribunal without unnecessary delay or expense",
  ["To guarantee that the operator's view prevails wherever it holds the contract's records",
   "To replace every step of the contract's dispute ladder with a single court hearing in Nigeria",
   "To make every arbitration public, so that suppliers across the industry can learn from each other's cases"],
  "The Arbitration and Mediation Act 2023 (Nigeria), s.1(1), states that the objective of the Part is to promote fair resolution of disputes by an impartial tribunal without unnecessary delay or expense. It favours neither party, replaces no step of a contract's ladder, and says nothing about making arbitrations public.",
  ['P167'])

q(0, "EKC-04 is the synthetic casing and tubulars frame agreement with TB-D (synthetic), which contains an arbitration clause seated in Nigeria. TB-D sues Ekene in court over late-delivery deductions. Ekene's lawyers ask when Ekene must ask the court to refer the matter to arbitration. What does the Arbitration and Mediation Act 2023 (Nigeria), s.5(1), provide?",
  "The court must refer the parties to arbitration if Ekene asks no later than its first statement on the substance, unless the agreement is void, inoperative or incapable of being performed",
  ["The court may refer the parties to arbitration at any time before judgment, whenever Ekene asks, since the arbitration clause survives any step Ekene takes in the court case",
   "The court must hear the case once it is filed, since an arbitration clause gives way to any suit a supplier brings first, whatever the clause provides on where disputes go",
   "The court must refer the matter to mediation first, since s.5(1) makes mediation compulsory before a court may consider whether an arbitration clause applies to a suit"],
  "The Arbitration and Mediation Act 2023 (Nigeria), s.5(1), requires the court to refer the parties to arbitration when a party asks no later than its first statement on the substance of the dispute, unless the court finds the agreement void, inoperative or incapable of being performed. The request has a deadline, the clause does not give way to the suit, and s.5(1) says nothing about compulsory mediation.",
  ['P168'])

q(3, "EKC-02 is the synthetic platform supply vessel time charter with MV-B (synthetic). Its arbitration clause is seated in Nigeria and says nothing about the number of arbitrators, and the parties have not agreed a number since. How is the tribunal made up under the Arbitration and Mediation Act 2023 (Nigeria), s.6(2)?",
  "It consists of a sole arbitrator",
  ["It consists of three arbitrators, one named by each party",
   "It consists of as many arbitrators as the court appoints",
   "It cannot be formed until the parties agree on a number"],
  "The Arbitration and Mediation Act 2023 (Nigeria), s.6(2), provides that where there is no agreement as to the number of arbitrators, the arbitral tribunal shall consist of a sole arbitrator. Section 6(2) supplies the default, so the tribunal can be formed without a further agreement, and it names neither a panel of three nor a number set by the court.",
  ['P169'])

q(1, "EKC-06 is the synthetic instrument maintenance service with IM-F (synthetic). An arbitral award in a dispute seated in Nigeria goes against Ekene, and Ekene's lawyers consider applying to set it aside. By when must the application be made, under the Arbitration and Mediation Act 2023 (Nigeria), s.55(4)?",
  "No later than three months from the date on which Ekene received the award",
  ["No later than 30 days from the date on which the tribunal signed the award",
   "At any time before IM-F applies to the court to enforce the award against Ekene",
   "No later than three months from the date of the hearing that decided the dispute"],
  "The Arbitration and Mediation Act 2023 (Nigeria), s.55(4), provides that an application for setting aside shall not be made after three months have elapsed from the date on which the party making it received the award. The clock runs from receipt; 30 days belongs to the s.70 mediation invitation, and s.55(4) ties the limit to neither enforcement nor the date of the hearing.",
  ['P174'])

q(2, "EKC-06 is the synthetic instrument maintenance service with IM-F (synthetic). A tribunal seated in Nigeria has made an award in Ekene's favour over repeat-failure deductions, and IM-F has not paid what the award orders. Ekene's lawyers ask how the award can be turned into something the court will act on. What do s.57(1) and (3) of the Arbitration and Mediation Act 2023 (Nigeria) allow?",
  "On written application the Court enforces the award, and with its leave the award may be enforced in the same way as a judgment or order",
  ["A fresh suit on the contract alone, since an award has no force until a court has tried the whole dispute again",
   "Only a complaint to the Bureau of Public Procurement, which collects sums that tribunals award to operators",
   "Nothing short of a second arbitration, since the first tribunal's award binds IM-F once a second tribunal has confirmed it"],
  "The Arbitration and Mediation Act 2023 (Nigeria), s.57(1) and (3), recognises an arbitral award as binding and has the Court enforce it on written application; with the Court's leave it may be enforced in the same manner as a judgment or order. The award needs no retrial, no second tribunal and no role for the Bureau.",
  ['P175'])

emit(Q, '/root/cat-wip-contracts/banks/sc5a_m03.json', expect_n=15)
finish()
