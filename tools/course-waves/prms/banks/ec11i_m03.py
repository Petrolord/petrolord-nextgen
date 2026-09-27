import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC11 Professional m03, Incremental and Cumulative Categories.
# Every figure and every engine message is quoted from digest.txt, where the
# engine returned it on the Ekene fixture or a stated golden input, and every
# key was re-run through the vendored engine by the writer's witness
# (scratch/bank-intermediate). No capstone name, input or value appears.

q(3, "The Ekene Main Reserves are stated cumulatively as 8.890000, 16.650000 and 24.990000 MMbbl. What Probable (P2) does the engine return?",
 "7.760000 MMbbl",
 ["16.650000 MMbbl",
  "8.340000 MMbbl",
  "8.890000 MMbbl"],
 "The increment is a difference: Probable (P2) is the 2P less the 1P, and the engine returns 7.760000 MMbbl. 16.650000 is the cumulative 2P, which already includes the Proved (P1). 8.340000 is the Possible (P3), the 3P less the 2P. 8.890000 is the Proved (P1), which equals the 1P.")

q(1, "On the same cumulative Ekene Main set, which figure carries the P90 label, and as which category?",
 "8.890000 MMbbl, as the 1P low estimate",
 ["24.990000 MMbbl, as the 3P, the 90th percentile of the range",
  "16.650000 MMbbl, the 2P",
  "7.760000 MMbbl, the Probable (P2)"],
 "P90 is always the low estimate: the quantity met or exceeded with at least 90 percent probability when the method is probabilistic, so it sits on the 1P, 8.890000. The 3P carries the P10 label and the 2P the P50. An increment carries no probability label at all; the engine prints the labels beside the cumulative rows only.")

q(0, "The golden input cat-faq33-incremental states Reserves as a first increment of 5, a second of 2 and a third of 3 MMbbl. Which 2P and 3P does the engine build?",
 "10.000000 for the 3P, with the 2P at 7.000000",
 ["3.000000 for the 3P, with the 2P at 2.000000: slices read as categories",
  "3.000000 for the 3P, with the 2P at 7.000000",
  "7.000000 for the 3P, with the 2P at 5.000000, one slice behind"],
 "Cumulative categories are running sums of the increments: 1P = P1 = 5, 2P = P1 + P2 = 7 and 3P = P1 + P2 + P3 = 10, which the engine returns as 7.000000 and 10.000000. Reading a slice as a category ignores that each category includes the ones below it. Shifting the sums by one slice drops the Possible (P3) from the 3P.")

q(2, "Ekene North's Contingent Resources are stated incrementally as C1 3.000000, C2 1.500000 and C3 2.000000. What 2C does the engine return?",
 "4.500000",
 ["1.500000",
  "6.500000",
  "3.000000"],
 "The 2C is C1 plus C2, 3.000000 plus 1.500000, and the engine returns 4.500000, the same figure it gives when the set is stated cumulatively (golden input cat-contingent-cumulative). 1.500000 is the slice C2 alone. 6.500000 is the 3C, which adds C3. 3.000000 is the 1C, the first slice.")

q(0, "In the engine's category output, which rows carry a probability label such as P90, P50 or P10?",
 "The cumulative rows only; an increment carries none",
 ["Every row, each increment taking the label of its own cumulative category",
  "Only the increments",
  "The 1P and the Proved (P1) alike"],
 "The engine prints each cumulative row with its case, label, probability and value, and the increments with a label and a value only. An increment is a difference of two estimates, and there is no sense in which the Probable (P2) slice has a 50 percent chance. The 1P and the Proved (P1) share a value, and the P90 label still belongs to the cumulative 1P.")

q(3, "A set stated with the cumulative method also carries a key second with the value 1. What does the engine return?",
 "estimates.second must be left out for the cumulative method (state low, best and high); got 1",
 ["The categories from low, best and high, the extra key ignored",
  "The categories from the increments, which take precedence over the estimates",
  "second is not an accepted key; the accepted keys of estimates are listed"],
 "A set is one form or the other. With both a best estimate and a second increment there would be two answers for the 2P, and the engine picks neither; it refuses the key from the other form. It drops no key silently. Second is an accepted key of estimates for the incremental method, so the refusal is about mixing forms and is no unknown-key refusal.")

q(1, "Under the method \"incremental\" a box also states a low estimate of 1. Which field does the refusal name?",
 "estimates.low, to be left out for the incremental method",
 ["estimates.first, which the low estimate would overwrite",
  "method, which must change to cumulative once a low is stated",
  "estimates, which must be ordered low <= best <= high"],
 "The engine's message reads \"estimates.low must be left out for the incremental method (state first, second and third); got 1\". It names the key from the wrong form, so the fix is to remove that key. The engine never changes a stated method to fit the keys, and ordering applies only to a cumulative set.")

q(2, "A second increment is stated as -1. How does the engine treat it?",
 "It stops it at the input with a refusal on estimates.second",
 ["It accepts it and returns a 2P below the 1P",
  "It treats it as 0 and builds the categories from the rest",
  "It accepts it once the method is switched to cumulative"],
 "A negative slice would put a smaller figure above a larger one, so the engine stops it at the input, with the message ending \"got -1\". It never rewrites an input to 0, and under the cumulative method the key second is refused outright. A zero increment, by contrast, is accepted.")

