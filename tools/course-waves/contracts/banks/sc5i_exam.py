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

# SC5 Professional final exam. 42 scenario questions, seven drawn from the material
# of each module, each on a fact the module banks do not key. Passing it at
# the existing pass mark issues the Professional certificate.
# Topics: T04, T05, T06, T07, T08, T09, T10, T14.
# Every key rests on a PACK.md passage named in its src list; the
# explanation cites the SOURCE by name and locator (an Act and its section,
# a guidance and its paragraph), never a passage id or a pack section.
# ---- questions (Professional bank writer) ----
# From module 1, segmenting suppliers.
q(2,
  "Ekene (synthetic) spends a large sum each year on EKC-03, camp catering and facility services from CF-C, and many capable caterers work in the region. Using Kraljic's portfolio idea, taught by concept, which group fits the catering?",
  "Leverage: a real effect on the result, bought in a market where many suppliers compete",
  ["Bottleneck: little effect on the result, with a supply that is hard to secure in the region",
   "Strategic: any service with a large annual spend is strategic whatever its supply market",
   "Non-critical: a camp service never affects the result, however much is spent on it"],
  "In Kraljic's portfolio idea a leverage item matters to the result and many suppliers compete for it, which fits a large catering spend in a market with many capable caterers. A bottleneck needs a hard supply, a strategic item needs a difficult supply market as well as a strong effect, and a large spend is more than a non-critical item carries.",
  ['P056'])

q(0,
  "EKC-01, the synthetic Ekene well services framework with WS-A, is high in cost, and few suppliers in the region can provide coiled tubing and nitrogen on call. In the World Bank's supply positioning model (PPSD guidance, Fourth Edition, August 2025), taught by concept, which quadrant fits?",
  "Strategic Critical: high cost with few suppliers",
  ["Tactical Advantage: high cost and low risk, with many suppliers",
   "Tactical Acquisition: routine and low value, with many suppliers",
   "Strategic Security: low cost, yet strategically important"],
  "The World Bank's supply positioning model names four quadrants: Strategic Critical (high cost, few suppliers), Strategic Security (low cost and strategically important), Tactical Acquisition (routine and low value, with many suppliers) and Tactical Advantage (high cost and low risk, with many suppliers). High cost with few suppliers is Strategic Critical; each other quadrant needs many suppliers or a low cost.",
  ['P058'])

q(3,
  "EKC-07, EM-G's environmental monitoring consultancy (synthetic), costs little each year, yet Ekene cannot operate without the quarterly sampling it delivers. In the World Bank's supply positioning model, taught by concept, which quadrant describes it?",
  "Strategic Security",
  ["Tactical Acquisition, since its annual cost is low",
   "Strategic Critical, since every monitoring job is costly",
   "Tactical Advantage, since many consultancies compete"],
  "The World Bank PPSD guidance describes Strategic Security as low cost and strategically important, which fits a cheap consultancy that the operation relies on. Tactical Acquisition is routine and low value with many suppliers, Strategic Critical is high cost with few suppliers, and Tactical Advantage is high cost and low risk. Low cost alone does not make a contract tactical.",
  ['P058'])

q(1,
  "The Ekene team (synthetic) places EKC-03, CF-C's catering, and EKC-07, EM-G's monitoring, in its non-critical segment. The camp manager asks whether that means CF-C's service levels can be relaxed. What follows from the segment, as GovS 008 (version 2.2), clause 6.2, and the World Bank's Contract Management Practice guidance frame it?",
  "Lighter relationship work, while each contract's own terms, service credits included, are still applied in full",
  ["No management at all, so service levels and service credits are set aside for non-critical suppliers",
   "A move to the strategic segment, since any supplier with service levels is strategic by definition",
   "A renegotiation of each contract, since a non-critical label changes the terms on which it was signed"],
  "GovS 008 at 6.2 accepts that some suppliers need no relationship management, and the World Bank's Contract Management Practice guidance, taught by concept, reminds that a contract is managed by its own terms. A non-critical segment reduces relationship work; it leaves the service levels and credits exactly as the contract states. Having service levels does not make a supplier strategic, and a segment does not reopen a contract.",
  ['P062', 'P007'])

