import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC2 Professional m03, Abnormally Low Bids.
# Every figure is quoted from digest.txt. The source is the World Bank
# Procurement Guidance, Abnormally Low Bids and Proposals, Second Edition, July
# 2016 (Stage 1 and Annex I). No boundary-table figure, no should-cost and no
# capstone name, code, price or value appears.

q(2, "The abnormallyLow function is handed the substantially responsive bids of a tender. What decides whether it takes the absolute or the relative approach?",
 "The count of bids: fewer than 5 takes the absolute approach and 5 or more the relative one",
 ["Whether an estimate is given, since an estimate always wins over the count",
  "A wide spread of the bids, which switches the engine to the relative test",
  "The award basis: a lowest-cost award takes the absolute test and a combined award the relative test"],
 "The engine chooses by the number of substantially responsive bids, with ALB_RELATIVE_MIN_BIDS at 5, cited to Stage 1 of the ALB Guidance (2016). With 5 or more bids the relative test runs even when an estimate is given, and the engine still refuses a negative one. Neither the spread nor the award basis enters the choice.")

q(0, "With fewer than five substantially responsive bids, when does the engine flag a bid?",
 "When 100 x (estimate - C) >= 20 x estimate, so 20% or more below the estimate",
 ["Only if C sits more than one population standard deviation below the mean of the bids handed in",
  "Strictly beyond 20% below the estimate; a bid exactly at 20% is left alone",
  "At 100 x (estimate - C) >= 10 x estimate, the s.16 margin of the content Act applied to price"],
 "The engine's basis reads \"fewer than 5 substantially responsive bids: flag when 100 x (estimate - C) >= 20 x estimate (20% or more below)\", with ALB_ABSOLUTE_PCT at 20. The inequality includes the 20% line. The mean less one standard deviation is the relative test for 5 or more bids, and the 10 percent margin belongs to s.16 of the content Act, which protects an indigenous company.")

q(3, "Annex I Example 2 has four bids and a Borrower's cost estimate of 150003863. Which bids does the engine flag?",
 "Bid 1 at 42.759565 and Bid 2 at 23.005876 percent below",
 ["Bid 1 only, the lowest, because the Guidance discusses that bid and no other in its text",
  "Bid 1 and Bid 3, as a bid 5.339220 percent away on either side of the estimate is examined too",
  "None at all, since four bids are too few for the engine to judge any price abnormally low"],
 "Bid 1 is 42.759565 percent below and Bid 2 23.005876 percent below; both are 20 percent or more below, and the engine flags every bid the rule reaches. The Guidance discusses Bid 1, the lowest. Bid 3's -5.339220 is a bid above the estimate. Four bids take the absolute approach and still judge every bid.")

q(1, "In Annex I Example 2, Bid 4's percentage below the estimate prints as -10.254183. What does the sign mean?",
 "Bid 4 sits above the estimate, so it is not flagged",
 ["Bid 4 is 10.254183 percent below the estimate, short of 20, so it is left unflagged",
  "The estimate is 10.254183 percent below Bid 4's price, so the estimate itself is flagged as low",
  "Bid 4 was refused, as the engine signals a price above the estimate with a negative figure"],
 "The course states it: a negative percentage is a bid above the estimate. Bid 4's evaluated cost of 165385533 is above 150003863, and its flag is false. The engine does not flag an estimate, and a flag false is a result: nothing is refused.")

q(2, "The abnormally low view is called on the four responsive materials bids with no estimate. What does the engine return?",
 "A refusal: \"estimate is required: with 4 substantially responsive bids (fewer than 5) the absolute approach compares each bid with the Borrower's cost estimate\"",
 ["The relative test, with a mean, a population standard deviation and a limit over the four bids",
  "A result with every flag false and the reason that no estimate was given for the absolute approach",
  "An estimate built by the engine from the mean of the four bids, and each bid compared with it"],
 "Four bids take the absolute approach, which compares each bid with the Borrower's cost estimate, so the estimate is required and the call is refused by the field estimate. The engine never switches to the relative test below 5 bids and never builds an estimate of its own.")

q(3, "Sixteen bids are handed to abnormallyLow with an estimate of -1. The relative approach will not use the estimate. What does the engine return?",
 "The call is refused, since a given estimate has to be above 0 whichever approach runs",
 ["The relative test on the sixteen bids, with the estimate ignored since the approach does not read it",
  "The absolute test, because an estimate given at all overrides the count of bids handed to the engine",
  "A result with every bid flagged, since every evaluated cost is more than 20% above a negative figure"],
 "An estimate that is given must be valid, whatever approach runs. The engine refuses a negative estimate by the field estimate, \"estimate must be a finite number above 0 when given\", even with sixteen bids. The count decides the approach, and the call never reaches a test.")

q(0, "For five or more bids the engine flags a bid when \"C < mean - SD, the population standard deviation\". What does the strict inequality mean for a bid exactly at the limit?",
 "It is not flagged; only a bid below mean less one standard deviation is flagged",
 ["Flagged, because a price at the limit already counts as one standard deviation below the mean",
  "Refused, as the engine cannot decide a price on the line",
  "Flagged under the population figure and left alone under the sample figure the engine also prints"],
 "The rule is strict: C < mean - SD. A price equal to the limit fails the inequality, so it is not flagged. The engine refuses nothing on the line. It computes only the population figure for its test; the sample standard deviation is a derived comparison the course prints, and the engine never flags by it.")

