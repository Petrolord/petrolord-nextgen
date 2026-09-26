import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC1 cashflow, beginner tier, final exam. Reconstructed from the served rows (the applied
# migrations replayed on a local scratch database) with the EC7 PIA re-cut applied;
# written by tools/course-waves/cashflow/pia-recut/build.py. Edit the rows there, then re-run it.

q(1,
 "In the hand-derived 2030 row the depreciation column reads 5000000.00 USD, and that number appears nowhere in the net cash flow of -12500000.00. What is the column there for?",
 "To reduce taxable income to 65000000.00, and through the 50 percent rate to cut tax by half of itself.",
 ["To spread the 50000000.00 of capex across the two rows so that each year carries its share of the spend in cash.",
  "To record the part of the capex the engine has already returned to the contractor through the cumulative column.",
  "To mark the tax value of the royalty, which is deductible and so must be printed as a separate line."],
 "A reader who subtracts depreciation from revenue when building net cash flow gets a row 5000000.00 too low and never sees it, because the arithmetic looks tidy.")

q(3,
 "AKATA's oil falls from 2200000.00 bbl in 2029 to 770000.00 bbl in 2035. Where does that decline come from?",
 "The production upload. The engine models no reservoir and believes the volumes it is given.",
 ["A decline model fitted by the engine to the first two rows and projected forward at a constant fraction a year.",
  "The economic limit, which trims the volumes each year as opex escalates against price.",
  "The depreciation schedule, which retires a tenth of the field's capacity each year alongside its capex."],
 "If the volumes are wrong the ledger is wrong, and the engine has no way to know; the file listed 770000 against year 2035 and the row repeats it to two decimals.")

q(0,
 "A capex row carries both amount_usd and cost_usd. Under what condition does the engine refuse the file?",
 "Only when the two hold different values; equal values are taken once.",
 ["Always, because a row may carry exactly one cost column and the engine will not pick between two preferred aliases.",
  "Never, because both are preferred aliases and the engine sums every column ending in _usd in that case.",
  "Only when one of them is prefixed total_, which the fallback excludes from its sum."],
 "ambiguous_cost_aliases says which: different values, refused; the same value, accepted once, and the year's capex is the value, counted once.")

q(2,
 "AKATA's 2030 row prints applied_oil_price 83.640000 USD/bbl. Why does the course insist on quoting six decimals rather than 83.64?",
 "Because the decimals are what let a reader check the escalator's work against the engine, and a rescale throws that away.",
 ["Because the engine rounds internally to six places and a shorter figure would not reproduce the gross revenue of 159564720.00.",
  "Because prices below 100 need six decimals to carry the same precision as the money columns, which carry two.",
  "Because 83.64 would be read as a percentage by the configuration, which stores rates and prices in one field."],
 "Money is printed to two decimals, volumes to two, prices to six, rates to four; the engine never changes a unit or a precision, and neither should a reader.")

q(2,
 "jv_royalty_pct is entered as 15 for AKATA. What does the engine do with a reader who types 0.15 instead?",
 "It runs, at a royalty a hundred times smaller than intended, and nothing objects.",
 ["It refuses the run, because a royalty below 1 percent is outside the range the JV regime accepts.",
  "It reads the fraction as a percent value and reports the same 27904800.00 of royalty in 2029.",
  "It scales the value back to 15 by comparing it with the tax rate of 40."],
 "Rates are percent values everywhere in the configuration; a file or a field in the wrong unit is believed, and every number downstream carries the error at full precision.")

q(0,
 "alaoma_csv_ingestion has oil in rows dated 2027-01 and 2027-02, and its flat price runs with an escalator. Which price does the February oil earn?",
 "The same price as the January oil, because the month finds the year and is then forgotten; 2027 revenue is 14250000.00 on 190000.00 bbl at one price.",
 ["One month of escalation on the January price, because the escalator compounds from the base date month by month and the row carries a month.",
  "The base price for both, because escalation starts only in the second calendar year of the ledger and 2027 is the first.",
  "A price from a deck the engine builds from the row dates, one entry per dated row."],
 "Dating happens before any price is applied, so where a date lands is a pricing decision: a row dated the following January would earn the next year's escalated price.")

q(3,
 "fiscal_regime picks one of three cascades from gross revenue to net cash flow. Which description is the JV cascade?",
 "Royalty, then deductions, then a single tax rate: 20000000.00 of royalty and 32500000.00 of tax out of 100000000.00 in 2030.",
 ["Cost recovered from a capped share of revenue and the remainder split, which is why psc_carryforward pays 27000000.00 of tax on 200000000.00 of revenue and nets -1000000.00.",
  "Five taxes on three bases, which on the published worked example collect 617004738.36 out of 1460000000.00 of revenue.",
  "One tax on gross revenue with no deductions, which is what the loss columns reading 0.00 on every row implies."],
 "Every regime reports the same KPI set; what differs is the cascade between the one gross revenue and the net, and the JV is the flat one.")

q(1,
 "zero_rates_capex_only runs with total revenue 0.00 USD and prints take null, unit technical cost null and payback beyond project life. Why was it not refused instead?",
 "Refusal is for a file the engine cannot read; this one was readable, and null is the engine declining to invent a ratio with nothing on top.",
 ["It was refused, and the null readings are what the KPI block prints for any run that stops at the door.",
  "Because zero volumes are a valid decline and the engine treats them as the economic limit having been reached in the first row.",
  "Because the file carried capex rows, and a capex file alone is enough to run without production."],
 "The eight refusals name headers, prices, ambiguity and emptiness; a readable file with nothing sold runs, and its cumulative ends at -70000000.00.")

q(0,
 "A production file carries w1_oil_bbl_forecast beside a real oil column. What happens to the forecast column?",
 "It is dropped without a word, because the suffix must be last and forecast follows it.",
 ["It is summed with the real column, because the prefix w1 marks it as the same well's oil and the engine adds a well's columns.",
  "It is refused as no_volume_columns, because a header that is nearly a volume column is treated as ambiguous.",
  "It is read as a separate well, since anything before _oil_bbl is a well name."],
 "Alone, the file fails; beside a real column it runs, and the only trace is an annual volume smaller than the spreadsheet's.")

q(3,
 "alaoma_csv_ingestion uploads rows dated 2027-01 with oil_bbl=100000 and 2027-02 with oil_bbl=90000, plus days_in_month, liquid_bbl, oil_rate_bopd and watercut_pct. What does the engine read for 2027?",
 "Oil 190000.00 bbl, and none of the other four columns, because none ends in a volume suffix.",
 ["Oil 190000.00 bbl, with the two months priced separately and then added, because the date carries the month.",
  "Liquid volumes, since liquid_bbl ends in _bbl and the engine takes the largest volume column it finds.",
  "Two rows, one for January and one for February, because the ledger keeps the upload's period."],
 "The month is used to find the year and then forgotten; there is no cash flow of March in the ledger it returns.")

q(1,
 "month_index_rows uploads twenty-four production rows of oil_bbl=10000 at month_index 1 through 24 with base_year 2027. What does the ledger hold?",
 "Two rows, 2027 and 2028, each with 120000.00 bbl, and nothing in it knows the upload was monthly.",
 ["Twenty-four rows, one a month, each priced at the escalated price for its month and then summed in the KPI block.",
  "One row in the base year holding all twenty-four months, because a month index counts from the base year and stays in it.",
  "Two rows of 120000.00 bbl and an empty 2029 row, because month_index=24 closes a year and opens the next."],
 "The result reads total revenue 18000000.00, and its capex at month_index=1 is 2027 capex 5000000.00; months exist on upload and not in the ledger.")

q(2,
 "per_well_beats_total_rollup carries total_oil_bbl=100000, well1_oil_bbl=60000 and well2_oil_bbl=40000 for 2027 and reports revenue 7500000.00 USD and take 55.0000 percent. Had the total been added to the wells, what would have looked odd in the KPI panel?",
 "Nothing. Revenue and every reading built on it would be double, and each would still be a plausible number.",
 ["The take, which would have fallen below the royalty rate because the tax base doubled while the royalty did not.",
  "The payback, which would have moved from Year 0 to a positive number because the capex stayed at 0.00.",
  "The DPI, which prints null with no capex and would have become a number once revenue doubled."],
 "The wells are the data and the total is dropped; a reader who sums every _oil_bbl column gets 200000 and concludes the engine lost half the field.")

q(3,
 "AKATA's production file carries akata_oil_bbl and akata_gas_mscf. What is akata to the engine?",
 "A well prefix; anything before the suffix is a well, and the engine sums each stream across every well it finds.",
 ["A field tag that tells the engine the two columns belong to one ledger, which is why the gas and the oil are priced together.",
  "A label it ignores, because only the bare oil_bbl and gas_mscf forms are read and the prefixed forms are carried past.",
  "The name of the price deck the two streams are resolved against, one deck per prefix."],
 "The prefix can be akata, w1 or a real well name as long as the suffix closes the header; a file with many wells needs one oil column per well and one gas column per well.")

q(0,
 "case_insensitive_headers uploads columns headed Date, Oil_BBL, Cost_USD and Total_Opex_USD. How does the engine read them?",
 "As date, oil_bbl, cost_usd and total_opex_usd; case is ignored, so the 2027 opex is 750000.00.",
 ["It refuses the production file, because Oil_BBL is not one of the lower-case suffixes the no_volume_columns message lists.",
  "It reads the volumes and refuses both cost files, because a preferred alias is matched exactly and Cost_USD is not one.",
  "It reads them all, but Cost_USD falls through to the fallback sum because only an exact alias is preferred."],
 "OIL_BBL and Oil_BBL are the same column as oil_bbl; the recogniser tests the suffix and the alias, never the case.")

q(1,
 "A capex column headed amount_usd holds thousands of USD rather than USD. What does the refusal check do?",
 "Nothing. The file passes and the capex is read at one thousandth of its value.",
 ["It refuses the file, because the values are too small against the production volumes to be a plausible capex.",
  "It scales the column by 1000, because the engine detects the magnitude from the other cost files.",
  "It flags the row as ambiguous, since a preferred alias with an implausible value is treated like two aliases that disagree."],
 "The refusal does not check that the number under a recognised header is the right number; a gas column headed _mscf holding scf is read at a thousand times its value the same way.")

q(1,
 "A production file fails with no_usable_date, and the reader pastes in a year column with one value on every row. What has happened?",
 "The refusal goes away and every month lands in one year, and no later refusal will catch it.",
 ["The refusal goes away and the engine spreads the rows evenly across the year, because the month index is inferred from row order.",
  "The refusal persists, because a year column with a single repeated value is not a usable date.",
  "The engine re-dates the rows from the filename and ignores the pasted column."],
 "A refusal is the engine's only chance to object; after the door it believes you, and the only check left is the annual volumes it reports back.")

q(2,
 "AKATA applies 82.000000 in 2029, 83.640000 in 2030 and 85.312800 in 2031. Why is 85.312800 not 82 plus two equal steps?",
 "The escalator compounds: 85.312800 is 83.640000 escalated again, and each step is larger than the one before.",
 ["The 2031 step includes the inflation rate of 3 percent on top of the 2 percent escalator, so the second year climbs faster.",
  "The gas escalator is applied to the oil price in the second year, and the two rates add.",
  "The escalator is linear and 85.312800 is a rounding of the second equal step."],
 "The six decimals are the compounding made visible, and the gas price runs 3.200000, 3.264000, 3.329280 on its own escalator in the same rows.")

q(0,
 "The three-stream case uploads w_oil_bbl=5000000, w_gas_mscf=30000000 and w_condensate_bbl=300000 for 2025 at 80, 4.5 and 70 with escalators 0, and the row reads gross revenue 556000000.00 USD. What does the row show about the split between streams?",
 "Nothing. One revenue number carries all three, and a reader who wants the oil share multiplies the volumes by the prices the row does carry.",
 ["Three revenue columns, one per stream, because each stream has its own price, escalator and deck and the ledger keeps them apart.",
  "The oil share only, since gas and condensate are folded into boe at 6 Mscf per barrel before they are priced.",
  "A blended price per boe, which is what applied_oil_price shows on a row with more than one stream."],
 "The JV cascade never needs the split, because royalty and tax are taken from the one gross revenue, which is why the engine keeps only the one number.")

q(3,
 "With no deck, a flat 80 and the escalator typed as 0, what does the resolver return for the years 2028 through 2035 around a 2030 base year?",
 "80.000000 in every year, before the base year as well as after it.",
 ["80.000000 from the base year onward and de-escalated values before it, since the base year is still the anchor for the years behind it.",
  "80.000000 from 2030 onward and the inflation rate applied before it, because a typed zero only switches off the forward escalation.",
  "Nothing, because an escalator of 0 is read as unset and falls back to the inflation rate."],
 "Zero means flat; only a blank escalator falls back to inflation, and the same call with the escalator at 10 returns 72.727273 for 2029.")

q(2,
 "A reader sets a 10 percent escalator for a flat price, then enters the deck_step_hold deck, which ends at 50 in 2032. What does the resolver return for 2035?",
 "66.550000, because past the last entry the escalator runs on the last deck price, a rising tail nobody chose.",
 ["50.000000, because a deck holds its last entry for every later year the way it holds between entries.",
  "55.000000, because the escalator runs once past the end of the deck and then the price holds.",
  "The flat price escalated, because the deck ends in 2032 and the flat price returns for the years after it."],
 "The fix for a deck that should stay at 50 is an escalator of 0, and a reader who set 10 for the flat price and forgot it has a tail nobody chose.")

q(0,
 "deck_differential sets a one-entry deck at 100 for 2030, a 10 percent escalator and a differential of -5. Why does 2031 read 105.000000 rather than 95 escalated?",
 "The order is fixed: resolve the deck and escalate to 110, then add the differential.",
 ["The differential is applied only in deck years, so 2031, past the deck, carries no differential and reads 110 less rounding.",
  "The differential escalates with the price, so the 2031 gap is larger than 5 and the row is 105 by coincidence.",
  "The scale of 1.2 was also set on that case, and the two adjustments cancel in 2031."],
 "A reader who applies the differential to the benchmark and then escalates disagrees with the engine by a little more each row and never by enough to look like a bug.")

q(1,
 "A reader wants a crude at 120 percent of the benchmark and types 20 into oil_price_scale. What happens?",
 "The price is multiplied by twenty, and nothing refuses it.",
 ["The engine reads 20 as a percent and multiplies by 1.2, since every rate field is a percent value.",
  "The run is refused, because a scale above 10 is outside the range the resolver accepts.",
  "The scale is treated as a differential of 20 USD/bbl, since the two adjustments share a field."],
 "deck_scale shows the intended form: oil_price_scale 1.2 turns the 100 entry into 120.000000, and the configuration is the only record that a scale was used at all.")

q(3,
 "escalator_defaults_to_inflation sets inflation_rate_pct 5 and leaves the oil and opex escalators blank. What does the 2031 row show?",
 "Price 105.000000 and opex 10500000.00, both escalated at the inflation rate, with the capex escalator still 0.",
 ["Price 100.000000 and opex 10000000.00, because a blank escalator means flat, and only a typed value escalates.",
  "Price 105.000000 and opex 10000000.00, because only prices default to inflation and opex defaults to 0.",
  "Price 100.000000 and opex 10500000.00, because inflation is a cost phenomenon and prices are set by the deck."],
 "A blank escalator is inflation, a zero escalator is flat, and only the capex escalator is safe to leave blank.")

q(3,
 "A reader divides AKATA's 2029 gross revenue of 186032000.00 USD by its 2200000.00 bbl of oil and gets a number above 82.000000. What have they found?",
 "Nothing about the price. Gas revenue is in the numerator and gas volume is not in the denominator.",
 ["That the escalator started a year early, because 82.000000 in the base year should reproduce exactly from the row.",
  "That the flat price was mis-entered, since gross revenue over oil volume is the definition of the applied price.",
  "That a differential is in force, because the applied price column hides adjustments."],
 "The applied_oil_price column is the price; gross revenue is that price times the oil plus 3.200000 times 1760000.00 Mscf of gas.")

q(0,
 "None of the published price cases sets a differential and a scale together. What can a lesson say about the order between them?",
 "Nothing. The order is not published, it matters, and the only way to know is to run both in the explorer and read the applied price.",
 ["That the scale comes first, because a multiplicative adjustment is always applied before an additive one in the resolver.",
  "That the differential comes first, because deck_differential resolves before deck_scale in the published order.",
  "That it does not matter, because the two adjustments commute on any price."],
 "A scale applied to a price already carrying a -5 differential moves the differential too, so the two orders give different rows.")

q(2,
 "A hand-derived JV ledger shows royalty 20000000.00 USD beside tax 42500000.00 in the same year. What is that the fingerprint of?",
 "Royalty charged against cash but not removed from taxable income.",
 ["Royalty taken off revenue less opex, which shrinks the royalty and enlarges the tax in the same row.",
  "The tax rate mis-entered as 85, which lifts the year 1 tax toward 55250000.00.",
  "A working interest below 100, scaling tax and not royalty."],
 "At 50 percent tax the 20000000.00 deduction is worth 10000000.00, and 42500000.00 is the tax the engine prints only when the royalty is 0.00.")

q(1,
 "With jv_psc_depr_years 7, AKATA's schedule claims 248571428.57 USD of 255000000.00 and total tax reads 119700211.23, against 148425219.46 on the default. Why is the total tax lower?",
 "More of the capex is deducted inside the seven-year horizon, so less of it is lost when the field ends.",
 ["A faster schedule shrinks the base in the early years and the loss carried forward is refunded at cessation.",
  "Tax is charged on the undepreciated balance, and the seven-year schedule leaves less balance.",
  "The seven-year schedule spreads the opex as well as the capex, which the default does not."],
 "The default claims 174000000.00 in seven years and never writes off the rest; every faster schedule claims more and pays less in total.")

q(0,
 "Rebuild AKATA's 2032 net cash flow of 53959532.44 USD from the row: gross revenue 116656473.02, royalty 17498470.95, opex 26225448.00, depreciation 25500000.00, taxable income 47432554.07, tax 18973021.63, capex 0.00. Which lines are subtracted from revenue?",
 "Royalty, opex, capex and tax; depreciation is not among them.",
 ["Royalty, opex, depreciation and tax, since the row is built from left to right and every deduction column counts.",
  "Royalty, opex and depreciation only, because tax is a reading and not a cash line.",
  "Tax alone, because the taxable income already has royalty, opex and depreciation removed."],
 "116656473.02 less 17498470.95, less 26225448.00, less 0.00, less 18973021.63 is 53959532.44 to the cent; depreciation was used once, to reach 47432554.07, and then left.")

q(2,
 "AKATA at a 40 percent working interest prints 2029 net -48449472.00 USD, take 66.1723 percent and unit technical cost 40.006602 USD/boe. Which of those three is the partner's own number?",
 "Only the net cash flow; the other two are ratios the interest scales on both sides.",
 ["Only the take, because a partner's share of the value is what take measures while the other two are field readings.",
  "Only the unit technical cost, because the interest scales the barrels while the capex and opex stay at the field's 255000000.00 and 183899092.34 USD.",
  "All three, because every reading printed on a scaled run belongs to the partner."],
 "Take reads 66.1723 percent and unit technical cost 40.006602 USD/boe at 100, 75, 60, 40 and 25 percent alike, while the 2029 net falls from -121123680.00 to -48449472.00.")

q(3,
 "A partner's interest in a field steps from 100 percent to 60 percent after payout. How does the engine model it?",
 "It cannot: jv_working_interest_pct is one number for the whole life.",
 ["With a second run at 60 percent whose rows are spliced in from the payback year the first run reports.",
  "With the interest applied year by year from a column in the production file, which the engine reads like a volume.",
  "By scaling the pre-payout rows at 100 and the later rows at 60 automatically, since payback is a reading it already has."],
 "Working interest is one number for the whole life, so it cannot step at a date, and it carries no carried interest and no partner-specific cost; what it does reach is every money line and the volumes alike.")

q(1,
 "The hand-derived case at a 25 percent working interest prints year 1 royalty 5000000.00 USD, tax 8125000.00 and net -3125000.00, each a quarter of the 100 percent figures. What does the same run report as its take?",
 "80.7692 percent, the same as at 100 percent, because the interest scales the government's lines and the contractor's together.",
 ["95.1923 percent, because the partner's scaled net is set against the field's unscaled pre-take value.",
  "A quarter of 80.7692 percent, since take is a money reading and every money reading scales with the interest.",
  "Null, because the engine declines a take on any run below a 100 percent interest."],
 "NPV falls from 21590909.09 to 5397727.27 USD with the share while take does not move. A take that set the partner's scaled net against the field's unscaled value would climb as the interest fell, a reading about the partnership.")

q(0,
 "AKATA's cumulative_nominal reads 29050104.71 USD at the end of 2032 and its cumulative_cash_flow reads 19845806.34. What do the two agree on and what do they not?",
 "They agree that payback falls in 2032, and they disagree on the fraction inside the year.",
 ["They agree on the fraction, because both are interpolated from the same 2032 flow, and disagree on the year.",
  "They agree on nothing, because one is a running sum and the other a total.",
  "They agree on the trough and disagree on the sign of the 2032 entry."],
 "The nominal and real columns change sign in the same year, so the whole-year part is the same; the engine's 3.461632 walks the nominal column.")

q(3,
 "multiyear_jv_real prints payback \"2.89 years\" and multiyear_pia_real \"2.84 years\", and both cross zero in their third row. Do the two fields pay back at the same time?",
 "No. Their payback_years are 2.889357 and 2.844931, and each label is a rounding of its own figure.",
 ["Yes, because the two labels differ only in the second decimal, and a label is a display rounding of one shared crossing.",
  "Yes, because both cross zero in their third row and payback is a year.",
  "No, because one is a JV field and the other a PIA field, and the regimes count from different rows."],
 "Both fields cross zero in their third row, yet payback_years reads 2.889357 on the JV field and 2.844931 on the PIA field: the fraction inside the crossing year differs, and each label rounds its own figure. Two fields that cross in the same row can still pay back at different times.")

q(2,
 "The hand-derived case reports unit technical cost 35.000000 USD/boe and opex per boe 10.000000. From which totals?",
 "Capex 50000000.00 plus opex 20000000.00 over 2000000.00 boe, then 20000000.00 over the same.",
 ["Capex 50000000.00 plus opex 20000000.00 over 1000000.00 bbl, the first year's oil, then the first year's opex over the same.",
  "Revenue 200000000.00 less tax 65000000.00 over 2000000.00 boe, then royalty over the same.",
  "Capex 50000000.00 plus opex 20000000.00 plus tax 65000000.00 over 2000000.00 boe, then opex over the same."],
 "Neither number contains royalty or tax; the case has no gas, so its 2000000.00 bbl are 2000000.00 boe.")

q(0,
 "On the hand-derived case take is 65.3846 percent with the royalty at 0 and 30.7692 percent with the tax at 0. What do the two numbers together say?",
 "A regime is a take rather than a rate: each instrument moves the share on its own axis, and neither rate alone is the government's share.",
 ["That royalty is the larger instrument, since removing it moves the take further than removing the tax.",
  "That the two instruments add, so the take with both in force is their sum rather than the 80.7692 the engine prints.",
  "That take is undefined when either rate is zero, and the engine prints the other rate instead."],
 "With both in force the take is 80.7692 percent; royalty shrinks the tax base, so the two do not simply add.")

q(1,
 "jv_loss_unused_at_cessation ends at a cumulative of -50000000.00 USD with total revenue 0.00. What does the engine print for take and payback?",
 "Take null and payback \"Beyond project life\", with payback_years null.",
 ["Take 100.0000 percent, since the government's share of a total loss is everything, and payback null.",
  "Take null and payback \"Year 0\", because one row has no crossing.",
  "Take 125.0000 percent, because the contractor's total is negative, and payback null."],
 "Take passes 100 when the contractor's total is negative but there is value to share; with no revenue there is nothing to share and the engine prints null.")

q(2,
 "AKATA's KPI line prints unit technical cost 40.006602 USD/boe, PV of capex 250909090.91 USD, discounted payback 3.961607 years and discounted take 76.1610 percent. Which one belongs to the Associate reading?",
 "The unit technical cost, which is a lifetime average with no clock in it.",
 ["The PV of capex, because capex is spent in the first two years and needs no discounting.",
  "The discounted payback, because payback is the tier's reading and the discounted form is more precise.",
  "The discounted take, because AKATA runs on the real basis and the real basis is the discounted one."],
 "The other three carry a rate; the Associate ledger ends before a discount rate is mentioned.")

q(3,
 "The Associate method builds one row by hand before trusting the engine. Why is the first year, 2029 on AKATA, the row to choose?",
 "It holds the capex, so a broken convention shows as the largest gap.",
 ["It is the base year, so no escalator has acted and every line is the typed value, which makes it the easiest row to reproduce.",
  "It is the trough of the cumulative, and a payback cannot be read until the trough is proven.",
  "It is the only row on which the real and nominal columns agree, so the basis cannot confuse the check."],
 "The base year also hides the escalators, which is why the second proven row is 2030: applied price 83.640000, opex 24720000.00, net 31746007.20.")

q(1,
 "A hand-built AKATA 2029 row prints a royalty smaller than 27904800.00 USD and a tax larger than 45250880.00. Which convention was broken?",
 "The royalty was taken off something net, and because its deduction against tax shrank with it, the tax grew.",
 ["Depreciation was charged to cash, which lowers the net and forces the tax up to balance the row.",
  "Capex was deducted from the tax base, which removes the royalty's share of the base.",
  "The working interest was applied to the royalty and not to the tax."],
 "The ledger looks plausible and every downstream number is wrong; the fix is the base, which is the 186032000.00 of sales and nothing smaller.")

q(0,
 "The course calls the null take on zero_rates_capex_only a truer answer than any percentage. Why?",
 "There is no value to share, and a number would describe a share of nothing.",
 ["Because the engine cannot compute a ratio when the working interest is not set, and null flags the missing field.",
  "Because take is only defined on the real basis, and the case runs nominal.",
  "Because the case was refused at the door and null is what a refused KPI block prints."],
 "Reading what the engine refuses as carefully as what it returns is one of the three habits the tier carries into the others.")

q(2,
 "AKATA's real total of 117362408.71 USD is smaller than its nominal total of 141637829.18. Is the real total a discounted number?",
 "No. It is the same cash restated in 2029 money by the 3 percent inflation rate; the discounted reading is the NPV of 72534830.66.",
 ["Yes, because restating in base-year money and discounting are the same operation at the inflation rate.",
  "Yes, because the real column is the discounted_cash_flow column under another name.",
  "No, because the real total is the nominal total less the depreciation the horizon never reached."],
 "Real is a basis and discounting is a clock; the Associate tier names the basis and leaves the clock to the Professional tier.")

q(3,
 "A production sharing contract recovers cost from a pool before it shares profit. Would AKATA's JV ledger show such a pool?",
 "No. The JV regime is one royalty and one tax rate, and the pool belongs to a different regime and a different tier.",
 ["Yes, in the loss_carryforward column, which under JV is the cost pool waiting to be recovered.",
  "Yes, in the depreciation column, since the 255000000.00 spent less the 174000000.00 claimed is the unrecovered cost.",
  "Only when the economic limit is on, because the pool is what the limit test reads."],
 "AKATA's loss columns read 0.00 on every row, its royalty is one rate, its tax is one rate, and its field ends when its data ends.")

emit(Q, '/root/wt-ec7-recut/tools/course-banks/cashflow/beginner/ec1b_exam.json', expect_n=42)
finish()
