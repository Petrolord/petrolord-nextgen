import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC11 Associate final exam: classes, categories and the low estimate.
# Forty-two questions, seven drawn from the material of each module, each on a
# fact or an engine return the module banks do not key. Every key rests on a
# digest line or an engine return re-run in
# /root/cat-wip-prms/scratch/bank-beginner/witness.mjs.

# The resources framework
q(2, "Which of the engine's functions takes three stated estimates with a class, a method and a unit, and returns the categories?",
 "`categorize`.",
 ["`classify`, which returns the category labels beside the class of one project.",
  "`aggregate`, which adds the estimates of one project into a total.",
  "`reconcile`, which rebuilds the categories from an opening figure."],
 "categorize returns the cumulative categories with their outcome labels, the increments, the exceedance sentence and whether one value describes the range. classify returns the class, the sub-class and the category labels only, with no figures. aggregate and reconcile work on several projects or on movements, which belong to the Expert tier.")

q(3, "What did the course find when it checked the consolidated PRMS errata (versions 1.01 to 1.03, May 2022)?",
 "No change to the sections the engine applies.",
 ["A change to the chance of commerciality, which now adds the two chances together.",
  "A change to the categories that renames the 3P as the high case for Reserves only.",
  "That the errata withdraw the 2018 text, so the course cites the errata alone."],
 "The errata were checked and change none of the sections the engine applies; they are cited by item and their prose is not quoted. Pc remains the product of Pg and Pd for a prospect, the labels are unchanged, and the course cites SPE-PRMS 2018 by section.")

q(3, "From which document did the course read the English text of SPE-PRMS 2018?",
 "The SPE-hosted English-Chinese edition, whose English is the 2018 text and whose section numbers are the 2018 numbers.",
 ["A paid 2022 edition of the standard bought from SPE, since the 2018 text is out of print.",
  "The Commission's copy attached to the Petroleum Industry Act 2021 as a schedule.",
  "A summary written by the course, since the licensed text was not read."],
 "The sources table records the English text as read from the SPE-hosted English-Chinese edition (Version 2023 V1.0, developed from PRMS 2018 V1.0). It is the paid 2022 Application Guidelines that were not read, and the Act carries no copy of the standard.")

q(0, "Who operates the synthetic Ekene field in the course's fixture?",
 "EKO, Ekene Operator (synthetic).",
 ["The Commission, which holds the Ekene lease on behalf of the Federation.",
  "A real Niger Delta operator whose name the fixture hides behind a code.",
  "No operator is named, since the fixture states only the eight projects and their facts."],
 "The fixture names EKO, Ekene Operator (synthetic), with a working interest of 70.000000 percent, on the Ekene petroleum mining lease (synthetic). Every name and figure in it is synthetic, and no real company appears. The working interest returns in the Professional tier.")

q(0, "A box for EKN-1 carries the misspelt key `markets` inside `commerciality`. What does the engine print?",
 "commerciality.markets is not an accepted key; the accepted keys of commerciality are developmentPlan, financialAppropriations, timeFrame, market, facilities, approvals, firmIntention",
 ["commerciality.market must be true or false (stated; no default); got nothing",
  "A result with the class Reserves, since the misspelt key is set aside and the true market is assumed.",
  "maturity is not an accepted key; the accepted keys at the top level are name, discovery, recoveryProject, subClass, commerciality, economicStatus, projectStatus, reservesStatus, chances, nigeria"],
 "Those are the engine's own words for the golden case class-refuse-unknown-key. The accepted keys are checked before any input is read, so the unknown key is named first, with its path and the full list of keys the block does read. A misspelt key is refused; it is never set aside. The maturity message answers an unknown key at the top level.")

q(2, "Ekene Deep, EKN-6, also appears in another course of the academy. What is the link?",
 "It is the same prospect the farm-out course prices, with the same chance of geologic discovery.",
 ["It is the discovery the pia course taxes, stated there as Reserves at on-production.",
  "It is the field the decline curve analysis course forecasts, stated there as developed-producing.",
  "It is a different prospect that shares the name, with a different chance."],
 "Ekene Deep is the prospect the farm-out course trades, carrying the same chance of geologic discovery. Here it is classified, as Prospective Resources with sub-class prospect. A prospect is undiscovered, so no course states it as Reserves or as developed-producing.")

