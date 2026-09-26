import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC2 Associate m04, The Evaluated Cost.
# Sources: the evaluated cost rule and its citation, the table of the four
# passing well services bids term by term, the engine's verbatim reasons, the
# omission at the average and who prices it, the completion-time basis, the
# ranking basis, priced and major deviations, and the evaluatedCosts
# refusals. The keyed figures were re-run through the engine
# (scratch/bank-beginner/witness.mjs).

q(0, "Which terms does the engine add to the corrected price to build a well services bid's evaluated cost?",
 "Less the discount, plus priced deviations, omissions and the completion-time adjustment.",
 ["Plus the discount, less priced deviations, with omissions left out.",
  "The quoted total's gap from the lowest bid, plus the arithmetic correction a second time.",
  "Only the completion-time adjustment."],
 "The engine's rule is corrected price less discount plus priced deviations plus omissions plus the schedule adjustment, with a further term the well services tender does not use. A discount lowers the figure and a deviation raises it, the correction is already inside the corrected price, and no term measures a gap to another bid.")

q(2, "WS1 quotes 943200.000000 with an unconditional discount of 15000.000000 and finishes in the minimum 6 weeks. What is its evaluated cost?",
 "928200.000000",
 ["943200.000000, as a discount changes only the final contract sum.",
  "No figure until the committee judges whether the discount is genuine.",
  "885574.000000"],
 "The engine deducts an unconditional discount from the corrected price: 943200.000000 less 15000.000000 is 928200.000000, and at 6 weeks there is no completion adjustment. A discount is certain, so it counts in the comparison. 885574.000000 is WS2's evaluated cost, and nothing in the rule adds a discount back.")

q(3, "WS3 omits nitrogen. The other responsive bids price it at 33600.000000, 35400.000000 and 37200.000000. What does the engine add to WS3?",
 "35400.000000, the average of the three",
 ["33600.000000, the lowest of the three, which gives WS3 the benefit of the doubt.",
  "No price until an estimate is stated.",
  "Nothing, because a bid that omits an item is held to have included it in another line."],
 "The engine's reason is \"item nitrogen omitted; the average of the 3 prices quoted by the other responsive bids, 35400, is added\", following ITB 34.1 of the Works SPD (September 2025). The average is the cited rule; the engine offers no lowest option (asked for one, it refuses), nothing sums the three, and an omission is priced in and not assumed away.")

q(1, "WS4 also quotes a nitrogen line. Why is its price left out of the average that prices WS3's omission?",
 "WS4 failed the pass mark, so its price envelope was never opened and it is not responsive.",
 ["WS4's nitrogen line was corrected, and corrected amounts are left out of the average.",
  "The average takes three prices at most, the three received first by the tender box.",
  "WS4 quoted the lowest total of the six, and the lowest bid is excluded to keep the average fair."],
 "Only responsive bids price an omission: an omitted item is priced at the average of the corrected amounts quoted for it by the other responsive bids. WS4 fell below the pass mark, so its price was never read. The average uses corrected amounts, has no cap on its count, and excludes no bid for being low.")

q(3, "WS2 asks for payment in 30 days where the conditions give 60. How does the engine treat that departure?",
 "As a priced deviation of 9500.000000, added to WS2's evaluated cost.",
 ["A major deviation, which rejects WS2 at the commercial stage for refusing the terms.",
  "Reduced by 9500.000000, since earlier payment lowers the contractor's own financing cost.",
  "As a note in the report that leaves the evaluated cost unchanged, because payment terms carry no price."],
 "The engine's reason is \"deviation payment-terms: asks for payment in 30 days where the conditions give 60; priced at the interest on the earlier payment (9500)\". A minor deviation is quantified in money and added (Public Procurement Act 2007 s.31(14)). A major deviation reaches the engine only as a stated rejection reason, and a priced deviation is added to the cost.")

q(0, "WS5 finishes in 9 weeks against a minimum of 6, at ratePerWeek 0.005. What completion-time adjustment does the engine add?",
 "12741.000000, that is 0.005 x 3 x 849400",
 ["8674.000000, the adjustment for two weeks beyond the minimum on WS2's corrected price.",
  "0.005 x 9 x 849400, on all 9 weeks.",
  "0.000000, since 9 weeks is inside the maximum of 10 and so earns no charge."],
 "The adjustment is ratePerWeek x the weeks beyond minWeeks x (corrected price less discount): 0.005 x 3 x 849400 = 12741, as the engine's reason prints. 8674.000000 belongs to WS2. Only weeks beyond the minimum are charged, and the maximum of 10 marks rejection, with every week between 6 and 10 still charged.")

q(1, "What price does the engine multiply to find the completion-time adjustment?",
 "The corrected price less the discount, a base the engine names as its convention.",
 ["Whatever total the bidder wrote, before any arithmetic correction.",
  "The corrected price before the discount, so a discount leaves the charge unchanged.",
  "One common base for all, the lowest evaluated cost in the tender."],
 "The engine's schedule basis reads \"ratePerWeek 0.005 of (corrected price - discount) for each week beyond 6\". The Works SPD (September 2025) gives the rate and leaves the base open, so the engine states its choice. The quoted total would carry an arithmetic slip into the charge, and charging before the discount would bill time on money already given back.")