q(0,
  "Ekene (synthetic) wants WS-A to give its best crews to EKC-01 call-offs. The contract owner proposes sharing a forward view of planned well work at each quarterly review. Using supplier preferencing from the World Bank's PPSD guidance, taught by concept, why might that help?",
  "A buyer the supplier sees as core or worth developing tends to receive more effort from it",
  ["A forward view obliges WS-A under the framework to hold its best crews for Ekene alone",
   "Sharing plans moves Ekene into the supplier's nuisance segment, which always carries top priority",
   "Supplier preferencing ranks buyers only by their KPIs, so plans make no difference"],
  "Supplier preferencing places the buyer in the Development, Core, Nuisance or Exploitable segment by the value and attractiveness of its business to the supplier, and a buyer seen as core or worth developing tends to get more effort. A forward view makes Ekene's business more attractive without changing the framework's terms. A nuisance account gets the least attention, and the tool does not rank buyers by KPIs.",
  ['P059'])

q(2,
  "The Ekene contract team (synthetic) judges the spend on EKC-04, TB-D's casing frame agreement, to be high, and TB-D is the only supplier qualified for a premium connection the wells use. Using Kraljic's portfolio idea, which group does the team place EKC-04 in?",
  "Strategic: a strong effect on the result and a difficult supply market",
  ["Leverage: high spend, so buying power alone settles the relationship",
   "Non-critical: casing is a standard product that any mill can make",
   "Bottleneck: a difficult supply market with only a small effect on the result"],
  "In Kraljic's portfolio idea a strategic item matters a great deal to the result and comes from a difficult supply market. With a high spend and a single qualified source, EKC-04 is strategic; a team that judged the spend small could place it as bottleneck and would record that reason. Leverage assumes many competing suppliers, and a premium connection with one qualified source is not a standard product.",
  ['P056'])

q(1,
  "Ekene (synthetic) also buys large volumes of standard diesel from a market with many suppliers and little supply risk. In the World Bank's supply positioning model, taught by concept, where does that purchase sit?",
  "Tactical Advantage: high cost and low risk, with many suppliers",
  ["Strategic Critical: high cost, so it belongs with the few-supplier purchases",
   "Strategic Security: strategically important, because the fuel is used every day",
   "Tactical Acquisition: routine buying, so its high cost does not matter at all"],
  "The World Bank PPSD guidance describes Tactical Advantage as high cost and low risk, with many suppliers, which fits a large diesel spend in a competitive market. Strategic Critical needs few suppliers, Strategic Security is low cost, and Tactical Acquisition is routine and low value. The model places each purchase by both its supply risk and its value.",
  ['P058'])

# From module 2, supplier performance reviews.
q(3,
  "EKC-07, the synthetic Ekene monitoring consultancy, reaches its end date next month. Borrowing the UK guidance on Key Performance Indicators, para 14, as practice, what assessment should the contract team plan now?",
  "A final assessment of EM-G's performance against the KPIs when the contract ends",
  ["None, because a contract that is ending needs no further performance assessment",
   "A new tender for the monitoring, which replaces any assessment of the ending contract",
   "An assessment published by the Board, since the contract is in the oil and gas industry"],
  "The UK guidance on Key Performance Indicators, para 14, asks for an assessment at least once in every twelve month period during the contract and on termination. Read as practice for Ekene, that means a closing assessment as the contract ends. An ending contract still needs one, a new tender is a separate decision, and the Board does not publish assessments of Ekene's contracts.",
  ['P038'])

q(2,
  "Ekene's scorecard for EKC-02 (synthetic) borrows the UK KPI ratings. MV-B's vessel availability is just short of the charter's service level this quarter and closing on it. Which of the five UK ratings fits best?",
  "Approaching target",
  ["Inadequate, since any miss is a failure",
   "Good, since the gap is small this quarter",
   "Other, since availability is not a KPI"],
  "Just short of the level and closing on it is what the UK guidance on Key Performance Indicators, para 15, calls Approaching target. Inadequate is kept for results significantly below the KPI, Good is for meeting or beating it, and vessel availability is the charter's stated service level, so a named rating fits. Ekene borrows the scale as practice.",
  ['P039'])

q(0,
  "An Ekene manager (synthetic) asks what the World Bank Procurement Regulations (Seventh Edition, September 2025), taught by concept, say key performance indicators are for when a contract needs them. Which answer fits Annex XI?",
  "To confirm that the contractor performs satisfactorily and meets the contract's requirements",
  ["To set the contract price, since payment follows the score on each KPI every month",
   "To replace the contract's specification, since KPIs describe the whole of the service",
   "To rank the supplier against its competitors for the next Bank-financed tender"],
  "The World Bank Procurement Regulations, Annex XI para 2.4, taught by concept, set key performance indicators where they are needed to confirm that the contractor performs satisfactorily and meets the requirements of the contract. KPIs do not set the price or replace the specification, and ranking suppliers for the next tender is a procurement question for another course.",
  ['P043'])

