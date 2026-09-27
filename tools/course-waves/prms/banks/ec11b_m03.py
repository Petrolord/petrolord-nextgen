import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC11 Associate m03, Reserves and Contingent Resources.
# Sources: the seven commerciality criteria and the firm intention in the
# engine's wording; the three Ekene Contingent projects with their blockers and
# chances; technology under development; the reserves status and the project
# status; the refusals of classify this module shows; the 17 CFR 229.1203(d)
# quotation. Every key rests on a digest line or an engine return re-run in
# /root/cat-wip-prms/scratch/bank-beginner/witness.mjs.

q(2, "When does the engine classify a discovered project with a recovery project as Reserves?",
 "When all seven commerciality criteria and the firm intention are met with established technology.",
 ["When at least five of the seven criteria are met and the economic status is stated \"viable\".",
  "Once its chance of development is above 50 percent.",
  "When the licensee has declared a commercial discovery to the Commission under the Petroleum Industry Act 2021."],
 "The test is all or nothing (PRMS 2.1.2.1, Table 1): one criterion not met keeps the project in Contingent Resources, and the engine names every one that fails. A chance of development is stated beside a Contingent class and sets no class. A Nigerian declaration is printed as a note beside the class and leaves the PRMS class unchanged.")

q(0, "Which criteria does the engine list as holding back EKN-4, Ekene North appraisal?",
 "developmentPlan, financialAppropriations, approvals, firmIntention",
 ["financialAppropriations, timeFrame, economicStatus, market, facilities, firmIntention",
  "technology under development, developmentPlan, financialAppropriations, economicStatus, firmIntention",
  "market, facilities"],
 "The engine's class decision on EKN-4 reads Contingent Resources: not commercial (developmentPlan, financialAppropriations, approvals, firmIntention). The six-name list is Ekene East gas, EKN-3, and the list that opens with technology under development is Ekene West tight sand, EKN-5. EKN-4 meets the market and facilities criteria.")

q(3, "Ekene East gas, EKN-3, is held back by six criteria. Which two criteria does it meet?",
 "developmentPlan and approvals.",
 ["market and facilities.",
  "timeFrame and economicStatus.",
  "financialAppropriations and firmIntention."],
 "The engine lists financialAppropriations, timeFrame, economicStatus, market, facilities and firmIntention as the blockers of EKN-3, so of the eight conditions the two it meets are the development plan and the approvals. Its market and facilities are among the blockers, and a significant gas discovery declaration is a Nigerian note printed beside the class.")

q(1, "The golden case class-tech-under-development-only states every criterion met, with the recovery project stated as technology under development. What does the engine return?",
 "Contingent Resources, with the one blocker \"technology under development\".",
 ["Reserves, since every one of the eight commerciality conditions is met.",
  "A refusal naming `recoveryProject`, since a project that meets every criterion must state established technology to be accepted.",
  "Discovered Unrecoverable, since the recovery technology has not yet been shown to work in this field."],
 "A project that relies on technology still under development cannot be Reserves even when every criterion is met, so the engine returns Contingent Resources and names technology under development as the blocker. It is a result, which the engine does not refuse. Discovered Unrecoverable needs a recovery project of none, and this one states a project.")

q(0, "A learner states the economic status of a project as \"positive\". Which message does the engine print?",
 "economicStatus must be one of \"viable\", \"not-viable\", \"undetermined\"; got \"positive\"",
 ["commerciality.market must be true or false (stated; no default); got \"positive\"",
  "Criterion (4) read as met.",
  "economicStatus must be true or false (stated; no default); got \"positive\""],
 "Those are the engine's own words for the golden case class-refuse-economic-status. Positive economics is read from a stated economic status, and only the three named values are accepted. The economic status is stated as one of three words. The engine does not read an unaccepted word as met.")

q(3, "What chance of commerciality does the engine return for Ekene East gas, EKN-3, a discovered project with a stated chance of development of 50.000000 percent?",
 "50.000000 percent, since Pc = Pd for a discovered project.",
 ["25.000000 percent, a quarter point for each of the two criteria it meets.",
  "None: Contingent projects carry no chance.",
  "20.000000 percent, the figure of Ekene West tight sand, since both are held back by the economics criterion."],
 "For a discovered project the chance of commerciality is the chance of development alone (PRMS 2.1.3.3), and the engine prints Pc = Pd. The engine scores no criteria into a chance. A chance is carried by Contingent Resources and required for them; it is Reserves that carry none. EKN-5 states its own chance of development, 20.000000 percent.")

q(2, "EKN-5 has five blockers and a chance of development of 20.000000 percent; EKN-3 has six blockers and 50.000000 percent. What explains the gap?",
 "Each chance is a judgement the project team states, and the engine reports it beside the class.",
 ["The engine lowers the chance by a fixed step for every blocker it finds on the project.",
  "The engine sets EKN-5 lower because technology under development counts as a double blocker.",
  "EKN-3 is gas, and the engine raises the chance of a gas project to allow for the significant discovery rules."],
 "The chance of development is a stated input: the engine multiplies nothing and derives no chance from the number or kind of blockers. That is why the chances do not follow the count of blockers. The Nigerian note on EKN-3 is printed beside its class and changes no chance.")

q(1, "What reserves status does the Ekene file state for EKN-2, Ekene infill wells, whose investment decision is taken and whose production is yet to start?",
 "Undeveloped, since its production is yet to start.",
 ["Developed-producing, since the decision is now taken.",
  "Developed-non-producing, since the wells wait on a pipeline.",
  "None, since a status is stated only with production."],
 "EKN-2 is Reserves, sub-class approved-for-development, with a stated reserves status of undeveloped (PRMS 2.1.3.6, Table 2). Developed-producing needs a project on production, which EKN-2 is not. The Ekene file has no developed-non-producing project. Every Reserves project carries a stated status, producing or not.")

