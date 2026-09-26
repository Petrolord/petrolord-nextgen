import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC2 Expert m05, Reading the Engine Honestly. Every figure is quoted from
# digest.txt: the uncited 'highest' omission option in the engine's own words
# (never keyed as a correct method), the World Bank Annex 2 erratum (Company B
# printed 82, printed scores sum to 77.000000, keyed as the source's misprint),
# printed against exact figures, Kiiver and Kodym's line, the commercial
# weight's double, the boundary table, the twelve-digit tie key and the caps.

K = [3, 0, 2, 1, 0, 2, 3, 1, 0, 3, 2, 1, 3, 0, 2]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("A learner switches the omission rule to the option named highest. How does the engine's own basis describe that option?",
 "As the 'highest' option, which the cited texts do not use, with the average of ITB 34.1 named as the cited rule",
 ["Through the World Bank Goods document's own rule, which prices an omitted item at the dearest quote among the responsive bids",
  "The conservative reading of ITB 34.1, preferred whenever a bidder has omitted an item on purpose",
  "It adds no words at all: the option is accepted silently and priced like the average"],
 "The engine's basis under 'highest', verbatim: \"an omitted item is priced at the highest corrected amount quoted for it by the other responsive bids, else the Employer's best estimate (the 'highest' option, which the cited texts do not use; the cited rule is the average of World Bank SPD ITB 34.1)\". No text the course read uses it, the Goods document included, and the engine labels it wherever it appears; it never presents it as a reading of ITB 34.1.")

# 2
x("WS3 omits nitrogen. The average of the other responsive bids' prices gives 35400.000000; the uncited option gives 37200.000000. Which does the course teach and grade?",
 "The average, 35400.000000, the rule ITB 34.1 states",
 ["The higher figure, 37200.000000, since it is the cautious price for an omission",
  "Both, graded side by side, since the engine accepts either rule by name",
  "Whichever the tender states, with no preference between the two in the course"],
 "The omission rule of the World Bank SPDs, ITB 34.1, is the average price quoted by the substantially responsive bidders, the engine's default, and the course teaches and grades that rule only. The 'highest' option is shown so a reader of the engine knows it exists and what the engine says about it; it is never a key and never graded.")

# 3
x("A tender asks the engine for the omission rule lowest. What does the refusal say?",
 "That omissionRule must be 'average', the default from ITB 34.1, or 'highest', an option the cited texts do not use",
 ["Lowest is reserved for the award basis and cannot name an omission rule at all",
  "omissionRule must be 'average' or 'lowest', it says, and 'highest' is withdrawn",
  "Only that the rule is unknown, with no word on which rule the texts actually use"],
 "The engine's message, verbatim: \"omissionRule must be 'average' (the default, World Bank SPD ITB 34.1: the average price quoted by the substantially responsive bidders) or 'highest' (the highest price quoted by them, an option the cited texts do not use)\". The refusal names both accepted rules and which one the texts use. Lowest-cost is an award basis, a different input, and the engine offers no 'lowest' omission rule.")

# 4
x("The World Bank Guidance, Annex 2, prints Company B's criterion scores as 12, 11 and 54 and its total as 82, with a threshold of 80. How does this course key B?",
 "The printed 82 is the source's misprint: the engine totals B's printed scores at 77.000000, below the threshold",
 ["At 82 as printed, B clears the threshold of 80 and stands second behind C",
  "The mean of 82 and 77.000000, the two figures the Guidance can be read to give",
  "Unknown: B's total cannot be known, so the course leaves B out of the example and grades A and C"],
 "The course records both figures and says which one the engine uses. B's printed scores sum to 77.000000, the engine's total on them, and at a threshold of 80 the engine returns fail-pass-mark. The printed 82 disagrees with the source's own scores, so it is the source's erratum. Averaging the two figures invents a third, and the example is kept whole with both figures labelled.")

