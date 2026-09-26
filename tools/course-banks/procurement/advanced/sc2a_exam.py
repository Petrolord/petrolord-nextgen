import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC2 Expert final exam, 42 questions across the tier's six modules, seven a
# module: contract types, cost percentiles, should-cost, the whole tender,
# reading the engine honestly, and conventions with the report. Every figure is
# quoted from digest.txt; keys rest on engine output printed there. Each
# question asks a different angle from the module banks (dupaxes at 0.45).

K = [2, 0, 3, 1, 3, 0, 2, 1, 1, 3, 0, 2, 0, 1, 3, 2, 1, 0, 2, 3, 3,
     1, 0, 2, 0, 3, 1, 2, 2, 0, 1, 3, 1, 2, 0, 3, 0, 1, 2, 3, 1, 0]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# ---- contract types on one job
# 1
x("In one iteration of the Ekene contract comparison, how does the engine build the contractor's own cost?",
 "The fixed cost of 140000.000000 plus the days drawn times the daily cost drawn",
 ["Mobilisation fee of 160000.000000 plus 50000.000000 for each day drawn",
  "Its planned 722350.416667, scaled up by the NPT fraction drawn in that iteration",
  "Lump sum less its planned margin, 900000.000000 less 177649.583333"],
 "The fixture states contractor cost = fixed cost + days x daily cost, with a fixed cost of 140000.000000, and both the days and the daily cost are drawn each iteration. The fee plus 50000 a day is what the company pays under the day rate. Scaling the plan by the NPT fraction ignores the daily cost draw. The lump sum less its planned margin equals the planned contractor cost only, one outcome.")

# 2
x("Over 20000 iterations on seed 20270211 the mean job length is 15.277257 days. Which figure does the engine print as the P90 of the days, and how does it sit against the plan of 13.865486?",
 "13.557943, the LOW figure, a little below the plan",
 ["17.399290, the longer figure, well above the plan",
  "15.053348, the middle of the days, above the plan",
  "19.243864, the longest job drawn, in the far tail of the triangle above the planned days"],
 "The engine labels its percentiles by exceedance, so the P90 of the days is the LOW figure, 13.557943: nine iterations in ten run at least that long. It sits below the planned 13.865486. 17.399290 is the P10, the HIGH figure, 15.053348 the P50, and 19.243864 the maximum drawn.")

# 3
x("The contractor's own cost, before any contract pays it, runs across the Ekene iterations. Which pair gives its P90 and P10 in the engine's labels?",
 "P90 723013.750014, the LOW figure; P10 945032.177102, the HIGH figure",
 ["Reversed: P90 945032.177102 and P10 723013.750014, the high label on the high cost",
  "Minimum 633271.750221 as P90 and maximum 1162952.266817 as P10, the two ends of every draw",
  "P90 722350.416667, the planned cost, and P10 827170.582636, the mean of the run"],
 "On seed 20270211 with 20000 iterations the contractor cost's P90 is 723013.750014 and its P10 945032.177102, with P50 817988.243265, the P90 the LOW figure. Swapping them reverses the exceedance labels. 633271.750221 and 1162952.266817 are the minimum and maximum, and 722350.416667 and 827170.582636 are the plan and the mean, none of them a percentile.")

# 4
x("The contractor's probability of a loss is 0.199500 under the lump sum and 0.059900 under the day rate. Why is the day rate figure so much smaller?",
 "The company pays for every extra day at the rate, so a loss needs a daily cost well above plan",
 ["Its planned margin, 130923.888889, is the larger of the two, so the day rate has more room before a loss",
  "Under a day rate the contractor absorbs no part of the overrun at all, so it cannot lose on extra days",
  "The day rate is sampled on fewer iterations, so fewer losses are drawn"],
 "Under the day rate the company carries the duration risk, paying 50000 for each extra day, so the contractor loses only when its daily cost runs well above its planned 42000.000000. Under the lump sum it absorbs every overrun. The lump sum's planned margin, 177649.583333, is the larger. The contractor still absorbs 35329.377418 of the overrun under the day rate, and every contract type is read from the same 20000 iterations.")

