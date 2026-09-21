import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H3 lopa, ASSOCIATE final exam.
# Digest sections drawn on: 1 and 2 (the engine, its constants and its units),
# 3 (the refusals this tier owns), 4 and 5 (the scenario and a forgotten
# factor), 6 (IPL credit), 7 and 8 (the tolerance and the gap), 9, 10 and 11
# (outcome states, the bands and the decade snap), 12 (the golden scenarios),
# 13 (the risk matrix seam) and 32 (the vocabulary).

q(2,
  "The constant `PFD_STATE` carries three names. Which set is it?",
  "NOT_SIL_RATED, SIL and BELOW_SIL4_TABLE_FLOOR.",
  ["NO_SIF_REQUIRED, SIL and BELOW_SIL4_TABLE_FLOOR, which are the words the engine uses when it places an achieved figure on the low demand table.",
   "NOT_SIL_RATED, SIL1, SIL2 and SIL3.",
   "FOUND, UNACHIEVABLE and CAPPED_AT_LIFETIME."],
  "`PFD_STATE` is listed in the constants table as NOT_SIL_RATED, SIL and BELOW_SIL4_TABLE_FLOOR. NO_SIF_REQUIRED belongs to `LOPA_OUTCOME`, the band numbers are returned beside a state and are no states themselves, and the third set belongs to a call this tier does not use.")

q(0,
  "How many architectures does the constant `ARCHITECTURES` name?",
  "Five: 1oo1, 1oo2, 2oo2, 2oo3 and 1oo3.",
  ["Four: 1oo1, 1oo2, 2oo2 and 2oo3, since a third channel is a case the engine treats as a variation of the second and does not name on its own.",
   "Three: 1oo1, 1oo2 and 2oo3, which are the arrangements a low demand function is built in and the only ones the constant carries.",
   "Five, and the constant also names a high demand mode."],
  "The constants table gives `ARCHITECTURES` as 1oo1, 1oo2, 2oo2, 2oo3 and 1oo3, five in all. The engine has no high demand or continuous mode at all, so no such name appears beside them.")

q(3,
  "What does the units table say about the two failure rate fields?",
  "Both are per hour and zero or more, and they are never both zero.",
  ["Both are per hour and above zero, so neither may be zero.",
   "Both are per year and zero or more, so that they sit in the same unit as the initiating event frequency and the tolerable frequency do.",
   "Both are dimensionless fractions between zero and one."],
  "The units table gives lambdaDU and lambdaDD as per hour, zero or more, and never both zero. Either may be zero on its own, which is how a channel with no detected failures is described. The verification half works in hours and the determination half in years, and neither rate is a fraction.")

q(1,
  "The units table sets a relation between the proof test interval and the lifetime. What is it?",
  "T1 must be above 0 and T2 must be at least T1.",
  ["T1 above 0 and T2 strictly greater than T1.",
   "T1 and T2 are both given in years, and T2 must be at least eight of them, which is the longest interval the engine will sweep to in its own tables.",
   "T1 must be at least T2."],
  "The units table gives T1 above 0, MTTR and MRT zero or more, and T2 at least T1. At least allows the two to be equal. All four are times in hours, and the engine sets no minimum lifetime of its own.")

q(0,
  "An analyst passes the IPLs as a single object and not as a list. What does the engine return?",
  "ipls: must be a list of { name, pfd, independent }",
  ["ipls[0].name: every IPL needs a name, because the engine reads the object it was handed as a single unnamed layer before it checks anything else",
   "ipls: the summed IPL PFDs reach 1, which is not a probability, so the list the engine was handed cannot be carried into the product for this row",
   "ipls[0].pfd: the layer carries no figure"],
  "The refusal table gives the field as `ipls` with the engine's own message that it must be a list of { name, pfd, independent }. The engine does not try to read the object as one layer, so the name and figure refusals never arise. IPL PFDs on a LOPA row are multiplied and never summed.")

q(2,
  "An IPL entry arrives with a figure and a flag and no name. Which field does the engine name?",
  "`ipls[0].name`",
  ["`ipls`, because a list holding an entry the engine cannot identify is not a list of layers it will carry through the product for the row",
   "`ipls[0]`, which is the whole entry, since the engine reports the layer it objected to and lets the analyst find the missing part of it",
   "`ipls[0].independent`"],
  "The refusal table names `ipls[0].name` and the message is that every IPL needs a name. The field named is always the offending input down to its position in the list and its own key, which is why the whole list and the whole entry are both the wrong answer here.")