q(3,
  "Ekene (synthetic) is preparing the contract management plan for EKC-05, the flowline works, on the model the World Bank Procurement Regulations describe for contracts their procurement strategy identifies. Under Annex I para 3.7, taught by concept, what does that plan set?",
  "Key performance indicators and milestone events",
  ["The bid evaluation criteria and their relative weights",
   "The operator's annual Nigerian content report",
   "The Board's approval of the project's plan"],
  "The World Bank Procurement Regulations, Annex I para 3.7, taught by concept, have the borrower prepare a contract management plan setting key performance indicators and milestone events for the contracts its strategy identifies. Evaluation criteria belong to the tender, the annual content report is the operator's duty under the content Act, s.60, and the Board's certificate relates to the Nigerian Content Plan.",
  ['P019'])

q(1,
  "At the EKC-01 review (synthetic), WS-A and Ekene cannot agree whether a delay was caused by WS-A's equipment or by Ekene's late well handover. How should the minutes record the point, following the World Bank's Contract Management Practice guidance on what to record?",
  "As a point still disputed, with both parties' views, the dates and who took part",
  ["As agreed in Ekene's favour, since the operator writes and keeps the review minutes",
   "Left out of the minutes entirely until the parties have reached agreement",
   "As agreed in WS-A's favour, since the supplier raised the point first"],
  "The World Bank guidance, taught by concept, asks the contract manager to record performance, every communication and notice, the dates and who was involved. A disagreement is part of that record, so the minutes carry both views. Recording one side's view as agreed misstates what happened, and leaving it out loses the record the next step may need.",
  ['P160'])

q(2,
  "CF-C (synthetic) agrees an improvement plan on EKC-03 after failing cleanliness audits, and asks Ekene to waive the service credits for the missed months while the plan runs. What do the sources support?",
  "The credits for the missed months apply as the contract states, and the plan runs alongside them",
  ["The credits are waived, since an agreed plan replaces the remedy that the contract gives for a missed level",
   "The credits are doubled, since a supplier on a plan has shown that its failure is deliberate",
   "The credits are held back until the plan's checkpoint and cancelled if CF-C passes the test"],
  "The World Bank's Contract Management Practice guidance, taught by concept, reminds that a contract is managed by its own terms, and EKC-03's terms deduct a credit when a level is missed. An improvement plan addresses the cause of the failure and does not remove the remedy for months already missed. Doubling or cancelling credits would depart from the contract.",
  ['P007', 'P042'])

q(0,
  "After the fourth quarterly review of EKC-01 (synthetic), the Ekene contract owner holds a yearly look at whether the framework still buys what the operation needs. Which World Bank expectation, taught by concept, does that step serve?",
  "Evaluation, the stage of systematic management that looks back at whether the contract works",
  ["That the Bank gives prior review to every framework before its second year begins",
   "That each framework is re-tendered at the end of every year of its operation",
   "That performance is published each year on the Bank's central digital platform"],
  "Annex XI para 2.1 of the World Bank Procurement Regulations, taught by concept, asks for contract management that runs as a system from planning through to evaluation. The owner's yearly look is where the evaluating happens. Nothing in the Regulations calls for a yearly prior review or re-tender of a framework, and a central digital platform is a feature of the UK regime.",
  ['P009'])

# From module 3, variations and change control.
q(3,
  "Under the UK guidance on Contract Modifications, one ground treats a change as non-substantial. By how much may such a change lengthen or shorten the term?",
  "By no more than 10% of the maximum term provided at award",
  ["By no more than 50% of the term, if the change was unforeseeable",
   "By no more than 15% for works and 10% for goods or services",
   "By any amount, provided the supplier's profit stays the same"],
  "The UK guidance on Contract Modifications, ground 1 (s.74(1)(b) and s.74(3)), treats a change as non-substantial if it does not lengthen or shorten the term by more than 10% of the maximum term provided at award, does not materially change the scope, and does not shift the economic balance toward the supplier. Fifty per cent is the unforeseeable circumstances value cap, 10% and 15% of value are the below-threshold limits, and the term limit applies whatever happens to profit. It is UK law, read as practice for Ekene.",
  ['P080'])