q(2, "Where do the practicals of this course run?",
 "In the course's own calculator panels, which call the same vendored engine the lessons quote.",
 ["In the Suite app for reserves reporting, opened from the course page.",
  "In a spreadsheet the learner builds from the lesson tables and uploads with the answers at the end.",
  "In the Commission's online reserves portal, which applies the PRMS classes."],
 "This is an engine course with no Suite app. The Associate tier uses the classification calculator, and the later tiers add the reserves and aggregation calculators, each calling the same vendored engine on the learner's own inputs. No regulator portal is part of the course.")

# Discovered and undiscovered
q(2, "Which two Ekene projects are stated as undiscovered?",
 "EKN-6 and EKN-7.",
 ["EKN-8 and EKN-5.",
  "EKN-3 and EKN-4.",
  "EKN-1 and EKN-2, since both are named after the Ekene Main accumulation."],
 "Ekene Deep (EKN-6) and Ekene Shallow (EKN-7) are potential accumulations still to be drilled, and the engine classifies both as Prospective Resources. The other six are discovered, including EKN-8, whose residual oil is known and has no recovery project.")

q(3, "Ekene Deep's chance of development is cleared in the panel before the call runs. Which refusal comes back?",
 "chances.developmentPct must be a number from 0 to 100; got nothing",
 ["A chance of commerciality of 25.000000 percent, the chance of geologic discovery alone.",
  "chances must be left out for Reserves (PRMS 2.1.3.3 treats Reserves as near-certain to be commercial, so no chance figure is carried); got nothing",
  "chances.geologicDiscoveryPct must be left out for a discovered accumulation; got nothing"],
 "Those are the engine's own words: a prospect needs both stated chances, and a missing one is refused by name. The engine multiplies nothing until both are stated. EKN-6 is Prospective Resources, and the Reserves and discovered-accumulation messages apply to other classes.")

q(1, "The course's small case \"A play\" states a Pg of 10.000000 percent and a Pd of 50.000000 percent. What chance of commerciality does the engine print?",
 "5.000000 percent.",
 ["10.000000 percent, the chance of geologic discovery, since a play has no development stage.",
  "50.000000 percent, since a play is judged on its chance of development alone.",
  "20.000000 percent, the figure of Ekene Deep, since every Prospective sub-class shares one chance."],
 "The play follows the same rule as the prospect and the lead (PRMS 2.1.3.3): Pg times Pd, whatever the sub-class, so 10.000000 percent times 50.000000 percent gives 5.000000 percent. Taking one stated chance on its own drops a judgement, and 20.000000 percent belongs to Ekene Deep's own chances.")

q(3, "The decision table for EKN-6 reads \"prospect (stated)\" in its sub-class row. What does the word \"stated\" signal?",
 "The engine took the sub-class from the input and checked only that it is one of the three Prospective ones.",
 ["The engine derived the sub-class from the chances, and \"stated\" marks a figure it computed from the two stated chances.",
  "The Commission has approved the sub-class, and \"stated\" is the regulator's mark.",
  "The sub-class is provisional and will be replaced once a well is drilled on the prospect."],
 "For Contingent and Prospective Resources the engine takes the stated sub-class and checks it belongs to the class (PRMS 2.1.3.5.9, Table 1 for a prospect). It derives no sub-class from the chances; only a Reserves sub-class is derived from stated facts. No regulator approval is involved.")