q(1,
  "An IPL is entered with a PFD of zero. What reason does the engine attach to its refusal?",
  "a PFD of 0 is a perfect layer, which none is",
  ["a probability of 0 means the scenario cannot happen, which is not a LOPA scenario, so the figure cannot be carried into the product for the row",
   "a layer with no chance of failing on demand would divide the frequency by zero, and the engine will not form a quotient it cannot report",
   "a PFD of 0 is below the table"],
  "The refusal table quotes the engine: the entry must have a PFD above 0 and no more than 1, because a PFD of 0 is a perfect layer, which none is. The clause about a scenario that cannot happen belongs to the enabling condition refusal. No quotient is formed and no band is consulted, because a refusal replaces the result.")

q(3,
  "A proposed function is typed with a PFDavg above one. What comes back?",
  "sifPfdAvg: must be a PFDavg above 0 and no more than 1",
  ["sifPfdAvg: the proposed function has been clipped to 1 and the row has been computed with that value, which the engine reports as a warning",
   "requiredSifPfdAvg: the proposed figure is above the target this row demands, so the loop the analyst was closing cannot be closed with it",
   "tmelPerYr: no function above one meets any tolerance"],
  "The refusal table names `sifPfdAvg` and gives the engine's message that it must be a PFDavg above 0 and no more than 1. Nothing is clipped and no warning is returned. A proposal above the target is a result and never a refusal, and it is reported through `meetsTmel`.")

q(1,
  "Why does this course never use the word the risk courses use for a consequence category?",
  "Because LOPA is frequency based, and a consequence is described in words and carried by its TMEL.",
  ["Because the word means something else in two other live courses of the academy.",
   "Because the engine returns a category of its own on every row.",
   "Because the word belongs to the high demand mode."],
  "The vocabulary table gives the rule: the word is never used, because LOPA is frequency based and a consequence is described in words and carried by its TMEL. The fluid and metering courses are the reason the beta factor is always written in full, which is a different row of the same table.")

q(3,
  "The vocabulary table legislates how the two probability words are written. What is the rule?",
  "PFDavg for a SIF or a subsystem, and IPL PFD for a layer's credited figure.",
  ["PFDavg for a layer's credited figure, and IPL PFD for a whole function.",
   "PFDavg everywhere, including for a credited layer.",
   "Either word may be used for either quantity."],
  "The vocabulary table gives PFDavg for a SIF or a subsystem, an average over the proof test interval, and IPL PFD for the single figure an analyst credits for one layer. The two quantities are different and the two names are fixed, so neither may stand in for the other.")

q(0,
  "An enabling condition and a conditional modifier are defended in different ways. Which pairing is right?",
  "The condition by how much of the year the plant is in that configuration, the modifier by an argument about ignition or occupancy.",
  ["The condition by an argument about ignition or occupancy, the modifier by the share of the year in that configuration.",
   "Both by the same evidence, since the engine multiplies them at the same place.",
   "The condition by an audit record, the modifier by a proof test result."],
  "An enabling condition is a state that must hold for the initiating event to lead anywhere, so it is defended by the fraction of time the plant is in that state. A conditional modifier is the probability that the consequence follows, so it is defended by an argument about ignition or about somebody being in reach. Audit records and proof tests belong to the layers.")

q(2,
  "A LOPA row is frequency based. Which comparison does the method make?",
  "A frequency per year formed from probabilities, compared with a TMEL per year.",
  ["A consequence category compared with the bands of a corporate matrix.",
   "A frequency per year compared with the row's own uncredited frequency.",
   "A matrix score compared with a matrix band."],
  "The seam says it plainly: a LOPA row multiplies a frequency per year by probabilities and compares the result with a TMEL per year. Nothing in this engine takes a consequence category, a matrix score or a matrix band. The unmitigated frequency is a reporting figure and is never the thing the tolerance is compared with.")

