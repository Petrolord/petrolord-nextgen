import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H5 qra, ASSOCIATE final exam.
# Digest sections drawn on: 1 and 2 (the engine, its sources, its exports and
# its units), 3 (the refusals this tier owns, rows the modules did not key),
# 4 (the seams), 5 and 6 (the overfill tree and the branch sum tolerance),
# 7, 8 and 9 (the flammable release, the wrong builds and the ignition table),
# 10 and 11 (LSIR and Purple Book Appendix 6.B), 12 (IRPA), 13 and 14 (the
# transect and the golden cases). Every question is new: none rewords a
# module question.

q(2,
  "An analyst wants the LSIR at a list of distances along one line from a release, and where it passes chosen contour levels. Which function is that?",
  "`lsirTransect`",
  ["`locationIndividualRisk`, called once for every distance on the line, since it returns contour crossings when it is given more than one place",
   "`individualRiskPerAnnum`, which takes each distance as a location and returns a crossing wherever the occupancy changes",
   "`thermalFatalityTransect`"],
  "The function table gives `lsirTransect` as the call that takes distancesM, scenarios with fatalityProbabilities and contourLevelsPerYr, and returns the LSIR at each distance and where it crosses each level. `locationIndividualRisk` returns one place's LSIR and no crossings, and `individualRiskPerAnnum` weights places by occupancy. `thermalFatalityTransect` is one of the three functions that run the consequence engine to MAKE a probability of death, which belongs to the consequence course.")

q(0,
  "What does `pbDirectIgnitionProbability` need from its caller?",
  "releaseType, massRateKgS or massKg, and substance.",
  ["The three inputs of the release tree.",
   "releaseType and substance only.",
   "A distance and a wind speed."],
  "The function table lists releaseType, massRateKgS or massKg, and substance, and the call returns the Table 4.5 direct ignition probability and its band. The frequency and the two ignition probabilities are the inputs of `flammableReleaseEventTree`. The size is its own input, a rate for a continuous release or a mass for an instantaneous one, and no distance or wind speed enters the table.")

q(3,
  "The engine names its sources in every `basis`, from its export `QRA_SOURCES`. What does it cite under the key PB?",
  "TNO Purple Book CPR 18E (1999)",
  ["UK HSE, Reducing risks, protecting people (2001), which the engine cites whenever an individual risk is summed at a place",
   "UK HSE, Cost Benefit Analysis (CBA) checklist (2003 values), cited for the event tree and the direct ignition table",
   "The H4 consequence engine, cited as the source of every probability of death it is handed as an input"],
  "The sources table gives PB as TNO Purple Book CPR 18E (1999), and the Purple Book is the source the event tree, LSIR and IRPA bases name. R2P2 and the CBA checklist sit under their own keys and are no source of the tree or the table. A probability of death is a stated input, and the engine's source list carries no key for the consequence engine.")

q(1,
  "Which of the consequence course's and the facilities courses' functions does this engine export?",
  "None of them: it re-grades nothing those courses own, and the jest suite asserts so.",
  ["All of them, so that a learner can check a stated probability of death against the consequence course's own figure.",
   "Only the flare radiation calls, which belong to the facilities courses.",
   "Only the plume call, which belongs to the consequence course."],
  "The digest says the engine re-grades nothing the consequence course or the facilities courses own, exports none of their functions, and that the jest suite asserts so. Flare radiation belongs to the facilities courses and is never used here. A toxic cloud, like a fire or an explosion, is modelled in the consequence course, and this engine takes the probability of death as a stated input.")

q(0,
  "What range does the units table allow for an occupancy?",
  "0 to 1 as a fraction of the year, or 0 to 8760 hours, and no more than the whole year in total.",
  ["0 to 1 as a fraction at each place, with no limit on the total, since each place is checked on its own.",
   "Any number of hours up to 8766, a calendar year with leap days, and any fraction up to 1.",
   "Above 0 only, as for a root frequency."],
  "The units table gives occupancy as a fraction of the year from 0 to 1, or hours from 0 to 8760, and no more than the whole year in total. The total is checked as well as each place, because a person is in one place at a time. The engine converts at 8760 hours a year, and an occupancy of 0 is allowed.")