# 5
x("On its own printed scores Company B falls below the Annex 2 threshold. What does that change in the example's outcome?",
 "The winner stays C; B joins A below the threshold, where the Guidance names only A as rejected",
 ["The winner changes to A, since B's lower total removes it from the comparison with C for first place",
  "Nothing at all: the list of qualifying companies and the winner are the same on either of the two totals",
  "C falls below the threshold too, so no company passes and the example has no winner"],
 "C scores 91.000000 and passes on any reading, so the outcome the Guidance states, C first, is the same. What changes is who else qualifies: at 77.000000 B fails with A (59.000000). A fails on both readings, and C's 91 is unaffected by B's total.")

# 6
x("The Guidance's Figures X to XII print Company D's combined score as 98.34. The engine returns 98.333333. How was the printed figure produced, and are the two equal?",
 "It was rounded up; printed less exact is 0.006667, so they are different figures",
 ["They are equal: 98.34 is 98.333333 rounded to two decimals in the usual way",
  "The engine's 98.333333 truncates the Guidance's exact 98.34, the source's working figure",
  "It was truncated, the third decimal dropped, so the printed figure is the lower one"],
 "The printed figure less the exact one is 0.006667, and the course reads D's 98.34 as rounded up, a figure above the exact one. Truncation would print a figure below it. The source prints two decimals, and the engine's figure is the exact combined score; two figures near each other are never keyed as equal.")

# 7
x("For Company B, Figures X to XII print a combined score of 84.26 where the engine returns 84.266670. How did the source print it?",
 "Truncated: the third decimal was dropped, printed less exact is -0.006670",
 ["Rounded up to the next hundredth, as the source does for every company it scores",
  "Rounded to the nearest hundredth, since 84.266670 sits closest to the printed 84.26",
  "Exactly, since the engine's extra digits are only floating-point noise from the division"],
 "The printed less exact difference is -0.006670, and the course records B's figure as truncated. A printed figure below the exact one is the mark of a dropped digit. The source mixes the two: D and C are rounded up, B and A truncated. The engine's digits are the exact figure, and every printed combined figure is within 0.01 of it.")

# 8
x("Company C's technical figure appears in Figures X and XII of the Guidance. What does the course record about it?",
 "The same quantity is printed 68.33 in one figure and 68.34 in the other",
 ["Figure XII corrects Figure X, so 68.34 is the Guidance's final figure for C",
  "Both print 68.33, which agrees with the engine's 68.333333 to two decimals",
  "The engine returns 68.34, confirming the later figure over the earlier one"],
 "The course records that Company C's technical figure is printed 68.33 in Figure X and 68.34 in Figure XII for the same quantity, and the engine's 0.8 x St for C is 68.333333. A source can print one quantity two ways, which is why a printed figure is quoted exactly as printed and labelled as the source's, and why neither print is the exact figure.")

# 9
x("Kiiver and Kodym (2015) say that under linear conditions bid B, priced 75 between A at 50 and C at 100, would receive 75 points. What does the engine's linear method give B?",
 "50.000000, since the engine's linear family gives the dearest bid 0.000000",
 ["75.000000, as the source's own straight line drawn between A's 100 points and C's 50",
  "66.666667, since linear and lowest-ratio agree on a three-bid field",
  "67, the lowest-ratio score that Table 1 prints for bid B"],
 "The engine's linear method scores Sc = 100 x (Cmax - C) / (Cmax - Cmin), so A scores 100.000000, B 50.000000 and C 0.000000. The 75 in the text is a straight line drawn between A's 100 and C's 50, which no engine method reproduces, and the course does not claim one. 66.666667 is B's lowest-ratio score, which Table 1 prints as 67.")

# 10
x("At a technical weight of 0.7, the engine prints the commercial weight in its basis as 0.30000000000000004. What does that figure show?",
 "The engine computes 1 - 0.7 in binary floating point and prints the shortest decimal of the double it holds",
 ["A defect in the basis, which should print 0.3 since the two weights sum to one",
  "A stated engine convention that shifts weight toward price by a tiny margin",
  "The double 0.3 printed in full, since every double has seventeen significant digits"],
 "The engine computes the rest of the weight as 1 - 0.7 in binary floating point and prints the shortest decimal that reads back to the double it holds. That double is not the double 0.3 (checked), so printing 0.3 would misreport it. Nothing is shifted on purpose: it is a property of doubles. The lesson is that figures which print alike, or nearly, are not thereby equal.")