q(0,
  "With exactly one enabling condition on a row, what does `enablingProduct` come to?",
  "That condition itself, which on this row is 0.300000000000.",
  ["The condition multiplied by the conditional modifiers, which on this row brings the key to 0.100000000000 before the layers are applied to it.",
   "One, because a single entry leaves the product of the list at its neutral value until a second condition has been added to the row.",
   "0.045000000000, the condition itself."],
  "With one condition on the row the product is simply that condition, and the digest prints `enablingProduct` as 0.300000000000 for it. 0.100000000000 is `modifierProduct`, which is the other list, and 0.045000000000 per year is the frequency this row reports when the condition is left off altogether.")

q(3,
  "In the table of the same row run five ways, what does the derived column read for the line with nothing left out?",
  "1.000000, against an unmitigated frequency of 0.013500000000 per year.",
  ["1.000000, against 0.000013500000 per year, the completed row.",
   "3.333333, against an unmitigated frequency of 0.013500000000 per year, because the full row is compared with the row missing its condition.",
   "10.000000, against 0.135000000000 per year."],
  "The first line of that table reads nothing left out, 0.013500000000 per year, derived 1.000000, because the derived column is each frequency over the full row and the full row is one times itself. 0.000013500000 per year is the mitigated frequency, further down the chain, and the other two pairs are other lines of the same table.")

q(1,
  "Which figure in the forgotten factor table is reached by dropping the term that describes the plant's configuration?",
  "0.045000000000 per year.",
  ["0.027000000000 per year, which is where the row lands when the first of its two conditional modifiers is the term left off the worksheet.",
   "0.135000000000 per year, because the configuration term is the largest single factor and dropping it carries the row to the top of the table.",
   "0.013500000000 per year."],
  "The configuration term is the enabling condition, the separator on the high pressure manifold, and the table gives the enabling condition left out as 0.045000000000 per year. 0.027000000000 per year is ignition left out, 0.135000000000 per year is every modifier left out, and 0.013500000000 per year is the full row.")

q(2,
  "Which omission carries the derived figure 2.000000 in that table?",
  "Ignition left out.",
  ["The blast zone modifier left out, whose stated probability is the smaller of the two the row carries and so the larger factor when dropped.",
   "The enabling condition left out, which is the only single term in the table whose derived figure is not a whole number at all.",
   "Every modifier left out at once."],
  "Ignition left out reads 0.027000000000 per year with a derived 2.000000, the reciprocal of its stated 0.5. The blast zone modifier left out reads 5.000000, the enabling condition left out reads 3.333333, and every modifier left out reads 10.000000.")

q(1,
  "What stated IPL PFD does the relief valve sized for the blocked outlet case carry, and how does it compare with the other three entries?",
  "0.01, against 0.1 on each of the other three.",
  ["0.1, the same figure as each of the other three entries, so the four layers on this row differ only in their flags and never in their figures.",
   "0.01, against 0.1, 0.001 and 0.001 elsewhere.",
   "0.001, against 0.1 on the other three."],
  "The table of four layers gives the relief valve 0.01 and gives 0.1 to the high level alarm, the BPCS level trip and the operator round alike. So the relief valve is a decade better than any other entry on the list, and no entry carries 0.001.")

q(3,
  "An IPL is entered with no `independent` flag at all. How is it treated?",
  "The same way as one flagged with a string: it is not credited.",
  ["It is credited, because the credit rule only removes credit from a layer whose independence has been actively denied by the analyst who typed it.",
   "The call is refused and the engine names the field, since the credit rule cannot be applied to an entry whose independence flag is absent.",
   "It is credited at the figure entered, with a warning."],
  "The digest says the test is on the value true itself, that an IPL whose independent is the string yes is not credited, and that a missing flag is treated the same way. Credit is given only when the analyst has asserted independence in the one form the engine accepts. Nothing here is refused and no warning is returned.")

q(0,
  "Which two stated figures multiply to the credited product on the ORONI row?",
  "0.1 and 0.01.",
  ["0.1 and 0.1, the two layers on the list that describe an action taken by a person rather than by a piece of mechanical equipment.",
   "0.3 and 0.1, which are the configuration figure and the alarm figure, taken together as the product the engine credits for this row.",
   "0.01 and 0.01, the relief valve counted twice."],
  "The credited layers are the high level alarm with operator response at 0.1 and the relief valve sized for the blocked outlet case at 0.01, and their product is `iplProduct`. 0.3 belongs to the enabling condition and is no layer, and the relief valve takes one credit only.")