q(1,
  "A synthetic Ekene analyst studies the UK unforeseeable circumstances ground in the UK guidance on Contract Modifications (Schedule 8, paragraph 4). Which conditions does it set?",
  "Circumstances not reasonably foreseeable before award, the overall nature unchanged, and a value rise of no more than 50% outside utilities",
  ["Any circumstances the supplier did not price, with no limit on the value rise and no check on the nature",
   "Circumstances foreseen at award but left out of the contract, with a value rise capped at 15 percent",
   "Circumstances the Board declares unforeseeable, with a value rise capped at ten per cent of the sum"],
  "The UK guidance on Contract Modifications, ground 5, allows a modification for unforeseeable circumstances when they could not reasonably have been foreseen before award, the overall nature of the contract stays the same, and the estimated value rises by no more than 50%, a cap that does not apply to utilities contracts. Unpriced risks, foreseen omissions and Board declarations are not the test. The ground binds UK authorities only.",
  ['P082'])

q(2,
  "Ekene (synthetic) is drafting the contract management plan for EKC-06 on the model of the World Bank Procurement Regulations, Annex XI para 3.1, taught by concept. Which items does that model list among a plan's usual contents?",
  "Variation and change control, and record keeping",
  ["The bid evaluation report and all its scoring sheets",
   "The Board's certificate for the content plan",
   "The supplier's audited accounts for the last three years"],
  "The World Bank Procurement Regulations, Annex XI para 3.1, taught by concept, list among the usual contents of a contract management plan risks and mitigation, roles and authorisations, reporting, key terms, milestones and payment, deliverables kept up to date for change orders, KPIs, variation and change control, and record keeping. The evaluation report belongs to the tender, the Board's certificate to the operator's plan, and accounts to financial monitoring.",
  ['P020'])

q(0,
  "The Ekene contract manager (synthetic) rejects a change request from MV-B on EKC-02 because the work was already within the charter. A colleague suggests deleting the request from the change register to keep it tidy. What does GovS 008 (version 2.2), clause 5.4.5, read as practice, support?",
  "Keeping the rejected request in the register with its reason, as evidence retained for later disputes",
  ["Deleting it, since a register holds only the changes that were approved and then instructed",
   "Moving it to MV-B's own files, since the supplier raised it and so holds the record of it",
   "Replacing it with an approved entry, so that the register does not show that any request was ever refused"],
  "GovS 008 at 5.4.5 expects change control to give an audit trail in a change register and to retain evidence for later procurement or disputes. A rejected request kept with its reason shows it was considered and why it was refused if MV-B raises it again. Deleting it, handing it to the supplier or disguising it breaks the audit trail.",
  ['P078'])

q(3,
  "On EKC-07 (synthetic), each of four one-well changes looked small, and only when they were added together did the contract owner see their size. Which column of the change register, kept as GovS 008 (version 2.2), clause 5.4.5, expects, shows that pattern?",
  "The cumulative total",
  ["The date each change was raised",
   "The name of each change's approver",
   "The supplier's reference number"],
  "GovS 008 at 5.4.5 expects an audit trail in a change register, and a running total of each change added to all earlier ones is the column that reveals slicing of the kind the UK guidance on Contract Modifications, para 15, warns against. Dates, approvers and references matter to the trail, yet none of them shows the size of the changes together.",
  ['P078', 'P083'])

q(2,
  "Over a year, the contract owner approves six variations to EKC-05 (synthetic), each assessed and justified. What does the World Bank's Contract Management Practice guidance, taught by concept, expect the contract manager to do with the increases granted?",
  "Track and control every increase granted, so the contract's cost growth stays in view",
  ["Nothing further once each one is approved, since the approval ends the contract manager's part",
   "Leave cost tracking to FW-E, since a lump sum makes cost the contractor's affair",
   "Report them to the Board, since every variation needs the Board's approval first"],
  "The World Bank guidance expects the contract manager to track and control every increase that is granted, besides seeing that each request is justified. Approval does not end the manager's part, a lump sum does not hand the operator's cost control to the contractor, and the Board does not approve individual variations.",
  ['P088'])

q(1,
  "Under the UK Procurement Act 2023 regime, as the UK guidance on Contract Modifications, para 8, describes it, what extra step follows a change needing a contract change notice on a contract worth more than £5 million including the change?",
  "Publication of the modification or of the contract as modified, subject to listed exemptions",
  ["A new procurement for the whole contract, since any change above £5 million is prohibited outright",
   "Approval of the change by the Bureau of Public Procurement before it is implemented",
   "A payment of one per cent of the change's value into a fund held by the authority"],
  "The UK guidance on Contract Modifications, para 8, says that where a change needs a contract change notice and the contract is worth more than £5 million including the change, the UK Act also requires publication of the modification or of the contract as modified, subject to listed exemptions. A permitted change needs no new procurement, the Bureau is a Nigerian body, and no fund payment attaches to a UK modification.",
  ['P085'])