# 5
x("A learner sets duration.nptFrac to -0.1. What does the engine return?",
 "Its refusal, \"duration.nptFrac must be at or above 0; got -0.1\"",
 ["A run with the NPT fraction clipped to 0, so the days equal the productive 12.056944",
  "The wellCost refusal passed through, since the NPT fraction belongs to wellCost's stretch",
  "A run in which the job shrinks by a tenth, days below the productive time"],
 "The tender engine checks the NPT fraction itself and refuses a negative one under the field duration.nptFrac, with the figure it was given. It clips nothing, and the pass-through form is for an activity wellCost refuses. A job shorter than its productive time is not a result the engine returns.")

# 6
x("A day rate is entered as { rate: 50000 } with no mobilisation fee. What does the engine return?",
 "A refusal under dayRate: the rate and the mobilisation fee must both be stated, at or above 0",
 ["A day rate with a mobilisation fee of 0, the default for a missing fee",
  "A day rate with the fixture's 160000.000000 fee filled in from the Ekene job",
  "The run with the day rate row left out and a note that its fee was missing"],
 "The engine refuses a day rate that lacks either part, naming the field dayRate. It supplies no default fee, borrows nothing from a fixture, and never drops a contract type from a result. The message asks for both parts at or above 0, so a mobilisation fee stated as 0 is accepted; only a missing part is refused.")

# 7
x("A committee compares a lump sum bid and a day rate bid on their planned payments alone, 900000.000000 against 853274.305556. What does that comparison miss?",
 "Who carries the overrun: the company pays 71671.875955 of it on a day rate, none on a lump sum",
 ["Nothing, since each planned payment is the figure the company actually pays on the job in every outcome",
  "The day rate's mobilisation fee of 160000.000000, which the planned payment leaves out of its total",
  "Seed choice, since the planned payments change with every seed that the committee might choose to run"],
 "A planned payment says nothing about the overrun, which 0.902400 of the iterations produce, averaging 107001.253374. Under the lump sum the company pays none of it and the contractor absorbs it all; under the day rate the company pays 71671.875955 of it for the extra days and the contractor absorbs 35329.377418. The planned payment 853274.305556 already includes the 160000 fee (160000 + 50000 x days), and planned payments come from the plan, which no seed moves.")

# ---- cost percentiles
# 8
x("Which of the three Ekene contract types has both the lowest P90 company cost and the highest P10 company cost?",
 "Cost plus 12 percent: 809775.400015 at P90 and 1058436.038354 at P10",
 ["The day rate: 837897.131515 at P90 and 1029964.481686 at P10",
  "The lump sum: 900000.000000 at both, the narrowest range",
  "Cost plus 12 percent: 1058436.038354 at P90 and 809775.400015 at P10, the widest range of the three"],
 "Cost plus 12 percent spans 809775.400015 (P90, a 90 percent chance the cost meets or exceeds it) to 1058436.038354 (P10), wider at both ends than the day rate's 837897.131515 to 1029964.481686. Fee on cost magnifies every swing in what the contractor spends. A fixed price has a single point for a range. Swapping the two labels is the reversal the course warns against.")

# 9
x("The plan ranks the reimbursable contract as the smallest payment and the lump sum the largest. How do the sampled mean company costs rank them on seed 20270211 with 20000 iterations?",
 "Lump sum lowest at 900000.000000, then the day rate at 923862.832721, then the reimbursable at 926431.052553",
 ["The same order as the plan: the reimbursable lowest, then the day rate, then the lump sum at the top of the three",
  "Day rate lowest at 853274.305556, then the reimbursable at 809032.466667, then the lump sum as the highest of the three",
  "All three tie at the lump sum's 900000.000000, since the means converge over 20000 iterations"],
 "The sampled means are 900000.000000 for the lump sum, 923862.832721 for the day rate and 926431.052553 for cost plus 12 percent, the reverse of the plan's order, because the job's long upper tail lifts the mean cost of the two contracts that pass the overrun to the company. 853274.305556 and 809032.466667 are planned payments, and the means differ.")

