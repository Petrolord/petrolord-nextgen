import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC7 Associate m03, Royalty by Terrain.
# Sources: the small-field tranches and their boundary table; the daily rate
# and calendar days; Ekene Alpha's royalty lines; the gas and NGL royalty with
# the in-country share; the gas field case; the texts behind both sections.
# Every rate and money figure keyed here is re-run through deriveOilRoyaltyRate,
# deriveGasRoyaltyRate and computeCashFlow in
# /root/cat-wip-pia/scratch/bank-beginner/witness.mjs.

q(0, "A shallow water field produces 50,000 bopd. What royalty rate does the engine return on the whole liquids volume?",
 "0.112500, the two tranches blended with 12.5 percent on the barrels above 10,000 bopd.",
 ["12.5 percent, the terrain rate, since the field is well above 10,000 bopd.",
  "0.132500, the rate the onshore scale returns at 50,000 bopd.",
  "0.062500, the average of the two small-field tranches."],
 "The engine applies the first 5,000 bopd at 5 percent, the next 5,000 at 7.5 percent and everything above 10,000 bopd at the shallow water rate of 12.5 percent, as one weighted rate on the whole volume: 0.112500. Charging 12.5 percent on every barrel ignores the tranches; 0.132500 is the onshore rate, where 15 percent enters; 0.062500 is the rate at exactly 10,000 bopd.")

q(2, "A deep offshore field produces 60,000 bopd. Which rate does the engine return?",
 "0.054167, with 7.5 percent on only the barrels above 50,000 bopd.",
 ["7.5 percent on the whole volume, since the field is past the 50,000 bopd tier.",
  "0.050000, since deep offshore pays 5 percent at every daily rate.",
  "0.114583, the shallow water rate at 60,000 bopd."],
 "Seventh Schedule para 10(3) charges 5% up to 50,000 bopd and \"the share of the production above 50,000 bopd\" at the terrain rate, and r.13(1)(b) makes that a weighted average: 0.054167 at 60,000 bopd. Charging 7.5 percent on the whole volume is the step error; 5 percent holds only up to and including 50,000 bopd; 0.114583 belongs to shallow water.")

q(1, "An onshore field produces exactly 5,000 bopd. Which statement matches the engine?",
 "It pays exactly 5.000000 percent, as the first tranche includes its edge.",
 ["It pays 0.050005, since the edge barrel falls in the 7.5 percent tranche above it.",
  "It pays 6.250000 percent, the average of the two small-field tranches of the Schedule.",
  "It pays 15 percent, the onshore terrain rate, on every barrel."],
 "Each edge belongs to the tranche below it: r.13(2)(a) covers \"production less than or equal to 5,000bopd\", so the engine returns 0.050000 at 5000 bopd. The rate 0.050005 is the engine's figure at 5001 bopd, 6.250000 percent is the rate at 10,000 bopd, and the 15 percent terrain rate reaches only barrels above 10,000 bopd.")

q(3, "At exactly 10,000 bopd the Regulations' middle band says \"less than\" and the upper band \"greater than\". What does the engine return onshore and in shallow water?",
 "0.062500 for both; the two formulas agree there, so the gap moves no figure.",
 ["0.062509 onshore and 0.062506 in shallow water, since the terrain rate begins to enter right at the edge.",
  "0.050000 for both terrains, because the second tranche of 7.5 percent opens only above 10,000 bopd.",
  "A refusal from the engine, because neither band of the Regulations covers exactly 10,000 bopd."],
 "r.13(2)(b) covers production \"less than 10,000bopd\" and r.13(2)(c) and (d) cover \"greater than 10,000bopd\". At exactly 10,000 bopd both formulas give 0.062500, which is what the engine returns, so the gap moves no figure. 0.062509 and 0.062506 are the engine's figures at 10001 bopd; the second tranche starts above 5,000 bopd; and the engine does not refuse a finite daily rate of 0 or more.")

