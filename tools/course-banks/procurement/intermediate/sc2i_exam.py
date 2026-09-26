import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC2 Professional final exam, 42 questions across the tier's six modules.
# Every figure is quoted from digest.txt. The materials tender runs on its
# fixture settings unless a question states otherwise: pass mark 60, omission
# rule average, delivery schedule minWeeks 8, maxWeeks 14, ratePerWeek 0.0025,
# life cycle 5 years at 0.1, a lowest-cost award. Every combined score is quoted
# with its technical weight and methods, every s.14 lead with its reading.
# At least six questions need two modules at once. No capstone name, code,
# price or value appears.

# ---- lowest evaluated cost over the life of the asset

q(2, "Opening MS4's life-cycle cost year by year: which discounted figure belongs to the second year of maintenance?",
 "5785.123967, the 7000.000000 times the year 2 factor 0.826446",
 ["6363.636364, since a payment made during year 2 is discounted from the end of year 1",
  "4781.094188, as the factor for year 2 is 1 / (1 + 0.1) raised to the fourth power",
  "5259.203606, taken from the middle of the five-year life cycle as its representative year"],
 "Year n carries the factor 1 / (1 + 0.1) raised to n, applied at the end of that year, so the second year's 7000.000000 counts for 5785.123967. The other figures are other rows of the same table: 6363.636364 belongs to the first year, 5259.203606 to the third and 4781.094188 to the fourth.")

q(0, "An evaluator states a life-cycle discount rate of -1. What does evaluatedCosts return?",
 "A refusal by lifeCycle.discountRate: a fraction above -1 and at most 1, where 0.1 is 10 percent a year",
 ["A life-cycle cost with every year's cost doubled, since a rate of -1 inflates each future payment",
  "The life cycle dropped, and the evaluated cost returned without its last term for every bid",
  "A refusal by lifeCycle.years, as a negative rate is read as a request for no years at all"],
 "The engine's message is \"lifeCycle.discountRate must be a fraction above -1 and at most 1 (0.1 is 10 percent a year)\". A rate of -1 is outside that range and the call is refused by that field. The engine drops nothing silently, and the years have their own refusal.")

q(3, "A call to evaluatedCosts spells the life-cycle key as lifecycle, with a small c. What happens?",
 "The call is refused as a key the function does not read, and the accepted keys are listed",
 ["Matched to lifeCycle, as input keys are compared without case",
  "Left out without a word, so each evaluated cost omits its last term",
  "The evaluated costs come back with a warning that one key was unknown and has been ignored"],
 "The engine refuses: \"lifecycle is not an accepted key; the accepted keys at the top level are bids, omissionRule, bestEstimates, schedule, lifeCycle, tolerance\". A misspelt optional key is refused and never silently drops a term, which is the danger with a life cycle: the evaluated cost would look complete.")

q(1, "Without the life cycle, MS3's evaluated cost is 562500.000000, its corrected price. Why does nothing else enter?",
 "MS3 omits no item and delivers in 8 weeks, the minimum, so no omission and no schedule term is added",
 ["MS3 is an indigenous company with capacity, and s.16 lifts every adjustment from its evaluated cost",
  "MS3's discount cancels its schedule adjustment of 2701.500000 to the last unit, so the sum is its price",
  "Without a life cycle the engine prices each bid at its quoted total, and every other term waits for it"],
 "MS3 prices every line, so its omission term is 0.000000, and 8 weeks is not beyond minWeeks 8, so its schedule adjustment is 0.000000. Other bids carry terms without the life cycle: MS4's 519709.475000 includes its omission 12000.000000 and schedule 3779.475000. 2701.500000 is MS1's schedule term, and s.16 adjusts no evaluated cost.")

