import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# Ten questions below were rewritten by the key-truth audit to clear the exam
# against module near duplicates. Each carries a trailing comment naming the two
# modules it now spans and the module question it used to repeat, so it may sit
# under a section header that names only one of those modules.

# ---------------- m01, the schedule as a network ----------------

q(0, "Hull conversion slips 60 days on a network that returns 870 days, and the Egina FPSO card reads a capex of 1363.3524, an operating cost of 55.7800 and a decommissioning allowance of 204.5029 million USD. Which of those three figures moves with the slip?",
 "None of them, because the card reads a type and a nameplate of 60000 bopd and no duration at all, while first oil does move, since hull conversion sits at a float of 0.",
 ["All three, because the allowance is 15 percent of a capex that a longer build carries more of, and the operating cost of 55.7800 follows the same curve at the power 0.6.",
  "The operating cost alone, because 55.7800 is an annual figure and 60 more days of construction is 60 more days of it standing before the vessel earns anything at all.",
  "None of them, and first oil holds as well, because hull conversion carries 180 days of float in the way detailed engineering and topsides fabrication do."],
 "a4 sits on the critical path with a late start of 300 and a float of 0, so a slip on it moves 870; the card's three money columns are a curve on a type and a nameplate."),  # cross-module replacement (m01 with m04); the original repeated ec6i_m01 Q1 verbatim
q(2, "Subsea installation is 180 days of work, the smallest real piece on EGINA's schedule, and it carries 480 days of float. What produced that figure?",
 "Its late start of 690 less its early start of 210, with the late finish of 870 coming from a8, which also waits on the far longer chain through a4 and a7.",
 ["The sum of the floats along its own chain, since a2 carries 180 days of float ahead of it and those days are added to whatever a6 can absorb on its own account.",
  "The gap between the calendar span of 933 days and the network duration of 870 days, spread across the three activities that sit off the critical path.",
  "The 870 day duration less the 420 days of hull conversion, since the longest single activity in a network sets the room that every shorter one is given."],
 "Float is late start less early start, so 690 less 210 is 480, and a6 may start as late as day 690 and still land on 870."),

q(1, "A schedule where a waits on c, c waits on b and b waits on a returns the message that the schedule has a dependency cycle through a, b and c. Why is that a refusal rather than a duration?",
 "The forward pass needs an activity whose predecessors are all known, and inside the loop none of the three ever is, so there is no ordering to walk and no pass to run.",
 ["The pass would keep adding durations to itself without ever reaching an end, so the engine stops at a fixed iteration count and reports the ids it was still holding at that point.",
  "A cycle makes every activity critical at float 0, and the engine declines any network whose critical list holds every row in the schedule.",
  "The duration would be right and only the critical path through the loop ambiguous, so the message stands in place of the path while the duration itself is left unreported."],
 "Naming the three ids is the useful part, because the fix is deciding which of those links was typed by mistake, and dropping one quietly computes a duration for a plan nobody wrote."),

q(1, "A published case of four activities with no dependencies at all returns a duration of 7 days with all four critical across four separate paths. What does critical mean there?",
 "Only that nothing gave any of them anywhere to move, since with no links typed every activity starts on day 0 and the schedule is as long as its longest single activity.",
 ["That the engine could not read the dependency column at all and fell back on marking every row critical at float 0, which is exactly the behaviour repaired before this course.",
  "That the four activities share one path of 7 days, because unlinked activities are chained in the order they happen to sit in the schedule.",
  "That each of the four is itself 7 days long, which is why none of them can absorb a slip without moving the end of the project."],
 "It is the correct answer to the network it was handed, and it reports four paths, one per activity; a schedule where nothing is linked looks healthy and is not."),

q(3, "A planner points at detailed engineering's 180 days of float and says the four well campaign, 182 rig days on a single rig, will fit inside it. What is wrong with that?",
 "Float belongs to its own chain, and the campaign is not an activity in the network at all.",
 ["Nothing, provided the campaign is run on two rigs at 95 days, which is the figure that fits inside 180 days of float with a fortnight left over.",
  "The float to use is 480 days rather than 180, since subsea installation is the activity the drilling would run beside and it is the one carrying room.",
  "The campaign is 182 days of elapsed time and the float is 180 days of work, so the two are different quantities and the rig days have to be restated first."],
 "Total float is what one activity can absorb only if nothing ahead of it on its chain absorbs any first, and EGINA's eight activities carry no drilling row for a campaign to sit in."),  # cross-module replacement (m01 with m03); the original repeated ec6i_m01 Q7