# 10
x("Where does the lump sum's 900000.000000 sit within the day rate's range of company costs on the Ekene job?",
 "Above the day rate's P90 and below its P50 of 912667.421771",
 ["Above the day rate's P10 of 1029964.481686, beyond the whole range",
  "Below the day rate's P90 of 837897.131515, under the whole range",
  "Exactly at the day rate's mean, since the lump sum is priced to it"],
 "The day rate's P90 is 837897.131515 and its P50 912667.421771, so 900000.000000 lies between them: at least half the day rate outcomes cost the company more than the lump sum would. The day rate's mean is 923862.832721, above the lump sum. The P10, 1029964.481686, is the HIGH figure, far above it.")

# 11
x("In the language of an ordinary statistics text, which percentile of the sorted costs is the engine's P90 cost?",
 "The 10th percentile, read at index floor(0.1 n)",
 ["The 90th percentile, read at index floor(0.9 n) of the sorted costs",
  "Fiftieth, since P90 names the middle of the sorted costs",
  "An interpolated point between the 10th and 90th, weighted toward the high end"],
 "The engine's basis says so directly: for a cost P90 is the LOW cost (10th percentile) and P10 the HIGH cost (90th percentile), with P90 read at index floor(0.1 n). floor(0.9 n) is where the P10 is read. The P50 is the middle, and no percentile is interpolated.")

# 12
x("A reserves engineer is used to P90 as the cautious figure. Why does the same definition make the P90 cost an optimistic one?",
 "The value met or exceeded nine times in ten is a low value for a volume and for a cost alike, and a low cost flatters a budget",
 ["Because the engine redefines P90 for costs as the value not exceeded nine times in ten",
  "Because PRMS applies only to volumes, so the engine uses the opposite convention for money",
  "It does not: P90 is cautious for a cost too, since it is the larger figure"],
 "The definition is the same for both: a 90 percent probability the quantity meets or exceeds the value, so the value is low. For reserves a low volume is cautious; for a cost a low figure is optimistic, because nine outcomes in ten cost at least that much. The engine keeps one definition from lib/conventions/percentile.js and never switches convention for money.")

# 13
x("How does the contractor cost's P50 on the Ekene run, 817988.243265, compare with the planned contractor cost?",
 "It sits well above the planned 722350.416667, since most iterations run longer than the plan",
 ["Equal to the planned 722350.416667, since the plan is built at the middle of the sampled draws of the job",
  "It sits below the plan, since P50 is the low half of the contractor's cost",
  "Equal to the mean of 827170.582636, since on any job the middle and the average of the costs agree"],
 "The plan is the modes, and with the NPT fraction's long upper tail most draws run longer, so the P50 of the contractor's cost, 817988.243265, sits above the planned 722350.416667 and 0.902400 of the iterations overrun. The plan is built from modes and is not the middle of the draws, and the mean, 827170.582636, sits above the P50 on this skewed job.")

# 14
x("A draft report prints the day rate as P90 1029964.481686 and P10 837897.131515. What should a reviewer conclude?",
 "The labels were swapped: the engine's P90 cost is 837897.131515, the LOW figure",
 ["Nothing is wrong, since a higher percentile label always names the higher cost of the two",
  "Another seed was used, and a seed can reverse the order of the percentiles",
  "The figures were interpolated, which flips the labels at small iteration counts"],
 "Under the exceedance labels every cost row reads P90 at or below P50 at or below P10, and the engine returns the day rate's P90 as 837897.131515 and its P10 as 1029964.481686. A P90 printed above its P10 means the labels were swapped. No seed changes that order, and the engine never interpolates.")