q(2,
  "Where does the engine draw its line for a zero frequency: at the start of an event tree, or on a scenario at a place?",
  "A root must be above 0 per year; a scenario may carry 0 or more per year.",
  ["Both must be above 0 per year.",
   "A root may be 0 or more; a scenario must be above 0.",
   "Both may be any number, negative ones included."],
  "The units table sets the two apart: an event tree's starting frequency has to be positive, while a scenario handed to the LSIR may sit at zero, as the golden case with-zero-frequency shows. Nothing in the engine accepts a negative frequency, and a scenario at zero simply contributes nothing.")

q(3,
  "Someone leaves the name of a branch blank. Quote the refusal.",
  "tree.branches[0].name: every branch needs a name",
  ["tree.branches[0].name: the branch has been named after its outcome so that its leaf can still be carried into the totals",
   "tree.branches[0].outcome: every leaf needs an outcome before the tree can be pooled into totals by the engine",
   "tree.branches: must be a non-empty list of { name, probability, next? }"],
  "Those are the engine's own words from the refusal table for a branch with no name. The engine names nothing on the analyst's behalf. An outcome is optional, since a leaf with no outcome takes its branch name, and the non-empty list message is real engine text for an empty branch set.")

q(1,
  "A call to the ignition table gives a release type the table does not have. What does the engine say?",
  "releaseType: must be 'continuous' or 'instantaneous'",
  ["releaseType: the release has been read as continuous, the more common of the two types, and looked up in the table",
   "massRateKgS: a continuous release needs a rate above 0 kg/s",
   "substance: must be one of k1-liquid, gas-low-reactivity, gas-average-high-reactivity (PB Table 4.7 classifies reactivity)"],
  "Those are the engine's own words from the refusal table for a release type the table does not have. The engine reads nothing as a default type. The rate message and the substance message are real engine text for two other faults: a continuous release with no rate and a substance class the table does not have.")

q(1,
  "An `lsirTransect` call lists its distances as 0, 50 and then 50 again. What does the engine return?",
  "distancesM[2]: distances must increase strictly",
  ["The LSIR at 0 m and 50 m, the repeat dropped",
   "distancesM: must hold at least two distances",
   "scenarios[0].fatalityProbabilities: 'fire' needs one probability of death per distance (2)"],
  "Those are the engine's own words from the refusal table, naming the third distance, `distancesM[2]`, the first that fails to increase. The engine drops nothing and adds no note, and the length of the list is fine here. The message about one probability of death per distance is real engine text for a scenario one probability short.")

q(3,
  "The delayed ignition input is left out of `flammableReleaseEventTree`. Which message comes back?",
  "delayedIgnitionProbability: must be the probability of delayed ignition GIVEN no immediate ignition, in [0, 1]",
  ["delayedIgnitionProbability: taken as 0, so the whole release that escapes immediate ignition has been counted as no ignition",
   "delayedIgnitionProbability: taken from Purple Book Table 4.5 for the substance class, as the preset split is taken from section 4.8",
   "immediateIgnitionProbability: must be given with the delayed one"],
  "Those are the engine's own words from the refusal table, and they say in capitals that the input is conditional: GIVEN no immediate ignition. The engine invents no number, so it takes no zero and no table value for a missing input. The fault is the delayed ignition probability, which is the field the engine names.")

q(0,
  "`locationIndividualRisk` is called with an empty scenario list. Which field does the refusal name, and why that one?",
  "The field `scenarios`, the whole list, because there is no scenario inside it to point at.",
  ["An LSIR of 0.000000000000 per year",
   "The field `scenarios[0]`, the first entry",
   "No field: the call returns a note"],
  "The refusal table names `scenarios` and quotes the engine: scenarios: must be a non-empty list of scenarios. With nothing in the list there is no position such as `scenarios[0]` to name. The engine never answers an empty call with zero, since a zero would read as a real LSIR, and it never swaps a refusal for a note.")

q(2,
  "Two leaves end with the spill never lit. Pooled, how often per year is that?",
  "0.000085500000",
  ["0.000063000000",
   "0.000022500000",
   "0.001900000000"],
  "The two 'no fire' leaves, 0.000063000000 in the bund and 0.000022500000 outside it, pool into 0.000085500000 per year. Either leaf alone misses the other. 'No release' is a separate outcome, the answered alarm at 0.001900000000 per year, because nothing leaves the tank there.")

