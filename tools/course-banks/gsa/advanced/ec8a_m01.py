import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC8 Expert m01, Energy Parity and the S-Curve. Keys rest on the engine's
# parity slopes on the three stated heat contents, the published S-curve and
# the golden kinks case run through priceSeries, the export feed's price rows,
# the S-curve refusals and the printed-against-exact slope. Every figure is a
# digest line; the printed 0.172 is keyed as printed alike and never equal.

K = [2, 0, 3, 1, 1, 3, 0, 2, 3, 1, 0, 2, 2, 0, 3]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("The engine's energyParitySlope is called on 5.8 MMBtu per barrel, the heat content the Energy Charter Secretariat (2007) works on. What slope does it return?",
 "0.172414, the reciprocal of 5.8 MMBtu per barrel",
 ["0.172 exactly, the heat-equivalence slope that the report prints in its section 4.5.3.3",
  "5.813953, the heat content in MMBtu per barrel that the printed slope implies when run backwards",
  "0.175778, the slope the engine holds for the EIA's 5689000 Btu per barrel read on 2026-09-26"],
 "The engine's rule is slope = 1 / (MMBtu per barrel), and on 5.8 it returns 0.172414. The report prints 0.172, a rounded figure the course quotes as the report's own; 5.813953 is a heat content and no slope at all; 0.175778 is the slope on the EIA's heat content, a different input.")

# 2
x("On the EIA's energy conversion page (read 2026-09-26), one barrel of crude oil carries 5689000 Btu. What parity slope does the engine return on that heat content, and what does it mean for a report?",
 "0.175778, and a report names the heat content its parity slope rests on",
 ["0.172414, because the engine converts every source to the Energy Charter Secretariat's 5.8 MMBtu per barrel first",
  "0.166667, the EIA figure rounded up to 6 MMBtu per barrel",
  "5.689000, the heat content itself, in MMBtu per barrel"],
 "On 5.689000 MMBtu per barrel the engine returns 0.175778. Two sources give two slopes, so a report says which heat content it used. The engine divides by whatever heat content it is given and converts nothing to 5.8; 0.166667 is its answer on a stated 6; and 5.689000 is the input, the MMBtu per barrel, and no slope.")

# 3
x("Run backwards, the Energy Charter Secretariat's printed slope of 0.172 implies 5.813953 MMBtu per barrel. How does the course read the printed 0.172 against the engine's 0.172414?",
 "As a rounded figure: the two print alike at three decimals, are not equal, and each is quoted as its own source's",
 ["As the exact slope for a different barrel, so the report and the engine disagree only about heat content",
  "As an error in the report that the engine corrects, so every quotation of 0.172 becomes 0.172414 in the course",
  "As the same slope, because two figures that agree to three decimals are keyed as equal throughout this course"],
 "The printed slope's reciprocal, 5.813953, is no heat content the report states, so 0.172 is a rounded figure. Printed alike is not equal: the course quotes 0.172 as the report's and 0.172414 as the engine's on 5.8. Nothing in the text says the report used another barrel, and the course never rewrites a source's printed figure.")

# 4
x("The Ekene export feed agreement (synthetic) prices gas at 0.5 + 0.12 x the averaged oil index. Set beside the parity slope on 5.8 MMBtu per barrel, what does its slope say?",
 "Its slope of 0.12 sits below 0.172414, so the formula prices gas below oil on heat content",
 ["It sits above parity once the constant is added, since 0.12 plus 0.5 exceeds the parity slope of 0.172414",
  "Nothing, since parity is a reference for hub-indexed prices only",
  "It sits at parity, since the S-curve slopes of 0.06 on each side average out to the parity slope over the term"],
 "A contract slope below the parity slope prices gas below oil on heat content, and 0.12 is below 0.172414. Adding a constant in US$ per MMBtu to a slope in US$ per MMBtu per US$ per barrel compares unlike things; parity is no bar to comparing an oil-indexed slope, since it is hub-linked multipliers that parity says nothing about; and the S-curve slopes act only outside the kinks and average to nothing.")

