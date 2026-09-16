# Capex lands in year one

Capex is three buckets added together, multiplied by a scaling factor, and charged entirely to the first row. There is no schedule and no input that would create one.

{{panel:ec-regime-explorer}}

## Three buckets, one row

Capex is `drilling` plus `facilities` plus `subsea`, multiplied by the capex multiplier, and the whole of it is charged in year 1. The Designer's default project declares drilling 300, facilities 150 and subsea 50 million USD, so year 1 carries 500.0000 million USD and years 2 through 25 each carry 0.0000. ODIDI declares drilling 260, facilities 120 and subsea 40 million USD, giving 420.0000 million USD in year 1 and nothing after.

## What that does to the first row

On the default project under "USA - Gulf of Mexico", year 1 has gross revenue of 271.9889 million USD, royalty of 50.9979 million USD, opex of 31.0027 million USD and capex of 500.0000 million USD. Contractor net cash flow is -310.0117 million USD and cumulative net cash flow is the same figure, because there is nothing before it.

Cumulative net cash flow reaches 8.9905 million USD in year 3, which is why payback for that regime is year 3. One row of spending sets the payback year for the whole life.

## The multiplier

The capex multiplier scales the total before it is charged. On the published test project the flat regime returns an NPV of 1262.3470 million USD. At a multiplier of 1.3 the same regime returns 1062.6176 million USD, and at 0.7 it returns 1460.6941 million USD. None of the three reports an internal rate of return: at 0.7 the net present value is zero at -20.4852 percent inside the searched band and again at 1095.4783 percent above it, so the engine returns null with the status multiple-roots rather than naming a rate. The multiplier is the only capex control there is.

## The mistake

The careful reader spreads the spend, because a 500.0000 million USD deepwater development is not built in twelve months. The sandbox refuses a capex schedule outright and has no field to hold one. Faking a schedule by lowering the multiplier changes the total, not the timing, and quietly answers a different question.

The consequence is discounting. All 500.0000 million USD sits at the year 1 exponent, so its present value is as large as it can be, while the revenue it buys is spread over 25 discounted years. Every NPV here is harsher on capital, and any rate of return read off it more sensitive to the capex number, than a phased model would be.

## What capex refuses

It refuses a schedule, a contingency, an abandonment provision at the end of life, and depreciation. Capex never becomes a tax shield in its own right; it enters the ledger once as cash and once through the cost recovery pool, and nowhere else.

## Exercise

Write the capex row for years 1, 2 and 25 of ODIDI. Then say what the year 1 contractor net cash flow of -310.0117 million USD on the default project would need in order to become a phased number, and why no combination of the existing inputs can produce it.