q(0,
  "Of the five overfill leaves, which is the rarest, and how rare?",
  "The contained spill that ignites in the bund, at 0.000007000000 per year.",
  ["The overtopped bund that ignites outside it, at 0.000007500000 per year.",
   "The overtopped bund that is never lit, at 0.000022500000 per year.",
   "The answered alarm, at 0.001900000000 per year."],
  "Ranked by frequency the leaves run 0.000007000000 (in the bund, ignited), 0.000007500000 (overtopped, ignited), 0.000022500000 (overtopped, unlit), 0.000063000000 (in the bund, unlit) and 0.001900000000 (alarm answered), so the ignited contained spill is the rarest by a small margin over its overtopped neighbour. The answered alarm is by far the most common leaf.")

q(1,
  "A reviewer's overfill worksheet shows 0.000007000000 per year for the pool fire outcome. What has gone wrong?",
  "Only the leaf ignited in the bund was read; the leaf through the overtopped bund, 0.000007500000, was left out of the pool.",
  ["Nothing: a pool fire can only happen inside a bund, so the leaf outside the bund belongs to a separate outcome altogether.",
   "The initiating frequency was typed as 2e-3 where the tree needs it per hour.",
   "The path probability was used in place of the frequency, which would give a number without a unit per year."],
  "The digest says reading only the first pool fire leaf gives 0.000007000000 per year, which misses the leaf through the overtopped bund. Both leaves carry the outcome 'pool fire', so they pool into 0.000014500000. The initiating frequency of 2e-3 is per year as stated, and a path probability such as 0.003500000000 is a different number from the leaf frequency.")

q(3,
  "Is BRANCH_SUM_TOLERANCE absolute or relative, and how large is it?",
  "Absolute, 1e-9.",
  ["Relative, 1e-9 of the largest probability in the set, so a set of small branches gets a smaller allowance than a large one.",
   "Absolute, 1e-6, wide enough to let a tenth of a millionth through as ordinary rounding.",
   "Relative, one part in ten million of the sum."],
  "The digest says BRANCH_SUM_TOLERANCE is 1e-9, absolute. That covers the double rounding of 0.7, 0.2 and 0.1, which sum to 0.9999999999999999, and refuses a set such as 0.4000001 and 0.6 a tenth of a millionth over one. A tolerance of 1e-6 would pass that typing error, and no relative allowance applies to a branch sum.")

q(2,
  "An analyst counts every delayed ignition of the EREMOR release as an explosion. What explosion frequency does that tree give?",
  "0.000135000000 per year, 2.500000 times the engine's figure.",
  ["0.000054000000 per year, since the split is applied afterwards by the engine whatever the analyst draws.",
   "0.000081000000 per year, 1.500000 times the engine's figure, since counting every delayed ignition as an explosion swaps the split.",
   "0.000315000000 per year, the release that never ignites."],
  "Without a split, every delayed ignition, 0.000135000000 per year, becomes an explosion, which is 2.500000 times the engine's 0.000054000000. The engine runs the tree it is given and cannot know a branch belongs under another, so no split is applied later. 0.000081000000 is the swapped split, a different wrong build, and 0.000315000000 is the 'no ignition' outcome.")

q(2,
  "Which EREMOR outcome follows immediate ignition, and at what frequency?",
  "The jet or pool fire, at 0.000050000000 per year.",
  ["The flash fire, at 0.000081000000 per year, since a flash fire is the first thing to happen when a gas release lights.",
   "The explosion, at 0.000054000000 per year, since immediate ignition of a gas gives a blast before the release spreads.",
   "Nothing: every ignition is delayed."],
  "Immediate ignition gives a jet or pool fire: 5e-4 per year times 0.1 is 0.000050000000 per year. The flash fire and the explosion follow DELAYED ignition of a vapour cloud, on the path through no immediate ignition, at 0.000081000000 and 0.000054000000. The tree has an immediate ignition branch of its own.")