# ---- should-cost
# 15
x("Which of the company's cost items make the Ekene should-cost rise when the NPT fraction rises?",
 "The coiled tubing spread and company supervision, per-day items at 26500.000000 and 3500.000000",
 ["Pumping services and the acid system, the two largest lump items, which scale with the days on location",
  "Every item on the list alike, since the contingency scales the whole estimate in step with the days",
  "Mobilisation and demobilisation at 160000.000000, which the company is charged for by the day on location"],
 "Only per-day items move with the days: the coiled tubing spread at 26500.000000 and company supervision at 3500.000000, 30000.000000 a day together. Pumping services, the acid system, nitrogen and mobilisation and demobilisation are lump items valued as lumps. Contingency is a fraction of the base, so it moves only with the per-day part of the base.")

# 16
x("Which amount of the Ekene should-cost falls to the synthetic partner with a 40% working interest?",
 "358144.416667, its working interest of the 895361.041667 estimate",
 ["402912.468750, since the largest partner carries the operator's share",
  "Its 40% of the base, 813964.583333, before contingency",
  "134304.156250, since partners pay on the base alone"],
 "afe.js charges each listed partner its working interest of the whole estimate, contingency included, so EK-B at 40% carries 358144.416667 of 895361.041667. The figure 402912.468750 belongs to the operator, who carries whatever the partners leave, and 134304.156250 to the 15% partner. A share of the base alone would leave the contingency unfunded.")

# 17
x("The programme passed to the should-cost is an empty list. Which engine's words does the refusal end with?",
 "wellCost's: \"The program has no activities.\" after the tender engine names the field program",
 ["The tender engine's own, that items give an estimate of 0 and the ratio is undefined",
  "afe.js, whose partner split cannot run without an estimate",
  "None: an empty programme gives a base of 0.000000 and a null flag for every bid"],
 "An error in an imported engine is passed through with that engine's name, so the refusal reads \"program or its cost items are refused by engines/drilling/wellCost.js: The program has no activities.\" The estimate-of-0 message is the tender engine's check on cost items, a different input. afe.js is never reached, and a refused input returns no result.")

# 18
x("Someone types the screening band upside down, low 1.25 and high 0.8. How does the should-cost call respond?",
 "The same refusal as for no band: low must be above 0 and at most high, with no default",
 ["Read as 0.8 to 1.25, with the two limits swapped quietly into order before any ratio is tested",
  "A result that flags every bid above or below, since no ratio can sit inside a band like that one",
  "Refused under band.low alone, with high accepted as typed"],
 "The engine refuses a band whose low is above its high with the same message as a missing band: \"band must be { low, high } with 0 < low <= high (ratios of bid to estimate); there is no default\", under the field band. It never reorders an input and never returns a result on a band it cannot read.")

# 19
x("On the probe estimate of 100000.000000, a bid of 125001.000000 gives a ratio of 1.250010 and is flagged above. What does its reason say, and what does it leave out?",
 "That 1.25001 is above the upper limit 1.25; it carries no instruction about abnormally low bids",
 ["Abnormally high, it says, so the bid must be rejected under the World Bank Guidance on abnormal prices",
  "That it should be examined as a possibly abnormally low bid, the same words the engine gives below the band",
  "Only the flag above, with no sentence, since the engine writes its reasons for the low bids alone"],
 "The engine's reason, verbatim: \"bid-to-estimate ratio 1.25001 is above the band's upper limit 1.25\". Only the reason for a bid below the band adds the instruction to examine it as a possibly abnormally low bid. The band rejects nothing, and each flagged bid carries a reason.")

# 20
x("With the should-cost of 895361.041667 as the estimate, what are WS2's band ratio and its percentage below the estimate on the absolute test?",
 "0.989069 and 1.093083 percent, neither flagged",
 ["0.962898 and 3.710240 percent, both flagged",
  "1.036677, above the estimate, and -3.667678 percent below it",
  "0.989069, flagged below 1"],
 "For WS2, evaluated at 885574.000000, the band ratio is 0.989069 and the absolute ALB figure 1.093083 percent below: both screens pass it. The pair 0.962898 and 3.710240 belongs to WS5, and 1.036677 with -3.667678 to WS1, which lies above the estimate. Sitting under an estimate is no flag in itself: the band starts at 0.8 and the ALB line at 20 percent.")