# From module 4, supplier risk and resilience.
q(0,
  "Ekene (synthetic) is drafting financial distress terms for a future works contract like EKC-05, following the UK guidance note on economic and financial standing (2026 edition). How often does that note recommend the supplier's board confirmation for works contracts?",
  "Six monthly",
  ["Every two years",
   "Only at award",
   "At completion only"],
  "The UK guidance note, paras 4.6.1 to 4.6.2, says boards of suppliers of critical service contracts give an annual written confirmation, and recommends that for works contracts and public sector dependent suppliers under closer monitoring the confirmation be six monthly. A two-year cycle, a single confirmation at award or one at completion would leave the works unwatched while they run.",
  ['P094'])

q(3,
  "MV-B (synthetic) has begun selling its EKC-02 invoices to a factoring company and asks Ekene to renegotiate the charter's payment terms. Which reading of the UK Corporate Financial Distress guidance note (2025 edition) fits?",
  "Both are non-financial warning signs of possible distress, to be recorded and looked into",
  ["Both are routine business practice, with no bearing on MV-B's financial health",
   "Both prove MV-B is insolvent, so the charter is ended the same week",
   "Both are claims under the charter, to be assessed for more money or time"],
  "The UK Corporate Financial Distress guidance note, section 2.3.2 and Appendix 1, lists invoice discounting or factoring and suppliers seeking to renegotiate contract terms among the non-financial signs of distress. They are warning signs to record, date and pass to the contract owner, and they prove nothing on their own. A request to change payment terms is not a claim for time or money under the charter.",
  ['P096'])

q(1,
  "Ekene's continuity plan for EKC-04 (synthetic) was written a year ago, when TB-D was the only qualified source. A second mill has now qualified the premium connection. What do the sources support?",
  "Review the plan now, since plans kept with the risk register are revisited when the facts change",
  ["Leave the plan as written, since it is reviewed only at the contract's end",
   "Delete the plan, since a second qualified mill removes all supply risk",
   "Ask TB-D to update the plan, since the supplier owns the operator's plans"],
  "The World Bank's Contract Management Practice guidance, taught by concept, expects the risk register to be reviewed regularly while the contract runs, and a continuity plan is reviewed with it and whenever the facts change. A second qualified source changes the answer to what stops and what Ekene can do. Waiting for the end, deleting the plan or handing it to the supplier all leave the record out of date.",
  ['P099'])

q(2,
  "WS-A (synthetic) tells Ekene it will hand the nitrogen part of EKC-01 call-offs to a new sub-contractor next month. Among the protections the Sourcing Playbook (June 2023), Chapter 5, lists, which one bears on this?",
  "Approval of key sub-contractors, if the framework includes it",
  ["Step-in rights, which let Ekene take over and run WS-A's business",
   "Assignment, which moves the whole framework across to the new firm",
   "Resolution planning, which applies to any sub-contract"],
  "The Sourcing Playbook, Chapter 5, lists step-in rights, the approval of key sub-contractors, and assignment and novation provisions as protections against supply chain risk. A new sub-contractor for part of the service is a question of sub-contractor approval, which EKC-01 gives Ekene only if its terms include it. Step-in, assignment and resolution planning address different events.",
  ['P187'])

q(0,
  "A contractor on the synthetic Ekene flowline project ignores the Nigerian content plan in its contract. Under the content Act, s.68, what can follow for a contractor who carries out a project contrary to that Act, besides a fine?",
  "Cancellation of the project, the alternative that s.68 states",
  ["Debarment from all public procurement, as the Bureau orders",
   "Loss of the operator's licence under the content Act, s.68",
   "Nothing more, since s.68 names only operators, leaving contractors out"],
  "Section 68 of the content Act (Act No. 2 of 2010) sets two outcomes on conviction for a project run contrary to that Act: the fine measured on the project sum, or the project's cancellation. It reaches contractors and sub-contractors as well as operators. Debarment belongs to the Public Procurement Act 2007 regime for public bodies, and licences are outside what s.68 addresses.",
  ['P133'])