q(0,
  "Which cell does the engine read for an instantaneous 10000 kg release of a gas of low reactivity?",
  "0.04, in the medium band, since 10000 kg is the closed top edge of the middle band.",
  ["0.09, in the large band, since the upper edge of a printed band always opens into the band above it.",
   "0.02, in the small band, which the engine gives an instantaneous 500 kg.",
   "0.065, the k1-liquid cell."],
  "The engine treats both ends of the middle band as inside it, so an instantaneous 10000 kg of gas-low-reactivity reads 0.04 (medium). The large band value of 0.09 starts above that edge, at the 20000 kg row. 0.02 is the small band row for 500 kg, and 0.065 is the liquid column, which is the same at every size.")

q(1,
  "A continuous 5 kg/s leak of gas-low-reactivity: which probability and band apply?",
  "0.02, in the small band.",
  ["0.04, medium.",
   "0.065, small.",
   "0.2, small."],
  "The engine's lookup puts a continuous 5 kg/s of gas-low-reactivity at 0.02, small. 5 kg/s lies below the middle band, which starts at 10 kg/s. 0.065 is the k1-liquid column, and 0.2 the small cell of the average to high reactivity gases.")

q(3,
  "How does the engine's validation record label the cells of its Table 4.5 lookups?",
  "The band-edge cells as its own reading; the interior cells as published.",
  ["Every cell as published, since the table is printed in full in the Purple Book and needs no reading of its own.",
   "Every cell as checked against a second reading, which is why a capstone may ask for any lookup to be graded.",
   "Every cell as the engine's own reading."],
  "The digest says the validation record labels the band-edge cells as the engine's own reading and the interior cells as published. The edges are a reading because the printed band \"10 - 100 kg/s\" says nothing about which band its end points join. Nothing checks the table against a second reading, so every capstone states its ignition probabilities rather than asking for a lookup.")

q(0,
  "Which substance classes does `pbDirectIgnitionProbability` accept, and what does its refusal say classifies them?",
  "k1-liquid, gas-low-reactivity and gas-average-high-reactivity; the refusal cites PB Table 4.7 for the reactivity classes.",
  ["gas-low-reactivity and gas-average-high-reactivity only, since a liquid has no direct ignition probability of its own.",
   "k1-liquid, gas-low-reactivity and gas-average-high-reactivity; the refusal cites Table 4.5 for the classes.",
   "Any name, with an unknown class read as k1-liquid."],
  "The refusal lists exactly k1-liquid, gas-low-reactivity and gas-average-high-reactivity, and its bracket says \"PB Table 4.7 classifies reactivity\". Table 4.5 is the ignition table the lookup reads, which is a different table. k1-liquid has its own column at 0.065, and an unknown name is refused, `constructor` included.")

q(3,
  "On the process deck a stated probability of death of 0.5 applies to the jet or pool fire (0.000050000000 per year). What is that outcome's share of the deck LSIR?",
  "0.000025000000, which is 0.168748 of the process deck LSIR.",
  ["0.000050000000, its whole frequency.",
   "0.000037800000, which is 0.255147 of the process deck LSIR, since the jet or pool fire is weighted the same way as the explosion there.",
   "0.000081000000, the flash fire's share."],
  "Half of 0.000050000000 per year is 0.000025000000, which the engine reports as 0.168748 of the deck's 0.000148150000. Taking the whole frequency treats a one in two chance as a certain death, which overstates it twofold. 0.000081000000 belongs to the flash fire, whose stated probability of death on the deck is 1.")

q(2,
  "In Purple Book Appendix 6.B, what effective cloud width does the source print, and what does the whole chain through the engine give?",
  "86.2 m printed; 86.301293 m through the whole chain.",
  ["86.301293 m printed; 86.2 m through the chain.",
   "86.2 m in both.",
   "361 m in both."],
  "The digest's table prints the effective cloud width as 86.2 m in the source and 86.301293 m through the engine's whole chain. The engine rounds no step, and on the whole chain the engine computes the width itself. 361 m is R, the distance to the grid point, which enters the coverage probability beside the width.")

q(1,
  "What weather and direction probability, PM Pphi, does Appendix 6.B use?",
  "0.0368, the same in the source and the engine.",
  ["0.456, the printed coverage probability.",
   "0.835, the centreline probability of death printed in the source, which the weather and direction term is taken to scale.",
   "1.84e-8, the step 6 frequency."],
  "The digest's table gives PM Pphi as 0.0368 printed and 0.0368 through the engine. 0.456 is the printed coverage probability Pci and 0.835 the printed centreline probability of death Pcl. 1.84e-8 per year is the product f PM Pphi carried into step 6, which already has the frequency folded in.")