q(2, "The golden input cat-zero-increment states Reserves incrementally as 0, 7 and 0 MMbbl. Which cumulative categories come back?",
 "1P 0.000000, 2P 7.000000 and 3P 7.000000",
 ["A refusal, since a Proved (P1) of 0 leaves no low estimate to label P90",
  "1P 0.000000, 2P 7.000000 and 3P 0.000000, each slice read as its own category",
  "1P, 2P and 3P all 7.000000"],
 "A zero increment is accepted, and the running sums give 1P 0.000000, 2P 7.000000 and 3P 7.000000. A 1P of 0 says no quantity is confident enough to call proved, and a 3P equal to the 2P says the high case adds nothing. Only a negative increment is refused. The sums never drop back to 0 once a slice has been added, and a 1P of 7 would need a first increment of 7.")

q(0, "A Prospective Resources set is stated with the incremental method. What does the engine return?",
 "A refusal: method must be \"cumulative\" for Prospective Resources",
 ["The categories 1U, 2U and 3U built from the stated increments",
  "The increments U1, U2 and U3 with cumulative sums beside them",
  "Contingent Resources increments C1, C2 and C3, relabelled"],
 "PRMS 2.2.2.4 defines no incremental terms for Prospective Resources, and the engine refuses the incremental method for them, printing that section in its message. A Prospective set is stated cumulatively and returns 1U, 2U and 3U with no increments. The engine never relabels one class's categories as another's.")

q(3, "The method control is set to not stated. Which message comes back?",
 "method must be one of \"cumulative\", \"incremental\"; got nothing",
 ["method must be \"cumulative\" for Prospective Resources; got nothing",
  "The cumulative method is read from the low, best and high keys",
  "estimates must be ordered low <= best <= high; got nothing"],
 "The method has no default, so a missing method is refused by name and the message says it got nothing. The engine infers nothing from which keys are present. The Prospective refusal applies only when the incremental method is stated for that class, and the order check runs only on a stated cumulative set.")

q(1, "On Ekene Main waterflood (EKN-1) the net-entitlement categories give a 2P oil of 9908615.920000 and a 1P oil of 5289968.880000 barrels. What Probable (P2) oil does the engine report?",
 "4618647.040000 barrels",
 ["9908615.920000 barrels",
  "5289968.880000 barrels",
  "4960152.645000 barrels"],
 "Increments from three forecasts are exact differences of the three cut, entitled quantities, so the Probable (P2) oil is 9908615.920000 less 5289968.880000, which the engine returns as 4618647.040000. 9908615.920000 is the cumulative 2P. 5289968.880000 is the Proved (P1), equal to the 1P. 4960152.645000 is the Possible (P3) oil.")

q(0, "On EKN-1 in BOE, the Possible (P3) is 5621506.350833 and the Probable (P2) is 5234466.685000. Why is the slice above the 2P the larger one?",
 "The high case runs longer before its canonical economic limit",
 ["The Possible (P3) carries the P10 label, which always sits highest",
  "The engine scales the Possible (P3) alone by the stated gas factor",
  "A mistake in the forecast, which the engine would refuse on order"],
 "Each forecast is cut at its own canonical economic limit year: the best case in 2037 and the high case in 2040, so the high case keeps more years and the slice between the 2P and the 3P comes out larger. An increment carries no probability label. BOE converts the gas at 6.000000 Mscf per BOE for every row alike, and the cumulative categories are in order, so nothing is refused.")

q(2, "Why can a set stated with the incremental method never be out of order?",
 "Each running sum adds a slice that is zero or more",
 ["The engine sorts the three increments before adding them",
  "Its keys are read as P90, P50 and P10",
  "An incremental set is checked for order only after the sums are built"],
 "A negative slice is refused at the input, so every running sum is at least the one before and the 1P, 2P and 3P come out ordered. The engine sorts nothing, since sorting would change what was stated. The probability labels sit on the cumulative categories. No later order check is needed for this form, which is one reason to state increments when a set is built from separate pieces of work.")

q(3, "The golden input cat-single-value states Reserves cumulatively as 2.000000, 2.000000 and 2.000000. Which increments come back?",
 "Proved (P1) 2.000000, with Probable (P2) and Possible (P3) at 0.000000",
 ["A refusal: a range needs the low below the high",
  "Proved (P1), Probable (P2) and Possible (P3) each at 2.000000",
  "No increments: one value describes the whole range"],
 "Equal estimates are accepted: the order check allows low <= best <= high with equality. The engine returns the increments as differences, so the Proved (P1) is 2.000000 and the other two are 0.000000, and it adds that a single value may describe the expected result (PRMS 2.2.1.3). Three increments of 2 would put the 3P at three times the stated high, and the engine still prints increments for a single-value set.")

emit(Q, '/root/cat-wip-prms/banks/ec11i_m03.json', expect_n=15)
finish()