q(3, "MS2's evaluated cost is 547863.577232 and it carries no omission. Which terms make it up?",
 "Corrected price 525700.000000, schedule adjustment 1314.250000 and life-cycle cost 20849.327232",
 ["Corrected price 525700.000000 and the inspection average 12000.000000, with no schedule term at all",
  "Its quoted total less a discount, plus a life-cycle cost of 26535.507386 on its valve maintenance",
  "Corrected price 503930.000000 with its omission, schedule and life cycle added in turn"],
 "The materials table prints MS2's terms: corrected price 525700.000000, omissions 0.000000, schedule adjustment 1314.250000 and life-cycle cost 20849.327232, summing to 547863.577232. 12000.000000 is MS4's omission, 503930.000000 is MS4's corrected price and 26535.507386 is MS4's life-cycle cost.")

q(0, "MS1's evaluated cost is 543001.500000 without the life cycle. What is it with the life cycle at 5 years and 0.1?",
 "565746.220616, after its life-cycle cost of 22744.720616 is added",
 ["543001.500000 still, since MS1 prices every line and omits nothing for the life cycle to add to",
  "565746.220616 less 22744.720616, since the life cycle is a credit taken off a bid's price",
  "581453.933847, since the life cycle moves MS1 to the last rank of the four on the tender"],
 "MS1's valve maintenance of 6000.000000 a year discounts to a life-cycle cost of 22744.720616, and the evaluated cost rises from 543001.500000 to 565746.220616. The life cycle is a cost, and it applies to every bid whether or not it omits anything. 581453.933847 is MS3's evaluated cost; MS1 stays third.")

# ---- rated criteria and price scoring

q(1, "The World Bank Guidance on Evaluating Bids and Proposals (February 2025), Figures X to XII, prints company D's combined score as 98.34. The engine computes 98.333333. How should a report treat the two?",
 "As different figures: the Guidance rounded up at two decimals, and the engine's figure is exact",
 ["Equal, since two figures that agree to the second decimal place must describe the same bid's combined score",
  "An engine defect, since a combined score must reproduce the Guidance's published figure to every printed digit",
  "As the Guidance's error, since 98.34 cannot come from any rounding of the figure 98.333333"],
 "The engine's 98.333333 is exact; the Guidance prints to two decimals and rounded D's figure up. The ranking agrees, D, C, B, A, and every printed combined figure is within 0.01 of the engine's. Printed alike is not equal, and a printed source figure is quoted as the source's.")

q(2, "Annex 3 of the World Bank Guidance on Evaluating Bids and Proposals (February 2025) weights the technical score 0.4. The engine gives company A a combined 94.375000. What does the Guidance print, and how was it reached?",
 "94.37, two decimals of the engine's figure with the third one dropped",
 ["94.375000 in full, since the Guidance prints the engine's figure to six decimals",
  "90.625000, company A's financial score Sc, printed in the place of its combined figure",
  "91.66, which is company A's figure once the financial score takes 0.6"],
 "The Guidance prints 94.37, which is 94.375000 with the third decimal dropped. 91.66 is what the Guidance prints for company B, whose engine figure is 91.666667. A wins on both, with St 100.000000 and Sc 90.625000.")

q(0, "A contract rated Moderate risk is estimated at US$12000000. What weighting does the Rated Criteria matrix allow it?",
 "Cell c, a range of 0.100000 to 0.400000 for the Rated Criteria",
 ["The narrowest band, cell d at 0.200000 to 0.300000, since low risk always takes it",
  "Top-row cell a, 0.500000 to 0.800000, since high value lifts any risk into it",
  "Cell b, 0.600000 to 1.000000, the band the well services tender sits inside"],
 "The engine maps Moderate onto its low row, and US$12000000 is at or above the US$10 million line, so the contract is high value: the rule reads \"Moderate/Low Procurement Risk and High Value, Rated Criteria weighting between 10% and 40%\". Low risk does not always give the narrowest band; cells a and b belong to the High/Substantial row.")

q(3, "Under linear pricing with the relative technical score, the course steps the technical weight on the well services bids from 0.7 to 1. What does the stepped table show about the award as the technical weight rises?",
 "It moves from WS5 to WS1 and then to WS3",
 ["Straight from WS5 to WS3, since WS3 has the highest technical percentage",
  "WS5 keeps it at every step, since the linear method gives WS5 a commercial 100",
  "It moves from WS3 to WS1 and then to WS5 as the technical share of the score grows"],
 "The table prints WS5 most advantageous at 0.7, 0.75 and 0.8, WS1 at 0.85 and 0.9, and WS3 at 0.95 and 1. The award passes through WS1 before WS3. At 0.85 the table also prints a tie between WS5 and WS3, both at 85.000000, ordered by the lower evaluated cost.")