q(0, "The generated document lists HSE and Risks as two separate sections of the nine it checks. Does a plan carrying both of them band its risks twice?",
 "No, because one scale runs the register, the HSE tab and the matrix, so both sections read the same thresholds and cannot disagree with each other.",
 ["Yes, because the HSE tab holds thresholds of its own, which is why one row can read High on one section and Medium on the other and a reader takes the worse of the two.",
  "Yes, because the hazard screen that bands High above 5 and Medium above 2 is what the HSE section reports, and the register bands the same rows at 20, 12 and 6.",
  "No, because only the Risks section bands anything at all: the HSE section counts the rows naming a safety source, which is why the two totals agree at five."],
 "Before the repairs made ahead of this course several surfaces each carried their own thresholds, so a disagreement between two of them is now a bug rather than a reading."),  # cross-module replacement (m05 with m06); the original repeated ec6i_m01 Q8
q(2, "The four well campaign occupies 95 elapsed days on two rigs. What does the studio need before those 95 days can be shown as a start date and an end date?",
 "A day somebody typed, since nothing is read from the machine's clock and a concept with no start date is refused rather than dated from today.",
 ["Nothing, since a campaign is dated from the day the plan is run, which is why the layout reports elapsed days rather than rig days in the first place.",
  "The 182 rig days, since a date column is built from the work rather than from the elapsed time somebody plans around, and the two rigs finish at 95 and 87 days.",
  "The network duration of 870 days, since every dated figure anywhere in the schedule is measured out from the same day 0 that the forward pass starts counting at."],
 "A span is counted in whole calendar days and every date in EGINA is stated somewhere, so a date from a clock is right on the day it was computed and wrong on every other."),  # cross-module replacement (m02 with m03); the original repeated ec6i_m02 Q4
q(0, "An activity whose dates cannot be read returns a calendar span of null, and the document still counts Schedule among the nine sections it reports present. Is that a contradiction?",
 "No: completeness asks only whether a section carries something, and null is the honest answer to a different question, so neither figure is filling a gap.",
 ["Yes: an unreadable date should drop the plan to 89 percent in the way a plan with no economics written does, and the null is the check the document missed.",
  "Yes: null is what the count returns before a section has been read at all, so a Schedule reported present has already overwritten that null with a span of 0.",
  "No: the document reads the network duration of 870 days rather than the typed dates, so the Schedule section never sees the unreadable row and the null never reaches it."],
 "The document reports what is there and what is missing without filling a gap, and null says the extent is unknown where 0 would say the schedule has no extent."),  # cross-module replacement (m02 with m06); the original repeated ec6i_m02 Q5 verbatim
q(3, "A FPSO sanctioned on 2028-02-29 reaches first oil on 2031-03-01, and the engine still reports 36 months. Why does the date land on the first of March?",
 "The sanction sits on the last day of a February that has a twenty ninth, the February three years later does not, and month arithmetic on a calendar lands on the following day.",
 ["The engine adds a fixed count of milliseconds for the 36 months and the extra leap day pushes the result past midnight, which is why the month count between the two dates still reads 36.",
  "First oil moves to the next working day whenever the month arithmetic lands on a date the calendar does not carry, which adds a day to the span.",
  "The concept carries 36 months from sanction, and the engine dates a leap day start from today, so the answer moves with the day the plan was run."],
 "A FPSO sanctioned 2027-04-01 reaches 2030-04-01 at the same 36 months, and an implementation counting milliseconds drifts with every leap year it crosses."),

q(1, "A concept with no start date, run with no today supplied, is refused and told to enter one or pass today to date the schedule from. Why can the engine take neither way out itself?",
 "Both ways out need somebody to choose a day and be able to state it, and a schedule dated from the moment the code ran disagrees with itself a week later with nothing altered.",
 ["The concept's 36 months are measured from its sanction date, and with no sanction typed the engine cannot tell a FPSO from a Platform at 24 months.",
  "Dating from today would be correct enough, but the calendar span of 933 days would then have to move with it, and the engine will not shift a figure a reader has already seen.",
  "A missing start date is a completeness failure rather than an input error, so the plan drops to 89 percent and the schedule is simply left undated."],
 "A first oil computed from a clock is right on the day it was computed and wrong on every other, and a plausible date in a date column carries no mark saying where it came from."),