q(0,
  "Working Appendix 6.B step by step from the PRINTED values, what does the digest get?",
  "A coverage probability of 0.456038429735 from the printed width of 86.2 m, Pd = 0.835 x 0.456 = 0.380760, and a contribution of 7.0104e-9 per year.",
  ["A coverage probability of 0.456574314811, Pd = 0.380294556093 and a contribution of 0.000000006997 per year.",
   "A coverage probability of 0.456, Pd = 0.381 and a contribution of 7e-9 per year, the printed values with nothing recomputed.",
   "A Pd of 0.832930245430 and a contribution of 0.000000007010 per year."],
  "From the printed values the digest gets a coverage probability of 0.456038429735 from the printed 86.2 m, Pd = 0.835 x 0.456 = 0.380760, and a contribution of 7.0104e-9 per year. 0.456574314811, 0.380294556093 and 0.000000006997 are the whole chain's values. The bare printed values recompute nothing, and 0.832930245430 is the whole chain's centreline value.")

q(3,
  "Which pair gives the centreline probability of death that Appendix 6.B prints, then the value its full recomputation in the golden file reaches?",
  "0.835 in the source; 0.832930245430 in the golden recomputation.",
  ["0.381 in the source; 0.380294556093 in the golden recomputation, which are the two values of the centreline probability of death.",
   "0.835 in both.",
   "0.456 in the source; 0.456574314811 in the golden."],
  "The digest's golden table gives Pcl as 0.835 printed and 0.832930245430 through the whole chain. 0.381 and 0.380294556093 are the two values of Pd = Pcl Pci, after coverage. 0.456 and 0.456574314811 are the coverage probability Pci. The whole chain computes Pcl; this course starts its own steps at the probability of death onward.")

q(3,
  "What contribution per year does the engine's whole Appendix 6.B chain give, against the source's printed 7e-9?",
  "0.000000006997",
  ["0.000000007010",
   "0.000000108000",
   "0.0368"],
  "The whole chain gives 0.000000006997 per year. 0.000000007010 is step 6 through `locationIndividualRisk` with the printed Pd of 0.381, and both reproduce the printed 7e-9 to two significant figures. 0.000000108000 is an EREMOR figure that has nothing to do with the source, and 0.0368 is PM Pphi, a probability.")

q(1,
  "In what unit, and over what range, does the engine carry an individual risk?",
  "Per year, 0 or more.",
  ["A probability from 0 to 1, since it is a chance of death.",
   "Per hour, above 0.",
   "Per working lifetime, from 0 to 1."],
  "The units table gives individual risk per year, 0 or more, like every LSIR and IRPA the engine returns. It is built from frequencies per year, so it is a rate with no upper bound of one, never a bare probability. Hours enter only as occupancy, and the engine reports nothing per lifetime.")

q(2,
  "Which single place dominates the EREMOR operator's IRPA, and with what contribution?",
  "The process deck, at 0.000016912100 per year.",
  ["The accommodation, the most hours.",
   "The control room, at 0.000000597717 per year, since the operator's supervising hours count double there.",
   "All three equally, since the IRPA averages them."],
  "The process deck contributes 0.000016912100 of the 0.000017541379 per year. The accommodation has the most hours, 2560, but the lowest LSIR, so it adds only 0.000000031562. The control room adds 0.000000597717, and nothing counts double. The IRPA is a weighted sum, never an average.")

q(0,
  "An analyst wants to reuse the Purple Book indoor and outdoor fractions as a vulnerability factor in an IRPA. Why does the digest say that is the wrong use?",
  "Those fractions are for societal risk, counting deaths in a population; the vulnerability factor for individual risk is the analyst's own.",
  ["The fractions are right for the IRPA, and the engine applies them by default whenever a place is marked as being indoors.",
   "The fractions are for the ignition table, where they set how much of a release reaches an ignition source inside a building.",
   "The fractions are set by the consequence course as a dose, so they are graded there."],
  "Purple Book indoor and outdoor fractions count deaths in a population cell, which is societal risk and the next tier's work. For one person's IRPA no source the engine read gives a vulnerability factor, so the engine leaves the factor to the analyst and uses 1 when none is supplied. Nothing is applied automatically for a building, and the fractions play no part in the ignition table or in any dose, which belongs to the consequence course.")

