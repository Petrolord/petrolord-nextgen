import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC5 portfolio, intermediate tier, An AFE Is a Promise. Reconstructed from the served rows (the applied
# migrations replayed on a local scratch database) with the EC5 engine re-cut applied;
# written by tools/course-waves/portfolio/recut/build.py. Edit the rows there, then re-run it.

q(2,
 "OFON-1 is authorised at 27050000 USD and the engine forecasts 27600000 on the same lines. Which lines lift the forecast past the authorisation, and by what figure on each?",
 "CSG-02, which has already spent 4300000 against a budget of 3900000, and CMT-03, whose entered forecast of 1400000 stands over its budget of 1250000.",
 ["DRL-01 and CMP-05, the two largest budgets, because a forecast at completion grows with the size of the lines it adds and those two carry most of the AFE.",
  "LOG-04 and CMP-05, whose commitments of 900000 and 1200000 are added on top of their budgets once a contractor order has been placed against the line.",
  "DRL-01 and CSG-02, the two lines that have spent most of their budgets, since the forecast projects each line's spend forward at its current rate."],
 "The overrun of 550000 is 400000 on CSG-02 and 150000 on CMT-03; DRL-01's 12400000 spent and committed is still under its 14200000, so it forecasts its budget.")

q(0,
 "A cost report prints LOG-04 as 350000 spent of a 2100000 budget, a line that looks barely touched. What has the report left out?",
 "The 900000 committed to contractors and not yet paid, so 1250000 of the line is already spoken for.",
 ["The invoices billed against the line, which would lift its actual to the 4400000 dated 2027-06-05 once they are posted to it.",
  "Its entered forecast, which the engine substitutes for the budget on every line that has spent less than half of its authorisation.",
  "Its progress of 20.0000 percent, which turns the 350000 spent into 420000 of work and shows the line running ahead of its budget."],
 "A commitment is money already promised through an order or contract; actual plus commitment on LOG-04 is 350000 + 900000 = 1250000 against the 2100000 budget.")

q(3,
 "A contractor order on DRL-01 is paid and its amount is moved into the line's actual, but nobody takes it out of the commitment. What happens?",
 "Actual plus commitment counts the order twice, and the forecast rule can read the double count as an overrun without any check.",
 ["The engine matches the paid amount against the commitment it came from and removes it, so the line's forecast is unchanged by the move.",
  "The engine refuses the line once actual plus commitment passes the budget, and its message names the cost item carrying the excess.",
  "Nothing moves in any reading, because the forecast rule reads the budget and the entered forecast and never looks at the commitment column."],
 "The commitment is a typed figure the engine never ties to a contract or an invoice; DRL-01 already carries 9800000 spent and 2600000 committed, 12400000, against 14200000.")

q(1,
 "OFON-1 reads 55.7856 percent spent. What sits in the numerator of that figure?",
 "Only the 15090000 of actuals on the lines; the 5000000 committed stays outside it.",
 ["Actuals and commitments together, because money promised to a contractor is money the AFE can no longer spend on anything else.",
  "The earned value of 15231500, since percent spent measures how much of the authorised budget the finished work has used up.",
  "The invoice total, because a spend percentage is a reading of money that has left the company and only the invoices carry a date."],
 "Percent spent is 15090000 over the budget of 27050000. CPI and percent spent read the line actuals only; commitments enter the forecast rule and nothing else.")

q(1,
 "A fifth invoice is entered on OFON-1 and no line's actual is changed. Which reading moves?",
 "The S-curve's Actual series, while CPI, percent spent and the EAC stay where they were.",
 ["CPI and percent spent, which read spend, while the curve reads line actuals.",
  "The EAC, on the line the engine matches to the invoice by its amount.",
  "Every reading, since the engine reconciles invoices with line actuals."],
 "The metrics read actuals from the cost lines and the S-curve reads the dated invoices; OFON-1's four invoices and its line actuals both total 15090000 only by construction.")

q(3,
 "An invoice on an AFE is saved with a null date. What does the repaired engine do with it?",
 "Leaves it off the S-curve and reports it in the count of undated invoices beside the curve.",
 ["Refuses the AFE with an error that names the invoice, in the way negative progress on a cost line is refused.",
  "Counts it from 1970, which is earlier than every bucket, so it appears in the S-curve from the first point on.",
  "Places it at the as-of date, so it lifts only the points from that day onward and leaves the earlier ones alone."],
 "The engine still does not refuse an undated invoice, but it no longer guesses a date for one: an invoice it cannot date reaches no bucket, and the count is reported beside the curve, 2 on the published undated case.")

q(0,
 "A reviewer sees 15090000 of actuals on the OFON-1 dashboard and 15090000 at the last Actual point of its S-curve. What has the reviewer established?",
 "That two totals match, which says nothing about whether every invoice is dated or where each one's money went.",
 ["That every invoice was posted to the right line, since the curve sums invoices by cost code.",
  "That the line actuals are correct, because the curve is built from those same line actuals and could not reach the total otherwise.",
  "That the engine reconciled the two records, since it declines to draw a curve whose invoices disagree with the actuals on the lines."],
 "The engine reconciles nothing: an invoice carries a date and an amount and no cost code, and on OFON-1 the 15090000 agreement holds by construction.")

q(2,
 "OFON-1 carries an invoice of 5200000 dated 2027-04-10. Which cost line is it for?",
 "The AFE cannot say, because an invoice carries a date and an amount and no cost code.",
 ["DRL-01, the only line whose actual of 9800000 is large enough to hold it.",
  "Every line in proportion to its actual, as the engine spreads each invoice.",
  "CSG-02, since the engine books an invoice to the nearest line actual."],
 "The line actuals say where the money went and the invoices say when; no OFON-1 invoice equals any line's actual, and the 5200000 could be drilling, casing or both.")

q(3,
 "Casing bought in another currency is to be entered on OFON-1, which is kept in USD. Where is the exchange rate held?",
 "Nowhere in the AFE: the amount is converted before it is typed, at a rate the engine never sees.",
 ["In a currency code held on each cost line, so every line converts at its own rate before the engine totals the budget of 27050000.",
  "In the partner split, which bills each partner in its own currency.",
  "Beside each invoice, so the S-curve can restate the casing spend in USD."],
 "The AFE holds one currency code for its lines, invoices and partners and no exchange rate among its inputs; OFON-1's 27050000 is whole USD as the engine prints it.")

q(0,
 "A cost line is typed in a local currency beside four lines kept in USD. What does the engine do with it?",
 "Adds it to the other lines without complaint, because it holds one currency code and has no way to know.",
 ["Refuses the AFE, since a line whose amounts are out of scale with the rest fails the same input check that refuses negative progress.",
  "Flags the line and leaves it out of the EAC until an exchange rate is supplied.",
  "Converts it at the exchange rate stored with the AFE's currency code."],
 "Nothing in the engine can tell a local amount from a USD one, so the mixed ledger totals quietly, just as OFON-1's lines total 27050000 in one currency.")

q(1,
 "Why would OFON-1's CPI of 1.009377 read the same if every amount on the AFE were restated in one other currency?",
 "It is 15231500 over 15090000, one amount over another in the same currency, so the unit cancels.",
 ["The engine converts every amount to USD before it forms a ratio, so the currency the lines are typed in never reaches the index.",
  "CPI is formed from the progress percents alone, which carry no currency.",
  "It would not, since CPI is quoted against USD and needs the rate applied."],
 "Earned value over actuals divides like by like; percent spent 55.7856 and percent complete 56.3087 cancel the unit the same way.")

q(2,
 "Someone rewrites OFON-1's budget of 27050000 in millions, rounded, to lay it beside a capital portfolio figure in million USD. What is wrong?",
 "The two models share nothing, and the rescaled figure is a number the engine never printed and nobody can check.",
 ["Only the rounding, since at four decimals the budget would sit correctly in a portfolio sum.",
  "Only the scale, since the portfolio is kept in thousands of USD and the budget has to be divided by a thousand before it is added.",
  "Only the sign, since the portfolio records a capex as a negative figure and the budget has to be negated before the two are added."],
 "OFON-1 is whole USD against line budgets and the portfolio is million USD with whole projects against a limit; a figure from one never belongs in a sum with the other.")

q(0,
 "One cost line is saved with a progress of -0.5 percent and another with progress past 100 percent. What does the engine do?",
 "Refuses the first with a message naming the cost item, and accepts the second, letting it earn more than its budget.",
 ["Refuses both, since its own message says progress runs from 0 to 100 percent.",
  "Clamps both into the range, reading the first as 0 and the second as 100, and reports the clamped figures as though they were typed.",
  "Accepts both with a flag, leaving the flagged lines out of earned value while still carrying their budgets in the EAC and the total."],
 "Negative progress stops the calculation with \"Progress runs from 0 to 100 percent.\" in the message, yet progress past 100 is taken, and earned value is only as good as the progress typed in.")

q(3,
 "OFON-1 is reported again on a later date with every line unchanged. Which of its four headline readings can change?",
 "Only SPI, 0.872063 as of 2027-08-15; the EAC, earned value and CPI stay as the lines have them.",
 ["The EAC, since a forecast at completion is recomputed from the spend expected by the date of the report and moves with each one.",
  "CPI, since actuals are counted only up to the as-of date of the report.",
  "All four, since every figure the engine prints is a reading of one day."],
 "The EAC of 27600000, earned value of 15231500 and CPI of 1.009377 are read from the lines as entered; only the schedule reading depends on the as-of date.")

q(2,
 "OFON-1 has spent 15090000. How much work has that money bought?",
 "The spend cannot say; the typed progress says it, and on OFON-1 it earns 15231500.",
 ["15090000 of work, since a dollar spent buys a dollar of scope.",
  "What the invoices cover, since an invoice follows delivered work.",
  "55.7856 percent of the scope, the share of the budget spent."],
 "Spending and progress are separate columns: earned value is each budget times its typed progress, 15231500 on OFON-1, and actuals of 15090000 say only what was paid.")

emit(Q, '/root/wt-ec45-recut/tools/course-banks/portfolio/intermediate/ec5i_m01.json', expect_n=15)
finish()