q(2,
  "Between which two figures does the mitigated frequency move when the two uncredited layers are credited as well?",
  "From 0.000013500000 per year to 0.000000135000 per year.",
  ["From 0.013500000000 per year to 0.000013500000 per year, which is the step the two layers the engine does credit already make on this row.",
   "From 0.000013500000 to 0.000001000000 per year.",
   "From 0.000013500000 per year to 0.000000067500 per year."],
  "The digest says with all four IPLs credited the mitigated frequency reads 0.000000135000 per year against 0.000013500000. The first alternative is the effect of the two layers already credited, 0.000001000000 per year is the TMEL, and 0.000000067500 per year is a frequency from the table of proposed functions.")

q(1,
  "The credit rule opens with a clause about counting. What does that clause say and why is it there?",
  "An IPL is credited once, because one piece of hardware counted twice would halve the frequency twice.",
  ["An IPL is credited once for each scenario it protects on a worksheet.",
   "An IPL is credited once for each flag it carries, so twice if both are set.",
   "An IPL is credited once per proof test interval."],
  "The rule begins with the words that an IPL is credited once, and the digest gives the reason under ONE CREDIT PER IPL: a layer counted twice would halve the frequency twice for one piece of hardware. The rule is about one row and one layer, and it has nothing to do with the number of flags or with any interval.")

q(3,
  "Tighten this row's tolerance to 1e-8 per year. Which three figures does the engine report?",
  "1350.000000, SIL3 and 0.000740740741.",
  ["1350.000000, SIL2 and 0.000740740741, because the demand has moved by one step of ten and so stays inside the band it was already in.",
   "135.000000, SIL3 and 0.007407407407, which is the line the ladder of tolerances gives to this particular tolerable frequency for the row.",
   "13500.000000, SIL3 and 0.000074074074."],
  "The ladder gives 1e-8 per year a required RRF of 1350.000000, the outcome SIL3 and a required PFDavg of 0.000740740741. A demand of 1350.000000 is above 1000, so it is past the SIL2 band. The other two triples are the lines above and below it on the same ladder.")

q(0,
  "The last line of the ladder of tolerances is 1e-10 per year. What does the row report there?",
  "135000.000000, BEYOND_SIL3_REDESIGN and a required PFDavg of 0.000007407407.",
  ["135000.000000, BEYOND_SIL3_REDESIGN and a required PFDavg of null.",
   "13500.000000, BEYOND_SIL3_REDESIGN and a required PFDavg of 0.000074074074.",
   "135000.000000, SIL3 and 0.000007407407."],
  "The ladder's last line gives 1e-10 per year a required RRF of 135000.000000, the outcome BEYOND_SIL3_REDESIGN and a required PFDavg of 0.000007407407. The state carries its required PFDavg intact and never returns null, and the triple with 13500.000000 is the line above.")

q(2,
  "Why can a function carrying the correct SIL on its datasheet still miss the tolerance?",
  "Because a SIL is a band ten times wide and the required PFDavg is one number inside it.",
  ["Because a datasheet quotes an RRF and the row demands a PFDavg, read the other way.",
   "Because a datasheet bands on the high demand table and the engine on the low.",
   "Because a datasheet figure is an average and a required figure is not."],
  "The digest says a SIL is a band ten times wide, the required PFDavg is one number inside it, and a SIF anywhere in the band above that number misses the TMEL. A required RRF and a required PFDavg are reciprocals and both are reported, and every band in this engine is low demand.")

q(1,
  "A function of 0.02 is proposed against a row requiring 0.007407407407. What does the table of proposals show?",
  "Its own band is 1, it leaves 0.000000270000 per year, and it misses.",
  ["Its own band is 2, it leaves 0.000000270000 per year, and it misses, because the proposal sits inside the band the row requires and above the target.",
   "Its own band is 1, it leaves 0.000000121500 per year, and it misses.",
   "Its own band is 1, it leaves 0.000000270000 per year, and it meets the tolerance."],
  "The table of proposals gives 0.02 its own band of 1, a mitigated frequency with the SIF of 0.000000270000 per year and `meetsTmel` false. The figure 0.000000121500 per year belongs to the proposal at 0.009, which is the one banded 2 and still missing.")