q(3, "Part of the residual oil in Ekene Main becomes reachable by a new recovery method. How does the engine deal with it?",
 "That part is stated again with its new project and classified afresh; the engine keeps no memory of an earlier class.",
 ["It moves that part out of Discovered Unrecoverable on its own, once the method has been named in the file.",
  "Nothing: the part stays Discovered Unrecoverable for good, since a class once given cannot change.",
  "It refuses any new project on EKN-8, since unrecoverable quantities take no recovery project."],
 "A class is a statement about today's facts. When a project can reach part of the residual oil, that part is stated with the project and classified again, and every call reads only the facts in its box. The engine moves nothing by itself and holds no history. A recovery project is a stated input on any discovered quantity.")

q(3, "The course's case \"A discovery of no interest\" states a discovered project with no recovery project and a no-interest declaration. What does the engine return?",
 "Discovered Unrecoverable, with a note citing s.78(8)(c) and s.78(15) of the Act.",
 ["Contingent Resources at development-not-viable, with the declaration as its only blocker.",
  "A refusal on the no-interest declaration.",
  "Undiscovered Unrecoverable, since a discovery of no interest is treated as never found."],
 "The class comes from the facts, discovered with no recovery project, and the engine's note reads, in its own words: discovery declared of no interest (PIA 2021 s.78(8)(c)); the Commission may require relinquishment of the parcels over the structure (s.78(15)). The note leaves the class unchanged.")

# Reserves and Contingent Resources
q(1, "Which reserves status does the Ekene file state for EKN-1, the waterflood on production?",
 "Developed-producing.",
 ["Undeveloped, since the waterflood still needs injection wells.",
  "Developed-non-producing, since part of the field is shut in behind pipe.",
  "None: a producing project carries a sub-class and no status."],
 "The waterflood is on production, and its sub-class decision reads on-production: on production, selling petroleum to market. A developed-producing status needs exactly that, wells open and producing now. Injection wells still to drill and zones shut in behind pipe describe the other two statuses.")

q(2, "Two of the eight commerciality conditions are read from inputs other than a plain true or false. Which two?",
 "The time-frame and the economic status.",
 ["The market and the facilities.",
  "The approvals and the firm intention.",
  "The development plan and the financial appropriations, which the engine reads from a budget."],
 "The time-frame is read from a stated number of years until development starts, with a stated flag for a longer time-frame that is justified; positive economics is read from the stated economic status: viable, undetermined or not-viable. The other six are each stated true or false. The engine reads no budget.")

q(3, "Which of the three Ekene Contingent projects states its economic status as viable?",
 "EKN-4, Ekene North appraisal.",
 ["EKN-3, Ekene East gas, whose economic status is stated as undetermined.",
  "EKN-5, Ekene West tight sand, stated not viable.",
  "None of them, since a viable project is always Reserves."],
 "EKN-4 is stated viable and is held back by its plan, money, approvals and firm intention. EKN-3 is undetermined and EKN-5 not-viable, which is why economicStatus is among their blockers. Viable economics is one criterion of eight, so a viable project can still be Contingent Resources.")

q(0, "Why does the chance column read none for EKN-1 and EKN-2?",
 "They are Reserves, which carry no chance figure (PRMS 2.1.3.3).",
 ["Their chances were left out of the file by mistake and should be filled in.",
  "Their chance is kept in a separate Reserves file that the table does not read.",
  "They are on production."],
 "Reserves are treated as near-certain to be commercial, so no chance figure is carried, and stating one is refused. EKN-2 is not on production and still carries none. The engine prints no chance of 100 percent for Reserves; it prints none.")

q(0, "A discovered project meets all seven commerciality criteria with established technology, but its firm intention to proceed is stated false. Which class does the engine return?",
 "Contingent Resources, held back by firmIntention.",
 ["Reserves, whatever the intention.",
  "Reserves at justified-for-development, the sub-class for a project still waiting on its commitment.",
  "A refusal naming firmIntention, since a project meeting seven criteria must state it true."],
 "The firm intention is part of the test (PRMS 2.1.2.1, 2.1.2.3), and the test is all or nothing, so the engine returns Contingent Resources and names firmIntention as the one blocker. A false criterion is a stated fact; the engine does not refuse it. Justified-for-development is a Reserves sub-class, which needs every condition met.")