q(2, "Reading 2027-04-01 as an instant rather than as a calendar date showed one stored string as two different days. Which readers saw the earlier day, and why did nothing look broken?",
 "Everyone west of Greenwich, because UTC midnight falls on the day before there, and sanction, first oil and every milestone moved together so each reader saw a consistent schedule.",
 ["Only readers in zones that change their clocks, because the offset shifts by an hour inside the window and a whole number of days becomes a fraction.",
  "Everyone east of Greenwich, because local midnight there falls after UTC midnight and the stored instant is then rounded down to the preceding day.",
  "Only the reader who typed the date, because the stored value keeps its author's zone while every other reader is shown the plan converted into their own."],
 "The string never said anything about a time, and the disagreement surfaces only when two readers quote a date to each other."),

# ---------------- m03, wells and rig days ----------------

q(3, "The rig rate of 310000 USD a day is a figure the plan carries and the FPSO card's capex of 1363.3524 comes off a screening curve. Which of the two can be argued about with a contract in hand?",
 "The rate, which is negotiated and dated and belongs to the plan, while the curve reads a type and a nameplate and has never seen a shipyard quote.",
 ["The capex, since 1363.3524 is printed to four decimals against a rate typed as a round 310000, and the more precise figure is the one a quote can be set against.",
  "Both, since the curve is fitted to yard prices and the rate comes from the rig market, so a commercial negotiation moves each of them the same way.",
  "Neither, since both are engine outputs, and the ledger lines of 1180.0000 for hull and topsides and 170.0000 for mooring and installation are the only figures a contract reaches."],
 "Before the repair every well was priced at a hardcoded 250000 USD a day whatever the plan carried, which is why the rate an answer was computed at is read before the answer."),  # cross-module replacement (m03 with m04); the original repeated ec6i_m03 Q6
q(0, "EG-02 is 11600 ft and takes 45 days, while a 12000 ft horizontal well takes 53. What does that say about ranking a campaign by depth?",
 "That depth alone does not order the days, because trajectory moves them as well: the same 12000 ft hole is 40 days vertical, 46 deviated and 53 horizontal.",
 ["That the ordering holds and EG-02 is the exception to it, since a well drilled from an existing slot carries fewer days than a fresh hole at the same depth.",
  "That the day count is settled by complexity alone, and the engine assumes high complexity on a 12000 ft hole, which is the 79 day case in the table.",
  "That a producer takes longer than an injector at the same depth, which is why EG-03 at 10800 ft returns 42 days against EG-02's 45."],
 "A high complexity horizontal at 12000 ft takes 79 days, longer than EG-01's 61 days at 14200 ft, on less hole."),

q(1, "A campaign priced at a stale rig rate returns 113750000 USD where 141050000 USD is true, with all four wells still in the right order. Which row of the risk register carries that?",
 "None of them, because a register holds the rows somebody wrote and scored, and a silent pricing error raises no row, no band and no flag anywhere.",
 ["Logistics congestion, the Operations row banded Low at a score of 4, whose cost impact of 25.0000 million USD is where an error in a commercial term lands.",
  "Hull yard delay, the Fabrication row banded High at a score of 12, since a commercial rate that was never read is a yard and fabrication exposure by source.",
  "The unscored row, since Host government approval is what the register reports whenever a figure is missing rather than wrong."],
 "A refusal would be easier to live with: a negative capex is refused by name and gets fixed within the hour, while a plan priced at somebody else's rate computes cleanly."),  # cross-module replacement (m03 with m05); the original repeated ec6i_m03 Q2
q(2, "On two rigs EGINA's four wells take 95 days against 182 rig days of work. Where does 95 come from?",
 "Each well goes to the rig free first: EG-01 at 61 and EG-02 at 45 take a rig each, EG-03 at 42 joins the rig free at 45, and EG-04 at 34 joins the rig carrying 61.",
 ["From dividing the 182 rig days between the two rigs and rounding the answer up to a whole day, since a rig cannot be stood down part way through a shift on a well.",
  "From the longest well at 61 days plus the shortest at 34 days, since the two rigs are run in step with each other and the campaign closes when the slower pair finishes.",
  "From an optimiser balancing the rigs, which pairs 61 with 34 and 45 with 42 to bring both as close to 87 days as whole wells allow."],
 "The rigs finish at 95 and 87 days, and a well cannot be split, so the arithmetic is a packing problem in whole wells rather than a division."),

q(2, "Priced at 250000 USD a day the same four wells return 113750000 USD against 141050000 USD at the plan's own rate. Why is that error hard to catch in the table?",
 "Every row moves in the same proportion, so the deepest well is still the dearest and only the total is wrong, and totals are what leave the wells section.",
 ["The engine flags a rate it did not read from the plan, and the flag sits on the campaign total rather than on any row, where a reader scanning wells will miss it.",
  "The two totals differ by less than the spread between the trajectories, so the difference falls inside a range that the day count could never have narrowed.",
  "The costs are printed to the unit, so the change lands in the digits after the first few and leaves the leading figures of every well undisturbed."],
 "Before the repair every well was priced at a hardcoded 250000 USD a day whatever the plan carried, so a plan entering 310000 got 113750000 back with no sign of it."),