q(1, "At technical weight 0.7 and relative technical scoring, WS1's commercial score is 92.883107 by the lowest ratio. What is it by the linear method?",
 "31.080136, as the linear line runs from 100 at Cmin to 0 at Cmax",
 ["92.883107 as well, since WS1 sits between the two extremes where the methods agree",
  "77.265217, which is the commercial score WS1 is given under the linear method",
  "0.000000, since the linear method scores every bid other than the lowest at 0"],
 "Sc linear = 100 x (Cmax - C) / (Cmax - Cmin); WS1 at 928200.000000 scores 31.080136. 77.265217 is WS1's combined score B under linear pricing, a different figure. Only the dearest responsive bid, WS3, scores 0.000000 under the linear method.")

q(2, "The well services tender is high risk at US$900000, so its cell is b. The stepped table under linear pricing runs technical weights from 0.7 to 1. What does the band say about those steps?",
 "Every step sits inside cell b, 0.6 to 1, so the band alone cannot choose between WS5, WS1 and WS3",
 ["Only 0.7 sits inside cell b, so every higher step is refused by the engine as a misapplication of the matrix",
  "The steps from 0.85 upward fall outside cell b, which caps the Rated Criteria weight at 0.8",
  "Every step sits inside cell a, since the estimated cost puts the contract on the high-value side"],
 "Cell b runs from 0.600000 to 1.000000, and both ends are inside. Each step from 0.7 to 1 sits inside it, and across those steps the table's award moves from WS5 to WS1 to WS3. The band limits the weight; the choice inside it is stated. 0.8 is the top of cell a, which needs a high-value contract.")

q(3, "At technical weight 0.7 with linear pricing and the relative technical score, WS3's combined score is exactly 70.000000. Why?",
 "WS3 has the highest technical percentage, St 100, and the dearest cost, Sc 0, so B is 0.7 x 100",
 ["A cap at the technical weight times 100, which the engine applies to every bid whenever the linear method is chosen",
  "WS3's commercial score is 70 under the linear method, and its technical score adds nothing to the combined figure",
  "The linear method replaces the combined score with the technical weight for every bid"],
 "WS3 carries the highest technical percentage, 85.000000, so St = 100 x T / Thigh is 100.000000, and it is the dearest responsive bid, so its linear Sc is 0.000000. B is 0.7 x 100 plus the commercial weight times 0, which is 70.000000. No cap exists, and the other bids score other figures: WS5 87.647059 at the same settings.")

# ---- abnormally low bids

q(0, "On Annex I Example 1, Bid 4's evaluated cost is 1378232. Is it flagged under the relative test?",
 "No, since it sits above the limit of 1348451.837504, the mean less one population standard deviation",
 ["Yes, since it sits below the mean of 1664426.375000, which is where the test draws its line",
  "Yes, since it is among the four lowest of the sixteen, and the test flags the lowest quarter",
  "No, because it sits more than 20 percent below the mean and the absolute test applies instead"],
 "The relative test flags C < mean - SD, and the limit is 1348451.837504. Bid 4 at 1378232 is above it, so its flag is false; the engine flags Bid 1, Bid 2 and Bid 3 only. The mean itself is not the line, no quartile rule exists, and sixteen bids take the relative approach.")

q(2, "An evaluator holds five substantially responsive bids and also types in a valid cost estimate. Does the estimate change which abnormally low test runs?",
 "The relative approach, since 5 or more bids take it and the estimate is left unused",
 ["The absolute approach, since a stated estimate always takes precedence over the count of bids",
  "Both approaches, with a bid flagged only if each of the two tests flags it at the same time",
  "Absolute, since the relative test needs sixteen bids like Annex I"],
 "ALB_RELATIVE_MIN_BIDS is 5, so five bids take the relative test, comparing each bid with the mean less one population standard deviation of the field. The estimate stays unused, though it is still checked: a negative one would be refused. No test runs both ways, and Annex I Example 1 simply happens to hold sixteen bids.")