# 5
x("The Energy Charter Secretariat's Figure 51 S-curve (A 0.1485, B 0.8, kinks at 15 and 30 US$ per barrel, flat outside) is run on a JCC of 10. What does the engine return?",
 "3.027500 on the low segment, the plateau held at and below the lower kink",
 ["2.285000 on the straight line, because the S-curve bends the price only above its upper kink",
  "3.500000 clamped at the floor, a flat segment being a floor",
  "2.500000, the foot of the figure's printed price axis"],
 "On the published curve the engine prices a JCC of 10 at 3.027500 on the low segment, the plateau that follows from the printed parameters. 2.285000 is the straight line with no S-curve; 3.500000 is a different golden case that states a floor of 3.5; and 2.500000 is only the bottom of the printed axis.")

# 6
x("Figure 51's S-curve and the straight line 0.8 + 0.1485 x JCC are both priced on the golden JCC values 10, 15, 22.5, 30 and 40. At which of them do the two lines price differently?",
 "Only at 10 and 40, the months outside the kinks",
 ["At every JCC except 22.5, the one point where the two lines are made to cross",
  "At 15 and 30 as well as at 10 and 40, since a month at a kink takes the outer segment's price",
  "At none of them, because the flat outer segments reproduce the straight line's prices at both ends"],
 "Both give 3.027500 at 15, 4.141250 at 22.5 and 5.255000 at 30, because between the kinks and AT either kink the S-curve is the straight line. Outside them it holds flat: 3.027500 at 10 against 2.285000, and 5.255000 at 40 against 6.740000. A kink month is on the middle segment, and the plateaus differ from the line at 10 and 40.")

# 7
x("On the golden kinks case, 0.5 + 0.12 x oil with kinks at 50 and 90 and slopes of 0.06 below and 0.03 above, a month's index is exactly 50.000000. What does the engine return?",
 "The mid segment at 6.500000, the middle line's price",
 ["The low segment at 6.500000",
  "The low segment at 6.499400, the outer slope applied from the kink downwards to the month",
  "The mid segment at 6.501200, the middle line one cent past the kink where it starts to apply"],
 "Between the kinks, and AT either kink, the engine prices P = constant + slope x X, so 50.000000 is on the mid segment at 0.5 + 0.12 x 50 = 6.500000. The low segment starts strictly below the kink: 6.499400 is the price at 49.990000, and 6.501200 is the price at 50.010000.")

# 8
x("In the same golden kinks case the index moves from 90.000000 to 90.010000. How does the engine's price move?",
 "From 11.300000 to 11.300300, the high slope of 0.03 on the cent beyond the kink",
 ["From 11.298800 to 11.300000, because 90.010000 is the first month priced on the middle line",
  "Up to a plateau of 11.300300, flat above the kink",
  "Not at all: the curve is capped at 11.300000 above the kink"],
 "At 90.000000 the month is on the mid segment at 11.300000; at 90.010000 it is on the high segment, which starts from the kink's price and adds the high slope of 0.03 on the one cent beyond it, giving 11.300300. 11.298800 is the price at 89.990000. The high slope here is 0.03, so the price keeps rising and there is neither a plateau nor a cap.")

# 9
x("Why does the engine's S-curve never jump in price at a kink, whatever slopes a contract states?",
 "Each outer segment starts from the middle line's price at its kink and adds its own slope times the distance beyond it",
 ["The engine averages the two neighbouring segments' prices across the month, which smooths any step away",
  "Kink months are rounded to four decimals, which hides a step smaller than the fifth decimal from view",
  "A month at a kink is left out of the priced series and carries forward the previous month's price"],
 "The engine's rule prices below the low kink as constant + slope x lowKink + lowSlope x (X - lowKink), and the high side likewise, so at the kink the distance is zero and both formulas agree. The curve is continuous at both kinks by construction. Nothing is averaged across segments, rounding cannot hide a step (and the golden kinks case states no rounding), and every month is priced.")

# 10
x("The Ekene export feed (synthetic) has S-curve kinks at 55 and 90. Its 2028-01 block averages the oil index over 2027-07 to 2027-12 at 56.488333. On which segment is it priced, and at what price?",
 "The mid segment, at 7.278600",
 ["The low segment, at 7.278600, since any block averaging under 60 is read as low",
  "The low segment, at 7.323800, the outer slope of 0.06 on the whole average below 90",
  "Clamped at a floor of 7.278600, which the export formula states for its low months"],
 "56.488333 lies between the kinks of 55 and 90, so the block is on the mid segment at 0.5 + 0.12 x 56.488333, rounded to four decimals: 7.278600. The low segment starts only below 55; 7.323800 is the next block's price (2028-04); and the export formula states no floor, so no month is clamped.")