# 21
x("Why does the should-cost carry no seed and no iteration count?",
 "It runs the programme once at a single stated NPT fraction, so nothing is drawn",
 ["The contract comparison's seed 20270211, borrowed without printing it",
  "Its seed is fixed inside wellCost, so a caller cannot change it",
  "Averaging 20000 draws of the NPT triangle, which needs no seed"],
 "The should-cost is deterministic: wellCost evaluateProgram at one stated NPT fraction (0.15 on the Ekene job), then the cost items and contingency. Only the contract-type comparison samples, on a stated seed and iteration count. No figure of the should-cost depends on a draw.")

# ---- whole tender
# 22
x("Switch the well services award basis to lowest-cost and leave every other fixture setting alone. Which bid wins, in the engine's words?",
 "WS5, with the reason \"WS5 has the lowest evaluated cost\"",
 ["WS4, whose quoted total of 763200.000000 is the lowest of the six",
  "WS3, since the technical envelope still ranks it first",
  "WS5, with the reason that its quoted total is the lowest of the passing bids"],
 "Under a lowest-cost award the engine awards WS5, reason \"WS5 has the lowest evaluated cost\", at 862141.000000. WS4 failed the pass mark, so its price is never opened. The technical percentages only decide who passes under this basis. WS5's quoted total, 849400.000000, ties WS2's, and the award rests on the evaluated cost.")

# 23
x("In the evaluateTender result for the well services tender, in what order does commercial.bids list the passing bids?",
 "WS5, WS2, WS1, WS3, evaluated cost ascending",
 ["WS3, WS1, WS2, WS5, by combined score from the top",
  "WS1, WS2, WS3, WS5, in the order the bids were input",
  "WS4, WS5, WS2, WS1, WS3, by quoted total ascending"],
 "commercial.bids is ordered by evaluated cost ascending: WS5 862141.000000, WS2 885574.000000, WS1 928200.000000, WS3 957990.000000. The combined-score order, WS3, WS1, WS2, WS5, belongs to ranking.bids. Input order is how technical.passed lists them, and WS4 never reaches the commercial envelope.")

# 24
x("A caller writes the content setting as a plain sentence where the whole-tender call expects an object. How is it answered?",
 "The refusal \"nigerianContent must be { ncLeadBasis } when given\"",
 ["An award under the points reading, which the engine reads out of the text it was given",
  "The award without s.14, the text ignored silently as an unknown shape",
  "A refusal naming ncLeadBasis alone, with no mention of the shape"],
 "The engine checks the shape of the content entry and refuses text under the field nigerianContent. It reads no reading out of free text and ignores no stated input, and it names the field it refuses, here the whole entry.")

# 25
x("A caller asks for s.14 in a lowest-cost award of the well services tender, but no bid carries an ncPct. How does the whole-tender call respond?",
 "A refusal naming a bid's ncPct: it is required for every bid at the commercial stage",
 ["The award with each missing content taken as 0, so no bid can lead under s.14",
  "The award with the bids left out of the s.14 group but still in the ranking",
  "A refusal naming criteria, since content is a technical criterion here"],
 "In the engine's words: \"bids[4].ncPct is required for every bid that reaches the commercial stage when nigerianContent is given\". bids[4] is WS5, the fifth bid in the list, which passed the technical envelope. A missing content is never set to 0 or dropped from the group, since either would decide s.14 on a figure nobody stated. Content enters a lowest-cost award at the commercial stage, and a combined award takes it as a rated criterion instead.")