q(3, "The materials tender has five bids, yet the abnormally low test on its evaluation must take the absolute approach and needs an estimate. Why?",
 "MS5 failed the pass mark, so only four bids are substantially responsive, and fewer than 5 take the absolute approach",
 ["Materials tenders always take the absolute approach, since the relative test is written for works",
  "The life cycle makes the evaluated costs present values, which the relative test cannot compare",
  "MS3 is indigenous with capacity, and s.16 removes it from the count the relative test reads"],
 "MS5 scores 50.000000 against a pass mark of 60, so its price envelope stays shut and MS1 to MS4 remain. Four is below ALB_RELATIVE_MIN_BIDS, so the absolute test runs and a cost estimate must be typed in before any flag can be read. Nothing about materials, the life cycle or s.16 enters the count.")

q(1, "The engine's reason for Example 1's Bid 1 prints the standard deviation as the shortest round-trip decimal of the double the engine holds, with ten decimal places. Which standard deviation does a report quote?",
 "The numeric field at six decimals, 315974.537496, with the reason quoted only whole",
 ["The figure inside the reason, with every digit it prints",
  "315975, the Guidance's printed figure, which is the published value a report should cite",
  "326337.099079, the sample standard deviation"],
 "A figure inside a reason is the shortest round-trip decimal of the double; a report quotes the numeric field, 315974.537496, and shows a reason only verbatim. 315975 is the Guidance's rounding to the unit, and 326337.099079 is the sample figure, which the engine does not use.")

q(0, "In Annex I Example 2, a committee rejects Bid 1 after examination and the absolute test is run again on Bids 2 to 4 with the same estimate. What happens to Bid 2's flag?",
 "It stays true, since the absolute test compares Bid 2 with the estimate alone",
 ["Cleared, as Bid 2 is now the lowest and judged against the rest",
  "A refusal replaces it, as three bids are too few for any approach the engine offers",
  "It clears, as a rejection above it resets every flag the committee has not yet examined"],
 "Under the absolute approach each bid is tested against the estimate: Bid 2 is 23.005876 percent below 150003863, which is 20 percent or more, whoever else is in the field. Fewer than 5 bids still take the absolute approach and need the estimate, which is given.")

q(3, "The constants ALB_ABSOLUTE_PCT (20) and ALB_RELATIVE_MIN_BIDS (5) sit in the engine's DEFAULTS. Where does each come from?",
 "Both from Stage 1 of the World Bank ALB Guidance, Second Edition, July 2016",
 ["Both are engine conventions with no published source, stated so that a reader can change them",
  "The 20 from the Public Procurement Act 2007 s.31 and the 5 from the World Bank Regulations para 5.50",
  "The 20 from s.16 of the content Act and the 5 from the lead of s.14, both applied to the price"],
 "The DEFAULTS table cites both to \"WB ALB Guidance (2016) Stage 1\": 20 percent or more below the cost estimate for the absolute approach, and 5 substantially responsive bids as the fewest for the relative approach. The s.14 lead is NC_LEAD_PCT, the s.16 margin is INDIGENOUS_MARGIN_PCT at 10, and the Act 2007 s.31 covers arithmetic errors and deviations.")

# ---- measuring Nigerian content

q(2, "WS2's content is 70.000000 for coiled tubing, 90.000000 for pumping and 87.500000 for stimulation, all by man-hours. How many items meet their Schedule minimums?",
 "1 of 3: stimulation meets 85%, while coiled tubing misses 75% and pumping misses 95%",
 ["3 of 3, since its overall content of 77.647059 is above the lowest minimum of the three",
  "2 of 3: coiled tubing and stimulation meet theirs, and pumping alone falls short of 95%",
  "0 of 3, since each item is judged against the highest minimum, 95% for pumping"],
 "Each item is tested against its own line: 70.000000 against 75% falls short, 90.000000 against 95% falls short, and 87.500000 against 85% meets. The engine prints both shortfalls as reasons. The overall figure, 77.647059, does not enter the item test.")