# 11
x("Average-price scoring, where a price score falls as a price moves away from the mean of the prices, is described by Kiiver and Kodym (2015) and Chen (2008). Why does the engine not offer it?",
 "No text read prints a formula for it, so the engine offers lowest-ratio and linear only and refuses other names",
 ["It is offered as mean-deviation, the third priceMethod, for any tender that draws more than five substantially responsive bids",
  "The World Bank Regulations prohibit average-price scoring, and the engine cites that prohibition by its paragraph",
  "It is offered but ungraded, since its scores depend on which other bids are in the field"],
 "Both sources describe average-price methods and warn against them, and neither prints a formula; no text read does. The engine offers lowest-ratio (the World Bank's) and linear (the family Kiiver and Kodym describe), and refuses any other name: \"priceMethod must be 'lowest-ratio' or 'linear'; there is no default\". mean-deviation is refused by name, and no Regulations paragraph is cited as a prohibition.")

# 12
x("Three boundaries: a bill line whose gap equals the tolerance, a bid exactly 20 percent below the estimate, and a price equal to the relative ALB limit. What does the engine do at each?",
 "Not corrected; flagged; not flagged",
 ["Corrected; flagged; flagged, since every check fires at its limit",
  "Not corrected; not flagged; not flagged, since every check fires strictly beyond its limit",
  "Corrected; not flagged; flagged, since a lower price is always the stricter test"],
 "Each rule keeps its own boundary. A gap equal to the tolerance is not a discrepancy (only a gap above it is corrected). The absolute ALB test flags a bid \"20% or more below\", so exactly 20 percent is flagged. The relative test flags a price below the mean less one standard deviation, so a price equal to the limit (99.000000 on the probe) is not flagged. No single rule covers all three.")

# 13
x("Two stated bids have evaluated costs of 1000000.0000001 and 1000000. How does the engine order them, and why?",
 "They tie at twelve significant digits, so the stated tie-break decides, down to the bidder id",
 ["The lower cost, 1000000, ranks first, since the two are different doubles and the engine returns both as typed",
  "Receipt time alone decides, since a tie in cost is broken by receipt first",
  "The engine refuses, since two costs this close cannot be ranked honestly"],
 "Two figures tie when Number(x.toPrecision(12)) agrees, and both costs have the key 1000000.00000, so they tie although they are different doubles. The stated tie-break is the lower evaluated cost, then the earlier receipt, then the bidder id; on the probe the bidder id decided (A, B). Costs apart at the twelfth digit, such as 1000000.00001 and 1000000.0001, do not tie and the lower ranks first.")

# 14
x("A learner types 200001 iterations into the contract comparison. What does the engine return?",
 "A refusal naming the cap: \"iterations must be a whole number from 1 to 200000\"",
 ["Clipped to 200000 iterations, with a note in the basis",
  "The run at 200001 iterations goes ahead, since the cap is a guide for the panel only",
  "A refusal naming MAX_BIDS instead, the single cap that governs every call to the engine"],
 "MAX_ITERATIONS is 200000, and a call over it is refused with the cap in the message. The engine clips nothing: a call over any cap is refused and left unadjusted. MAX_BIDS is 100 and governs the number of bids, a different input. The Monte Carlo cap is the one a learner can reach by typing.")

# 15
x("The World Bank Regulations are cited in their Seventh Edition, September 2025. What does the course say about the Sixth Edition of February 2025?",
 "It is superseded, and none of the evaluation rules used here changed between the two",
 ["The edition the engine's para 5.50 matrix was read from",
  "Still in force for Nigerian tenders until the Bureau adopts the Seventh",
  "A different high-value line appears in it, so the engine carries both and asks which applies"],
 "The course reads the Regulations in their Seventh Edition, read on 2026-09-26; the Sixth is superseded, and none of the evaluation rules used here changed between them. Para 5.50 and its US$10 million high-value line are cited to the Seventh. The engine carries one set of rules and asks for no edition, and the course makes no claim about the Bureau adopting an edition.")

emit(Q, '/root/cat-wip-procurement/banks/sc2a_m05.json', expect_n=15)
finish()