q(3,
  "Which of the four proposed functions leaves the row at 0.000000006750 per year?",
  "The one at 0.0005, whose own band is 3.",
  ["The one at 0.005, whose own band is 2, and which is the first of the four proposals on the table to meet the tolerance on this row.",
   "The one at 0.009, whose own band is 2, and which sits inside the band the row requires while still missing the tolerance it is held to.",
   "The one at 0.02, whose own band is 1."],
  "The table gives the proposal at 0.0005 an own band of 3 and a mitigated frequency of 0.000000006750 per year, meeting the tolerance. The proposal at 0.005 leaves 0.000000067500 per year, the one at 0.009 leaves 0.000000121500 per year and the one at 0.02 leaves 0.000000270000 per year.")

q(0,
  "What does the digest conclude from the proposal that is banded correctly and still misses?",
  "The band is a label and the required PFDavg is the target.",
  ["The band and the target agree whenever a function has been verified, so a correctly banded function that misses has not been verified properly.",
   "The band should be tightened by one step whenever a row sits near the middle of it, which is how a specification leaves itself some margin.",
   "The band should be quoted and the required PFDavg left out of the specification."],
  "The digest states it in two sentences after the proposal at 0.009: the band is a label and the required PFDavg is the target. Both figures go into the record, because the band drives the requirements the standards attach to it and the number is what a function is checked against.")

q(2,
  "A demand of 10000 is put to `outcomeFromRequiredRrf`. Which line of the ladder is that?",
  "SIL3, with a required PFDavg of 0.000100000000.",
  ["BEYOND_SIL3_REDESIGN, with a required PFDavg of 0.000100000000, since this demand has passed the last band the low demand table carries.",
   "SIL3, with a PFDavg of 0.000200000000.",
   "SIL2, with a required PFDavg of 0.000100000000."],
  "The ladder gives a demand of 10000 the outcome SIL3 and a required PFDavg of 0.000100000000. The band table gives SIL 3 a risk reduction factor above 1000 and up to 10000 inclusive, so this demand sits on the inclusive edge of that band. 0.000200000000 belongs to a demand of 5000.")

q(1,
  "Which required PFDavg belongs to a demand of 50, and what band is it?",
  "0.020000000000, in SIL1.",
  ["0.020000000000, in RISK_REDUCTION_BELOW_SIL1, because a demand of this size is smaller than the lowest banded function covers on the table.",
   "0.002000000000, in SIL2, which is the line the ladder of demands gives to a required risk reduction factor of exactly this size.",
   "0.200000000000, in SIL1."],
  "The ladder gives a demand of 50 the outcome SIL1, a required SIL of 1 and a required PFDavg of 0.020000000000. RISK_REDUCTION_BELOW_SIL1 runs up to a demand of 10, 0.002000000000 belongs to a demand of 500 and 0.200000000000 to a demand of 5.")

q(3,
  "A row demands 500. Which outcome and required PFDavg does the engine give?",
  "SIL2, with a required PFDavg of 0.002000000000.",
  ["SIL1, with a required PFDavg of 0.002000000000, because the demand has not yet passed the top of the lowest band the table names for a row.",
   "SIL2, with a required PFDavg of 0.020000000000, which is the pair the ladder of demands prints for a required risk reduction factor of this size.",
   "SIL3, with a required PFDavg of 0.000200000000."],
  "The ladder gives a demand of 500 the outcome SIL2, a required SIL of 2 and a required PFDavg of 0.002000000000. The SIL2 band runs above a risk reduction factor of 100 and up to 1000, so a demand of 500 is inside it. 0.020000000000 belongs to a demand of 50 and 0.000200000000 to 5000.")

q(0,
  "At a demand of 100000 the engine returns a note. What does it say, and what is the required PFDavg?",
  "It says the required PFDavg lies in the SIL 4 band, and the figure is 0.000010000000.",
  ["It says no function can supply the figure, and the figure is 0.000010000000.",
   "It says the demand is past the last band, and the figure is returned as null.",
   "It says the PFDavg lies in the SIL 4 band, and the figure is 0.000002000000."],
  "The ladder gives a demand of 100000 the note that the required PFDavg lies in the SIL 4 band, with a required PFDavg of 0.000010000000 and the SIL 4 column reading true. The note about no function being able to supply the figure belongs to a demand of 500000, whose required PFDavg is 0.000002000000.")