# ---------------- m04, facilities sized and priced ----------------

q(0, "Moving the FPSO's nameplate from 60000 to 150000 bopd is a factor of 2.500000 in size and 1.899144 in capex. What decides the second figure?",
 "The exponent alone: 2.500000 raised to the power 0.7 is 1.899144, so the capex reads 2589.2031 rather than the larger figure proportional scaling would give.",
 ["The type, since both rows belong to the same FPSO family and that family's own base cost is added once before the size ratio is applied to whatever remains of it.",
  "The gas and water handling capacities, which multiply by 2.500000 in exact step with the nameplate and drag the capex up by less than the full size factor of 2.500000.",
  "The decommissioning allowance of 204.5029, which rides inside the capex figure at 15 percent of it and damps the rise in the capex as the nameplate is grown."],
 "Operating cost uses a flatter exponent of 0.6, giving 1.732862 from 55.7800 to 96.6591, and a reader multiplying by 2.500000 overprices the debottlenecked case."),

q(1, "Decommissioning is 0.150000 of capex on all three facilities and still moves by 1.899144 between the two FPSO rows. How does a flat percentage carry the size exponent?",
 "It is a share of a capex that already carries the exponent, so 204.5029 and 388.3805 stand in the same ratio as 1363.3524 and 2589.2031.",
 ["The percentage is taken on the type's own unscaled base cost and is then rescaled by the nameplate ratio, which is the behaviour the engine now publishes.",
  "The share is 0.150000 on the FPSO rows only, and the tie-back's 27.7007 against 184.6717 uses a separate allowance written for a subsea system.",
  "The allowance reads the plan's own decommissioning provision of 260.0000 and apportions it across the facilities in proportion to their nameplates."],
 "Before the repairs the allowance was 15 percent of the unscaled base cost, so two FPSOs of very different nameplate returned the same removal figure."),

q(0, "The Deep tie-back reads an oil utilisation of 2.400000 and a gas utilisation of 1.024000, and a bottleneck fires on each side. What is a flag on its own not telling you?",
 "By how much the limit was crossed: the gas side is over by a hair at 1.024000 and the oil side is at 2.400000, and both flags read exactly the same.",
 ["Which facility the flag belongs to, since bottlenecks are reported for the plan as a whole and the two FPSO rows carry the same two entries beside them.",
  "Whether the limit is crossed at peak or across the profile, since the engine reads the whole shape and flags any year in which either ratio passes one.",
  "That a utilisation above one is a reading rather than an error, since the engine clamps the ratio at full and reports the overrun only through the flag."],
 "One numerator and three denominators, 60000 bopd against each nameplate and 38400 Mscf/d against each gas capacity, so the ratios carry the size of the problem."),

q(3, "Run the Deep tie-back against the tie-back concept's own peak instead of the plan's and its oil utilisation reads 1.000000 with no bottleneck. Why does the engine refuse that?",
 "The throughput belongs to the plan being assessed, the same 60000 bopd for every row, so a facility measured against the rate that suits it looks adequate for a plan it cannot carry.",
 ["A nameplate of 25000 sits below the screening tier's floor, so the engine measures every subsea tie-back against the largest nameplate the plan holds.",
  "The concept's peak is a screening shape rather than a forecast, so the engine substitutes the gas rate of 38400 Mscf/d for it on every facility row.",
  "Two concepts cannot be assessed at once, so the tie-back is held at the FPSO's utilisation of 1.000000 until one concept has been selected."],
 "The plan's peak of 60.0000 kbpd is 60000 bopd for all three rows, which is why the FPSO reads 1.000000, the debottlenecked case 0.400000 and the tie-back 2.400000."),

q(2, "The Deep tie-back gains Corrosion High when the fluid carries 12 ppm of H2S and shows nothing for corrosion when the field is blank. What cannot be read off that output?",
 "Whether the sour gas question was asked and answered or never asked at all, because the screen fires at any H2S above zero and a blank field leaves the same absent entry a clean one does.",
 ["Whether the hazard is High or Medium, since the corrosion screen grades on the measured concentration and 12 ppm sits near the boundary between them.",
  "Which facility carries the hazard, since the list is written against the fluid and the same entries are returned for every facility on the plan.",
  "Whether the score of 3 came from the configuration or from the fluid, since a subsea tie-back adds 3 and oil below 25 API adds 2 to the same total."],
 "The screen separates a measured field from an unmeasured one rather than one sour field from another, and the register at least has the word Unscored for a row waiting on a number."),