q(3,
  "EKC-02 (synthetic) was signed before Ekene adopted resolution planning practice, and it contains no term requiring resolution information. The charter is critical. What can the contract manager do now?",
  "Ask MV-B for the information anyway and record its answer",
  ["Require it by letter, which then binds MV-B from that date onward",
   "Suspend the day rate until MV-B provides all of the information",
   "Do nothing, since the charter cannot be managed further"],
  "The UK Resolution Planning guidance note describes contracts that require corporate resolution planning information and an insolvency continuity plan; the World Bank's Contract Management Practice guidance, taught by concept, reminds that a contract is managed by its own terms. EKC-02 holds no such term, so the manager can ask and record the answer, but cannot impose it by letter or withhold payment the charter does not allow.",
  ['P097', 'P007'])

q(2,
  "The synthetic Ekene team records that EKC-07 depends on EM-G's single named key person. Where does that dependency risk go, following the World Bank's Contract Management Practice guidance, taught by concept?",
  "Into the contract's risk register, with an owner and a review date, reviewed while the contract runs",
  ["Into EM-G's own files alone, since the key person is employed by the consultancy",
   "Nowhere until the key person actually leaves, since a risk that has not yet happened needs no entry at all",
   "Into the change register, since any risk to a named person is a change to the scope of the whole contract"],
  "The World Bank guidance expects the contract manager to review the risk register regularly while the contract runs, and a supplier's dependency on one person belongs in it with an owner and a review date. Leaving it with EM-G hides it from Ekene, waiting for the loss defeats the purpose of a register, and a risk is not a change to scope.",
  ['P099'])

# From module 5, Nigerian content obligations in depth.
q(1,
  "In one quarter Ekene (synthetic) awards EKC-05 and several purchase orders, some above $1,000,000 (USD). Under the content Act, s.24(1), what does the operator submit to the Board, and by when?",
  "A listing of contracts, subcontracts and purchase orders above that limit awarded in the quarter, within 30 days of its end",
  ["The annual Nigerian Content Performance Report, within sixty days of the beginning of the following year",
   "A new Nigerian Content Plan for each contract awarded, before any of the work in the quarter begins",
   "A copy of every contract signed in the quarter, whatever its value, at the next monitoring visit"],
  "The content Act, s.24(1), requires the operator to submit to the Board, within 30 days at the end of each quarter, a listing of all contracts, subcontracts and purchase orders exceeding $1,000,000 (USD), or such other limit as the Board may determine, awarded in the previous quarter. The annual report under s.60 and the plan under s.7 are separate duties, and the section asks for a listing above the limit.",
  ['P109'])

q(3,
  "NCDMB staff tell Ekene (synthetic) they will examine the figures in the yearly performance report Ekene filed. What role does s.62 of the content Act give them?",
  "Regular assessment and verification of the reports that operators file",
  ["Accepting each report as filed, with no power at all to check its figures",
   "Rewriting each report itself from the operator's accounting records",
   "Checking reports only when a contractor complains about how the operator acts"],
  "The content Act, s.62, says the Board shall undertake regular assessment and verification of the Nigerian Content Performance Report filed by all operators. It is not a passive recipient, it does not write the reports, and its checks are regular. The operator keeps the records that let each figure survive that verification.",
  ['P129'])

q(0,
  "The Board's designated agent asks FW-E (synthetic) for access to its fabrication yard and to the timesheets behind the EKC-05 content figures. FW-E says it answers only to Ekene. Under the content Act, s.64, what is the position?",
  "Operators and contractors provide the Board or its agent with access to facilities and supporting documents",
  ["FW-E may refuse, since only the operator deals with the Board under the content Act",
   "FW-E may refuse unless Ekene first agrees to pay for the agent's time on site",
   "FW-E need only send a summary, since its timesheets are commercially confidential"],
  "The content Act, s.64, requires all operators and contractors to provide the Board or its designated agent with access to their facilities and all documentation and information required for substantiating the Nigerian content reported. It names contractors directly, sets no condition of payment, and asks for the documents behind the figures, which a summary does not provide.",
  ['P130'])

