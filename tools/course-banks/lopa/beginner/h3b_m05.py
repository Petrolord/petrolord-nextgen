import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H3 lopa, ASSOCIATE m05 "Outcome States and the Exact Decade".
# Digest sections drawn on: 9 (the six outcome states and the ladder of
# demands), 10 (the low demand bands and where an exact decade falls) and
# 11 (the decade snap and how wide it is).

q(2,
  "How many outcome states does `LOPA_OUTCOME` carry, and which of these is one of them?",
  "Six states, and RISK_REDUCTION_BELOW_SIL1 is one of them.",
  ["Six states, and BELOW_SIL4_TABLE_FLOOR is one of them, which is the word the engine returns for a demand sitting under the bottom of the table.",
   "Four states, and NOT_SIL_RATED is one of them, since a row whose demand falls outside every band still has to be given a word for the worksheet.",
   "Six states, and CAPPED_AT_LIFETIME is one of them."],
  "The constant `LOPA_OUTCOME` lists six: NO_SIF_REQUIRED, RISK_REDUCTION_BELOW_SIL1, SIL1, SIL2, SIL3 and BEYOND_SIL3_REDESIGN. NOT_SIL_RATED and BELOW_SIL4_TABLE_FLOOR belong to `PFD_STATE`, which is a different constant and bands an achieved figure. CAPPED_AT_LIFETIME belongs to neither.")

q(0,
  "A required risk reduction factor of 1 is handed to `outcomeFromRequiredRrf`. What comes back?",
  "NO_SIF_REQUIRED, with the SIL column empty and no target returned.",
  ["RISK_REDUCTION_BELOW_SIL1, with no required SIL and a required PFDavg of 0.100000000000, because a demand of this size is still a demand.",
   "SIL1, with a required SIL of 1 and a required PFDavg of 0.010000000000, since the lowest band on the table has to carry the smallest demands.",
   "NO_SIF_REQUIRED, with a required PFDavg of 0.200000000000."],
  "The ladder of demands gives both 0.5 and 1 the outcome NO_SIF_REQUIRED, with no required SIL and a required PFDavg of null. There is no such thing as a demand for reduction at or below one, so no target is returned. 0.200000000000 is the required PFDavg at a demand of 5 and 0.100000000000 at a demand of 10.")

q(3,
  "At a required risk reduction factor of 5 the engine reports RISK_REDUCTION_BELOW_SIL1. What required PFDavg travels with it, and what does the state mean?",
  "0.200000000000, and it means some reduction is needed and less than a SIL 1 SIF provides by definition.",
  ["0.200000000000, and it means the row has been refused.",
   "0.020000000000, and it means some reduction is needed and less than a SIL 1 function supplies, which the engine reports as a state on the row.",
   "null, and it means no target can be given for a demand below the table."],
  "A demand of 5 sits on the ladder with 0.200000000000 printed beside it. The course's gloss on that word is that some reduction is needed and less than a SIL 1 SIF provides by definition, and the gap can be closed by a function or by one more independent protection layer. Nothing about the state refuses anything. The figure 0.020000000000 sits further down the same ladder, at 50.")

q(1,
  "Which required PFDavg does the engine return at a demand of 100, and which band is that?",
  "0.010000000000, in SIL1.",
  ["0.010000000000, in SIL2, because a demand that has reached a decade boundary is taken into the band above the one it has just left.",
   "0.001000000000, in SIL2, which is the line the ladder of demands prints for a required risk reduction factor of this size on the row.",
   "0.100000000000, in SIL1, which is where the ladder puts a demand of this size."],
  "The ladder gives a demand of 100 the outcome SIL1 with a required SIL of 1 and a required PFDavg of 0.010000000000. An exact decade belongs to the lower SIL, so 100 stays in SIL1. 0.001000000000 is the required PFDavg at a demand of 1000 and 0.100000000000 at a demand of 10.")