q(1, "Which Schedule line, minimum and measured unit does the materials tender tie its casing item to?",
 "steel-pipes, Steel Pipes at a minimum of 100% by tonnage",
 ["valves, at a minimum of 60% counted by number of joints",
  "casing-and-tubing, a line the engine holds at 100% by tonnage",
  "cement-portland, at 80% by tonnage, the line for well construction"],
 "The fixture ties casing to the Schedule line steel-pipes, which the engine holds at 100% by tonnage under MATERIALS AND PROCUREMENT. casing-and-tubing is not a line of NC_SCHEDULE and is refused. Valves (60% by number) and cement-portland (80% by tonnage) are the lines of other items.")

q(3, "MS3's casing content is 100.000000 against the Steel Pipes minimum of 100%. How does the engine judge the item, and MS3 overall?",
 "The item meets its minimum, and MS3 meets all 4 of 4, with an overall content of 86.240876",
 ["Short of it, since no content can exceed a minimum of 100%, which leaves MS3 meeting just 3 of its 4 items",
  "Refused, since a content of 100% leaves no share for the total to divide",
  "The item meets its minimum, and MS3's overall content is 100.000000 as its largest item"],
 "The rule is content >= the minimum, so 100.000000 meets 100%. MS3 meets every minimum, 4 of 4, and its weighted overall content is 86.240876. A Nigerian quantity equal to the total is inside 0 to total and is accepted.")

q(0, "Which units does the engine accept for a content item, as NC_MEASURES lists them?",
 "man-hours, tonnage, spend, length, number, volume and litres",
 ["man-hours, tonnage and number only, the three units the two Ekene tenders use",
  "any unit the bidder states, as long as it is the same unit for every item",
  "spend alone, since the Act measures all content in money for comparison"],
 "NC_MEASURES lists seven units: man-hours, tonnage, spend, length, number, volume, litres. A stated target in any other unit is refused: \"items[0].measure must be one of man-hours, tonnage, spend, length, number, volume, litres\". Even a listed unit is refused for an item whose Schedule line names another.")

q(2, "A content item is written with a measure and a source but no targetPct and no scheduleLine. What does the engine return?",
 "A refusal: \"items[0].targetPct must be a number from 0 to 100 when no scheduleLine is given\"",
 ["A target of 0% for the item, since a missing percentage is read as no minimum at all",
  "The nearest Schedule line's minimum, matched from the measure and the source text",
  "A result with the item marked as met by every bid, as nothing can fall below no target"],
 "A stated target must carry a percentage, a unit and a source. Without a Schedule line the percentage is required, and the engine refuses by the field items[0].targetPct. It never sets a hidden target and never guesses a Schedule line.")

q(1, "One materials bid reports casing, valves and cement but leaves baryte out of its items. What does the engine return?",
 "A refusal by that bid's items, since every bid reports every item",
 ["The bid's overall content computed over the three items it does report",
  "A baryte content of 0.000000 for that bid, with the item marked below its minimum",
  "A result with the missing item skipped and a reason noting it for the committee"],
 "The course's own case leaves casing out: \"bids[0].items.casing is missing: every bid reports every item\". The rule is the same for any item. A missing item is never read as 0 and never skipped, because either would change the overall content.")

q(3, "A materials bid reports a content item called pipe, which the tender does not list. What does the engine do?",
 "It refuses: pipe is not an item id, and the accepted keys are casing, valves, cement, baryte",
 ["Ignored as extra, with the overall content computed from the four items the tender itself lists for the bids",
  "Pipe joins the overall content with a weight of 0, so the figure does not move",
  "It maps pipe to the steel-pipes line and tests it against the Steel Pipes minimum"],
 "The engine checks every item key against the item ids the call carries: \"bids[0].items.pipe is not an item id; the accepted keys of bids[0].items are the item ids casing, valves, cement, baryte\". An unknown key is refused and never dropped or remapped.")