# 26
x("With maxWeeks lowered to 5 and minWeeks lowered below it, how does the engine word WS5's exclusion?",
 "\"WS5: offers completion in 9 weeks, beyond the maximum 5 weeks; the bid is nonresponsive\"",
 ["\"WS5: completion in 9 weeks is 3 weeks beyond the minimum 6 weeks; 0.005 x 3 x 849400 = 12741 is added\"",
  "\"WS5: technical score 70 is below the pass mark; the commercial envelope is not opened\"",
  "\"bids has no bid left to score: every bid is rejected\""],
 "Beyond maxWeeks a bid is rejected as nonresponsive, and the engine names the weeks it offers and the maximum. The 12741 adjustment is WS5's schedule reason at the fixture's maxWeeks of 10, where it is responsive. WS5 scores exactly 70.000000 and passes at the pass mark. The last quotation is rankTender's refusal, which evaluateTender does not return.")

# 27
x("An evaluateTender call carries a key domesticPreference. What does the engine do with it?",
 "Refuses it, naming the key and listing the accepted top-level keys",
 ["Applies a domestic preference margin from para 5.52 to the evaluated costs",
  "Ignores it and returns the normal award for the tender",
  "Passes it to contentPreference as the s.16 margin"],
 "\"domesticPreference is not an accepted key; the accepted keys at the top level are criteria, passMark, bids, omissionRule, bestEstimates, schedule, lifeCycle, award, technicalWeight, priceMethod, technicalMethod, nigerianContent\". The engine applies no domestic preference margin at all, refuses every key it does not read so no stated input is silently dropped, and s.16 takes no margin from the caller.")

# 28
x("On the stepped table under linear pricing, how does the most advantageous bid change as the technical weight rises from 0.7 to 1?",
 "From WS5 to WS1 and then to WS3",
 ["Straight from WS5 to WS3 at 0.85",
  "WS3 throughout, since linear pricing favours the best technical bid",
  "Reversed: WS3 first, then WS1, then WS5"],
 "The engine's steps give WS5 at 0.7, 0.75 and 0.8, WS1 at 0.85 and 0.9, and WS3 at 0.95 and 1. At 0.85 WS5 and WS3 tie at 85.000000 in third place, and WS1 leads at 87.162020. Under linear the dearest bid, WS3, scores 0.000000 on price, so it wins only when the technical weight nearly removes price.")

# ---- reading the engine honestly
# 29
x("The Guidance's Figure IX gives Company A scores of 2, 2, 2 and 1 on criteria weighted 50, 25, 15 and 10, scored 0 to 4, and prints a weighted score of 190. What does the engine return?",
 "190.000000 weighted points and a technical percentage of 47.500000",
 ["190.000000 as the technical percentage, since points and percent agree",
  "47.500000 weighted points, the printed 190 being a misprint",
  "82 points, the same kind of error the Guidance makes in Annex 2"],
 "The engine returns 190.000000 weighted points, the sum of weight x score, which matches the printed 190 exactly, and a technical percentage of 47.500000, each term divided by its maxScore of 4. Figure IX checks out; the erratum is in Annex 2, where B's printed total of 82 disagrees with its scores. One erratum does not discredit the rest of a source.")

# 30
x("The Guidance's Annex 3 prints Company A's combined score as 94.37. What is the engine's figure, and how was the printed one produced?",
 "94.375000, printed as two decimals with the third dropped",
 ["94.37, the same figure, since the engine rounds to two decimals",
  "94.375000, rounded up in print to the nearest hundredth",
  "91.666667, which is B's score, since the Guidance swapped the two"],
 "The engine's combined score for A at technical weight 0.4 is 94.375000, and the Guidance prints 94.37, two decimals of that figure with the third dropped (checked). Rounding up would print a figure above the exact one. The engine rounds nothing it returns. B's combined score is 91.666667, printed 91.66, and A wins on both.")

# 31
x("For Annex I Example 1 of the ALB Guidance, the source prints a mean of 1664426. What does the engine return, and how do the two relate?",
 "1664426.375000; the Guidance prints each figure rounded to the unit",
 ["1664426, identical, since the bids are whole numbers",
  "1348451.837504, the mean less one standard deviation",
  "315974.537496, the Guidance having printed the wrong figure"],
 "The engine's mean of the sixteen bids is 1664426.375000, and the Guidance prints each figure rounded to the unit: 1664426 for the mean, 315975 for the standard deviation and 1348452 for the limit. Whole-number bids can still average to a fraction. 1348451.837504 is the engine's limit, and 315974.537496 its population standard deviation.")

