# Working the capstone

An expert capstone asks for a portfolio's risk and an AFE's control in one answer. It is worked in a fixed order: the inputs, the set and its flags, the risk summary with its settings, the AFE as of its date, the shares, then every number this tier distrusts. The order is worked here on the teaching fields.

{{panel:ec-governance-explorer}}

## The inputs before any run

Read every project's capex, pos, npv_p50 and fail_cost before running anything. A negative capex refuses with PortfolioInputError; a pos of 1.4 or "n/a" does not, and on the published case quietly returns 80.0000. Write one risked EMV by hand for the project the answer leans on most. On OKONO that is OK-3: 0.250000 x 420.0000 - 0.750000 x 85.0000 = 41.2500, and its success-case NPV of 420.0000 is not its value. On the AFE side, check that every progress is 0 or more, and point out any above 100 percent, which the engine accepts.

## The set and its flags

Run the limit in the explorer and read four fields beside the set: capex, risked EMV, resolution and overLimit. OKONO at 450.0000 funds OK-1 + OK-3 + OK-4 for 291.0000 at resolution 1.0000 with overLimit false. Set it beside the ranking by EMV per million USD, which funds OK-1 + OK-4 + OK-5 at 287.7500. When the resolution is coarser than 1 million USD per cell, say whether overLimit fired, and say that an undershoot (D4) or a free project charged a cell (D2) would not be flagged.

## The risk summary with its settings

| limit | set | emv | stdDev | P(loss) | P90 | P10 |
| --- | --- | --- | --- | --- | --- | --- |
| 450.0000 | OK-1 + OK-3 + OK-4 | 291.0000 | 271.6522 | 0.123600 | -18.3574 | 738.1043 |

Write the seed and the iterations beside every simulated number, here 20260829 and 10000, and write the correlation used, saying it is one average number. The Low case P90 comes first and is the smaller NPV. A P(loss) quoted without its seed could be 0.119100 or 0.128500 on the same set, and at 1000 iterations its standard error is 0.010050. P-labels go on portfolio NPV outcomes and nowhere else.

## The AFE as of its date

State the as-of date first, then the rule. OFON-1 as of 2027-08-15 has an EAC of 27600000 from one forecast rule, a variance of -550000, earned value 15231500, CPI 1.009377 and SPI 0.872063. Name each line whose forecast is not its budget: CSG-02 forecasts its actual plus commitment and CMT-03 its entered 1400000. Say which numbers move with the date, planned value and SPI, and which do not.

## The shares

Give every party's working interest and share, the operator's remainder, and valid. OFON-1's operator holds 25.0000 percent of 27050000, a share of 6762500, and valid is true. When valid is false, quote the engine note and bill nobody.

## Before you submit

| Check | What passing looks like |
| --- | --- |
| Inputs | refusals named, clamps spotted, one risked EMV by hand |
| Set | capex, EMV, resolution and overLimit read |
| Risk | seed, iterations and correlation beside P(loss) and the P90 |
| AFE | as-of date, EAC rule, CPI beside the actuals total, SPI |
| Shares | interests, operator remainder, valid and any note |
| Distrust | CPI before spend, undated invoices, the plan's last point, the standard error |

## The mistake

The careful mistake is a correct number with its condition missing. A P90 without a seed, an SPI without an as-of date, a CPI without the actuals total and a set without its overLimit are each right, and each loses marks. The other is quoting the S-curve's last Forecast point, 24949669 on OFON-1, as the EAC.

## Exercise

Work OKONO at 600.0000 and OFON-1 in this order: the set and its flags, the risk summary with its settings, the AFE as of 2027-08-15, and the operator's share. Say which results would change under a different seed and which would not.