q(0, "On the well services tender, which bid has the highest overall content pooled by man-hours, and what is it?",
 "WS3, at 86.529412, meeting 3 of 3",
 ["WS6, at 84.705882, the highest since WS6 scores the most technically",
  "WS1, at 82.647059, since its pumping sits exactly on its minimum",
  "WS5, at 78.750000, the bid with the lowest evaluated cost on the tender"],
 "The pooled figures are WS3 86.529412, WS6 84.705882, WS1 82.647059, WS5 78.750000, WS2 77.647059 and WS4 67.058824. WS3 is highest and meets all three minimums. WS6 fails a mandatory requirement and is not scored technically, and content does not depend on the evaluated cost.")

# ---- section 14

q(2, "The engine's constants NC_PRICE_MARGIN_PCT and NC_LEAD_PCT are both cited to s.14. What does each set?",
 "1 sets the price group, within 1% of the lowest; 5 sets the lead, in points or relative as the caller states",
 ["1 sets the lead in points and 5 sets the price group, as a percent of the mean evaluated cost",
  "Both set price margins, 1 for s.14 and 5 for s.16, measured from the lowest evaluated cost",
  "5 sets the lead in percentage points, the Act's settled meaning, and 1 sets the price group"],
 "NC_PRICE_MARGIN_PCT is 1, the s.14 price group within that percent of the lowest evaluated cost. NC_LEAD_PCT is 5, the s.14 content lead \"at least this much higher (points or relative, stated by the caller)\". The Act does not say which reading applies. The s.16 margin is INDIGENOUS_MARGIN_PCT at 10.")

q(1, "K5 at 2010000 carries 75% content against LO's 70% at 2000000. With the lead read in percentage points, what does the engine return?",
 "A lead of exactly 5.000000 points, which meets the test, so s.14 applies and selects K5",
 ["A lead of 5.000000 points, short of the test, since the lead has to sit strictly above 5 points",
  "A relative lead measured against LO's content, since the engine reports every lead as relative",
  "No lead at all, since K5 sits 0.5% above LO and so falls outside the 1% group of the section"],
 "The points basis is top - runner-up >= 5 percentage points, and 75 against 70 is exactly 5.000000, so s.14 applies and K5 is selected. The call states the points reading, so the lead is in points. K5 at 2010000 is within 1% of 2000000 and in the group.")

q(0, "Of s.14's three phrases, which does the engine read as a stated reading in every result, and which must the caller state?",
 "\"within 1 %\" and \"closest competitor\" are read as stated; \"at least 5% higher\" is the required input ncLeadBasis",
 ["All three are required inputs, since the Act leaves every phrase of s.14 open",
  "\"closest competitor\" is required, and the other two are read as printed",
  "None of the three is an input, as the engine applies the Board's reading of each"],
 "The engine prints its readings of \"within 1 % of each other at commercial stage\" (within 1% of the lowest evaluated cost) and \"its closest competitor\" (the next-highest Nigerian content in the group) in every reason. For \"at least 5% higher\" it has no default, because the Act does not say points or relative, and ncLeadBasis must be stated.")

q(3, "Which content figure does the s.14 comparison of MS2 against MS4 use for MS2?",
 "Its overall content, 61.584657, the mean of its items weighted by its quoted amounts",
 ["The valves content alone, 58.333333, since valves are the one item that s.14 of the Act names for the test",
  "Cement, at 82.000000, the highest of its four item contents",
  "Its casing content, 60.000000, since steel pipes carry the largest spend"],
 "The s.14 call carries each bid's overall content, the figure the content call returns: MS2 61.584657 and MS4 57.043637. The overall is the weighted mean of the item contents with the bid's quoted amounts as weights, since the items mix tonnage and number. The s.14 call reads one content figure per bid, its ncPct.")

q(2, "The s.14 group is judged on evaluated costs. Which figures place MS2 0.296313 percent above MS4 on the materials tender?",
 "The evaluated costs with the life cycle: MS4 546244.982386 and MS2 547863.577232",
 ["Quoted totals, MS4 503930.000000 and MS2 525700.000000, read before any term is added",
  "Costs without the life cycle, MS4 519709.475000 and MS2 527014.250000",
  "The life-cycle costs alone, MS4 26535.507386 and MS2 20849.327232"],
 "s.14 acts at the commercial stage on the evaluated cost, which on the materials tender carries the omission, the schedule and the life cycle. MS2 at 547863.577232 sits 0.296313 percent above MS4 at 546244.982386. The figures without the life cycle and the quoted totals are other quantities, and the life-cycle cost is one term.")

