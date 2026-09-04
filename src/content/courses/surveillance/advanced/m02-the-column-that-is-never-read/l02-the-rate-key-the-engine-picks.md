# The rate key the engine picks

One line in `detectExceptions` decides which column the whole surveillance list is built on: `const rateKey = isInjector ? 'winj' : 'oil'`. Both of those are calendar volumes over a row.

{{panel:pd-reading-explorer}}

## What the choice commits

`windowMean` is called with that key, so the recent mean and the baseline mean that decide `rate_drop`, `shut_in` and `injection_drop` are means of volumes booked against a date. The producing-day rates sit on the same points and are not offered to the comparison at all.

Only two of the seven checks ride on that key. `watercut_rise` and `gor_rise` average ratios that `derivePoint` formed row by row, and `downtime` averages `hoursOn` directly, so the hours are in the module and are simply not in the rate comparison.

The module header calls the producing-day rate the number that says how the well is performing as opposed to how much it made. The function whose entire job is to say which wells have changed reads the other one.

## What the message then prints

Golden exception 4 on the published field is P-5, type `rate_drop`, severity high, value 100.000000000000 against a baseline of 300.000000000000, and the engine re-run prints `Oil down 67%: 100 vs 300 stb/d baseline.` The unit in that sentence is hard-coded. The quantity behind it is a mean of calendar volumes in stb over a row.

On a daily ledger with full uptime the two coincide and the sentence is harmless. On anything else it is a volume wearing a rate's unit.

## The published monthly well

P-3 files six rows. Five of them book 15000.000000 stb over the period and the last books 9000.000000 stb over the period, with `hoursOn` null on every one, so `oilPd` comes back equal to the period volume: 15000.000000 on the full rows. `derivePoint` has no way to know a row covers a month.

The derived exception reads type `rate_drop`, severity medium, value 12000.000000000, baseline 15000.000000000, message `Oil down 20%: 12,000 vs 15,000 stb/d baseline.` A month of oil is printed with stb/d after it, and the comparison behind it is between two period volumes.

## What no return says

An exception row carries a type, a severity, a value and a baseline. It does not carry the key those numbers came from, the window length that produced them, or the hours behind them. Two wells on one field can be compared over different window lengths, because each well widens its own windows on its own cadence, and nothing in the row says which window it used.

## The mistake

Reading the value and baseline of a `rate_drop` as rates because the message says stb/d, then dividing them to get a per cent change in well performance. The ratio is a ratio of calendar volumes. It answers how much less the well booked, and on a well whose uptime moved it does not answer how the well is producing when it is producing.

## Exercise

Read P-3 in the panel and record the period volume on a full row and on the last row.

Then say what the message would have to print instead of stb/d to be true of the quantity it is actually comparing.