q(2, "WS1 promises completion in 6 weeks, the minimum. What does the engine return for its schedule term?",
 "0.000000, with no credit for finishing early.",
 ["A credit of 4590.000000 for finishing a week sooner than WS3.",
  "Four weeks of credit for beating the maximum of 10, deducted from its price.",
  "A charge of 0.005 on the first week."],
 "The engine's reason is \"completion in 6 weeks is not beyond the minimum 6 weeks; no adjustment and no credit for earlier completion\". The minimum is the fastest completion the company values, so no bid earns a credit for speed, against WS3 or against the maximum, and no week up to the minimum is charged.")

q(2, "Under the well services schedule, minWeeks 6 and maxWeeks 10, a bid offers completion in 11 weeks. What does the engine do?",
 "It excludes the bid at the commercial stage and names the reason.",
 ["Charging 0.005 of the price for each of the 5 weeks beyond the minimum, it ranks the bid.",
  "A refusal naming schedule.maxWeeks, because a bid lies outside the stated band.",
  "It caps the bid at 10 weeks and charges the four weeks between 6 and 10."],
 "The engine's schedule basis says beyond 10 weeks the bid is rejected, so the bid leaves at the commercial stage as an exclusion with its reason, a result. The charge applies only to bids inside the band, a bid's weeks are never capped, and a refusal is kept for bad inputs such as maxWeeks below minWeeks.")

q(0, "Which bid holds the lowest evaluated cost of the well services tender, with omissions at the average and the fixture's schedule?",
 "WS5, at 862141.000000, with WS2 second at 885574.000000.",
 ["WS2, since its corrected price of 867400.000000 carries no discount to deduct.",
  "WS1, once its discount is taken.",
  "WS3, because the average price of its nitrogen line is lower than any bid's own."],
 "Evaluated cost ascending, the engine returns WS5 862141.000000, WS2 885574.000000, WS1 928200.000000 and WS3 957990.000000. WS2 adds a deviation and 8674.000000 of schedule to 867400.000000, WS1's discount leaves it third, and WS3's figure, with its nitrogen priced in, is the largest of the four.")

q(3, "WS3 quotes 918000.000000 and finishes in 7 weeks. How does its evaluated cost of 957990.000000 build up?",
 "918000.000000 plus 35400.000000 for the nitrogen omission plus 4590.000000 for one week beyond the minimum.",
 ["918000.000000 plus 35400.000000 plus 9500.000000 for a deviation on its payment terms.",
  "943200.000000 less its discount plus the nitrogen average of 35400.000000.",
  "918000.000000 plus 4590.000000 and a correction of 18000.000000 on ct-spread."],
 "Each row of the engine's table is the sum of its terms: WS3 has no correction, no discount and no deviation, so 918000.000000 + 35400.000000 + 4590.000000 = 957990.000000. The payment-terms deviation is WS2's, 943200.000000 and the discount are WS1's, and WS3's correction is 0.000000.")

q(1, "WS1 is given \"omitted\": [\"mob\"] while its bill still prices mob. What comes back?",
 "A refusal: \"bids[0].omitted lists 'mob', which the bid also prices\".",
 ["An evaluated cost with mob counted twice, once as priced and once at the average.",
  "An evaluated cost with WS1's own mob price removed and the average added in its place.",
  "A result that ignores the omitted list, since the bill line shows mob was priced."],
 "An item cannot be both omitted and priced, and the engine refuses the call in its own words. It does not count the item twice, does not replace the bidder's own price with an average, and does not quietly ignore the contradiction.")

q(0, "No responsive bid other than WS3 prices nitrogen, and no best estimate is stated. What does the engine return?",
 "A refusal: \"bestEstimates.nitrogen is required: bid WS3 omits item nitrogen and no other responsive bid prices it\".",
 ["An omission of 0.000000, since no price exists to average and WS3 carries the risk of the item.",
  "WS4's nitrogen price, the only other one quoted, used although its envelope was never opened.",
  "WS3 excluded at the commercial stage as a bid that failed to price every line of the bill."],
 "The omission basis says the average of the other responsive bids, else the Employer's best estimate. With neither, the engine refuses by name and asks for bestEstimates.nitrogen. It prices nothing at zero and does not reach into a failed bid's prices, and an omission is no ground for exclusion.")

q(3, "A bid is given the rejection reason \"major deviation: refuses the liability clause\". What does the engine do with it?",
 "Exclusion at the commercial stage, carrying the stated reason word for word.",
 ["Pricing the deviation at the bid's discount, it ranks the bid with the others.",
  "The bid's evaluated cost is set to the largest in the tender and it stays ranked.",
  "It asks for a price, refusing the call until the deviation carries an amount."],
 "A major deviation rejects a bid (Public Procurement Act 2007 s.31(7)) and reaches the engine as a stated rejection reason; the bid is excluded at the commercial stage with the reason given, and it is no longer responsive. Nothing prices it, no cost is imposed, and a stated reason is accepted as given (only an empty one is refused).")

q(1, "What does WS5's evaluated cost of 862141.000000 tell the company?",
 "That WS5 ranks first on cost under the stated rules; it is no forecast of the job's cost.",
 ["What the job will cost, since every correction and adjustment has already been made.",
  "The sum the company will pay WS5 if the contract is awarded to it on these terms.",
  "The lowest total quoted in the tender, before any correction or adjustment of the bills."],
 "An evaluated cost ranks bids under stated rules, with omissions at the average and the stated schedule, and is not a forecast of what the job will cost. Its completion-time adjustment of 12741.000000 is a term the stated schedule adds for the comparison, so the figure is no contract sum either, and the lowest quoted total was WS4's, whose envelope stayed sealed.")

emit(Q, '/root/cat-wip-procurement/banks/sc2b_m04.json', expect_n=15)
finish()