q(2,
  "EKC-06 (synthetic) brings a new analyser calibration method to Ekene, and the operator is preparing its technology transfer submission to the Board. Under the content Act, s.44, how often does the operator submit that plan?",
  "Annually, setting out planned initiatives for transferring technologies to Nigerian people and companies",
  ["Once only, when the Nigerian Content Plan is submitted in the bidding for the licence, permit or interest",
   "Quarterly, together with the employment and training report the operator files against its plan each quarter",
   "Only when a contractor asks, since technology transfer is a matter for the contractor alone"],
  "The content Act, s.44, requires the operator to submit to the Board annually a plan, satisfactory to the Board, setting out planned initiatives to promote the effective transfer of technologies from the operator and alliance partners to Nigerian individuals and companies. It is not a one-off, it is separate from the quarterly employment and training report under s.29, and the duty is the operator's.",
  ['P121'])

q(1,
  "IM-F (synthetic) asks why Ekene treats the training of Nigerian technicians as part of Nigerian content, when it only wanted to count Nigerian staff. Which wording in the content Act, s.106, explains it?",
  "Nigerian content is value added through the systematic development of capacity and capabilities",
  ["Nigerian content is the number of Nigerian staff on a contract on a given date",
   "Nigerian content is the share of a contract paid to companies with a Lagos address",
   "Nigerian content is the tonnage of steel bought from mills located in Nigeria"],
  "The content Act, s.106, defines Nigerian Content as the quantum of composite value added to or created in the Nigerian economy by a systematic development of capacity and capabilities through the deliberate utilisation of Nigerian human, material resources and services. Developing capacity is why training counts. A head count, an address or a tonnage is one measure at most and none of them is the definition.",
  ['P135'])

q(3,
  "At award of EKC-05 (synthetic), Ekene and FW-E record the Nigerian content targets agreed for the execution phase, as NCDMB's guidelines for its approvals of contracting processes (2025 update) describe. What follows once the contract is performed and the commitments are met?",
  "A Nigerian Content Compliance Certificate",
  ["A Certificate of Authorization for a new project",
   "A registration on the Joint Qualification System",
   "A refund of the one per cent Fund deduction"],
  "NCDMB's guidelines for approvals of contracting processes (2025 update) add a Nigerian Content Compliance Commitment at award recording the execution targets, and a Nigerian Content Compliance Certificate is issued by the Monitoring and Evaluation Directorate once the contract is performed and the commitments are met. The Certificate of Authorization follows the Board's review of a Nigerian Content Plan under the content Act, ss.8 and 9, registration is a qualification step, and no text describes any refund of the Fund deduction.",
  ['P137'])

q(0,
  "TB-D (synthetic) supplies casing under EKC-04. The contract manager is asked where the minimum Nigerian content for a particular project item or product comes from. Under the content Act, s.11(3), what is the source?",
  "The schedule to the content Act, which sets the minimum for each item, service or product specification",
  ["The Board's annual circular, which replaces the schedule each year for every product category",
   "The operator's own policy, since the content Act leaves minimum content levels to each company to decide",
   "The UK Sourcing Playbook, which sets content minimums for goods bought by public bodies"],
  "The content Act, s.11(3), requires all operators, alliance partners and contractors to comply with the minimum Nigerian content for a particular project item, service or product specification set out in the schedule to the content Act. The level is not left to each company, no annual circular is described as replacing the schedule, and the UK Playbook sets no Nigerian content levels.",
  ['P106'])

# From module 6, poor performance and remedies.
q(2,
  "FW-E (synthetic) is late on EKC-05 and the delay damages have reached the aggregate limit the contract states. An Ekene manager says the contract must now be ended. What does the World Bank's Contract Management Practice guidance, taught by concept, say about reaching that limit?",
  "It usually permits termination, though continuing with the contractor may still be the better option",
  ["It requires termination at once, since damages above the limit cannot then be deducted by the employer",
   "It resets the damages to zero, so that the employer starts deducting them again from the next milestone",
   "It removes every other remedy, so the performance security is barred from being called by Ekene"],
  "The World Bank guidance describes delay damages with an aggregate limit and says reaching the limit usually permits termination, though continuing may still be the better option. It permits and does not require. Nothing resets the damages, and reaching the limit does not remove the other remedies the contract holds. EKC-05's own terms decide exactly what applies.",
  ['P186'])

q(0,
  "A synthetic Ekene analyst studies the UK notice scheme. A UK authority terminates a whole contract for the supplier's breach. Under the UK guidance on Contract Performance Notices, para 26, where is that breach reported?",
  "In the contract termination notice",
  ["In a separate contract performance notice",
   "In the next annual KPI assessment notice",
   "Nowhere, since full termination ends the record"],
  "Para 26 of the UK guidance on Contract Performance Notices keeps the two notices apart: ending the whole contract for breach is recorded in the termination notice, and the performance notice is kept for lesser outcomes of a breach. The yearly KPI assessment is another duty, and a terminated contract still leaves a published record. None of this binds Ekene.",
  ['P071'])