q(1, "A box states a project on production whose final investment decision is stated false. What does the engine answer?",
 "projectStatus.finalInvestmentDecision must be true for a project on production (a producing project has passed its investment decision); got false",
 ["reservesStatus must be \"developed-non-producing\" or \"undeveloped\" for a project that is not on production; got false",
  "A result with the sub-class on-production and a warning that the decision date is missing.",
  "A result with the sub-class justified-for-development, since no decision has been taken."],
 "The engine's own words name the field projectStatus.finalInvestmentDecision (golden case class-refuse-producing-without-fid). Production can only follow an investment decision, so the pair of stated facts cannot both hold. The reservesStatus message concerns a producing status stated on an idle project, and a refused box brings back no sub-class or warning.")

q(1, "A learner adds a project status block to EKN-4, Ekene North appraisal. Why is it refused?",
 "The project status sets a Reserves sub-class, so it must be left out for Contingent Resources (PRMS 2.1.3.5).",
 ["EKN-4 is undiscovered, and a project status block is read only for projects whose accumulation has been discovered.",
  "The block names the wrong keys; the engine accepts only finalInvestmentDecision.",
  "A project status can be stated only together with a Nigerian declaration."],
 "The engine refuses the block by name: projectStatus must be left out for Contingent Resources, since the investment decision and production are the facts that set a Reserves sub-class. EKN-4 is discovered. The project status block has two keys, finalInvestmentDecision and onProduction, and has nothing to do with a Nigerian note.")

# Categories and the range
q(0, "Why do the Prospective Resources categories use the letter U?",
 "The quantities are undiscovered: 1U, 2U and 3U belong to Prospective Resources.",
 ["U stands for unrecoverable, the class that Prospective Resources fall into before a well.",
  "An unrisked figure is marked U, and only Prospective Resources carry one.",
  "U stands for uncertain, since only prospects have a range of outcomes."],
 "The letter names the class: P for Reserves, C for Contingent Resources and U for the undiscovered quantities of Prospective Resources. Unrecoverable quantities carry no categories at all. Every class with a project has a range of outcomes.")

q(3, "In the Ekene Main Reserves, how do the 1P and the Proved (P1) compare?",
 "They are the same figure, 8.890000 MMbbl: 1P = P1.",
 ["The Proved (P1) is 7.760000.",
  "16.650000 is the 1P, and the Proved (P1) is its first half.",
  "The Proved (P1) is 8.340000, the last of the three slices."],
 "The Proved slice is the whole 1P, and the engine prints the rule in its own words: 1P = P1, 2P = P1 + P2, 3P = P1 + P2 + P3. 7.760000 is the Probable (P2), and 16.650000 is the 2P. No slice is taken off the 1P.")

q(1, "A set is stated incrementally with a second slice of -1. What does the engine print?",
 "A refusal naming estimates.second, since a slice may be zero and may not fall below it.",
 ["A result with a 2P below the 1P and a warning line in the reasons.",
  "estimates must be ordered low <= best <= high; got -1",
  "estimates.second must be left out for the cumulative method (state low, best and high); got -1"],
 "In the engine's own words (golden case cat-refuse-negative-increment): estimates.second must be a finite number at or above 0; got -1. A slice may be zero but never negative. The ordering message answers cumulative figures out of order, and the mixed-forms message answers a slice key under the cumulative method. A refused box returns no categories.")

q(0, "Under the incremental method, a Reserves box keeps a leftover `low` of 1 from its cumulative form. Which message comes back?",
 "estimates.low must be left out for the incremental method (state first, second and third); got 1",
 ["A result that treats the low as the Proved (P1) and ignores the first slice.",
  "estimates.second must be a finite number at or above 0; got 1",
  "method must be \"cumulative\" for Prospective Resources (PRMS 2.2.2.4 defines no incremental terms for them); got \"incremental\""],
 "Those are the engine's own words for the golden case cat-refuse-incremental-with-low: each method reads its own three keys, and a cumulative key under the incremental method is refused. The engine sets no stated input aside. The Prospective message applies only to Prospective Resources.")