q(3,
  "What LSIR does the EREMOR transect give at 200 m?",
  "0.000000600000",
  ["0.000004500000",
   "0.000000020000",
   "0.000000000000"],
  "At 200 m the stated probabilities of death are 0.004 for the jet fire and 0.02 for the explosion, and the engine returns 0.000000600000 per year. 0.000004500000 is the 150 m figure and 0.000000020000 the 300 m figure. The LSIR falls to 0.000000000000 only at 400 m, where both stated probabilities of death are zero.")

q(2,
  "Name the distances at which the line's individual risk falls through 1e-6 and then 1e-7 per year.",
  "At 187.323816 m and 252.680255 m.",
  ["At 126.982958 m and 187.323816 m, the two crossings nearest the release point on this transect.",
   "At 200 m and 300 m, the printed distances.",
   "At 252.680255 m and 350.000000 m, the crossings further out along the transect, beyond the 200 m point."],
  "The engine puts the 1e-6 crossing at 187.323816 m and the 1e-7 crossing at 252.680255 m. 126.982958 m is the 1e-5 crossing and 350.000000 m the 1e-8 crossing. A crossing is interpolated between printed distances, so it never simply takes one of them.")

q(0,
  "Which string does the `lsirTransect` basis print, verbatim?",
  "LSIR(x) = sum f_i P_i(x); contour crossings interpolated in log10(IR) between bracketing points (linear in IR when one side is 0)",
  ["LSIR(x) = max f_i P_i(x); contour crossings taken at the nearest printed distance to each level",
   "LSIR(x) = sum f_i P_i(x); contour crossings interpolated linearly in IR between bracketing points throughout",
   "LSIR = sum f_i x Pd_i, a person present at the location all the time, outdoors and unprotected"],
  "The digest quotes the basis verbatim: LSIR(x) = sum f_i P_i(x); contour crossings interpolated in log10(IR) between bracketing points (linear in IR when one side is 0). The LSIR at a distance is a sum and never a maximum, and interpolation is in log10 except where one side is zero. The last string is the `locationIndividualRisk` model, for one place.")

q(1,
  "The EREMOR transect gives 0.000000020000 per year at 300 m. Where does that come from?",
  "The explosion alone, with a stated probability of death of 0.001; the jet fire's is 0 there.",
  ["The jet fire alone, since a jet fire reaches further than an explosion along any transect the engine is given.",
   "Both scenarios in equal parts, since the engine shares the LSIR out evenly between the scenarios at each distance.",
   "A floor the engine sets so that the 1e-8 crossing can be interpolated."],
  "At 300 m the stated probabilities of death are 0 for the jet fire and 0.001 for the explosion, so the explosion at 2e-5 per year gives 0.000000020000 alone. The engine shares nothing out and sets no floor. Every probability of death is a stated input; which scenario reaches further is read from them.")

q(2,
  "For flammable-pb-table-4.5-large-gas, the oracle's large gas record, which figure is its jet or pool fire?",
  "0.000017500000",
  ["0.000001350000",
   "0.000005250000",
   "0.000200000000"],
  "Its four outcomes come back as 0.000017500000 (jet or pool fire), 0.000001350000 (flash fire), 0.000000900000 (explosion) and 0.000005250000 (no ignition), so the immediate ignition branch carries the largest share of this record. 0.000200000000 belongs to flammable-default, a separate record.")

q(3,
  "What LSIR does the golden case three-scenarios return through `locationIndividualRisk`?",
  "0.000303200000",
  ["0.000148150000",
   "0.000000007010",
   "0.000858000000"],
  "The engine returns LSIR 0.000303200000 per year for three-scenarios. 0.000148150000 belongs to the EREMOR process deck, which has four outcomes and its own inputs. 0.000000007010 is the with-zero-frequency case, and 0.000858000000 is the pooled fire outcome of an event tree case.")