# 32
x("Chen (2008) scores price as 50 x L / P on prices 40, 50 and 80. What happens to the gap between B and C when A, priced 40, is declared invalid?",
 "It widens from 15.000000 to 18.750000 points",
 ["Unchanged at 15.000000, since A is neither B nor C",
  "Narrower, from 18.750000 down to 15.000000 points",
  "Closed to 0.000000, since B takes A's full score"],
 "With A in the field B scores 40.000000 and C 25.000000, a gap of 15.000000; with A declared invalid B scores 50.000000 and C 31.250000, a gap of 18.750000. Removing a bid that is neither B nor C moves the gap between them, because a relative price score depends on which bids are in the field. That is the ranking paradox Chen prints.")

# 33
x("On the stated s.16 bids the lowest evaluated cost is 3000000. I10 sits at 3300000 and I11 one unit more. What does the engine return for each?",
 "I10 at 10.000000 percent is protected; I11 at 10.000033 is not",
 ["Both are protected, since 10.000033 rounds to 10 percent",
  "Neither is protected, since s.16 needs strictly less than 10 percent",
  "I10 is selected for the award and I11 is excluded"],
 "The s.16 test is 100 x (C - Cmin) <= 10 x Cmin, so exactly 10 percent is inside the margin and I10 is protected, while I11 at 10.000033 is outside. The engine rounds nothing before testing. s.16 protects a Nigerian indigenous company with capacity from exclusion solely on price and never selects a bid: the selected bid is LO.")

# 34
x("On the tie probe, bid A costs 1000000.0001 and bid B 1000000.00001. Which ranks first, and is there a tie?",
 "No tie: their twelve-digit keys differ, and the lower cost ranks first (B, A)",
 ["A tie, since both round to 1000000 at six decimals, broken by bidder id (A, B)",
  "Tied, broken by the earlier receipt, since the costs agree to ten digits",
  "A refusal, since the costs differ by less than the arithmetic tolerance"],
 "Their keys at twelve significant digits are 1000000.00001 and 1000000.00010, which differ, so they do not tie and the lower cost ranks first, B then A. Agreement at six decimals is not the tie rule; printed alike is not equal. The arithmetic tolerance applies to bill lines and plays no part in ranking evaluated costs.")

# 35
x("One boundary in the engine is described as a property of doubles. What is it?",
 "A limit a person types is compared in binary floating point, and the oracle and engine agree except within one unit in the last place",
 ["Every limit is rounded to six decimals before any comparison is made",
  "The engine adds a tolerance of 1e-9 to every typed limit to absorb floating-point error",
  "Limits are compared as text, so a typed 0.8 and a computed 0.8 always match"],
 "A typed limit such as a tolerance or a band is compared in binary floating point, and the course states that the engine's oracle and the engine agree except within one unit in the last place of such a limit; every boundary was probed with figures exactly representable or far from that unit. The engine rounds nothing before comparing. 1e-9 is the weight-sum tolerance only.")

# ---- conventions and the report
# 36
x("Under the engine's overrun convention, is an iteration whose contractor cost equals the planned cost exactly an overrun?",
 "No: an overrun is a contractor cost above the planned cost",
 ["Yes, since the plan is a floor that any real job reaches on the day",
  "It counts as half an overrun in the probability the engine prints",
  "Only under the lump sum, where the price is fixed whatever happens"],
 "The engine's convention: an iteration overruns when its contractor cost exceeds the planned cost, and the boundary table records a cost equal to the planned cost as not an overrun. The same rule holds under every contract type, because the overrun is measured on the contractor's cost, and no iteration counts as half.")