q(3, "At 20,000 bopd, why does onshore pay 0.106250 while shallow water pays 0.093750?",
 "Above 10,000 bopd the terrain rate enters: 15 percent onshore, 12.5 in shallow water.",
 ["Onshore reads its tranches month by month under r.12(2) while shallow water reads the whole year at once.",
  "Shallow water keeps the 5 percent first tranche for its first 10,000 bopd, where onshore keeps it for 5,000.",
  "Onshore adds a royalty by price that the shallow water scale does not carry at that price."],
 "Both terrains pay 5 percent on the first 5,000 bopd and 7.5 percent on the next 5,000; the barrels above 10,000 bopd pay the terrain rate of para 10(2), 15 percent onshore and 12.5 percent in shallow water, so the weighted rates part. The engine reads every terrain's daily rate the same annual way, the tranches are identical below 10,000 bopd, and the royalty by price is a separate line that every terrain but frontier pays alike.")

q(2, "What liquids royalty rate does frontier acreage pay at 1 bopd and at 120000 bopd?",
 "0.075000 at both, because r.13(3) applies no sliding scale to a frontier basin.",
 ["0.050000 at 1 bopd and 0.075000 at 120000 bopd, climbing on the onshore tranches.",
  "5 percent up to 50,000 bopd, then 7.5 percent above that, as in deep offshore.",
  "No royalty at either rate."],
 "The Regulations read: \"(3) For frontier basin, the sliding scale shall not apply and the applicable rate shall be 7.5%.\" The engine returns 0.075000 at every daily rate in its tranche table. Frontier follows neither the onshore tranches nor the deep offshore tier, and what frontier escapes is the royalty by price (para 11(2)); its production royalty is still charged.")

q(1, "Ekene Alpha's 2026 rows carry 2920000 barrels of oil and 116800 of condensate. Why does the condensate enter the daily rate?",
 "Para 6 treats condensates as crude oil for royalty, and r.12(1)(b) scales the total.",
 ["Condensate sells at the oil price, so the engine merges the two streams into one before rating.",
  "Condensate is a natural gas liquid and joins the daily rate of the gas royalty.",
  "The engine counts every liquid, NGL included, in the daily rate the tranches read."],
 "Seventh Schedule para 6 reads that \"for royalty purposes condensates shall be treated as crude oil and natural gas liquids shall be treated as natural gas\", and r.12(1)(b) applies the sliding scale \"to the total production of crude oil plus condensates\". Alpha's condensate sells at 70 against oil at 75, so the prices differ; natural gas liquids go with gas and stay out of the daily rate; and gas has no daily rate at all.")

q(0, "Alpha 2026: crude plus condensate over the 365 days of the year. Which daily rate and liquids royalty rate does the engine return?",
 "8320.000000 bopd, and a weighted liquids royalty rate of 0.059976.",
 ["8320.000000 bopd, with 5 percent on the whole volume.",
  "7321.600000 bopd, and a rate of 0.057927.",
  "8320.000000 bopd, at the terrain rate of 12.5 percent."],
 "The engine divides 2920000 plus 116800 barrels by 365 and returns 8320.000000 bopd, between 5,000 and 10,000 bopd, so the rate is a weighted blend of the two small-field tranches, 0.059976. Five percent applies only at or below 5,000 bopd, 12.5 percent only to barrels above 10,000 bopd, and 7321.600000 and 0.057927 are Alpha's 2027 figures.")

q(2, "How does the engine turn Ekene Alpha's 2028 crude and condensate into the daily rate the tranches read?",
 "It divides the year's liquids by 366, the calendar days of 2028, giving 6425.404372 bopd.",
 ["It divides by 365 in every year, the length the engine assumes for any year of assessment it reads.",
  "It divides each month by the days oil was produced and rounds to whole barrels, month by month.",
  "It takes the busiest month of the year, since the text reads a month's production."],
 "The engine divides the year's crude oil plus condensate by calendarDays of the year, 366 in 2028, and prints 6425.404372 as royalty_liquids_bopd. It does not use 365 in a leap year. Month by month over the producing days, rounded, is the Regulations' own method (r.12(2)), which the engine's daily rate note names beside its annual reading, and no single month is picked.")

q(0, "How does Regulations r.12(2) define barrels of oil per day?",
 "A month's production over the days oil was produced that month, rounded to whole barrels.",
 ["A year's production over the calendar days of that year, kept to six decimals.",
  "A month's production over the calendar days of the month, with no rounding.",
  "A year's production over the days of the year on which oil was produced."],
 "The text reads that barrels of oil per day are found \"by taking the total production for the applicable month and dividing this amount with the number of days during which oil was produced in such month, and the result shall be rounded to entire barrels.\" A year over its calendar days is the engine's stated annual reading; the Regulations use producing days, a month and whole barrels.")

