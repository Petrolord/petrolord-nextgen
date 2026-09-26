import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC7 Professional m01, The Small Field Tranches.
# Every figure is quoted from digest.txt (the engine's own returns on stated
# daily rates and on the Ekene cases). No capstone name, term, row or value
# appears. The royalty by price is not asked here.

q(2, "A shallow water field produces 50,000 bopd of crude oil. What liquids royalty rate does the engine return on the whole volume?",
 "0.112500, one weighted rate built from the 5, 7.5 and 12.5 percent bands",
 ["12.5 percent on every barrel, the shallow water terrain rate of para 10(2)(b) once past 10,000 bopd",
  "0.132500, the three bands with the upper one at 15 percent",
  "0.062500, the average of the two small-field tranches"],
 "The Regulations' r.13(2)(d) weights 5 percent on the first 5,000 bopd, 7.5 percent on the next 5,000 and 12.5 percent on the rest, divided by the whole daily volume, and the engine returns 0.112500 at 50,000 bopd in shallow water. Charging 12.5 percent on every barrel ignores the tranches the proviso keeps for the first 10,000 bopd. 0.132500 is the onshore figure at the same daily rate, where the upper band is 15 percent. 0.062500 is the rate at exactly 10,000 bopd, and a larger field pays more than that.")

q(0, "A deep offshore field produces 60,000 bopd. Which rate does the engine apply to its crude oil and condensate value?",
 "0.054167, since only the barrels past 50,000 bopd pay 7.5 percent",
 ["7.5 percent on the whole volume, because the field has stepped over the 50,000 bopd tier and lost it",
  "0.050000, since the deep offshore tier covers every barrel up to 120000 bopd",
  "0.114583, the shallow water weighting at that daily rate"],
 "Para 10(3) charges 5 percent up to 50,000 bopd and the terrain rate on \"the share of the production above 50,000 bopd\", and r.13(1)(b) makes that one weighted average, so 60,000 bopd returns 0.054167. Charging 7.5 percent on every barrel treats the tier as a step, which the text does not do. The 5 percent tier stops at 50,000 bopd, so 0.050000 is wrong past it. 0.114583 is the shallow water return at 60,000 bopd and belongs to a different terrain.")

q(3, "Ekene Alpha produces 2920000 bbl of oil and 116800 bbl of condensate in 2026 and the engine prints a daily rate of 8320.000000 bopd. What produced that figure?",
 "Crude oil plus condensate for the year, over its 365 calendar days",
 ["Only the crude oil over 365 days, condensate going to gas",
  "Each month's liquids over that month's producing days",
  "Oil, condensate and gas in oil equivalent, over the year"],
 "Para 6 treats condensate as crude oil for royalty, r.12(1)(b) applies the scale to crude oil plus condensate, and the engine divides the year's total by the calendar days (365 in 2026). Leaving condensate out would understate the rate; condensate is never moved to the gas royalty. The month-by-month division is the Regulations' own r.12(2), which the engine replaces with an annual reading and says so in its notes. Gas stays out of the daily rate entirely.")

q(1, "Ekene Alpha declines to 4989.463014 bopd in 2030. What liquids royalty rate does the engine return that year?",
 "0.050000, the first tranche alone",
 ["0.050005, since a slice past the first edge still pays 7.5 percent",
  "0.075000, the flat rate a small shallow water field falls back to",
  "0.062500, the average of the two small-field tranches of para 10(4)"],
 "At or below 5,000 bopd the Regulations' r.13(2)(a) gives 5 percent, and the engine returns exactly 0.050000 for Alpha from 2030. 0.050005 is the return at 5001 bopd, one barrel past the edge, and Alpha is below it. 0.075000 is the frontier rate, which has no sliding scale and has nothing to do with a small shallow water field. 0.062500 is the rate at exactly 10,000 bopd, where half the volume pays 7.5 percent.")