q(1, "The FPSO card's capex of 1363.3524 is a screening figure, and the plan's ledger carries hull and topsides at 1180.0000 with mooring and installation at 170.0000. What can be done with the ledger that cannot be done with the card?",
 "Its lines can be interrogated, because a person wrote each of them and can defend it, while the curve reads a type and a nameplate and holds nothing inside to question.",
 ["Its lines can each be rescaled to a new nameplate, since every one of them carries the same power 0.7 exponent that the screening curve applies only to a total figure at the end.",
  "Its lines enter the screening economics, while the card's capex is left out of them because a screening estimate and an ABEX line are treated in exactly the same way.",
  "Its lines carry contingency and standby, which is what separates 1363.3524 from the 1350.0000 the concept holds in its facilities field."],
 "1363.3524 is an output of two inputs and it moves the moment somebody revises the nameplate, with no new engineering behind the change."),

# ---------------- m05, one risk scale ----------------

q(0, "Subsea tie-in slips scores 20 and Hull yard delay scores 12. Which bands do they take, and what rule decides?",
 "Critical and High, because the thresholds read 20 and above, 12 and above and 6 and above, so a score landing exactly on a threshold goes up rather than down.",
 ["High and Medium, since a threshold opens the band above it and a score has to pass 20 before the Critical label can be applied to the row that carries the score.",
  "Critical and High, decided by the impact ranks of 5 and 4 rather than by the scores, since the band is read from impact while the score orders the register within that band.",
  "Critical and Critical, since a Schedule risk and a Fabrication risk both bear on the date of first oil, and the register promotes any risk that touches an activity sitting on the critical path."],
 "A published case pins the thresholds at 20, 12 and 6 and returns Critical 2, High 1, Medium 1 and Low 1 at a consolidated 68 and a health of 46."),

q(3, "Host government approval carries an impact of 5 and a cost impact of 400.0000 million USD, the largest in the register, and contributes 0.0000 to an exposure of 269.0000. What produced that?",
 "Its probability is missing, so no factor can be keyed from the table that turns a rank into a likelihood, and with no factor the money never enters.",
 ["A Regulatory risk is left out of exposure by source, since the register prices only the risks a project team can mitigate from its own budget.",
  "The engine caps any one contribution at the largest scored one, 108.0000 from Subsea tie-in slips, so a cost impact above that is reported and not priced.",
  "An impact of 5 keys a factor of 0.85 and the product is carried into health instead, which is why health reads 58 with the row present and absent."],
 "The four scored contributions of 108.0000, 96.0000, 60.0000 and 5.0000 add to 269.0000, and the largest money in the register sits outside the number that summarises its money."),

q(1, "The register's five cost impacts add to 1145.0000 million USD and its exposure reads 269.0000. What is the 269.0000, and what is it not?",
 "An expected monetary value, each cost impact multiplied by the factor its probability keys, and neither the worst case of everything landing nor a floor, because nothing here is a distribution.",
 ["The contingency to fund, since the difference from 1145.0000 is the part the register's own mitigations are expected to remove before sanction.",
  "The worst case with the unscored row excluded, since a risk with no probability cannot be assumed to happen and its 400.0000 is held back.",
  "The sum of the Critical and High contributions of 108.0000 and 96.0000, grossed up for the Medium and Low rows the engine treats as noise."],
 "No risk costs its expected value, it costs its cost impact or it costs nothing, and an exposure of 0.0000 usually means the cost impact column is empty."),

q(2, "The FPSO card carries a decommissioning allowance of 204.5029 and the plan's ledger carries an ABEX line of 260.0000 million USD. Where do those two figures sit in roll-ups of 2250.0000 CAPEX and 95.0000 OPEX?",
 "In neither: the roll-ups add the CAPEX and OPEX lines the ledger holds, so one removal figure sits outside the totals and the other was never in the ledger at all.",
 ["The 260.0000 is inside the CAPEX total and the 204.5029 is left out of it, which is how the ledger comes to agree with the concept's own capex of 2250.0000 to the decimal.",
  "The 204.5029 is inside the CAPEX total of 2250.0000 and the 260.0000 is spread across the operating cost of 95.0000 a year over the concept's own 20.0000 year life.",
  "Both sit inside the OPEX total of 95.0000 a year, which is why that figure stands well above the card's own annual operating cost of 55.7800 for the same vessel."],
 "The plan holds one removal figure a person wrote and the card holds another a curve produced, and the case charges the ledger's ABEX line in the final production year while the card's allowance never enters it."),  # cross-module replacement (m04 with m06); the original repeated ec6i_m05 Q13