q(2, "Ekene North is stated as totals of 3.000000, 4.500000 and 6.500000. Which figure is both its 1C and its C1?",
 "3.000000.",
 ["1.500000, the C2.",
  "4.500000, the 2C, which is the first figure a report quotes for Contingent Resources.",
  "6.500000."],
 "The first slice of any class is the whole low estimate: the 1C is C1, 3.000000, as the engine returns for both golden inputs. 1.500000 is the C2 slice, 4.500000 the 2C, and 6.500000 the 3C.")

q(1, "A report adds a 2P, a 2C and a 2U into one figure. What does that figure describe?",
 "No class and no project: the labels keep each class apart, and figures of different classes stay out of one total.",
 ["The field's 2P, since Contingent and Prospective figures become Reserves once added.",
  "The field's best estimate of all resources, which is how the framework defines a total.",
  "A risked best estimate, since the Prospective figure carries its chance into the sum."],
 "Each class carries its own labels so that a figure is never mistaken for another class. Added together, a 2P, a 2C and a 2U belong to no class and describe no project. Adding changes no class, and a risked figure is one multiplied by a named chance, which no plain sum applies.")

q(1, "Which figure does the engine return as the 3U of the course's Prospective case, and which probability label sits beside it?",
 "70.000000 MMbbl, labelled P10.",
 ["12.000000 MMbbl, labelled P90.",
  "30.000000 MMbbl, labelled P50, the best estimate if the prospect succeeds.",
  "70.000000 MMbbl, labelled P90, since the prospect has the widest range of the three classes."],
 "The case states 12.000000, 30.000000 and 70.000000 MMbbl, and the engine returns them as 1U, 2U and 3U with P90, P50 and P10 beside them. The 3U is the high estimate, so it carries P10 in every class. 12.000000 is the 1U and 30.000000 the 2U.")

# The low estimate and probability
q(2, "Which probability label does the engine print beside the 1C of Ekene North?",
 "P90, the label of every low estimate whatever its class.",
 ["C90, since the probability label takes the class letter.",
  "P10, since Contingent Resources count their probabilities from the bottom.",
  "None: probability labels are printed for Reserves only."],
 "The outcome labels are the same in every class: P90 beside the low, P50 beside the best and P10 beside the high. The class letters, P, C and U, change with the class, and the outcome labels do not. The 1C of Ekene North and the 1U of the prospect case are both P90 figures within their own class.")

q(0, "Picture a hundred equally likely outcomes for a Reserves estimate, sorted from smallest to largest. Where does the P10 sit?",
 "Near the top: only ten or more of the outcomes reach it.",
 ["Near the bottom, since ten percent of the outcomes fall below it.",
  "In the middle, with half of the outcomes above it.",
  "Below the P90, since a smaller number means a smaller figure."],
 "The P10 is a figure met or exceeded by at least ten in a hundred outcomes, so it sits near the top of the sorted list; the P90, met or exceeded by at least ninety, sits near the bottom, and the P50 in the middle. Reading P10 from the bottom is the ordinary percentile, which runs the other way.")

q(1, "Why does petroleum reporting count exceedance from the top when an ordinary statistics table counts from the bottom?",
 "Because the question a lender or a regulator asks is how much is at least there.",
 ["Because a Reserves estimate is always made by a deterministic method.",
  "Because the SEC rules forbid percentiles counted from the bottom in any filing.",
  "Because the engine sorts every estimate from largest to smallest before printing it."],
 "Reporting asks how much is at least there, so the P90 is the figure met or exceeded with at least 90 percent probability, the low estimate. Estimates are made by either method. The quoted SEC text states the exceedance idea for proved reserves and forbids nothing about tables, and the engine sorts nothing: it refuses estimates out of order.")

q(2, "In the course's fixed order for reading a category table, which item comes first, and why?",
 "The class, since it tells the reader which labels to expect.",
 ["The value of the 2P, since the best estimate is the figure most readers want.",
  "The reasons, since they state everything the table does in words.",
  "The unit."],
 "The order runs class, unit, method, labels and probabilities, increments, and last the reasons. The class comes first because it sets the letters: P for Reserves, C for Contingent Resources and U for Prospective Resources. A class a reader did not expect means the table is about a different project.")