q(0,
  "At a demand of 50000 the engine reports BEYOND_SIL3_REDESIGN. What does its note say, and does the required PFDavg lie in the SIL 4 band?",
  "The note says the required PFDavg lies in the SIL 4 band, and the column marks it true.",
  ["The note says no function can supply the required PFDavg.",
   "The note says the row has passed the last band the engine knows, and the column is left empty because no claim about the SIL 4 band is made.",
   "The note names the SIL 4 band, and the column is false."],
  "At a demand of 50000 the engine's note says the required PFDavg lies in the SIL 4 band, and the table's own column reads true for that row. The note saying the required PFDavg is below the SIL 4 band and that no SIF can supply it belongs to a demand of 500000, where the column reads false.")

q(1,
  "Which demand on the ladder is the first whose required PFDavg falls below the SIL 4 band altogether?",
  "500000, whose required PFDavg is 0.000002000000.",
  ["100000, whose required PFDavg is 0.000010000000, because this is the first line on which the engine reports BEYOND_SIL3_REDESIGN for the row.",
   "50000, whose required PFDavg is 0.000020000000, which is the first of the demands the ladder shows past the last band on the table.",
   "10000, whose required PFDavg is 0.000100000000."],
  "The ladder marks 50000 and 100000 as lying in the SIL 4 band, with required PFDavg values of 0.000020000000 and 0.000010000000, and marks 500000 as false, with a required PFDavg of 0.000002000000. The demand of 10000 is still SIL3.")

q(3,
  "Why does the engine never clip a demand beyond SIL 3 to the largest band it knows?",
  "Because the state carries the required PFDavg intact, so a worksheet shows how far beyond the table the row sits.",
  ["Because clipping would change the outcome state on the row.",
   "Because the required PFDavg is the only figure returned for such a row.",
   "Because the table has a SIL 4 band and a row past SIL 3 is placed in it."],
  "The course says beyond SIL 3 is never clipped: the state carries the required PFDavg intact, so a worksheet shows how far beyond the table the row sits. The engine returns the required RRF and the state alongside that figure, and the process sector reads a demand of this size as a signal to change the process.")

q(2,
  "The low demand band table gives SIL 2 which bounds?",
  "A PFDavg from 1e-3 up to 1e-2, and a risk reduction factor above 100 and up to 1000.",
  ["A PFDavg from 1e-2 up to 1e-1, and a factor above 10 and up to 100.",
   "A PFDavg from 1e-4 up to 1e-3, and a risk reduction factor above 1000 and up to 10000, read from the two columns of the low demand table together.",
   "A PFDavg from 1e-3 up to 1e-2, and a risk reduction factor above 1000."],
  "The band table gives SIL 2 a PFDavg from 1e-3 inclusive up to 1e-2 exclusive, and a risk reduction factor above 100 and up to 1000 inclusive. The first alternative is the SIL 1 row and the second is the SIL 3 row. A smaller PFDavg is a larger risk reduction factor, so the two columns run in opposite directions.")

q(0,
  "`silFromPfdAvg` is handed 0.1 and then 0.05. What does it report for each?",
  "0.1 comes back NOT_SIL_RATED with no SIL, and 0.05 comes back SIL 1.",
  ["0.1 comes back SIL 1, because the SIL 1 band runs up to 1e-1 and includes that bound, and 0.05 comes back SIL 1 as well on the same reading.",
   "0.1 comes back NOT_SIL_RATED with no SIL, and 0.05 comes back SIL 2, which is the band the table gives to an achieved figure of that size.",
   "Both come back NOT_SIL_RATED, since neither is inside a band."],
  "The table of achieved figures gives 0.1 the state NOT_SIL_RATED with no SIL, and 0.05 the SIL 1 band with the state SIL. The SIL 1 band runs from 1e-2 inclusive up to 1e-1 exclusive, so a figure of exactly 1e-1 is above the top of the table and sits in no band at all.")

q(3,
  "An achieved PFDavg of 0.000005 is handed to `silFromPfdAvg`. What SIL and state come back, and what does the note say?",
  "SIL 4 with the state BELOW_SIL4_TABLE_FLOOR, and the note says no claim beyond SIL 4 exists.",
  ["No SIL and the state NOT_SIL_RATED, with no note at all.",
   "SIL 4 with the state SIL, since the figure sits inside the SIL 4 band and the table has a row for it on the low demand side of the engine.",
   "SIL 4 with the state BELOW_SIL4_TABLE_FLOOR, and no note."],
  "Below 1e-5 the table has no row, so the engine reports SIL 4 with the state BELOW_SIL4_TABLE_FLOOR and the note that a PFDavg below 1e-5 is off the table and no claim beyond SIL 4 exists. The state NOT_SIL_RATED belongs to a figure above the top of the table, and the state SIL belongs to a figure inside a band.")