q(1, "A contentPreference call carries a bid whose receivedAt is \"2027-03-02T13:25:00\" with no zone. What comes back?",
 "A refusal: \"bids[0].receivedAt must be a UTC time 'YYYY-MM-DDTHH:MM:SSZ'\"",
 ["Read as UTC, since a receipt given with no zone is taken to be Greenwich time",
  "The bid moved to the end of any tie-break, as its receipt time cannot be compared",
  "A result with the receipt time ignored, since s.14 does not order bids by receipt"],
 "The engine refuses a receipt time without its zone by the field bids[0].receivedAt, in contentPreference as in evaluatedCosts. It assumes no zone and never quietly drops a field it reads.")

# ---- section 16 and the award

q(0, "MS3 sits 6.445634 percent above the lowest evaluated cost. How do s.14 and s.16 each treat it?",
 "Outside the 1% s.14 group, so s.14 never compares it, and inside the 10 percent s.16 margin, so it is protected",
 ["Inside both, since the Act counts an indigenous company's price at a discount of 10 percent",
  "Outside both, since 6.445634 percent is above the 5% lead that s.14 and s.16 share",
  "Inside the s.14 group, where it leads with 86.240876 and is selected under both readings"],
 "The s.14 group is within 1% of the lowest, and MS3 at 6.445634 percent is out, so its 86.240876 content never enters the comparison. s.16 protects an indigenous company with capacity within 10 percent, and MS3 is within it. The 5% belongs to the s.14 lead, and no price is discounted.")

q(2, "The whole materials tender is sent to evaluateTender with no award basis stated. What does the engine return?",
 "The call is refused by award, which has no default and must be lowest-cost or combined",
 ["The award on the lowest evaluated cost, the default for a tender without rated criteria",
  "A combined award at technical weight 0.7, the weight that the well services tender states in its fixture",
  "The technical envelope only, with the commercial stage left for a later call"],
 "The award basis is a required input with no default: \"award must be 'lowest-cost' or 'combined'; there is no default\". The engine decides nothing a rule does not state: the pass mark, the weights, the technical weight, the methods, the s.14 reading and the award basis all have to be stated.")

q(3, "Suppose the well services tender wanted Nigerian content to count under its combined award at technical weight 0.7. How can it, and what binds the weight?",
 "As a rated criterion with its own weight in the technical envelope, with the technical weight still inside cell b",
 ["Through s.14 at the commercial stage, applied to bids within 1% on combined score",
  "Through s.16, with each indigenous bid's combined score lifted by 10 percent",
  "As a stated nigerianContent reading, after which the para 5.50 band no longer applies"],
 "With a combined award the engine refuses the content rule and asks for Nigerian content as a rated criterion with its weight. A content criterion is a rated criterion, so the technical weight carrying it must sit inside the para 5.50 cell; for high risk at US$900000 that is cell b, 0.600000 to 1.000000, which holds 0.7.")

q(1, "On the fixture settings and under the relative reading the materials award goes to MS2. In that run, which bid does the engine name as the lowest evaluated cost?",
 "MS4, at 546244.982386; the award moves by s.14 and the lowest evaluated cost stays with MS4",
 ["MS2, since the bid awarded under a lowest-cost basis is by definition the lowest evaluated cost",
  "MS2, once its content lead is subtracted from its evaluated cost as a price preference",
  "No bid, since s.14 replaces the lowest evaluated cost with the content ranking"],
 "The end-to-end table prints MS4 as the lowest evaluated cost in every run, and MS2 as the award under the relative reading. \"Lowest evaluated cost\" names the evaluated cost and does not name the award. The engine applies no price preference to content.")