# 37
x("A tender wants a Nigerian content target for catering, which the 2010 Schedule does not list. How does the engine take it?",
 "As a stated target with its percentage, measured unit and source, returned with that source",
 ["From the latest Board target, which the engine reads from the Board whenever a Schedule line is missing",
  "At the Schedule's nearest line, with that line's minimum used in place of the target the tender wants",
  "As an item with no minimum, reported but never tested"],
 "The engine carries the 2010 Schedule only. A target it does not list enters as a stated target with targetPct, measure and source; the course's example sets catering at 90% by man-hours, returned with its source \"stated by the user: a level stated for this example by the course; no Board target was read\". A stated target with no source is refused. No Board target was read, and nothing is substituted.")

# 38
x("An evaluation report on the well services tender states the technical weight. What must it add beside the 0.7?",
 "That 0.7 is inside the para 5.50 range of 0.6 to 1 for high risk at US$900000, with the price and technical methods",
 ["The weight's P90, since it was chosen under uncertainty",
  "The Guidance's worked weight of 0.8 as a check on it",
  "Only the combined score, since the weight is in the score"],
 "The report names the technical weight inside its para 5.50 range, and the price and technical methods. A high-risk contract at US$900000 is not high value, so it falls in cell b, 0.600000 to 1.000000, and the engine's reason says \"technical weight 0.7 is inside the range 0.6 to 1\". A weight is a stated setting and has no percentile, and 0.8 belongs to the Guidance's own example.")

# 39
x("An evaluatedCosts call on the well services bids states bestEstimates.mob. What happens?",
 "A refusal: mob is not an item any bid omits, and nitrogen is the only accepted key",
 ["The best estimate replaces every bid's mobilisation line",
  "It is stored and used only if a bid later omits mob",
  "WS3's nitrogen is priced from it, since estimates pool"],
 "A key that is an id is checked against the ids the call carries: \"bestEstimates.mob is not an item any bid omits; the accepted keys of bestEstimates are the omitted item ids nitrogen\". A best estimate prices an omission only when no other responsive bid prices the item, and it replaces no quoted line.")

# 40
x("How does the engine read the s.14 phrase \"within 1 % of each other at commercial stage\", and what happens exactly at the edge?",
 "As within 1% of the lowest evaluated cost; 2020000 against 2000000 is in the group, one unit more is out",
 ["Within 1% of the next bid up the ranking, so the group chains upward one bid at a time until a gap finally opens",
  "Relative to the mean of the bids, so the edge moves with the field",
  "Strictly below 1 percent, so a bid at 2020000 against the lowest at 2000000 falls just outside of the group"],
 "The reading is stated in every reason: \"within 1 % of each other at commercial stage\" is read as within 1% of the lowest evaluated cost, with the group test 100 x (C - Cmin) <= 1 x Cmin. So a bid exactly 1 percent above the lowest joins the group and one unit more does not. The course's table of conventions lists this as the engine's reading of s.14.")

# 41
x("What makes a graded figure in this course have exactly one right answer?",
 "It is an engine return value on inputs written down in advance, any draw on a stated seed and iteration count",
 ["Rounding to two decimals, so small machine differences vanish",
  "Averaging over several seeds, so no single draw decides it",
  "The panel's figure is accepted as typed by the learner"],
 "Every graded number is a return value of the engine on fixed inputs, and the one random draw, the contract-type Monte Carlo, runs on a stated seed and iteration count, so the same inputs give the same number on any machine. Figures are quoted to six decimals, and a figure from another seed is a different run.")

# 42
x("A bid reports its valves by tonnage for a content item on the Schedule line valves. What does the engine return?",
 "A refusal: valves must be measured by number, the unit the minimum is measured in",
 ["Converted from tonnes to a count through the Schedule, then reported as content by number",
  "Content by tonnage, reported with a note beside it that the unit differs from the Schedule's",
  "The valves item is left out of the bid's overall content and the other items are pooled"],
 "In the engine's words: \"bids[0].items.valves.measure must be 'number', the unit the minimum is measured in; got 'tonnage'\". Content in this course is Nigerian content in the measured unit the Schedule names for the item; the engine converts nothing and drops nothing.")

emit(Q, '/root/cat-wip-procurement/banks/sc2a_exam.json', expect_n=42)
finish()