q(1,
  "`silFromPfdAvg` returns its band convention as one line in its basis. Which line is it?",
  "IEC 61508-1 Table 2 / IEC 61511-1 low demand: SIL n holds 10^-(n+1) <= PFDavg < 10^-n; an exact decade belongs to the higher-PFD band.",
  ["Each band excludes its lower bound and includes its upper one.",
   "Each band is decided by rounding the figure to the nearest decade first.",
   "The bands overlap at their joins and the engine picks the higher SIL."],
  "That line is the engine's own band convention, quoted verbatim. Each band includes its lower PFDavg bound and excludes its upper one, which is the opposite of the first alternative. Nothing is rounded before banding, and the bands do not overlap.")

q(2,
  "A required risk reduction factor of exactly 100 and one of exactly 10 are put through the band rule. Where does each land?",
  "100 is SIL1 and 10 is below SIL1.",
  ["100 is SIL2 and 10 is SIL1, because a value that has reached a decade has by then crossed into the band above the one it started in.",
   "Both are SIL1, since the SIL 1 band runs from a risk reduction factor above 10 and up to 100 and takes both of its own bounds inclusively.",
   "100 is SIL1 and 10 is SIL1 as well, on the same reading of the table."],
  "Read in risk reduction factors, an exact decade belongs to the lower SIL: an RRF of exactly 100 is SIL 1 and exactly 10 is below SIL 1. The SIL 1 row of the table reads above 10 and up to 100 inclusive, so the lower bound is excluded and the upper bound is included, and a value has to be strictly past a decade to reach the higher band.")

q(0,
  "`DECADE_SNAP` is 1e-9. What does the engine do with it?",
  "It treats a value within that relative distance of a power of ten as the power of ten, for the band and for the comparison with the TMEL.",
  ["It rounds every result to nine decimals before printing it.",
   "It widens each band by that fraction at both of its ends.",
   "It refuses any figure that falls within that distance of a decade."],
  "The course says a value within that RELATIVE distance of a power of ten is treated as the power of ten, for the band and for the comparison of a mitigated frequency with the TMEL. The snap rounds nothing for display, widens no band, refuses nothing, and touches only values within one part in a billion of a decade.")

q(1,
  "Five frequency products whose exact value is a decade are computed in double. How many land strictly above 100, and at what seventeen digit figure?",
  "3 of the 5, at 100.00000000000001.",
  ["3 of the 5, at 100.00000000000000, which is the figure the course shows for those products in its column of seventeen significant digits.",
   "5 of the 5, at 100.00000000000001, because a product of decimal fractions can never be represented exactly in an IEEE double at any size.",
   "2 of the 5, at 100.000001, which is the figure printed beside them."],
  "The course says 3 of the 5 products land strictly above 100 in double, and the column of seventeen significant digits shows 100.00000000000001 for those three. The other two read 100.00000000000000 and so need no snap. 100.000001 belongs to the table of how wide the snap is, where it bands SIL2.")

q(3,
  "An analyst types a required risk reduction factor of 100.0000001 and then one of 100.000001. What does the engine report for each?",
  "100.0000001 gives decadeOf 2 and SIL1, and 100.000001 gives decadeOf null and SIL2.",
  ["Both give decadeOf 2 and the outcome SIL1, because each figure sits close enough to a power of ten for the engine to read it as that power.",
   "100.0000001 gives decadeOf null and SIL2, and 100.000001 gives decadeOf 2 and SIL1, which is the pair the course shows for those two entries.",
   "Both give decadeOf null and the outcome SIL2."],
  "The table of how wide the snap is puts 100.0000001 at a relative distance of 1.00e-9 from 100, inside the snap, so decadeOf is 2 and the outcome is SIL1. 100.000001 sits at 1.00e-8, which is already outside it, so decadeOf is null and the outcome is SIL2. One part in a hundred million is outside the snap.")

emit(Q, '/root/hse-wip-lopa/banks/h3b_m05.json', expect_n=15)
finish()