q(3, "The Reserves status control on Ekene infill wells is set to developed-producing. Which message does the engine print?",
 "reservesStatus must be \"developed-non-producing\" or \"undeveloped\" for a project that is not on production (developed producing reserves come from completion intervals open and producing, Table 2); got \"developed-producing\"",
 ["subClass must be \"approved-for-development\" for this project (final investment decision taken; production yet to start: PRMS 2.1.3.5.5, Table 1); got \"developed-producing\"",
  "projectStatus.finalInvestmentDecision must be true for a project on production (a producing project has passed its investment decision); got false",
  "reservesStatus must be one of \"developed\", \"undeveloped\"; got \"developed-producing\""],
 "Those are the engine's own words for the golden case class-refuse-dp-not-producing: developed producing reserves need a project that is producing. The subClass message is about a stated sub-class, and the investment-decision message is about a producing project stated without its decision. The engine accepts three statuses, and the message names the two that fit this project.")

q(0, "A box for a discovered project leaves out the market criterion inside `commerciality`. What happens?",
 "commerciality.market must be true or false (stated; no default); got nothing",
 ["The criterion is read as met.",
  "The criterion is read as not met, and market is added to the list of blockers.",
  "commerciality.markets is not an accepted key; the accepted keys of commerciality are developmentPlan, financialAppropriations, timeFrame, market, facilities, approvals, firmIntention"],
 "Those are the engine's own words. Every commerciality criterion is stated true or false with no default, so a missing one is refused by name and the engine does not guess it either way. The accepted-keys message answers a misspelt key such as markets, which is a different mistake.")

q(2, "The years until development starts are stated as -1 in a project's time-frame. Which message comes back?",
 "commerciality.timeFrame.startWithinYears must be a finite number at or above 0; got -1",
 ["A result with the time-frame met, since a start before now is sooner than any benchmark.",
  "commerciality.timeFrame must be true or false (stated; no default); got -1",
  "A result with timeFrame among the blockers."],
 "Those are the engine's own words for the golden case class-refuse-time-frame. The time-frame is read from a stated count of years until development starts, which may be zero and cannot be below it. It is one of the two criteria stated as something other than true or false, and a refused box returns no class, met or not.")

q(1, "A Contingent Resources project is run with its whole `chances` object removed. What does the engine print?",
 "chances must be an object { developmentPct } for Contingent Resources (PRMS 2.1.3.3: Pc = Pd); got nothing",
 ["chances must be left out for Reserves (PRMS 2.1.3.3 treats Reserves as near-certain to be commercial, so no chance figure is carried); got nothing",
  "chances.developmentPct must be a number from 0 to 100; got nothing",
  "A result with no chance tile and the class Contingent Resources."],
 "Those are the engine's own words: a Contingent project requires its chance of development, since Pc = Pd, and the engine supplies none of its own. The Reserves message applies only when the facts give Reserves, and the developmentPct message answers an empty chances object that is still present. The engine fills no missing chance with a figure, and it returns no Contingent class without its chance.")

q(3, "EKN-2 has its final investment decision and is not yet producing. A learner states its sub-class as development-pending. How does the engine respond?",
 "It refuses: the facts give Reserves at approved-for-development, and the message names that sub-class.",
 ["It returns Contingent Resources, development-pending, since the stated sub-class decides the class.",
  "It accepts the stated sub-class and prints \"development-pending (stated)\" in the decision table.",
  "It returns Reserves at justified-for-development, the nearest Reserves sub-class to the stated one."],
 "For Reserves the engine derives the sub-class from the investment decision and production and checks the stated one against it. In its own words: subClass must be \"approved-for-development\" for this project (final investment decision taken; production yet to start: PRMS 2.1.3.5.5, Table 1); got \"development-pending\". The class comes from the criteria, and justified-for-development is the sub-class before the decision.")

q(0, "Which section does the engine cite in the class decision of EKN-5, Ekene West tight sand, and which blocker does that decision list first?",
 "PRMS Table 1 (Contingent Resources guidelines), listing technology under development first.",
 ["PRMS 2.1.2.1 and Table 1, listing developmentPlan first, just as for Ekene North appraisal.",
  "PRMS 2.1.3.5.6 and Table 1, listing economicStatus first, because the economics are stated not viable.",
  "PRMS 2.1.1.2, listing firmIntention first."],
 "The engine's decision on EKN-5 cites PRMS Table 1 (Contingent Resources guidelines) and reads Contingent Resources: not commercial (technology under development, developmentPlan, financialAppropriations, economicStatus, firmIntention). PRMS 2.1.2.1 and Table 1 is what the other Contingent and the Reserves projects cite; 2.1.3.5.6 is the sub-class decision, and 2.1.1.2 belongs to the unrecoverable classes.")

q(2, "17 CFR 229.1203(d), quoted from the eCFR version current at 2026-09-01, asks a registrant to explain proved undeveloped reserves left undeveloped for five years or more. What does the engine do with that rule?",
 "It applies no such clock: it reads the reserves status that is stated.",
 ["It moves undeveloped Reserves into Contingent Resources once five years have passed since the investment decision.",
  "It refuses the undeveloped status on any Reserves project whose sub-class is approved-for-development.",
  "It prints a warning on EKN-2, whose status is undeveloped, citing the SEC rule."],
 "The quoted rule is a disclosure rule for US registrants, and the course quotes it as public text. The engine applies no such clock and reads only the status stated, so EKN-2 is Reserves, undeveloped, with no warning. Undeveloped is an accepted status for an approved project.")

emit(Q, '/root/cat-wip-prms/banks/ec11b_m03.json', expect_n=15)
finish()