# 11
x("Two golden cases price a JCC of 10: Figure 51's S-curve, flat below 15, and 0.8 + 0.1485 x JCC with a floor of 3.5 and a ceiling of 4.5. How does the engine label the two months?",
 "Figure 51's month on the low segment, and the other clamped at the floor",
 ["Both as clamped at the floor, since a flat outer segment and a stated floor are one term to the engine",
  "Both as on the low segment, since the engine reads any stated floor as a flat S-curve segment",
  "Neither, as labels appear only at price reopeners"],
 "The engine reports the segment and the clamp in separate columns. Figure 51 at a JCC of 10 is on the low segment at 3.027500; the floor case has no S-curve (segment none) and is clamped at the floor, 3.500000. A kink changes a slope and a floor holds a level, so the engine keeps them apart; reopeners carry a note and have nothing to do with these labels.")

# 12
x("A learner's S-curve states lowKink 90 and highKink 50. What does the engine do with the call?",
 "It refuses it by the field formula.sCurve.highKink, which must be above the lowKink of 90",
 ["It swaps the two kinks silently and prices with the low kink at 50 and the high kink at 90",
  "It drops the S-curve, prices the straight line and adds a warning beside the annual rows",
  "It prices every month on the low segment, since no index can lie above 90 and below 50"],
 "The engine's message, verbatim, is \"formula.sCurve.highKink must be above formula.sCurve.lowKink 90; got 50\". An S-curve that cannot be drawn is refused before anything is priced, naming the field. The engine repairs no stated term, drops none with a warning, and prices no curve that does not exist.")

# 13
x("A formula carries its S-curve with a key spelt highkink. What happens when the contract calculator runs it?",
 "The call is refused by the key's path, with lowKink, highKink, lowSlope and highSlope listed as accepted",
 ["The key is dropped, so the price runs straight on above 90 with no high kink at all",
  "Every key is read case-blind, so highkink is taken as highKink and the curve is priced",
  "Each month is priced and a note records that one S-curve key was not recognised"],
 "The engine's message, verbatim, is \"formula.sCurve.highkink is not an accepted key; the accepted keys of formula.sCurve are lowKink, highKink, lowSlope, highSlope\". An input key a function does not read is refused at whatever level it sits, with its path and the full list. A misspelt key is never silently dropped, keys are case-sensitive, and there is no warn-and-continue path.")

# 14
x("Which parity slope does the engine return on a stated 6 MMBtu per barrel, and by what rule?",
 "0.166667, one over the MMBtu per barrel",
 ["6.000000, the MMBtu per barrel quoted as a price in US$ per MMBtu for each dollar of oil",
  "0.172414, since the engine holds the Energy Charter Secretariat's 5.8 whatever is stated",
  "0.175778, the nearest of the published heat contents the engine carries to the stated 6"],
 "The rule is slope = 1 / (MMBtu per barrel); on 6 the engine returns 0.166667. The slope is the reciprocal of the heat content and is no heat content itself. The engine takes the stated input and holds no default barrel: 0.172414 and 0.175778 are its returns on 5.8 and 5.689000.")

# 15
x("The energy parity view is given an mmbtuPerBarrel of 0. What does the engine return?",
 "It is refused, naming mmbtuPerBarrel as the field at fault",
 ["A slope of 0.000000, the reciprocal taken as zero",
  "An unbounded slope, the largest double it can hold",
  "The Energy Charter Secretariat's 5.8 MMBtu per barrel, used as a default in place of the zero"],
 "The engine's message, verbatim, is \"mmbtuPerBarrel must be a finite number above 0; got 0\". A quantity that cannot be true is refused by name before anything is computed. The engine never invents a slope for a zero heat content and holds no default heat content to fall back on.")

emit(Q, '/root/cat-wip-gsa/banks/ec8a_m01.json', expect_n=15)
finish()
