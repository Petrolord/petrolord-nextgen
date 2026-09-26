import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC1 cashflow, intermediate tier, Net Present Value. Reconstructed from the served rows (the applied
# migrations replayed on a local scratch database) with the EC7 PIA re-cut applied;
# written by tools/course-waves/cashflow/pia-recut/build.py. Edit here, then re-run it.

q(3,
 "AKATA's discounted_cash_flow column runs minus 121123680.00, 28860006.55, 53279541.38, 40540595.37, 30649858.46, 23167486.48 and 17161022.43. How is the NPV of 72534830.66 obtained from it?",
 "Sum the column. There is no other step.",
 ["Sum the column and subtract the present value of capex, 250909090.91, since the discounted rows are revenue only.",
  "Divide the real total of 117362408.71 once by one plus the applied rate, which is what the column sums to.",
  "Sum the column and deflate the result by 3 percent to the 2029 base year."],
 "The first row is the valuation year and is undiscounted; each later row is the real flow divided by one more year at 6.796117 percent, and the sum is the headline.")

q(1,
 "zero_rates_capex_only and jv_loss_unused_at_cessation report take null and discounted take null. Why does the engine refuse a figure?",
 "The pre-take value, revenue less capex less opex, is not positive, so there is no residual to share.",
 ["Their royalty and tax rates are zero, so the government's share is undefined rather than nil.",
  "Their payback is beyond project life, and take is only computed for fields that have paid back.",
  "Their NPVs are negative, minus 69090909.09 and minus 50000000.00, and a share of a negative value is reported as null."],
 "Take is the government's part of the pre-take value, 66.1723 percent on AKATA; with nothing to divide it refuses to exist.")

q(0,
 "Summing AKATA's discounted column as you go, the running total has only just turned positive through 2032, and the last three rows, 30649858.46, 23167486.48 and 17161022.43, supply almost all of the 72534830.66. What does that imply for the profile?",
 "AKATA's value lives in its late years, the rows a higher rate punishes most, so its profile falls steeply.",
 ["The profile is nearly flat, because the tail rows are small and a rate change removes little from small rows.",
  "The profile rises with the rate, because the 2029 row is the largest in magnitude and is untouched by discounting.",
  "The profile is unaffected by the tail, since payback is reached during 2032 and later rows are invisible to it."],
 "From 5 to 10 percent the profile falls from 83023565.60 to 55805775.02, more than the drop from 15 to 20.")

q(2,
 "AKATA's applied rate is 6.796117 percent and its profile point is labelled 6.8. That point reads 72534830.66, which is the headline, so the gap is 0.00. How do the label and the reading relate?",
 "The point is labelled at the applied rate rounded to two decimals and evaluated at the exact rate, so the label is a rounded name and the number behind it is not rounded.",
 ["The point is both labelled and evaluated at 6.8 percent, and the gap is 0.00 because rounding 6.796117 up to 6.8 moves the NPV of a field this size by less than a cent, so the label and the evaluation are the same number and always were.",
  "The label is the exact rate truncated for display, and the reading is the 8 percent point of 65968275.69 interpolated back down to 6.8.",
  "The point is labelled at the rounded rate and evaluated on the nominal flows, which is why it agrees with the headline."],
 "Until engines 3.10.0 the point was evaluated at the label too, and AKATA's read 72513070.98 against the headline, a gap of -21759.68; the golden records no profile disagreement now.")

q(0,
 "Until engines 3.10.0 the profile gap ran minus 21759.68 on AKATA, minus 40996.42 on multiyear_pia_real and minus 453.74 on allowance_cap_midyear, and was never positive. What produced that sign, and what is the gap today?",
 "The point was evaluated at its rounded label, and 6.8 percent discounts every row a little harder than 6.796117; the exact rate is used now, so the gap is 0.00.",
 ["Floating point accumulation over the discounted rows drifted downward and still does, which is why the gap scales with the size of the field and cannot be removed by changing the rate at which the point is read.",
  "The profile left out the valuation year row, a negative on each of these fields, and that row is included now, so the gap is 0.00.",
  "The profile was evaluated end-year against a mid-year headline, and a half-year shift always removes value; both are read end-year now."],
 "The retired gap scaled with the size of the field, 40996.42 on the 203250580.21 case against 453.74 on the 2406447.46 case, and the golden records no profile disagreement on engines 3.10.0.")

q(3,
 "The profile samples 0, 5, 8, 10, 12, 15 and 20 percent plus the applied rate. What can it not show?",
 "The IRR, which is never a sampled point, and any turn of the curve between samples.",
 ["Rates below 5 percent, because the 0 percent point is the undiscounted total and not a discounted reading.",
  "The nominal basis, since the profile is always evaluated on the real flows even when the basis is nominal.",
  "Any rate above the applied one, because the engine stops sampling once the headline has been reproduced."],
 "AKATA is still 16026160.80 at 20 percent and its IRR of 29.2361 percent lies beyond the last sampled point, unseen by the profile.")

q(1,
 "AKATA's nominal running total is minus 24909427.73 at the end of 2031 and 29050104.71 at the end of 2032, and payback_years is 3.461632. A reader interpolates on the displayed cumulative_cash_flow column, minus 29534809.71 to 19845806.34, and lands later. Why?",
 "The engine reads payback on the nominal running total against the nominal 2032 flow of 53959532.44, while the displayed column on a real basis run is the real running sum.",
 ["The reader forgot to discount, and the engine's payback is read on the discounted column, which crosses at 3.961607 years.",
  "The displayed column carries depreciation of 25500000.00 a year that the payback calculation adds back.",
  "The reader should have interpolated against the 2033 flow, because the crossing is dated to the end of the year it occurs in."],
 "A real total, a nominal total and a discounted total each cross in a different place, and only the nominal one is the reported payback.")

q(2,
 "AKATA pays back at 3.461632 years and discounted at 3.961607, half a year later on the same rows. What makes the discounted crossing later?",
 "Every row after 2029 has been reduced, so the 2032 discounted row of 40540595.37 closes the shortfall only near the end of the year.",
 ["Discounted payback is measured from the valuation year rather than from the first row, which adds the half year.",
  "The discounted crossing is read on the real column, whose 2032 row of 49380616.06 is smaller than the nominal.",
  "The 2029 row is discounted as well, which deepens the hole the later rows must fill."],
 "multiyear_jv_real reads 2.889357 and 3.165997 and jv_analytic_decision_kpis 1.333333 and 1.366667; the discounted figure is never earlier.")

q(1,
 "AKATA is switched from end-year to mid-year discounting. What happens to its discounted payback?",
 "Nothing; it is 3.961607 years under all four combinations of basis and convention.",
 ["It moves half a year later, because every exponent has been shifted by half.",
  "It moves earlier, because the 2029 capex shrinks to minus 115486897.55 and the hole is shallower.",
  "It becomes 3.461632 years, because mid-year timing removes the gap between the two paybacks."],
 "The mid-year shift scales every discounted row by one factor, and a crossing does not move when everything is scaled together.")

q(0,
 "valuation_year_sunk reports payback Year 0 and 0.000000 years. What does that reading mean?",
 "The only negative row was declared sunk, so the metric never saw it and the first visible row is already positive.",
 ["The field recovered its capex of 50000000.00 within the first year of production, which a two-year ledger makes possible.",
  "The payback was measured backward from the valuation year of 2031, and the crossing sits at the valuation date.",
  "The sunk flow of minus 12500000.00 was counted as recovered at the moment it was written off."],
 "single_year_positive reads Year 0 for the honest reason, a first row of 35000000.00; the sunk case reads it because its capex year of minus 12500000.00 left the metric's sight.")

q(3,
 "AKATA's DPI is 0.289088, which is 72534830.66 over 250909090.91. Why is the denominator not the 255000000.00 of capex spent?",
 "The denominator is the present value of capex at the same rate and convention as the numerator, so the 2030 spend of 45000000.00 is discounted one year.",
 ["Depreciation already claimed by 2030, the 21000000.00 of 2029, is removed from the capex before the ratio is taken.",
  "The denominator is the capex net of its sunk portion, and the engine treats the sanction year spend as partly sunk.",
  "The denominator is capex less the 2035 tail, which the discount treats as abandoned."],
 "For every unit of capital, in present value, AKATA returns 0.289088 units of value beyond the discount rate.")

q(2,
 "A report relabels the engine's DPI as the profitability index. What is wrong with that?",
 "The engine's DPI is NPV over the PV of capex, so a project that exactly earns its rate scores zero where the textbook index scores one, and adding one does not recover the index because the textbook denominator holds every outflow, opex included.",
 ["Nothing, provided the report adds one to the DPI, since the profitability index is the DPI plus one by construction: NPV over the PV of capex becomes the PV of inflows over the PV of capex once the capital of 250909090.91 is added back to the numerator, and the two ratios then agree to the cent.",
  "Nothing; the two are the same ratio and differ only in whether the answer is printed as a fraction or a percentage.",
  "The profitability index uses undiscounted capex of 255000000.00 in the denominator, so the relabelled figure is too high: the engine discounts the 2030 spend of 45000000.00 by one year to reach 250909090.91, and dividing by the smaller present value inflates the ratio beyond what the textbook index prints for the same field."],
 "AKATA's opex of 183899092.34 sits inside the NPV here and would sit in the denominator there; the engine prints no profitability index.")

q(0,
 "multiyear_pia_real has an NPV of 203250580.21 and a DPI of 0.398389; multiyear_jv_real has an NPV of 88104639.00 and a DPI of 0.598241. Which ranks first?",
 "It depends on the constraint: if capital is scarce the second does more per unit of capital, and if it is not NPV ranks and the first wins.",
 ["The first, because NPV is the only ranking and DPI is a description that cannot reverse it.",
  "The second, because a higher DPI means a higher return on any measure, whatever the capital available: DPI is NPV per unit of capital, and a ratio that beats another per unit beats it in total as well.",
  "The first, because its PV of capex of 510181818.18 is larger and larger fields carry less risk per unit, so the rate they should be read at is lower and their NPV is understated at 6.796117 percent."],
 "NPV ranks by value; DPI ranks by value per unit of capital, and the two rankings disagree on these two fields.")

q(1,
 "AKATA's take is 66.1723 percent undiscounted and 76.1610 percent discounted. Why is the discounted figure higher?",
 "The government's share arrives earlier: royalty is taken from the first barrel in 2029, while the contractor's running total is negative until 2032 and is recovered in the tail years that discounting reduces most.",
 ["Tax at 40 percent compounds at the discount rate, so its present value grows relative to the contractor's share.",
  "Discounting reduces the capex of 255000000.00 more than it reduces revenue, which enlarges the residual the government shares: the capex sits in 2029 and 2030, where the exponents are the largest in the ledger, so its present value of 250909090.91 loses the most and the pre-take value grows.",
  "The discounted take is computed at the nominal 10 percent and the undiscounted at the real 6.796117 percent, and the harsher rate raises it: the two takes are read on different bases, so the gap between 66.1723 and 76.1610 is the Fisher gap between the two rates and has nothing to do with timing."],
 "Every published case with a tail shows the same direction, multiyear_jv_real 69.2573 against 75.4578; single_year_positive, with one row, reads 61.1111 percent both ways.")

q(3,
 "AKATA's take reads 66.1723 percent at a working interest of 100 percent, and 66.1723 at 75, at 60, at 40 and at 25. Why does the working interest leave the share alone?",
 "Every monetary line and the volumes report the share, so 2029 gross revenue falls from 186032000.00 to 111619200.00 at 60 percent and both sides of the ratio are scaled by one factor.",
 ["The royalty of 15 percent and the tax of 40 percent are the same at every interest, and take is simply those two rates restated on the pre-take value, so a run at 25 percent reports 66.1723 because the rates it is built from never moved.",
  "Take is read on the field-level rows before the working interest is applied, so a partner reports the whole field's take rather than a share of it, which is why the figure is identical at 100 percent and at 60.",
  "The government's part and the partners' part both grow as the interest falls, and the two movements cancel in the ratio."],
 "Until engines 3.10.0 revenue, volumes, opex, capex and depreciation stayed at field level while royalty, tax and net cash flow reported the share, so take counted the partners' portion and rose as the interest fell, 74.6292 at 75 and 91.5431 at 25.")

emit(Q, '/root/wt-ec7-recut/tools/course-banks/cashflow/intermediate/ec1i_m03.json', expect_n=15)
finish()