q(1, "The Regulations' r.13(2)(b) covers \"greater than 5,000bopd but less than 10,000bopd\" and r.13(2)(c) covers \"greater than 10,000bopd\". What does the engine return for an onshore field at exactly 10,000 bopd?",
 "0.062500, which each formula gives at that point, so the gap moves no figure",
 ["A refusal, because a daily rate that neither band names leaves the engine with no formula it can apply",
  "0.062509, reading the edge into the onshore upper band",
  "0.075000, a flat rate for a volume both bands omit"],
 "Neither band names exactly 10,000 bopd, but both formulas give 0.062500 there from the stated tranches, and that is the engine's return; the edge belongs to the tranche below it. 0.062509 is the onshore return at 10001 bopd, one barrel into the upper band. The engine does not refuse a daily rate of 0 or more. 0.075000 is the frontier rate and plays no part in the onshore scale.")

q(3, "Over which daily rates do an onshore and a shallow water field pay the same liquids royalty rate?",
 "At or below 10,000 bopd",
 ["At every daily rate, since terrain moves the tax rate alone",
  "Only at or below 5,000 bopd, inside the first tranche",
  "Only above 10,000 bopd, where both use three bands"],
 "Both tranches of para 10(4) are common to onshore and shallow water, so up to and including 10,000 bopd the two pay the same rate (0.058333 at 7500 bopd, 0.062500 at 10,000). Above it the terrain rate enters, 15 percent onshore against 12.5 percent in shallow water, so at 20000 bopd the returns are 0.106250 and 0.093750. The second tranche is shared too, so the agreement does not stop at 5,000 bopd. Terrain does move royalty above 10,000 bopd.")

q(0, "At 10001 bopd the engine returns 0.062509 onshore and 0.062506 in shallow water. Why do the two terrains part at that point?",
 "The barrel past 10,000 bopd pays the terrain rate, 15 percent onshore and 12.5 percent in shallow water",
 ["Shallow water keeps its second tranche running on past 10,000 bopd, where the onshore one stops",
  "Onshore fields lose their first tranche above 10,000 bopd, so every onshore barrel pays 7.5 percent or more",
  "The engine divides onshore volumes by 366 days and offshore volumes by 365, so the daily rates differ"],
 "The proviso to para 10(4) charges \"the share of the production over 10,000 bopd\" at the subparagraph (2) terrain rate, and r.13(2)(c) and (d) put 15 percent onshore and 12.5 percent in shallow water on that incremental volume, so the onshore rate rises faster. Neither terrain loses the first tranche; the Regulations keep 5 percent on 5,000 bopd in every band. The second tranche ends at 10,000 bopd on both terrains. The day count depends on the year and never on the terrain.")

q(2, "A frontier field produces 20000 bopd. What liquids royalty rate does the engine return?",
 "0.075000, flat, with no sliding scale",
 ["0.050000, the deep offshore tier",
  "0.093750, the shallow water weighting lent to every frontier basin",
  "0.106250, the onshore weighting, as frontier acreage lies on land"],
 "The Regulations' r.13(3) says: \"(3) For frontier basin, the sliding scale shall not apply and the applicable rate shall be 7.5%.\" The engine returns 0.075000 at every daily rate on frontier. The 5 percent tier belongs to deep offshore alone. 0.093750 and 0.106250 are the shallow water and onshore returns at 20000 bopd; frontier borrows neither scale.")

q(3, "A deep offshore field at 50001 bopd prints the same six-decimal rate, 0.050000, as one at 50,000 bopd. What explains it?",
 "One barrel at 7.5 percent moves the weighted rate by less than six decimals show",
 ["The deep offshore tier runs on to 60,000 bopd, so the extra barrel still pays 5 percent",
  "The engine rounds each daily rate down to whole thousands before any tier",
  "Para 10(3) reads its limit monthly, so one extra barrel a day goes free"],
 "At or below 50,000 bopd the rate is exactly 5 percent; above it only the barrels past 50,000 pay 7.5 percent, and one barrel in 50001 lifts the weighted rate by less than the course's six decimals. The tier ends at 50,000 bopd, as the 60000 bopd return of 0.054167 shows. The engine does not round the daily rate to thousands; Alpha's 2026 rate is 8320.000000. The monthly wording is a reading of the day count and exempts no barrel from the rate.")

q(0, "A field produces crude oil, condensate and natural gas liquids. Under PIA Seventh Schedule para 6, which volumes enter the daily rate the tranches read?",
 "Crude oil and condensate, with the natural gas liquids treated as natural gas",
 ["Only the crude oil, since the tranches are written for barrels of crude oil and nothing else",
  "All three liquids, each measured in barrels at the measurement point",
  "Oil and natural gas liquids, condensate left out"],
 "Para 6 says that \"for royalty purposes condensates shall be treated as crude oil and natural gas liquids shall be treated as natural gas.\" So condensate joins crude oil in the daily rate and the tranche rate, and natural gas liquids pay the gas royalty. Leaving condensate out, or counting the natural gas liquids in, each misreads that sentence.")