q(3,
  "The Ekene contract manager (synthetic) drafts a formal notice to IM-F on EKC-06 after its improvement plan failed. Which draft follows GovS 008 (version 2.2), clause 5.4.3, and the World Bank guidance on authority?",
  "One naming the contract and its notice clause, the facts and evidence, what IM-F is to do, signed by a person with authority",
  ["One sent as a text message by the technician on site, since speed matters more than form in a notice",
   "One stating that the contract is ended, since a failed plan makes any further notice unnecessary",
   "One addressed to IM-F's parent company, since a formal notice is always sent to the group's head office"],
  "GovS 008 at 5.4.3 has corrective action taken within the terms of the contract, so the notice follows the contract's clause, and the World Bank's Contract Management Practice guidance, taught by concept, notes that a contracting decision holds only when its maker has the authority to take it. A site text, a notice that jumps to ending the contract, or one sent to the wrong party does not meet that standard.",
  ['P067', 'P021'])

q(1,
  "Ekene (synthetic) issued FW-E a notice to correct on EKC-05, got no response, and has withheld payment for the defective section. On the World Bank's ladder of works remedies, taught by concept, what is the next rung?",
  "Calling the performance security",
  ["Termination for a contractual event",
   "Deducting delay damages for lateness",
   "Issuing a second notice to correct"],
  "Withholding payment is the second rung of the World Bank's ladder of works remedies in its Contract Management Practice guidance, taught by concept, and calling the performance security is the third. Delay damages and termination sit higher still, and a second notice to correct goes back down to a rung already used. Whether the security can be called depends on EKC-05's own terms.",
  ['P076'])

q(3,
  "WS-A (synthetic) has twice ignored the Nigerian content plan in EKC-01, using foreign crews where the plan names Nigerian ones. Under the content Act, s.66, what is the operator's duty?",
  "Ekene holds WS-A to the plan through the contract, since s.66 puts monitoring and enforcement on the operator",
  ["To report WS-A to the Bureau of Public Procurement, which enforces content plans in oil and gas",
   "To accept the crews, since the content Act places content duties on operators and leaves contractors free",
   "To wait for the Board to act, since enforcing a contractor's content plan is the Board's duty alone"],
  "Under s.66 of the content Act the operator does more than pass on its policies: it watches whether contractors comply and enforces compliance, so Ekene raises the crews under EKC-01's content terms. The Bureau of Public Procurement has no part in the content Act, contractors are bound by that Act as well, and the operator's duty stands without waiting for the Board.",
  ['P132'])

q(2,
  "WS-A's (synthetic) improvement plan on EKC-01 has failed, and a manager proposes going straight to termination. How does the World Bank's Contract Management Practice guidance, taught by concept, describe termination?",
  "As the ultimate remedy for a default, which sits at the top of the ladder",
  ["As the first remedy to use whenever an improvement plan fails its closure test",
   "As an informal step that needs no written record or notice given beforehand",
   "As a remedy for the supplier, with the employer unable to use it"],
  "The World Bank guidance calls termination the ultimate remedy for a default, at the top of the rising order of remedies. A failed plan leads first to a formal notice under the contract, and termination, taught at the Expert tier, needs a written record behind it. It is an employer's remedy when a contractual termination event occurs.",
  ['P183'])

q(0,
  "After Ekene's written request, EM-G (synthetic) still has not restored the named key person to the EKC-07 sampling rounds or replaced the staff concerned. What does the World Bank's Contract Management Practice guidance, taught by concept, describe next?",
  "Moving to the further remedies the consultancy contract itself provides",
  ["Accepting the junior staff member, since the request to EM-G has now been made",
   "Reducing the fee by an amount the contract manager chooses on the day it is paid",
   "Hiring a second consultancy for the same work under the same contract"],
  "The World Bank guidance on a consultant's unsatisfactory performance, taught by concept, describes two stages: a request under the contract to put the staffing right, then, where the consultant does nothing, the further remedies the contract holds. EM-G has let the first stage pass, so Ekene turns to EKC-07's own remedies. Accepting the junior substitute gives up the key person term, an unstated deduction has no contractual footing, and bringing in a second firm would be a fresh procurement.",
  ['P075'])
# ---- end of questions ----

emit(Q, '/root/cat-wip-contracts/banks/sc5i_exam.json', expect_n=42)
finish()
