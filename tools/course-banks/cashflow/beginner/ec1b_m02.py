import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC1 cashflow, beginner tier, From Rows to Years. Reconstructed from the served rows (the applied
# migrations replayed on a local scratch database) with the EC7 PIA re-cut applied;
# written by tools/course-waves/cashflow/pia-recut/build.py. Edit the rows there, then re-run it.

q(1,
 "Which of these headers does the engine read as a volume column, and why?",
 "total_oil_bbl, because the suffix _oil_bbl closes the header; w1_oil_bbl_forecast fails because forecast follows the suffix.",
 ["w1_oil_bbl_forecast, because the well prefix and the oil suffix are both present and the trailing word is a label the engine carries past.",
  "oil, because the engine matches on the stream name and treats the unit suffix as optional.",
  "oil_price_usd_bbl, because it ends in _bbl and every _bbl column is a barrel."],
 "The suffix must be last and case does not matter, so OIL_BBL is the same column as oil_bbl while oil_price_usd_bbl, which ends in _bbl but not in _oil_bbl, is not a volume.")

q(3,
 "The alaoma_csv_ingestion upload has date=2027-01 with oil_bbl=100000 and date=2027-02 with oil_bbl=90000. What does the ledger read for 2027?",
 "Oil 190000.00 bbl in one row, because every volume in every row with the same year is added into that year.",
 ["Two rows, 100000.00 bbl and 90000.00 bbl, because each dated row becomes a row of the ledger and the year is a label on it.",
  "Oil 120000.00 bbl, because liquid_bbl is the larger volume column in the first row and the engine takes the total liquid.",
  "Oil 100000.00 bbl, because a second row in the same year needs a month_index before it can be added."],
 "The engine reads 2027 as oil 190000.00 bbl, gas 0.00 Mscf, condensate 0.00 bbl and water 45000.00 bbl, and nothing in that ledger knows it was uploaded monthly.")

q(0,
 "The same upload carries days_in_month, liquid_bbl, oil_rate_bopd and watercut_pct beside oil_bbl. What does the engine do with them?",
 "It carries them past unread, because none ends in a volume suffix.",
 ["It uses oil_rate_bopd and days_in_month to check oil_bbl and refuses the file if the product disagrees with the volume.",
  "It reads liquid_bbl as the sales volume and derives oil from it using watercut_pct.",
  "It refuses the file, since unrecognised columns beside a volume column are the ambiguity the ambiguous_cost_aliases message describes."],
 "Every silent drop is a check the reader makes on the annual volumes the engine reports back: 190000.00 bbl of oil against the spreadsheet's own sum.")

q(2,
 "The month_index_rows case uploads an opex row of total_opex_usd=1000000 at month_index=13 with base_year 2027. Which ledger year does it join?",
 "2028, because month_index 13 is the first month of the year after base_year.",
 ["2027, because 13 is within the 24 months of the upload and the engine files all of them in base_year.",
  "2029, because month 1 is the year after base_year and month 13 the year after that.",
  "2027, because opex rows are matched to the production year they support, and production began in 2027."],
 "month_index counts months from the base year: 1 to 12 land in base_year and 13 to 24 in the next, so the ledger reads 2027 opex none and 2028 opex 1000000.00.")

q(0,
 "alaoma_csv_ingestion has capex rows dated 2027-01 for 30000000 and 2027-06 for 10000000. What does the ledger show?",
 "One 2027 capex of 40000000.00; the month locates the year and is then forgotten.",
 ["30000000.00 in 2027 and 10000000.00 in 2028, because a June date is past the middle of the year and rolls forward.",
  "Two capex entries in 2027, January and June, so that the mid-year convention can weight them by month.",
  "40000000.00 in 2027 with the June spend escalated by five months of the capex escalator."],
 "Dating happens before any price or escalator is applied, and rows in the same year add: the ledger has no months.")

q(2,
 "A production file has volumes but no year, date or month_index column. What does the engine do?",
 "It refuses with no_usable_date; it does not read a year from a filename, from row order or from a column called period.",
 ["It numbers the rows 1, 2, 3 as month indexes from base_year, since a row order is a date in all but name.",
  "It puts every row into base_year and proceeds, since base_year is the one year it is sure of.",
  "It refuses with no_production_rows, because rows without a date are not production rows."],
 "The engine does not infer a date, and the same refusal fires when the column exists but no row holds a usable value.")

q(1,
 "A reader numbers month indexes from the first production month, but production starts in the second year of the model. What happens to the ledger?",
 "Every volume, every escalated price and every cumulative figure shifts a year early, and the ledger looks complete.",
 ["The engine refuses with no_usable_date, because a month index that does not start at base_year is unusable.",
  "Nothing changes, because month indexes are relative to the first row of the file and the engine anchors them there rather than at base_year.",
  "The volumes shift a year early but the prices do not, since prices are applied by calendar year."],
 "The check is the plainest reading: month_index=13 is the first month of the year after base_year, so month_index=13 opex must show up in the second row, as the 1000000.00 does.")

q(3,
 "per_well_beats_total_rollup uploads total_oil_bbl=100000, well1_oil_bbl=60000 and well2_oil_bbl=40000 for 2027. What does the engine read, and by which rule?",
 "100000.00 bbl: the wells are summed and the total is dropped.",
 ["200000 bbl, since all three headers pass the volume test and every volume column in a year is added into that year.",
  "100000.00 bbl, read from total_oil_bbl, because a total column is preferred over the parts in the same way total_opex_usd is preferred among cost aliases.",
  "60000.00 bbl, the well nearest the dropped total."],
 "Had the total been added to the wells, revenue would have been double 7500000.00 and every reading built on it wrong by the same factor, and nothing in the KPI panel would have looked odd.")

q(0,
 "How does the cost side's rule for a total column compare with the volume side's?",
 "For volumes the total is ignored when wells exist; for costs a total_ prefixed column is excluded from the parts sum. In both, the pieces beat the rollup.",
 ["They are opposite: volumes take the total and drop the wells, while costs drop the total and sum the parts.",
  "They are the same: the total is added to the parts in both lanes, which is why usd_fallback_parts reports 25000000.00.",
  "Costs have no rule for totals, since a cost file carries one amount per row."],
 "drilling_usd=20000000 and facilities_usd=5000000 with total_usd=99 give capex 25000000.00, and the 99 never enters.")

q(1,
 "well1 and well2 sum to something other than total_oil_bbl. What does the engine report?",
 "The wells' sum, and nothing about the total it dropped: it does not warn, does not reconcile and does not use the total to check the wells.",
 ["A warning naming the total it dropped, so that the reader can decide which number the field actually sold.",
  "The total, since a disagreement means the wells are incomplete and the total is the safer figure.",
  "A refusal, because a total that disagrees with its parts is the ambiguity the engine will not resolve."],
 "Every one of those checks is one the reader does, by comparing the annual volume the engine reports against the file.")

q(3,
 "alaoma_csv_ingestion's opex rows carry fixed_opex_usd, variable_oil_usd, variable_water_usd, unit_opex_usd_per_bbl and total_opex_usd of 750000 then 740000. What is the 2027 opex?",
 "1490000.00, from total_opex_usd both times; the parts are not added and the unit rate is not multiplied by anything.",
 ["1000000.00, from fixed_opex_usd of 500000 in each month, because the preferred alias list begins with the fixed component.",
  "The total plus the parts, because a preferred alias takes the total and the *_usd fallback then adds every other cost column to it.",
  "The unit rate of 7.5 times the oil, because a per barrel column is the one tied to the volumes."],
 "A preferred alias, when present, is the amount; the rest of the row is carried past.")

q(2,
 "In usd_fallback_parts the capex row is drilling_usd=20000000, facilities_usd=5000000 and total_usd=99. If total_usd is renamed total_capex_usd, what does capex read?",
 "99, because total_capex_usd is a preferred alias, and a preferred alias when present is the amount while the parts are carried past.",
 ["25000000.00 still, because a total_ prefixed column is excluded from every sum whatever its full name.",
  "The row is refused as ambiguous_cost_aliases, because a preferred alias and two *_usd parts now hold different values.",
  "25000000.00, because the engine compares the alias against the parts and keeps the parts when they disagree."],
 "The fallback only runs when nothing preferred is there to stop it, so the same amounts under a different header give a different ledger.")

q(0,
 "A capex file headed category, date, spend is refused. What single change lets it through?",
 "Give the cost column a name ending in _usd, since the fallback sums *_usd columns and spend has no unit in its name.",
 ["Rename spend to cost, because the word cost is on the preferred alias list as cost_usd and the engine matches on the word and ignores the suffix.",
  "Add a total_usd column holding the sum, which the fallback prefers as the rollup.",
  "Nothing short of the exact header amount_usd, which is the one name a capex file must carry."],
 "The unit is in the header or the column is not a cost; Cost_USD in case_insensitive_headers was read as 30000000.00 because case is ignored but the suffix is not.")

q(1,
 "usd_fallback_parts, alaoma_csv_ingestion in both its production and its opex file, per_well_beats_total_rollup and case_insensitive_headers each dropped a column silently. What did a reader watching only for refusals see?",
 "Five successes: nothing was refused, every run produced a clean ledger, and the drops show only in the annual volumes, capex and opex read back against the file.",
 ["Four warnings, one per case, since a dropped column is logged against the row it came from even when the run proceeds, and the KPI panel carries a count of the columns it did not read.",
  "One refusal, the ambiguous_cost_aliases case, since two of the dropped columns were cost aliases holding values different from the one the engine read, and that is the ambiguity the message names.",
  "Nothing at all, because the KPI panel goes blank when a column is dropped."],
 "The refusals guard the door; once inside, the engine drops what it does not recognise without a word, and those drops are the failures to worry about.")

q(2,
 "per_well_beats_total_rollup was run with no opex file at all. What does the refusal machinery do?",
 "Nothing: the run proceeds with total opex 0.00, because the refusals check only that a recognised header exists, never that opex is present or the number under it right.",
 ["It refuses with opex_no_cost_column, because a missing opex file has no cost column to recognise.",
  "It refuses with no_production_rows, since a run needs all three files before it can build a ledger.",
  "It runs, but fills opex from unit_opex_usd_per_bbl times the annual volumes, the way the fallback sums *_usd parts when no preferred alias is present, so that the ledger is not left without a cost."],
 "The same door lets an amount_usd column holding thousands of USD through at one thousandth of its value; after the door, the engine believes you.")

emit(Q, '/root/wt-ec7-recut/tools/course-banks/cashflow/beginner/ec1b_m02.json', expect_n=15)
finish()