q(2, "Ekene Alpha's 2028 daily rate prints as 6425.404372 bopd. Which day count did the engine divide the year's crude oil plus condensate by?",
 "366, the calendar days of 2028",
 ["365 in every year, a fixed length for the royalty tranches",
  "The days oil was produced in each month, month by month as r.12(2) directs",
  "The producing days of 2028 as a whole"],
 "The engine divides by the calendar days of the year, and 2028 is a leap year of 366 days, so the rate is 6425.404372 and the liquids royalty rate 0.055546. A fixed 365 would miss the leap day. Dividing by the days oil flowed, month by month or over the year, is the Regulations' method; the engine reads the calendar year and states that choice in its notes.")

q(1, "Every PIA run of the engine prints this note: \"Royalty tranches read the year's crude oil plus condensate divided by the calendar days of the year; the Regulations (r.12(2)) divide each month's production by the days oil was produced in that month.\" What is the note?",
 "A statement of the engine's annual reading attached to a finished result",
 ["A refusal, cleared by loading twelve monthly production rows for every year of the ledger",
  "A warning that the liquids royalty for the year was left out of the ledger it returns",
  "A stated default to switch off before the figures can be used"],
 "A note in kpis.pia_notes is part of a result: the ledger ran, and the engine states where its annual day count departs from the monthly method of r.12(2). A refusal is a thrown error and no result comes back. The liquids royalty is computed on every row. The note names no switch to turn off; the annual reading is how the engine computes the daily rate.")

q(0, "A field lies partly onshore and partly in shallow water. Para 10(7) says its \"weighted average royalty shall be calculated as per regulations.\" What does the engine do with such a field?",
 "It runs one stated terrain string at a time and never reads the water depth",
 ["It splits the field at the 200 metre line using pia_water_depth_m",
  "It weights the two rates by a stated production share",
  "It refuses the run until the depth field is removed"],
 "The engine takes the terrain as one of four strings and carries pia_water_depth_m without reading it, so a straddling field is run under one terrain at a time and the Regulations' weighting of r.14(5) stays outside the engine. That is why the provision is concept-only and never graded on a number. There is no share-of-production input, and the engine does not refuse a run because a depth is present.")

q(3, "A field's weighted liquids royalty rate falls. Which hydrocarbon tax line does that raise directly, and under which provision?",
 "The assessable profit, since royalties are deducted under s.263(1)(b)",
 ["The cost price ratio cap, with royalties claimed inside the 65 percent limit of the Sixth Schedule",
  "The s.267 hydrocarbon tax rate, which the Act sets higher for a field paying the low tranches",
  "The production allowance paid on the barrels"],
 "PIA s.263(1)(b) deducts \"all royalties the liability for which was incurred and were paid by the company during that period in respect of crude oil and associated gas\", so a smaller royalty leaves more assessable profit. Royalties sit outside the cost price ratio (para 2(1) excludes s.263(1)(b)), and the cap is measured on revenue alone. The s.267 rate depends on licence and lease. The production allowance is a sum per barrel that no royalty changes.")

q(2, "The Ekene marginal field is a shallow water lease converted under s.94(1), producing 20000 bopd in 2026. What liquids royalty rate does the engine return?",
 "0.093750, the shallow water tranches",
 ["0.150000, the rate that s.94(1) attaches to a converted producing marginal field",
  "0.050000, the first tranche on every barrel of a marginal field",
  "0.106250, the onshore weighting applied to every marginal field"],
 "The marginal field flag moves the hydrocarbon tax rate to 0.150000; the royalty follows the terrain's tranches, and at 20000 bopd in shallow water that is 0.093750. So 0.150000 is the tax rate, which is a different line. Para 10(4) names marginal fields inside the same onshore and shallow water tranches, with no special first-tranche rule. 0.106250 is the onshore figure at 20000 bopd; this lease is in shallow water.")

emit(Q, '/root/cat-wip-pia/banks/ec7i_m01.json', expect_n=15)
finish()