q(2,
  "Which bounds does the band table give SIL 3?",
  "A PFDavg from 1e-4 up to 1e-3, and a risk reduction factor above 1000 and up to 10000.",
  ["A PFDavg from 1e-5 up to 1e-4, and a risk reduction factor above 10000 to 100000.",
   "A PFDavg from 1e-3 up to 1e-2, and a risk reduction factor above 100 to 1000.",
   "A PFDavg from 1e-4 up to 1e-3, and a risk reduction factor above 100."],
  "The band table gives SIL 3 a PFDavg from 1e-4 inclusive up to 1e-3 exclusive, with a risk reduction factor above 1000 and up to 10000 inclusive. The first alternative is the SIL 4 row and the second is the SIL 2 row.")

q(1,
  "The band table has a row for SIL 4. What risk reduction factors does it cover?",
  "Above 10000 and up to 100000.",
  ["Above 100000 and up to 1000000, since each band is a decade wide and SIL 4 sits one decade above the highest banded function the table names.",
   "Above 1000 and up to 10000, which is the range the low demand table gives the highest of the bands it carries a row for at all.",
   "Above 10000, with no upper bound at all."],
  "The band table gives SIL 4 a PFDavg from 1e-5 up to 1e-4 and a risk reduction factor above 10000 and up to 100000. Above 1000 and up to 10000 is the SIL 3 row. The table does have an upper bound, and below 1e-5 the engine reports the state that says the figure is off the table.")

q(3,
  "`silFromPfdAvg` is handed 0.001 and then 0.0001. Which bands come back?",
  "SIL 2 for the first and SIL 3 for the second.",
  ["SIL 3 for the first and SIL 4 for the second, because a value that has reached a decade is taken into the band above the one it has left.",
   "SIL 2 for both, since each figure sits within a decade of the other and the table resolves both of them onto the same row when it bands them.",
   "SIL 1 for the first and SIL 2 for the second."],
  "The table of achieved figures gives 0.001 the band SIL 2 and 0.0001 the band SIL 3, both with the state SIL. Each band includes its lower PFDavg bound, so a figure of exactly 1e-3 stays in SIL 2 and a figure of exactly 1e-4 stays in SIL 3.")

q(2,
  "What note does the engine return with a PFDavg below the bottom of the table?",
  "PFDavg below 1e-5 is off the table: no claim beyond SIL 4 exists",
  ["PFDavg below 1e-5 is off the table, so the figure has been raised to the table floor and the band reported is the one that floor falls in",
   "PFDavg below 1e-5 is off the table, and the engine has refused the call and named the field the offending figure was typed into",
   "the required PFDavg is below the SIL 4 band: no SIF can supply it, redesign"],
  "That is the engine's own note, returned with SIL 4 and the state BELOW_SIL4_TABLE_FLOOR. Nothing is raised to the floor and nothing is refused: the figure stays visible and the state says where it sits. The note about a required PFDavg below the SIL 4 band is the one a demand of 500000 returns on the determination side and belongs to a different call.")

q(0,
  "One of the five decade products is 0.3 x 0.1 against a stated tolerable frequency of 3e-4. What does it come to in double, and how would a plain comparison band it?",
  "100.00000000000000, and a plain comparison would band it SIL1.",
  ["100.00000000000001, and a plain comparison would band it SIL2, which is the pair of readings the digest prints for this product in its table.",
   "100.00000000000000, and a plain comparison bands it SIL2.",
   "100.000001, and a plain comparison would band it SIL2."],
  "The table of decade products gives 0.3 x 0.1 at 3e-4 the double 100.00000000000000, with decadeOf 2, the outcome SIL1 with the snap, and SIL1 from a plain comparison as well. This is one of the two products that needs no snap. 100.000001 belongs to the table of how wide the snap is.")

