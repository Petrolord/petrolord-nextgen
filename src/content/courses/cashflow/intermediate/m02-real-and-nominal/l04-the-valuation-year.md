# The valuation year

NPV is a value at a date. Move the date and the value moves with it, without a single row changing.

{{panel:ec-time-explorer}}

## The published case

valuation_year_forward is the two-row JV case with one added key, valuation_year=2031, one year after the base year of 2030. The rows are unchanged: a 2030 flow of minus 12500000.00 and a 2031 flow of 37500000.00.

| year | net_cash_flow | discounted, valued 2030 | discounted, valued 2031 |
| --- | --- | --- | --- |
| 2030 | -12500000.00 | -12500000.00 | -13750000.00 |
| 2031 | 37500000.00 | 34090909.09 | 37500000.00 |

Valued in 2030, the 2031 flow is one year away and shrinks. Valued in 2031, the 2031 flow is at the valuation date and stands as it is, while the 2030 flow is a year in the past and compounds forward by 1.1 to minus 13750000.00. The NPV moves from 21590909.09 to 23750000.00, and it is the same statement about the same rows, made a year later.

## AKATA valued later, with nothing sunk

| valuation_year | NPV | IRR, percent | payback, years | total capex |
| --- | --- | --- | --- | --- |
| 2029 | 72534830.66 | 29.2361 | 3.46 | 255000000.00 |
| 2030 | 77464382.26 | 29.2361 | 3.46 | 255000000.00 |
| 2031 | 82728951.93 | 29.2361 | 3.46 | 255000000.00 |
| 2032 | 88351307.89 | 29.2361 | 3.46 | 255000000.00 |

Each step forward multiplies the NPV by one year at the applied real rate of 6.796117 percent, because AKATA is on the real basis. Total net cash flow stays 117362408.71, rows flagged sunk stay 0, and sunk_net_cash_flow is not reported. Nothing was dropped. The 2029 capex is still in the ledger, compounded forward as a cost paid before the valuation date.

## What the valuation year is for

A field sanctioned in 2029 and reviewed in 2031 is worth stating at 2031, because that is the sum a board in 2031 would compare against that year's alternatives. A reader comparing two projects with different first years brings both to one valuation year first, or the earlier one carries a hidden discount.

## The mistake

The careful mistake is to expect that valuing from 2030 removes 2029. It does not; it revalues 2029. The 2029 flow of minus 121123680.00 becomes a larger negative when carried forward, exactly as the 2030 row of the published case becomes minus 13750000.00 rather than minus 12500000.00. So the NPV rises by compounding, not by forgiveness: 77464382.26 is 72534830.66 one year older, not 72534830.66 with the capex forgotten. Forgetting the capex is a different setting, treat_prior_as_sunk, and it produces 206819768.67, which is nowhere near.

A reader who sees 77464382.26 against 72534830.66 and reports that the project improved has confused a change of date with a change of prospects. IRR did not move, payback did not move, the total did not move. Only the date on the statement moved.

The second mistake is the reverse: expecting the NPV to grow at the nominal 10 percent. On the real basis it grows at 6.796117 percent, because that is the rate the real flows are discounted at. On a nominal run it grows at 10.000000 percent, as the published case does, from 21590909.09 to 23750000.00.

## What the valuation year refuses

It refuses to change any row: net_cash_flow for 2030 in the published case is minus 12500000.00 under both valuations, and the fiscal columns, royalty 20000000.00 and tax 32500000.00, are identical. It refuses to move the payback, which is measured from the first row, and the IRR, which is a property of the row vector and not of the date. It refuses to be a sunk flag; on its own it excludes nothing. And when it is not set it is the base year, which is why AKATA reads the same under valuation_year 2029 and under no valuation year at all.

## Exercise

Read the NPV of AKATA valued in 2029 and in 2031 and confirm the growth is two years at the applied real rate. Then say why total net cash flow did not change.