q(1, "On Annex I Example 1, with 16 bids, what mean, standard deviation and limit does the engine return?",
 "Mean 1664426.375000, standard deviation 315974.537496 and limit 1348451.837504",
 ["1664426, 315975 and 1348452, which the engine rounds to the unit",
  "A standard deviation of 326337.099079 on the n - 1 rule, limit 1338089.275921",
  "Mean 1348451.837504, standard deviation 315974.537496 and limit 1145142, the lowest bid of the sixteen"],
 "The engine returns 1664426.375000, 315974.537496 (the population figure) and 1348451.837504. The Guidance prints 1664426, 315975 and 1348452, each rounded to the unit; printed alike is not equal. 326337.099079 is the sample standard deviation, a derived comparison with a derived limit of 1338089.275921.")

q(2, "Example 1's Bid 3 has an evaluated cost of 1342106. Why does the choice of standard deviation decide its flag?",
 "It sits below the population limit 1348451.837504 and above the sample limit 1338089.275921",
 ["Above both limits, so the Guidance's own text is what flags it",
  "Below both limits, so the choice changes only the printed reason",
  "It sits exactly on the population limit, so the strict inequality alone decides it either way"],
 "Under the population standard deviation the limit is 1348451.837504 and Bid 3 at 1342106 is below it, so the engine flags Bid 1, Bid 2 and Bid 3. The sample figure, 326337.099079, would put the limit at 1338089.275921, and Bid 3 would stay unflagged with only Bid 1 and Bid 2 flagged (derived). 1342106 is on neither limit.")

q(0, "Why does the engine use the population standard deviation for the relative test?",
 "The Guidance's own Annex I Example 1 computes its figure that way",
 ["The sample figure cannot be computed for fewer than twenty bids, so the population one is used",
  "lib/stats offers only the population figure, and the engine imports every statistic it uses",
  "The population figure is the larger of the two and so flags fewer honest bids by construction"],
 "The engine's declared choice follows the Guidance: it divides by the number of bids, as Annex I Example 1 does. lib/stats also carries sampleStandardDeviation, which gives the larger figure, 326337.099079 against 315974.537496, so the population figure is the smaller of the two here and flags more bids.")

q(3, "Every flag reason from abnormallyLow ends with the same clause. What does it tell the evaluator to do?",
 "Clarify the price with the bidder before any decision; the bid is never rejected automatically",
 ["Reject the bid outright unless the bidder can show that it quoted its price in error during the tender",
  "Replace the bid's price with the estimate and rank it again at the average of the others",
  "Drop the bid from the field and rerun the test, since a flagged bid distorts the mean"],
 "The clause is \"a potential abnormally low bid: clarify the price with the bidder before any decision; it is never rejected automatically\". Stage 1 identifies a bid to examine, and the Guidance requires the price to be clarified with the bidder first. The engine rejects nothing on a flag, reprices nothing and drops nothing.")

q(1, "A committee examines a flagged bid and rejects it. How does that rejection enter the engine?",
 "As a stated rejection reason on the bid at the commercial stage, which the engine excludes with that reason",
 ["As a flag the engine sets on its own once a bid has stayed flagged through two runs of the test",
  "It cannot enter, since the engine holds every bid in the evaluation for as long as the tender runs",
  "As an evaluated cost of 0 for the bid, which the engine then reads as a withdrawal from the tender"],
 "A bid can carry a stated rejection reason at the commercial stage, and the engine excludes it with that reason in its own words. An empty reason is refused: \"bids[0].rejected must be a non-empty reason string when given\". The engine never rejects on a flag by itself, and an evaluated cost of 0 is refused by name.")

q(3, "The World Bank Guidance on Evaluating Bids and Proposals (February 2025), Figures X to XII, ranks five companies. What does the engine do with company E?",
 "It excludes E with the stated reason \"abnormally low bid, rejected after examination\" and ranks D, C, B, A",
 ["E is ranked first on price, since the lowest-ratio method gives the lowest evaluated cost 100 points",
  "The relative test flags E, and E stays in the ranking until the committee has examined it in full detail",
  "A refusal comes back, because a ranking cannot run with a bid the Guidance has already set aside by name"],
 "E enters the call as a rejected bid with a stated reason, so the engine excludes it with that reason and ranks the other four: D, C, B, A. The ranking agrees with the Guidance. The combined score does not run the abnormally low test, and a stated rejection is an ordinary result.")

q(0, "Under the relative approach, what happens to the limit when a committee removes a flagged bid from the field?",
 "The mean and standard deviation are computed again over the bids left, so the limit moves for every bid",
 ["Nothing moves, as the limit is fixed on the first run and read again for each remaining bid",
  "The limit moves only for bids that were flagged, while the unflagged bids keep their old verdict",
  "The engine keeps the removed bid in the statistics and drops it only from the list to clarify"],
 "The relative test computes the mean and the population standard deviation over the bids it is handed, so a new field gives a new limit for all of them. The engine counts the bids it is handed; with fewer than five left it switches to the absolute approach and asks for an estimate.")

q(2, "The Guidance discusses only Bid 1 of Annex I Example 2. Why does the engine also flag Bid 2?",
 "Bid 2 sits 23.005876 percent below the estimate, which is 20 percent or more by the same rule",
 ["The engine flags the two lowest bids of any field, whatever percentage they sit below the estimate",
  "Bid 2 falls more than one standard deviation below the mean of the four bids in the example",
  "The Guidance's own table flags Bid 2 as well, and the engine copies the Guidance's flags as printed"],
 "The engine applies one rule to every bid: 100 x (estimate - C) >= 20 x estimate. Bid 2 at 23.005876 percent below meets it, so it is flagged beside Bid 1. Four bids take the absolute approach, so no mean or standard deviation is computed, and nothing is copied from the Guidance's text.")

emit(Q, '/root/cat-wip-procurement/banks/sc2i_m03.json', expect_n=15)
finish()
