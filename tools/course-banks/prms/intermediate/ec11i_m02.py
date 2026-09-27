import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC11 Professional m02, The Seven Commerciality Criteria.
# Every figure and every engine message is quoted from digest.txt, where the
# engine returned it on the Ekene fixture or a stated golden input, and every
# key was re-run through the vendored engine by the writer's witness
# (scratch/bank-intermediate). No capstone name, input or value appears.

q(2, "Ekene North appraisal (EKN-4) states economic status viable, a start within 3 years, a market and facilities. Which criteria does the engine name as holding it back?",
 "developmentPlan, financialAppropriations, approvals, firmIntention",
 ["firmIntention alone, since its economics are already viable",
  "financialAppropriations, timeFrame, economicStatus, market, facilities, firmIntention",
  "None: a viable economic status settles commerciality by itself"],
 "The engine returns Contingent Resources for EKN-4 with the blockers developmentPlan, financialAppropriations, approvals and firmIntention. Positive economics is one criterion of seven plus the commitment, and every one must be met, so viable economics settles nothing alone and the commitment is one blocker among four. The six-item list belongs to Ekene East gas (EKN-3), which lacks a market and facilities.")

q(0, "Of the seven criteria and the commitment, six are stated as true or false. Which two does the engine read from other inputs?",
 "The time-frame, from a stated start and justification, and positive economics, from the economic status",
 ["The market and the facilities, which it reads from the stated forecast and prices",
  "The plan and the money, which it reads from the capital rows of the cost table",
  "Approvals and the commitment, both read from the Nigerian declaration"],
 "The time-frame is met from commerciality.timeFrame (startWithinYears and longerJustified) against the five-year benchmark, and positive economics is met only when the stated economic status is viable. A market, facilities, the plan, the money, approvals and the firm intention are each a stated true or false; the classification reads no forecast or cost table, and the Nigerian declaration is a note that moves no class.")

q(3, "One golden input differs from a Reserves project only in its start date: 6 years out, with no justification stated for waiting beyond the benchmark. What class comes back?",
 "Contingent Resources, with timeFrame as its one blocker",
 ["Reserves, since five years is only a recommended benchmark of the standard",
  "A refusal on startWithinYears, which must lie at or below 5",
  "Contingent Resources, with timeFrame and firmIntention as blockers"],
 "The reason reads \"time-frame: development starts within 6 years against the 5-year benchmark, a longer time-frame not stated as justified: not met (PRMS 2.1.2.3)\", so the class is Contingent Resources and timeFrame is the only blocker. The benchmark is a recommendation, and the engine applies it unless a longer time-frame is stated as justified. A start of 6 is a valid input; only a negative one is refused. The commitment is met on this input.")

q(1, "When the start is 8 years away and the box says the longer wait is justified, which line is printed for criterion (3)?",
 "time-frame: development starts within 8 years against the 5-year benchmark, a longer time-frame stated as justified: met (PRMS 2.1.2.3)",
 ["time-frame: development starts within 8 years against the 5-year benchmark: not met (PRMS 2.1.2.3)",
  "A refusal: startWithinYears must be at most 5 when a longer time-frame is stated",
  "time-frame: not tested, since the justification replaces the benchmark"],
 "A start beyond five years meets the criterion when a longer time-frame is stated as justified, and the engine prints the justification in its line, so the class is Reserves. The not-met line would need the justification false. No start of 0 or more is refused on its size, and the engine tests the time-frame on every discovered project with a recovery project, printing the justification it was given.")

q(1, "An otherwise commercial project is due to begin development in exactly 5 years, with nothing stated about a longer wait. What does the engine return for the time-frame criterion?",
 "Met, with the class Reserves",
 ["Not met, with one blocker, timeFrame",
  "A refusal until the edge is justified",
  "Met once a longer wait is justified"],
 "The engine prints \"time-frame: development starts within 5 years against the 5-year benchmark: met (PRMS 2.1.2.3)\" and returns Reserves. Reading five years exactly as met is the engine's stated reading of the edge; the alternative it names reads it as not met, and no graded figure rests on the edge. A start on the benchmark is a valid input, and no justification is needed within five years.")

q(3, "The golden input class-economics-undetermined meets every other criterion and states economic status undetermined. What does the engine return?",
 "Contingent Resources, blocked by economicStatus",
 ["Reserves, since undetermined economics are not negative economics",
  "A refusal: the economic status must be viable or not-viable",
  "Contingent Resources, sub-class development-not-viable by derivation"],
 "Only viable meets criterion (4), positive economics (PRMS 2.1.2.1(4), 2.1.3.7.1), so an undetermined status leaves the project Contingent with the single blocker economicStatus. Undetermined is one of the three accepted words, so nothing is refused. The engine derives no Contingent sub-class; it checks the stated one.")

q(0, "Someone types \"positive\" as the stated economic status of a discovered project. How does the engine respond?",
 "economicStatus must be one of \"viable\", \"not-viable\", \"undetermined\"; got \"positive\"",
 ["The class Reserves, with positive read as the same word as viable on every criterion line",
  "Contingent Resources, with economicStatus blocking as a word the engine does not know",
  "commerciality.economics must be true or false (stated; no default); got \"positive\""],
 "The engine accepts exactly three words for the economic status and refuses anything else by name, printing the value it was given. It maps no synonym onto viable, and a refusal returns no class. Positive economics is read from economicStatus, a top-level input, and commerciality carries no economics key.")