q(3, "A published register of five rows reading Critical 1, High 2, Medium 1 and Low 1 returns a health of 56, and EGINA's four scored rows return 58. Why is that comparison unsafe?",
 "Health averages over the scored rows, so a register rises as it grows in its lower bands, and the five row register is the worse of the two by a margin an average carries badly.",
 ["The five row register carries an exposure of 48.1000 against EGINA's 269.0000, and health is weighted by the money each band contributes to it.",
  "EGINA holds an unscored row and the published register does not, so EGINA's 58 is averaged over five rows against the other register's four.",
  "A consolidated 56 sits below EGINA's 44 on the scale health inverts, so the two numbers are reported on two different bases."],
 "Every risk Critical returns 0 and one Critical with one Low returns 50, and nothing was mitigated between those two registers: a row was added."),

q(1, "The Egina FPSO card returns an annual operating cost of 55.7800 million USD and the document's roll-up reports a total OPEX of 95.0000. Which of the two is the plan's operating cost?",
 "The 95.0000, the sum of the operating lines somebody wrote at 72.0000 for operations and logistics and 23.0000 for maintenance and integrity, while 55.7800 is a curve output.",
 ["The 55.7800, since it is the only one of the two derived from the facility the plan actually holds, and the ledger lines of 72.0000 and 23.0000 are provisional entries somebody has yet to firm up.",
  "Both, once the Deep tie-back's 9.8963 is added to the FPSO's 55.7800, since the roll-up is the sum taken across whichever facility cards a plan happens to carry.",
  "Neither, since the card's figure is annual and the roll-up's covers the whole life, so the two need putting on one basis before either can be called the plan's."],
 "The roll-up adds the cost items the ledger holds and nothing else, and the card's 55.7800 is a screening function of a type and a nameplate of 60000 bopd."),  # cross-module replacement (m04 with m06); the original repeated ec6i_m05 Q3
q(0, "A probability typed as text keys the factor table and gives an exposure of 4.0000, a fractional probability scores 10 but gives an exposure of 0.0000, and a probability outside 1 to 5 gives a consolidated 24. What is the common lesson?",
 "The multiplication is more forgiving than the scale, so a register returns a banded and healthy looking answer on a probability the exposure table cannot price, and the discipline is at the keyboard.",
 ["The engine declines any probability it cannot band, so each of those three registers reports its rows as unscored and prices none of them.",
  "A probability outside the range is clamped to the nearest end of the scale, which is why the out of range case reads one Critical and one Low.",
  "The factor table reads text and fractions alike, so all three carry an exposure and the differences between them are rounding in the fourth decimal."],
 "The fractional case returns a Medium at a consolidated 10 with an exposure of 0.0000, because it matches nothing in a table where 1 keys 0.05 and 5 keys 0.85."),

# ---------------- m06, the Professional reading ----------------

q(2, "The document reports completeness of 100 percent across nine sections while the register carries an unscored row and the schedule's window is wider than its network. What does that 100 percent claim?",
 "Only that each of the nine carries something: Field Data, Subsurface, Concepts, Wells, Facilities, Schedule, Economics, HSE and Risks are present, and completeness has no view on whether their numbers agree.",
 ["That the plan validates, since isValid true and an empty error list are what the completeness percentage is computed from, one section at a time.",
  "That every figure in the nine sections was read from the engine rather than typed by hand, which is what the repairs before this course made the check test for.",
  "That the sections reconcile, since a plan whose capex total and cost ledger disagree loses a section and cannot reach the full mark."],
 "The register still reads Unscored 1 and the schedule still spans 933 days against a network of 870, and the document reports what is there rather than filling a gap."),

q(0, "The document's roll-ups read a total CAPEX of 2250.0000 and a total OPEX of 95.0000, and a published empty ledger returns 0.0000 and 0.0000. What are the roll-ups doing?",
 "Adding the cost items the ledger holds and nothing else, which is why a published example returns a CAPEX of 574.3000 with an OPEX of 0.5000.",
 ["Taking the concept's three capex fields of 520.0000, 1350.0000 and 380.0000, which is why the total matches the concept and an empty ledger falls back on it.",
  "Summing the ledger and the facility cards together, which is why the CAPEX total sits above the FPSO card's own screening figure of 1363.3524.",
  "Reading the screening case, so the decommissioning provision of 260.0000 enters the OPEX total spread across the concept's 20.0000 year life."],
 "The ABEX line of 260.0000 is in neither total, and a published ledger of strings, blanks and unassigned phases returns a CAPEX of 12.5000 and an OPEX of 3.0000."),