q(2, "Ekene North's three slices are typed in as the incremental method asks. Who supplies which figures in the result?",
 "The C1, C2 and C3 are stated; the engine works out the 1C, 2C and 3C.",
 ["The 1C, 2C and 3C are stated; the engine works out the slices.",
  "Only the C1 is stated; the engine extends it to the rest of the range.",
  "All six are stated, and the engine checks that each slice matches the totals it was given."],
 "With the incremental method the three slices are stated and the engine builds the cumulative figures from them: 3.000000, 1.500000 and 2.000000 give 3.000000, 4.500000 and 6.500000. With the cumulative method it is the other way round. A box stating both forms is refused.")

q(0, "The engine cannot tell whether three estimates came from scenarios or from a distribution. What should a report do about it?",
 "Write the method beside every category table, so a reader knows whether P90 is a probability or a label.",
 ["Leave the method out, since the engine's words \"when probabilistic\" already settle it.",
  "Relabel deterministic figures low, middle and high, since the P labels belong to distributions.",
  "Convert every deterministic set to a distribution before it is reported, using the engine."],
 "The engine states the probability only for the probabilistic case, so the report has to say which method was used. The P labels stay attached in both cases as outcome labels, and the engine builds no distribution from scenarios.")

q(2, "Which of the Ekene Main Reserves figures carries at least a 10 percent probability of being met or exceeded, when the method is probabilistic?",
 "24.990000 MMbbl, the 3P.",
 ["8.890000 MMbbl, the 1P.",
  "8.340000 MMbbl, the Possible (P3), which is the slice at the high end of the range.",
  "16.650000 MMbbl, the 2P, since ten percent is the step between two categories."],
 "The high estimate carries P10: at least a 10 percent probability of being met or exceeded, so it is the 3P of 24.990000. The 1P carries P90 and the 2P P50. A slice such as the Possible (P3) is not an estimate of the whole quantity and carries no probability.")

# Nigerian terms in words
q(1, "How does s.318 of the Act define a commercial discovery, in the course's words?",
 "One the licensee judges can be economically developed after weighing all relevant economic factors.",
 ["One whose 2P has been booked by the Commission under its reserves regulation.",
  "One with a field development plan approved within two years of the declaration.",
  "One whose chance of development is stated at or above the threshold the Commission publishes each year."],
 "Section 318 defines a commercial discovery as one that can be economically developed in the opinion of the licensee or lessee after consideration of all relevant economic factors. No Commission booking regulation was found. The field development plan follows the declaration under s.79(1), and the Act sets no chance threshold.")

q(3, "Which Nigerian note does the engine print for EKN-3, Ekene East gas?",
 "A significant gas discovery under s.78(8)(b), with the retention rules and 3 years since the declaration.",
 ["A commercial discovery under s.78(8)(a), with a field development plan due within 2 years.",
  "A discovery of no interest under s.78(8)(c), with relinquishment of the parcels over the structure.",
  "No note, since a Contingent Resources project carries no Nigerian declaration."],
 "EKN-3 is stated as a significant gas discovery declared 3 years ago, and the engine's note cites s.78(8)(b), s.318, s.78(9) and reg. 6(3) and ends 3 years since the declaration. The commercial discovery note is EKN-1's. A discovered Contingent project may carry a note, and the note leaves its class unchanged.")

q(0, "Which two reasons in s.318 of the Act for a significant gas discovery concern markets?",
 "No markets for natural gas within Nigeria, and export markets that still need to be identified and developed.",
 ["A royalty rate too high for the gas to pay, and a tax rate above the one in the pia course.",
  "No field development plan within two years, and no approval from the Commission within 90 days.",
  "A gas price below the domestic base price, and a pipeline more than 10 years from completion."],
 "The Act lists them as (a) no markets for natural gas within Nigeria and (b) export markets need to be identified and developed, and reg. 4(a) and (b) of S.I. No. 37 of 2023 repeat them. The Act's definition names no royalty, tax, price or pipeline test, and the two years and 90 days belong to other provisions.")