q(2, "Starting from the on-production Ekene project, a user deletes the market criterion from the box. Which message comes back?",
 "commerciality.market must be true or false (stated; no default); got nothing",
 ["Reserves, the missing market read as met because the project is on production",
  "Contingent Resources, blocked by market, which it reads as not met",
  "commerciality must be an object with seven keys; got six"],
 "Every criterion is a stated fact with no default, so a missing one is refused by name and the message says it got nothing. The engine never fills a criterion from another fact, in either direction, so it returns neither Reserves nor a Contingent class with market blocked. The refusal names the missing key itself, commerciality.market.")

q(0, "For the approvals criterion a user enters the string \"yes\". Which message comes back?",
 "A refusal on commerciality.approvals that prints the value \"yes\" as it was given",
 ["Reserves, the word yes read as true for approvals",
  "approvals is not an accepted key; the accepted keys are listed",
  "Contingent Resources, blocked by approvals until a boolean is stated"],
 "A criterion is true or false and nothing else; a string is refused on the field that carries it, with the value printed as given. The engine reads no word as a boolean, so neither class comes back. The key approvals is an accepted key of commerciality, so the unknown-key message does not apply.")

q(3, "A box spells one criterion as commerciality.markets. What comes back?",
 "It is refused on the misspelt key, and the message lists the seven keys commerciality accepts",
 ["The class, with the misspelt key dropped silently and market left unread",
  "A refusal naming commerciality.market as missing",
  "The class, with markets read as the market criterion"],
 "The engine checks accepted keys before it reads any input, so the misspelling is refused first: \"commerciality.markets is not an accepted key; the accepted keys of commerciality are developmentPlan, financialAppropriations, timeFrame, market, facilities, approvals, firmIntention\". It drops no key silently and reads no near-match for a key it knows. The missing market would be refused only after the spelling is fixed.")

q(2, "The golden input class-no-firm-intention meets every criterion and states the commitment as not met. Which line does the engine print for it?",
 "commitment: the entity's firm intention to proceed with development: not met (PRMS 2.1.2.1, 2.1.2.3)",
 ["(7) legal, contractual, environmental, regulatory and government approvals in place or forthcoming: not met",
  "commitment: not tested, since the seven criteria are met",
  "Reserves: every commerciality criterion is met with established technology"],
 "The engine carries the commitment as a stated fact beside the seven criteria and prints it with its section; here it is not met, so the class is Contingent Resources with the single blocker firmIntention. Approvals are met on this input. The commitment is tested on every discovered project with a recovery project, whatever the seven show, and the Reserves decision line needs the commitment met.")

q(1, "A discovered project passes all seven criteria and the commitment, yet its recovery method is still being proven in the field. Which result does the engine give?",
 "Contingent Resources, with the blocker \"technology under development\"",
 ["Reserves, since every one of the seven criteria and the commitment is met",
  "Discovered Unrecoverable, because no established technology applies",
  "A refusal on recoveryProject, which must state established-technology here"],
 "Reserves need every criterion met with established technology, so technology under development keeps the project in Contingent Resources and the engine names it as the blocker. Unrecoverable needs no recovery project at all, and a project with technology under development has one. Technology under development is one of the accepted recovery projects, so nothing is refused.")

q(3, "The start of development is entered as -1 years in commerciality.timeFrame. What is the result?",
 "commerciality.timeFrame.startWithinYears must be a finite number at or above 0; got -1",
 ["time-frame: development starts within -1 years against the 5-year benchmark: met",
  "Reserves, since a start already past is well inside the benchmark",
  "commerciality.timeFrame must be an object { startWithinYears, longerJustified }; got -1"],
 "A start in the past is no time-frame, so the engine refuses the field that carries it and prints the value. It tests no benchmark on a refused input, so no time-frame line and no class come back. The timeFrame object itself is present and accepted; the refusal names the one key inside it that fails.")

q(0, "A project meets every commerciality criterion and states the Nigerian declaration as a significant gas discovery. What does the engine return?",
 "A refusal on nigeria.declaration, which must be \"commercial-discovery\" for such a project",
 ["Contingent Resources, since a significant discovery cannot yet be declared commercial",
  "Reserves, with the stated declaration printed beside the class as a note that moves no class at all",
  "Reserves, with a note printed that the retention period of the declared area runs at most 10 years"],
 "The engine keeps the note consistent with the class: \"nigeria.declaration must be \"commercial-discovery\" for a project that meets every commerciality criterion: a significant discovery cannot be declared commercial (PIA 2021 s.318) and a discovery of no interest is not being developed (s.78(8)(c)); got \"significant-gas-discovery\"\". The declaration never changes the class, so the project does not fall to Contingent Resources, and a contradicting note is refused before any Reserves result is printed.")

q(1, "In a copy of EKN-4, developmentPlan, financialAppropriations and approvals are set to true, and nothing else moves. What does the engine return?",
 "firmIntention alone still blocks it, so it stays Contingent Resources",
 ["Reserves, since economics, market, facilities and time-frame were already met",
  "Contingent Resources, with approvals and firmIntention still blocking",
  "Reserves, sub-class justified-for-development"],
 "Setting the three criteria true leaves the stated commitment false, and the commitment is part of the commerciality test (PRMS 2.1.2.1, 2.1.2.3), so the project stays Contingent with firmIntention alone. Approvals are met in this copy. A Reserves class needs every criterion and the commitment, and the Reserves sub-class is only derived once the class is Reserves.")

emit(Q, '/root/cat-wip-prms/banks/ec11i_m02.json', expect_n=15)
finish()