q(0, "Four percentages sit in the Professional rules: 1, 5, 10 and 20. Which pairing matches the engine's constants?",
 "1 the s.14 group, 5 the s.14 lead, 10 the s.16 margin, 20 the absolute abnormally low test",
 ["The s.14 group at 1, the relative ALB count at 5, the s.14 lead at 10 and the s.16 margin at 20 percent",
  "s.16's margin 1, the s.14 lead 5, the absolute ALB test 10, the s.14 group 20",
  "1 the ALB tolerance, 5 the s.16 margin, 10 the s.14 lead, 20 the s.14 group"],
 "The constants are NC_PRICE_MARGIN_PCT 1 and NC_LEAD_PCT 5 (s.14), INDIGENOUS_MARGIN_PCT 10 (s.16) and ALB_ABSOLUTE_PCT 20 (the ALB Guidance, Stage 1). The 5 in ALB_RELATIVE_MIN_BIDS is a count of bids, a different quantity.")

q(2, "On the fixture settings with no content rule stated, the materials award reason reads \"MS4 has the lowest evaluated cost\". Which option gives a true reason for passing over each of the two bids it names?",
 "MS5, whose lower quoted total was never opened, and MS3, whose technical 90.000000 earns only a pass",
 ["MS2, whose Nigerian content lead is applied in every run, and MS1, which delivers late",
  "MS3, whose s.16 protection outranks price, and MS5, which is protected the same way",
  "MS2 and MS1, since the award goes to the bid with the fewest terms added"],
 "MS5 quotes 487200.000000 but fails the pass mark of 60, so its commercial envelope is not opened. MS3 scores 90.000000, the highest, and under a lowest-cost award a technical score earns a pass and nothing more. s.14 is not tested with no content rule stated, and s.16 protects and selects nothing.")

q(3, "The whole materials tender in one call, with a lowest-cost award: at which stage is MS5 excluded, and with what reason?",
 "At the technical stage: \"technical score 50 is below the pass mark 60; the commercial envelope is not opened\"",
 ["At the commercial stage, as its price is the lowest and is examined as abnormally low first",
  "At the s.14 stage, as its content of 49.874791 is the lowest and falls out of the group",
  "It is not excluded; it is ranked last after its technical shortfall is priced as a deviation"],
 "evaluateTender runs the technical envelope on every bid, then the commercial envelope on the bids that passed. MS5 fails the pass mark and is excluded at the technical stage with the reason in the key. Its content never matters to s.14, and the ALB test is a separate call.")

q(1, "Under a lowest-cost award on the well services tender, which bid does evaluateTender award, and how does that compare with the combined award at 0.7, lowest-ratio and relative?",
 "WS5 on the lowest evaluated cost, 862141.000000, while the combined award goes to WS3",
 ["WS3 both ways, as the highest technical percentage",
  "WS4, whose quoted 763200.000000 is the lowest of the six",
  "WS5 both ways, since the lowest evaluated cost always scores the highest combined score"],
 "The lowest-cost award goes to WS5, 862141.000000; the combined award at technical weight 0.7, lowest-ratio and relative goes to WS3 at 96.998434. WS4 fails the pass mark, so its quoted total is never opened. The Professional tier follows the lowest-cost road on the materials tender with a life cycle added.")

q(0, "On the materials tender's fixture schedule (minWeeks 8, maxWeeks 14, ratePerWeek 0.0025), a bid's delivery is stated as 15 weeks. What does the evaluation do with it?",
 "The bid is excluded at the commercial stage with its reason, since beyond maxWeeks a bid is rejected",
 ["An adjustment of 0.0025 x 7 of the price is added and the bid is kept in the ranking as a late one",
  "A cap at 14 weeks on the adjustment, with the bid ranked on that capped figure among the responsive bids",
  "It refuses the whole call, since a completion beyond maxWeeks is an input error"],
 "The engine's schedule basis ends with the maximum: on the well services tender it reads \"beyond 10 weeks the bid is rejected\", and the materials tender states maxWeeks 14. A bid beyond the maximum leaves the commercial envelope as an exclusion with its reason, and the adjustment applies only to the weeks beyond minWeeks up to the maximum. A late bid is a result with a reason, so nothing is refused.")

emit(Q, '/root/cat-wip-procurement/banks/sc2i_exam.json', expect_n=42)
finish()