q(3, "A reviewer asks for the P90 of the FPSO card's capex of 1363.3524 and the P90 of the register's exposure of 269.0000 million USD. What is the answer?",
 "That neither carries one, since a P label belongs to a reserves distribution one fluid at a time, and a curve output and an expected value are not distributions.",
 ["184.6717 and 5.0000, the smallest facility capex the plan carries and the smallest contribution to the exposure, since a P90 is the low case of whatever figure is being reported.",
  "1363.3524 and 269.0000 themselves, since a screening figure is already a mid case and the low case of a single estimate is that estimate.",
  "The exposure alone carries one, at 269.0000 against cost impacts adding to 1145.0000, since an exposure is built from probabilities somebody keyed while a capex off a curve is not."],
 "P90 is the low case of one fluid's reserves, and a capex, a rate, a cost, a duration or an index never takes a P label at all."),  # cross-module replacement (m04 with m05); the original repeated ec6i_m06 Q15
q(2, "The same plan with no economics written reports 89 percent and the error that total CAPEX is zero or missing. What does that pair of outputs tell a reader?",
 "Which section is absent and why the plan is not valid, since the percentage counts the sections carrying something and the error names the one that does not.",
 ["That the economics are present but unreadable, since a section holding a zero of its own still counts toward the nine and only an unreadable one raises an error.",
  "That eight of nine sections rounds to 89 percent and the ninth is the risk register, whose unscored row keeps it from counting as complete.",
  "That the plan should be re-run on the concept's capex of 2250.0000, which the engine substitutes whenever the cost ledger carries no total."],
 "Nothing is substituted quietly: the plan carrying no economics reports 89 percent and names the missing total rather than reading 2250.0000 off the concept."),

# ---------------- across two modules ----------------

q(1, "EGINA's network returns 870 days and the dates typed on the same eight activities span 933. What are the 63 days between them?",
 "Contingency already spent, room the dates leave the work that no activity asked for, and it belongs to no activity as the 480 days on subsea installation does.",
 ["Contingency somebody set aside, which the engine holds back from the critical path so a slip on a1, a3, a4 or a7 can be absorbed before first oil moves.",
  "The float of detailed engineering and topsides fabrication counted once each, since 180 and 180 overlap and only the part outside the path reaches the calendar.",
  "A counting difference, since the network measures from day 0 while the calendar counts both ends of the window, adding a day for each milestone."],
 "870 comes from durations and links with no date taking part, 933 from the earliest typed date to the latest with no duration taking part, and nothing reconciles them."),

q(0, "The Egina FPSO card reads a capex of 1363.3524 and the four well campaign reads 141050000. What is the relationship between those two figures?",
 "Both are money in different notations, plan money in million USD to four decimals and well costs in whole currency units, and neither converts by moving a decimal.",
 ["The campaign is the drilling share of the facility's own capex, which is why the concept carries a drilling field of 520.0000 inside a total capex of 2250.0000 million USD.",
  "The card's figure is the annual cost of running the vessel and the campaign a one off charge, so the two are compared over the concept's own life of 20.0000 years.",
  "The campaign is a costed number and the card a screening one, so the campaign is the larger of the two once both are read in one unit."],
 "141050000 USD is 141.0500 million USD, well under the card's 1363.3524, and the plan's drilling cost item of 520.0000 is a third estimate of overlapping work."),

q(3, "The Deep tie-back's flow assurance score of 3 reads Medium, and a risk register score of 3 reads Low. Which reading is wrong?",
 "Neither, because flow assurance runs its own scale where a level is High above 5 and Medium above 2, while the register's bands of 20, 12 and 6 measure another quantity.",
 ["The flow assurance reading, since the studio carries a single risk scale and a score of 3 sits below the Medium threshold of 6 on every surface in the studio it appears on.",
  "The register reading, since a hazard list naming Hydrates High outranks a band computed from probability and impact and promotes the row that carries it.",
  "Both, since the repairs before this course put every surface onto one scale and a score of 3 now reads Low on the hazard screen as well."],
 "The register and the HSE matrix do agree, Critical 1, High 1, Medium 1, Low 1 and Unscored 1 on both, because they share one scale; the hazard screen never did."),