q(0, "Under reg. 7(2) of S.I. No. 37 of 2023, what happens when a licensee whose declaration does not meet the criteria says it intends to declare a commercial discovery?",
 "The Commission grants two years to submit a field development plan under section 79 of the Act.",
 ["The Commission grants a retention period of at least five years onshore.",
  "The area is relinquished at once under s.78(13) of the Act.",
  "The Commission declares the discovery commercial and books its 2P in the national figure."],
 "The regulation reads: \"(2) Where the licensee informs the Commission that it intends to declare a commercial discovery, the Commission shall grant the licensee two years within which to submit a field development plan for the area in accordance with section 79 of the Act.\" Retention periods follow an approved significant discovery, relinquishment under s.78(13) follows the end of retention, and no booking rule was read.")

q(1, "What does reg. 7(3) of S.I. No. 37 of 2023 require when the licensee says the discovery is of no interest?",
 "The Commission requires relinquishment of the parcels that cover the structure, pursuant to s.78(15) of the Act.",
 ["The Commission grants the licensee two years to change its mind before the parcels are released.",
  "The licensee pays a penalty set by the Commission and keeps the parcels.",
  "The discovery is reclassified as Prospective Resources and offered in the next licensing round."],
 "The regulation reads that the Commission shall, pursuant to s.78(15), require the licensee to relinquish the parcels that cover the structure of such discovery from its licence area. The two-year grant is reg. 7(2), for a licensee that intends a commercial declaration. The texts read set no penalty, and a discovered quantity is never Prospective Resources.")

q(1, "The engine's Nigerian note on EKN-1 ends \"12 years since the declaration: the two-year period has passed\". What does that note do to the class?",
 "Nothing: EKN-1 stays Reserves, and the note is printed beside the class.",
 ["It lowers EKN-1 to Contingent Resources until a late field development plan is filed.",
  "It turns EKN-1 into Discovered Unrecoverable, since the plan period has lapsed.",
  "A refusal comes back, since the years since the declaration are above two."],
 "The notes do not change the PRMS class: EKN-1 meets every criterion and is Reserves, and the note reports that the two-year plan period of s.79(1) has passed. The engine accepts any stated count of years and prints what the Act provides beside the class.")

q(3, "How does the course use the Nigerian Upstream Petroleum (Commercial) Regulations, 2025 (S.I. No. 7 of 2025)?",
 "By concept only: reg. 6 asks for a status report that includes a statement of the reserves situation.",
 ["As the Nigerian booking rule, which the engine applies to set each class.",
  "As a quoted text, since Nigerian subsidiary legislation may be quoted with its citation.",
  "It is the source of the national gas figures as at 1 January 2026."],
 "The Commercial Regulations are used by concept only, for the status report of reg. 6. No gazetted booking rule was found, so the engine applies none. The national gas figures come from the Commission's release of 1 April 2026.")

q(0, "In which gazette was S.I. No. 37 of 2023 published, and when was it made?",
 "Official Gazette No. 111, Vol. 110, 20 June 2023, made 24 May 2023.",
 ["Official Gazette No. 142, Vol. 108, 27 August 2021, made with the Act.",
  "Official Gazette No. 84, Vol. 112, 5 May 2025, made with the Commercial Regulations.",
  "Official Gazette No. 110, Vol. 111, 24 May 2023, made 20 June 2023."],
 "The sources table gives S.I. No. 37 of 2023, Official Gazette No. 111, Vol. 110, 20 June 2023 (made 24 May 2023). Gazette No. 142, Vol. 108 of 27 August 2021 carries the Act, and Gazette No. 84, Vol. 112 of 5 May 2025 the Commercial Regulations. Swapping the numbers and dates names no real gazette.")

emit(Q, '/root/cat-wip-prms/banks/ec11b_exam.json', expect_n=42)
finish()
