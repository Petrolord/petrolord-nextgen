import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC1 cashflow, intermediate tier, Sweeps. Reconstructed from the served rows (the applied
# migrations replayed on a local scratch database) with the EC7 PIA re-cut applied;
# written by tools/course-waves/cashflow/pia-recut/build.py. Edit the rows there, then re-run it.

q(2,
 "AKATA's price sweep runs from 30 to 120 USD/bbl and reports NPV, IRR, payback and take at nine prices. What is each point of the sweep, mechanically?",
 "A separate full run of the whole ledger with the flat oil_price_usd_bbl moved and every other input held still.",
 ["One ledger with its revenue column rescaled by the ratio of the new price to 82, and the royalty and tax columns rescaled with it.",
  "The base ledger with the oil price escalator moved so that the 2 percent path passes through the sweep price in 2030.",
  "A point on a probability curve, weighted so that the nine NPVs average to an expected value."],
 "Nine ledgers at nine flat prices, each with the 2 percent escalator on top: at 82 the 2030 applied price is already 83.640000, and each price carries its own tax column.")

q(0,
 "AKATA at 50 USD/bbl reports a take of 135.2824 percent. What does a take above 100 percent mean?",
 "The royalty is charged on revenue regardless while the pre-take value is small, so the government keeps more than the whole; the contractor's real net cash flow totals -45016230.39.",
 ["A rounding fault in the take denominator, which the engine leaves unflagged when the pre-take value is small.",
  "The royalty at 15 percent and the tax at 40 percent have stacked on one base, which the cascade should have prevented since they cannot exceed 55 combined.",
  "The sweep reused the royalty column from the 82 USD/bbl run against the smaller revenue at 50 USD/bbl."],
 "A take above 100 percent is a royalty on a loss and no error; at 45 USD/bbl it reads 247.7770 percent for the same reason.")

q(3,
 "AKATA at 40 USD/bbl and below reports take as null, while at 45 it reports 247.7770 percent. Why does the take vanish there?",
 "A share of a pre-take value that has stopped being positive is not reported.",
 ["The IRR at 40 USD/bbl is -21.3703 percent, and a take is suppressed whenever the root is negative.",
  "The tax column at 40 reads 13834880.00, 7217644.80 and 2950616.45 and then zeros, and a take needs a tax payment in every year of the ledger.",
  "Payback reads Beyond project life at 40, and the take is defined only inside the payback period."],
 "The null and the 247.7770 sit either side of one line: the pre-take value, revenue less capex less opex, crossing zero between 40 and 45 USD/bbl.")

q(1,
 "At 50 USD/bbl AKATA's tax column runs 21314880.00, 13633444.80, 8433524.45, 3963295.68, 79525.71, 0.00, 0.00. Why do the last two years pay nothing?",
 "Depreciation of 25500000.00 and the escalated opex outrun the revenue, so there is no positive taxable income to tax.",
 ["The economic limit trimmed those two years from the valued ledger, and a trimmed year carries no tax.",
  "The loss carried forward from the first year is used up against the last two years, since the royalty at 15 percent left no taxable income in 2029.",
  "The royalty at 15 percent takes the whole of the late-year revenue once the price falls this far."],
 "At 30 USD/bbl only the first two years pay, 6354880.00 and 801844.80, and total tax falls to 7156724.80: the price moves the year in which the deductions overtake the revenue.")

q(2,
 "On the published oil_price_multiyear_pia_real sweep the take reads 114.9262 percent at 40 USD/bbl, 69.3025 at 80 and 69.8048 at 120, while AKATA's JV take falls from 87.4083 at 60 to 57.9418 at 120. Why does the PIA take hold almost flat?",
 "The PIA's price royalty tiers rise with price, so the government's share grows as the pre-take value grows.",
 ["The PIA take is working-interest invariant, so it cannot move with the price either.",
  "The PIA field's unit technical cost is 32.823299 USD/boe at every point, so cost and price scale together and the ratio is fixed.",
  "The PIA cascade charges its taxes on revenue rather than on income, so the take is a rate rather than a share."],
 "Both takes are shares of a residual; the JV share falls because a fixed royalty and a fixed tax rate take a smaller fraction of a growing residual, and the PIA tiers replace that fixed royalty with one that climbs.")

q(3,
 "An analyst averages AKATA's nine sweep NPVs, from -169873348.04 at 30 USD/bbl to 231658748.27 at 120, and reports the mean as the expected value. What is wrong?",
 "Each NPV says what the field is worth if the price is that number for the whole life, and the sweep says nothing about how likely any price is.",
 ["The average must be taken over the discounted flows before the ledger is summed, never over the NPVs afterwards.",
  "The sweep is on the flat price only, so the mean ignores the 2 percent escalator that the engine adds on top at each price.",
  "The sweep should have been weighted by the take at each price, since the government's share changes from 57.9418 to null across it."],
 "Nine ledgers at nine flat prices are nine conditional answers, and averaging them is not an expected value because no probability was ever attached to a price.")

q(0,
 "At a nominal discount rate of 0 percent AKATA's rate sweep prints NPV 141637829.18, the nominal total rather than the real total 117362408.71, and an applied real rate of -2.912621 percent. Why?",
 "A nominal rate under the 3 percent inflation is a negative real rate, and discounting the real flows at a negative rate inflates them back to money of the day.",
 ["At 0 percent the engine switches to the nominal basis, since a real rate cannot be derived from a nominal rate of zero.",
  "The sweep is run on the nominal flows because the swept rate is nominal, whatever basis the case is configured on.",
  "The real total is the profile's 0 percent point, and the sweep rounds the Fisher rate differently from the profile."],
 "The applied real rate passes through zero between 2 and 4 percent nominal, and only from there does discounting on the real basis begin to shrink the real flows.")

q(1,
 "AKATA's NPV at a nominal discount rate of 8 percent is 83912631.29. Its inflation sweep, at a fixed 10 percent nominal, reports a real total net cash flow of 83912631.29 at 8 percent inflation. Why the same number?",
 "Because dividing each nominal flow by the same factor per year is deflation when 8 percent is the inflation rate and discounting when it is the discount rate.",
 ["Because 8 percent inflation at 10 percent nominal gives the same applied real rate as 8 percent nominal at 3 percent inflation.",
  "Because the Fisher relation holds NPV at 72534830.66 whatever the inflation, so any 8 percent reading maps back to one real figure.",
  "Because the two sweeps share one set of rows, and any two KPIs read from the same rows at the same percentage must agree."],
 "The applied rates are 1.851852 percent in one run and 4.854369 in the other, so it is not a coincidence of rates; it is the same arithmetic wearing two names, and the 2 percent row, 125059129.50, matches the same way.")

q(3,
 "discount_rate_multiyear_jv_real reruns its eight-year JV field at nominal rates from 0 to 20 percent in steps of 2. Which of its printed readings hold the same value on every row of the sweep?",
 "IRR 47.9020 percent, payback 2.89 years, take 69.2573 percent, total revenue 767745022.67 and total tax 181905488.72.",
 ["The discounted payback and the DPI, because both are ratios of present values that were scaled together.",
  "The NPV profile, since it is sampled at fixed rates of 0, 5, 8, 10, 12, 15 and 20 percent and does not read the configured rate.",
  "The applied real rate, which stays at 6.796117 percent because inflation is fixed at 3."],
 "The rows are the same on every row of the sweep and only the exponent changes, so every undiscounted KPI holds and every discounted one moves.")

q(2,
 "AKATA's breakeven is 64.916777 USD/bbl. Rerun at that price, the NPV is 897.16 USD, the IRR 10.0002 percent and the take 79.0146 percent. What is the 897.16?",
 "The trace of a search that stops at a tolerance on price: nothing for a decision, something for a reader who expected zero.",
 ["The NPV of the final row alone, which the search leaves unresolved because the 2035 revenue is priced by the escalator rather than by the flat price the search moves, so a remainder of that size is expected at any breakeven.",
  "Proof that the NPV curve against price never quite crosses zero, so 64.916777 is the nearest price rather than a root.",
  "The mid-year against end-year difference at the breakeven price, which the search cannot remove."],
 "The published cases leave the same trace, -243.53 on jv_analytic, -1391.65 on pia_worked_example and -3574.39 on multiyear_pia_real, and the IRR of 10.0002 percent confirms the crossing was found.")

q(0,
 "AKATA's breakeven reads 64.916777 USD/bbl as configured, 64.916777 at a working interest of 60 percent, 69.518418 at a 15 percent discount rate and 74.945115 with royalty 20 and tax 50 percent. Why does the working interest leave it unmoved?",
 "Scaling every flow by one factor leaves the zero of NPV against price where it was.",
 ["The breakeven is solved on gross revenue before any fiscal term is applied at all, so neither the working interest nor the royalty of 15 percent can reach it.",
  "The search moves the flat price before the working interest is applied in the cascade, so the interest is invisible to it.",
  "The take at breakeven, 79.0146 percent, is itself invariant to the working interest, so the price that produces it must be invariant too."],
 "The same argument holds the IRR at 29.2361 percent across every working interest: a zero does not move when the whole curve is multiplied by one number.")

q(2,
 "positive_at_floor_null reports a breakeven of null. What does that null mean?",
 "The NPV is already positive at the lowest price the search tries, so there is no crossing to bracket.",
 ["No price in the search turns the NPV positive, so the field never breaks even.",
  "The configuration carries a price deck, and a field priced by a deck has no single flat price to move.",
  "The search reached its price tolerance with a residual larger than the 897.16 it accepts on AKATA."],
 "Three nulls, three reasons: deck_present_null has a deck of one entry, never_breaks_even_null never turns positive, and positive_at_floor_null has nothing to bracket because it starts above zero.")

q(1,
 "A reader describes AKATA's breakeven of 64.916777 USD/bbl as the price at which the field stops losing money. What is the correction?",
 "It is the price at which the field stops losing value at the discount rate; at 60 USD/bbl the real net cash flow already totals 8466495.42, and the zero-total price sits between 50 and 60.",
 ["It is the price at which the field stops losing money in money of the day; in real terms the loss continues until the real total turns positive at a higher price, because the 3 percent deflator removes value from every row after 2029 and the real column crosses zero later than the nominal one.",
  "It is the price at which the IRR reaches 10.0002 percent, which is a property of the curve and not a statement about money at all, so the breakeven is a root-finding artefact that says where the curve meets the nominal rate and nothing about whether the field pays.",
  "It is the price at which the take reaches 79.0146 percent, the point where the government's share stops growing."],
 "At 50 USD/bbl the real total is -45016230.39 and at 60 it is 8466495.42, so the zero-total price is only bracketed by the sweep, while the breakeven, solved rather than read off a grid, sits above both at 64.916777.")

q(3,
 "On decline_rate_multiyear_pia at 20 percent decline the limit year is 2031, three years are trimmed and seven rows are valued. What does the sweep refuse to do with the trimmed years?",
 "Keep them: a year that fails the limit test is removed from the valued ledger instead of carried at zero, and the KPIs are of the shortened field.",
 ["Report them at all, so the rows column reads 10 on every point and only the KPIs reveal the trimming, because the row count is fixed by the production upload and the limit test only zeroes the values in the years it fails.",
  "Charge their opex, so the KPIs of the shortened field carry no cost after the limit year, while the revenue of the trimmed years is still counted inside the total revenue of the run.",
  "Discount them, so they enter the NPV at face value and pull the NPV down to -30055502.32, because a year past the limit is carried undiscounted as a liability instead of being removed from the ledger."],
 "At 40 percent decline seven years are trimmed and three rows survive, and total revenue falls from 3485716284.18 at 5 percent decline to 794617600.00.")

q(0,
 "The decline sweep reports a take of 1079.0391 percent at 40 percent decline and a unit technical cost of 78.666122 USD/boe. What is the 1199.4096?",
 "A share of a pre-take value that has almost vanished, because rows were trimmed while royalties are still charged on what remains.",
 ["A rounding fault in the take, which the engine should have reported as null once the residual turned negative as it does on AKATA at 40 USD/bbl.",
  "The royalties of 72878470.21 divided by the three surviving rows of revenue, which is how the take is defined once the limit engages.",
  "The take on the ten-year field before trimming, carried forward unchanged because the take is an undiscounted reading."],
 "Take is 93.0311 percent at 20 percent decline and 179.7616 at 30: the denominator shrinks toward zero as rows are cut, and a share of a value near zero is a large percentage.")

emit(Q, '/root/wt-ec7-recut/tools/course-banks/cashflow/intermediate/ec1i_m05.json', expect_n=15)
finish()