q(2, "Subsea tie-in slips is a Schedule risk banded Critical at 20, while subsea installation carries 480 days of float in the network. What does the register know about that float?",
 "Nothing at all, because a band is a probability times an impact that somebody typed, and the register reads no early start, no late start and no critical path.",
 ["It reads the float and prices it, which is why the Schedule source row carries the largest scored contribution to the register's exposure at 108.0000 million USD.",
  "It reads the critical path alone, so a risk naming an activity that carries float is banded one step below the same risk sitting on a1, a3, a4 or a7 instead.",
  "It reads the calendar span of 933 days instead of the float, which is how a Schedule risk reads Critical while the work has 63 days of room."],
 "Hull conversion and integration sit at float 0 and subsea installation carries 480 days, and none of that reaches a register scored 4 times 5."),

q(1, "The four well campaign is 182 rig days of work and 95 days of elapsed time on two rigs. Which figure could be typed as a duration in the activity network, and what still would not follow?",
 "The campaign days, since a duration is elapsed whole days, and the network would still know nothing of rig moves, a rig free only from a date, or an injector needed down first.",
 ["The rig days, since a network is built from the work rather than from the calendar, and the layout's 95 days is a presentation of the same 182.",
  "Neither, since a drilling campaign is priced rather than scheduled and the network reads its durations only from the eight activities the plan carries.",
  "Both, since 182 on one rig and 95 on two are one activity at two resourcings, and the forward pass takes the later of the two figures."],
 "Those constraints belong in the network where a link can be typed between two activities, and the layout answers only how much elapsed time this much drilling occupies."),

q(0, "The document reports a total CAPEX of 2250.0000 while the FPSO card carries 1363.3524 and the concept's facilities field carries 1350.0000. What should a reader do with three numbers describing overlapping things?",
 "Hold all three and ask what each was measured against, since the ledger totals line by line, the concept carries three capex fields, and the card is a curve on a type and a nameplate.",
 ["Take the card's figure, since it is the only one derived rather than typed and the other two are entries somebody may well have left stale.",
  "Average them, since each estimates the same vessel at a different stage and the mean of three estimates is the screening tier's own answer.",
  "Take the concept's field of 1350.0000, since the scenario economics read the card only when a concept's facilities capex is missing."],
 "The studio shows all three rather than picking one, and reconciling them is planning work while averaging them or deleting the inconvenient one is not."),

q(3, "A register row with no probability reads Unscored, and an activity with no readable dates returns a calendar span of null. What do those two answers have in common?",
 "Each reports an absence as an absence: the unscored row adds 0.0000 to an exposure of 269.0000 and leaves health at 58, and a null span says the extent is unknown.",
 ["Each is a documented default, since an unscored risk is banded Low and an undated activity is dated from the concept's own start date, so both plans still compute cleanly.",
  "Each halts the calculation and names the field that was left empty, in the way a concept with no capex is refused and a price deck short of a year is refused by name.",
  "Each is rounded to the nearest reportable value, so an empty schedule and an unreadable one both read 0 and the exposure still reads 269.0000."],
 "Before the repairs an unscored risk counted as Low, which raised health because health averages across the scored rows, so a register improved when a probability was left blank."),

q(2, "The document reports completeness at 100 percent with HSE and Risks both present, while the register reads health 58, exposure 269.0000 and one unscored row. What is the relationship?",
 "Completeness counts a section as filled and says nothing about what is in it, so a register whose headline figures are incomplete by exactly one row still scores its section present.",
 ["Health feeds completeness, so a section counts as present only when its own health clears 50, which the register's 58 does with room to spare.",
  "The unscored row is what holds completeness below the full mark, since nine of nine sections would otherwise report and the plan reads 89 percent.",
  "Exposure is the money form of completeness, so 269.0000 against cost impacts of 1145.0000 is the share of the register that has been filled in."],
 "Health 58, exposure 269.0000 and one unscored row are three separate readings, and the document carries the section as present either way."),

q(3, "The plan's peak of 60.0000 kbpd fills the Egina FPSO's nameplate exactly at an oil utilisation of 1.000000, and the plan carries four wells taking 182 rig days. What does that utilisation assume about the wells?",
 "Nothing at all, since the throughput is the plan's own peak and the gas that follows from a gas-oil ratio of 640 scf a barrel, and no well count, depth or trajectory enters it.",
 ["That the four wells deliver the nameplate, since the engine divides the peak across the producers and flags a bottleneck when one cannot carry its share.",
  "That the campaign finishes before first oil, since a utilisation of 1.000000 is reported only once the wells have been dated against the schedule network.",
  "That three of the four are producers, since EG-03 is a water injector and its 42 days are excluded from the throughput the ratio is measured against."],
 "One numerator and three denominators: 60000 bopd against each nameplate, so the FPSO reads 1.000000 and the debottlenecked case 0.400000 on the same production."),

emit(Q, '/root/ec-wip-fdp/banks/ec6i_exam.json')
finish()