q(1,
  "Which of the stated decade products lands at 100.00000000000001 and would be banded SIL2 without the snap?",
  "0.2 x 0.5 x 0.1 against a tolerable frequency of 1e-4.",
  ["0.7 x 0.1 x 0.1 against a tolerable frequency of 7e-5, which is one of the products whose double sits strictly above the decade it belongs on.",
   "0.3 x 0.1 against a tolerable frequency of 3e-4.",
   "0.9 x 0.1 against 9e-4 and no other."],
  "The table gives 0.2 x 0.5 x 0.1 at 1e-4 the double 100.00000000000001 and the plain comparison SIL2. The products 0.1 x 0.1 x 0.1 at 1e-5 and 0.9 x 0.1 at 9e-4 do the same, so three of the five land there. The rows with 0.3 x 0.1 and 0.7 x 0.1 x 0.1 read 100.00000000000000.")

q(2,
  "A required risk reduction factor of 99.9999999 is typed in. What does the engine report?",
  "decadeOf 2 and the outcome SIL1, at a relative distance of 1.00e-9.",
  ["decadeOf null and the outcome RISK_REDUCTION_BELOW_SIL1, because the figure has not yet reached the decade at which the SIL 1 band begins.",
   "decadeOf null and the outcome SIL1, the snap working upward only.",
   "decadeOf 2 and the outcome SIL2."],
  "The table of how wide the snap is gives 99.9999999 a relative distance of 1.00e-9 from 100, with decadeOf 2 and the outcome SIL1. The snap works on a relative distance in either direction, so a figure just below a decade is read as that decade in the same way as one just above it.")

q(0,
  "The golden case rrf-exactly-10 is run through the engine. What does it report?",
  "10.000000 with the outcome RISK_REDUCTION_BELOW_SIL1.",
  ["10.000000 with the outcome SIL1, because an exact decade belongs to the band that has the decade as its own inclusive upper bound.",
   "10.000000 with the outcome NO_SIF_REQUIRED.",
   "1.000000 with the outcome RISK_REDUCTION_BELOW_SIL1."],
  "The golden table gives rrf-exactly-10 a required RRF of 10.000000, the rational 10/1 and the outcome RISK_REDUCTION_BELOW_SIL1, with `meetsTmel` false. Read in risk reduction factors an exact decade belongs to the lower SIL, so 10 is below SIL 1. 1.000000 belongs to the golden case f-equals-tmel.")

q(1,
  "What does the golden case non-independent-not-credited show?",
  "A required RRF of 100.000000 with the outcome SIL1 and a relative difference of 0.",
  ["A required RRF of 100.000000 with SIL2, a band higher for the uncredited layer.",
   "A required RRF of 90.000000 with the outcome SIL1 and a relative difference of 0.",
   "A required RRF of 100.000010 with SIL2."],
  "The golden table gives non-independent-not-credited a required RRF of 100.000000, the outcome SIL1, `meetsTmel` false and a relative difference of 0. 90.000000 belongs to enabling-and-sif and 100.000010 to rrf-just-above-100.")

q(3,
  "Which golden case is named for a proposed function that does not quite close its row, and what does it report?",
  "sif-just-short, at 300.000000 with SIL2 and the tolerance missed.",
  ["enabling-and-sif, at 90.000000 with SIL1 and the tolerance missed, which is the case the golden keeps for a proposal that falls short of it.",
   "ipl-sufficient, at 0.100000 with NO_SIF_REQUIRED and the tolerance met, since a row closed by its layers needs no proposal to be short.",
   "beyond-sil4-band, at 200000.000000 with the tolerance missed."],
  "The golden table gives sif-just-short a required RRF of 300.000000, the outcome SIL2, `meetsTmel` false and a relative difference of 0. enabling-and-sif meets its tolerance, ipl-sufficient needs no function, and beyond-sil4-band is a redesign case.")

q(1,
  "How many records does the vendored golden carry in all, and who wrote them?",
  "76 records, written by the stdlib oracle in exact rational arithmetic.",
  ["76 records, written by the engine itself and stored beside it.",
   "13 records, written by the stdlib oracle in exact arithmetic.",
   "76 records, taken from a published table."],
  "The digest's engine note says the vendored golden carries 76 records, written by the stdlib oracle in exact rational arithmetic. 13 is the number of LOPA scenarios among them. A golden written by the engine would check nothing, and only some of the records come from a published source.")

emit(Q, '/root/hse-wip-lopa/banks/h3b_exam.json', expect_n=42)
finish()