q(0,
  "Which golden LSIR case returns the same 0.000000007010 per year as Appendix 6.B step 6 through `locationIndividualRisk`?",
  "with-zero-frequency, which also carries a scenario at a frequency of zero.",
  ["three-scenarios, whose LSIR of 0.000303200000 per year is the Appendix 6.B contribution scaled up to three scenarios at once.",
   "operator-two-areas, whose IRPA of 0.000041195890 per year carries the Appendix 6.B contribution across two areas.",
   "zero-probability-branch."],
  "The golden case with-zero-frequency returns LSIR 0.000000007010 per year through `locationIndividualRisk`, the same value step 6 gives with the printed probability of death of 0.381, and it shows that a scenario frequency of zero is accepted. three-scenarios returns 0.000303200000 and operator-two-areas is an IRPA case. zero-probability-branch is an event tree case.")

q(1,
  "operator-two-areas is an IRPA record in the golden file. Which pair of figures does it give?",
  "0.000041195890 per year, over 0.236986301370 of the year.",
  ["IRPA 0.000022000000 per year at an occupancy of 1.000000000000, which the full-occupancy case returns for one place.",
   "IRPA 0.000017541379 per year at an occupancy of 0.497716894977, the EREMOR operator's figures over three places.",
   "IRPA 0.000041195890 per year at an occupancy of 1.000000000000."],
  "For operator-two-areas the engine returns 0.000041195890 per year with the two areas together taking 0.236986301370 of the year. The pair 0.000022000000 and 1.000000000000 belongs to full-occupancy, and 0.000017541379 with 0.497716894977 to the EREMOR operator. Two areas that fill under a quarter of the year cannot carry an occupancy of one.")

q(2,
  "IPL credit and SIL determination belong to which course, as the seam table puts it?",
  "The LOPA course, H3.",
  ["This course, at the Associate tier, since both reduce a scenario frequency before it reaches the LSIR.",
   "The consequence course, H4, which also makes each probability of death that this course is handed as an input.",
   "The facilities courses, which the digest says also own flare radiation."],
  "The digest says LOPA, IPL credit and SIL determination belong to the LOPA course (H3), and this course names them only at the seam. The consequence course owns the probability of death, and point source flare radiation and setback distances belong to the facilities courses, so neither owns IPL credit.")

q(3,
  "Point source flare radiation and setback distances: which courses do they belong to?",
  "The facilities courses.",
  ["This course, which uses the radiation from each flare as a stated probability of death at the places nearest to it.",
   "The consequence course, which also fixes how far each place in the plot plan sits from the release.",
   "The LOPA course, which credits distance as a layer of protection in the same way it credits a relief valve."],
  "The seam table says point source flare radiation and setback distances belong to the facilities courses, and they are never used here. This course takes a probability of death as a stated input and computes no radiation. The consequence course owns source terms and probits, which belong there; a setback is a facilities matter and no layer the LOPA course credits.")

q(1,
  "The risk matrix and its scoring belong to which course?",
  "The risk and change course; this course never scores a matrix cell.",
  ["This course, at the Associate tier, where each LSIR is placed in a cell before an IRPA can be formed from it.",
   "The consequence course, which also makes each probability of death that this course is handed as a stated input.",
   "The LOPA course, beside IPL credit."],
  "The digest says the risk matrix and its scoring belong to the risk and change course, and this course never scores a matrix cell. An LSIR is a frequency per year and an IRPA a weighted sum, and neither passes through a cell. The consequence course owns the probability of death, and the LOPA course owns IPL credit.")

q(0,
  "The EREMOR process deck LSIR is 0.000148150000 per year and the control room's is 0.000006545000. The four outcome frequencies are the same at both places. What makes the difference?",
  "The stated probabilities of death, which are far larger on the process deck than in the control room for every outcome.",
  ["The occupancy of each place, since the control room is manned for fewer hours of the year than the process deck is.",
   "The distance from each place to the release, which the engine reads from the plot plan and turns into a lower frequency for the more distant place.",
   "The vulnerability factor, which the engine sets lower for a building than for an open deck."],
  "An LSIR is the sum of f times Pd at one place, and with the same frequencies at both places only the stated probabilities of death differ: 0.5, 1, 0.7 and 0.3 on the process deck against 0.02, 0, 0.1 and 0.01 in the control room. An LSIR carries no occupancy, the engine reads no plot plan and changes no frequency, and a vulnerability factor is the analyst's own and enters only the IRPA.")

emit(Q, '/root/hse-wip-qra/banks/h5b_exam.json', expect_n=42)
finish()