q(1, "A shallow water gas field states pia_gas_in_country_share_pct 50. What gas royalty rate does the engine return, and in which terrains?",
 "0.037500 in every terrain: half at 5 percent, half at 2.5.",
 ["2.5 percent, because any gas used in-country earns the lower rate on the whole volume of gas produced.",
  "0.037500 in shallow water only, with 5 percent onshore and offshore on the remainder of the gas.",
  "0.043750, with a quarter of the gas put at the lower rate."],
 "The engine blends 5 percent and 2.5 percent by the stated in-country share, and every terrain pays the same gas rate: 0.037500 at 50 percent. The lower rate applies only to the share used in-country, the terrain moves nothing in the gas royalty, and 0.043750 is the engine's rate at a 25 percent share.")

q(3, "What does Regulations r.16(4) say about natural gas liquids produced separately?",
 "They pay 5% whether used in-country or exported.",
 ["They pay 2.5% when they are used in-country, the same as marketable natural gas under r.16(1)(a).",
  "They count as condensate for royalty and pay the liquids tranche rate of the field's terrain.",
  "They pay no production royalty at all and are charged a royalty by price."],
 "The text reads: \"(4) The royalty rate of natural gas liquids produced separately, shall be 5% regardless of whether the natural gas liquids are used in-country or exported.\" Only marketable natural gas used in-country earns 2.5% (r.16(1)(a)). Para 6 puts natural gas liquids with natural gas, so they never join the liquids tranches, and the royalty by price reaches crude oil and condensate only.")

q(0, "ekene_nag_gas_in_country_half produces 20000000 Mscf of gas a year and no crude oil or condensate. Which royalty lines does it pay?",
 "Only the gas royalty, 2250000.000000 USD a year, with no liquids royalty and no royalty by price.",
 ["The gas royalty and a royalty by price read at the gas price of 3 USD per Mscf each year.",
  "The gas royalty plus a liquids royalty at 0.050000 on its condensate.",
  "No royalty, as a gas field is outside the Act's royalty."],
 "The engine returns a gas royalty of 2250000.000000 USD in each of 2026, 2027 and 2028 at 0.037500, and a liquids royalty and royalty by price of 0.000000: the field sells no crude oil or condensate, and the royalty by price reaches only those two. The 0.050000 on its row is the rate at a zero daily rate, charged on no liquids value, and para 10(6) charges gas a production royalty.")

q(2, "A learner types an in-country gas share of 100.5 into the royalty calculator. What does the panel print?",
 "The engine's refusal: pia_gas_in_country_share_pct must be a number from 0 to 100; got 100.5.",
 ["A rate of 0.025000, with the share capped at 100 and a note in kpis.pia_notes explaining the cap.",
  "A result at the default share of 0, applied silently with a gas rate of 0.050000.",
  "Negative gas royalty, shown as a credit."],
 "deriveGasRoyaltyRate refuses a share outside 0 to 100 and the panel shows the engine's own words. The engine does not cap, default or extrapolate this input: 100 is the highest share it accepts, where the rate is 0.025000, and a share above 100 is refused with that message.")

q(1, "Ekene Alpha's daily rate in 2030 is 4989.463014 bopd. Which liquids royalty rate does it pay that year?",
 "Exactly 5 percent, 0.050000, at or below 5,000 bopd.",
 ["0.052954, the rate of 2029, carried over into the next year until the field falls further.",
  "0.059976, the rate of its first year, held for the life of the converted lease.",
  "12.5 percent, the terrain rate for small fields."],
 "At or below 5,000 bopd onshore and shallow water pay exactly 5 percent, so from 2030 Alpha's rate is 0.050000. Each year's rate reads that year's daily rate, so neither 0.052954 (2029) nor 0.059976 (2026) carries over, and the 12.5 percent terrain rate applies only to barrels above 10,000 bopd.")

emit(Q, '/root/cat-wip-pia/banks/ec7b_m03.json', expect_n=15)
finish()
