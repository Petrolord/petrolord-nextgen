# Contractor net cash flow

One row of the ledger closes on one line: cost oil plus the profit share, less tax, less opex, less capex, and every term of it is printed.

{{panel:ec-regime-explorer}}

## The line

For "USA - Gulf of Mexico" on the Designer's default project, year 1 recovers 220.9910, earns no profit share because profit oil is 0.0000, pays tax of 0.0000, and carries opex of 31.0027 and capex of 500.0000. `contractorNCF` reads -310.0117.

| year | costRecovered | profitOil | tax | opex | capex | contractorNCF |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 220.9910 | 0.0000 | 0.0000 | 31.0027 | 500.0000 | -310.0117 |
| 2 | 198.6260 | 0.0000 | 0.0000 | 28.8480 | 0.0000 | 169.7780 |
| 3 | 167.1490 | 11.3804 | 2.3899 | 26.9153 | 0.0000 | 149.2243 |
| 4 | 25.1816 | 135.2891 | 28.4107 | 25.1816 | 0.0000 | 106.8784 |
| 5 | 23.6264 | 131.6841 | 27.6537 | 23.6264 | 0.0000 | 104.0304 |
| 25 | 11.5851 | 8.1761 | 1.7170 | 11.5851 | 0.0000 | 6.4592 |

From year 4 on, the recovered figure and the opex figure are one number, 25.1816 in year 4 and 23.6264 in year 5, so they cancel and the year is worth the profit share less the tax: 106.8784 on a residual of 135.2891 taxed at 28.4107. Year 2 is the largest positive row of the life at 169.7780 while earning no profit oil at all, because it recovers 198.6260 against opex of 28.8480 and pays no tax.

## Where royalty went

Royalty never appears as a subtraction on this line. Year 1 sold 271.9889 and paid royalty of 50.9979, both printed on the row, but the royalty came out before cost recovery began, so the 220.9910 of cost oil is already net of it. Subtract it a second time and year 1 is 50.9979 too low, with a life total to match.

## The same year under harsher terms

"Angola - Deepwater PSC" runs the same field on the same gross revenue of 271.9889, opex of 31.0027 and capex of 500.0000, and closes year 1 at -323.6112 rather than -310.0117, while the state's slice rises from 50.9979 to 64.5974. Nothing in the project changed: a 50 percent recovery limit and a split that keeps part of the residual for the state did all of it.

## When the line never turns

A published case runs the test project with capex of 20000. Life profit oil is 0.0000, tax is 0.0000, the contractor recovers 6126.0445 of cost and the life closes at -15724.0151 with an unrecovered pool of 15724.0151. The two are one figure with opposite signs: when the residual never appears, the contractor's life is exactly the cost that recovery could not reach. Payback is null, and the state still collects royalty of 875.1492.

## The mistake

Two errors are common and both look plausible on the page. The first treats the unrecovered pool as a cash cost, subtracting 310.0117 from a year that has already paid the 500.0000 the pool records. The second charges capex again in a later year, because the project plainly kept spending in life; the sandbox does not model that, and every row from year 2 to year 25 prints capex 0.0000.

## What it refuses

The line has no clock. Year 25's 6.4592 is added to year 2's 169.7780 at face value in the life total of 980.9313, and the net present value the engine reports at 10 percent for the same ledger is 382.0660. There is no abandonment row, no working interest, and no partial year.

## Exercise

Rebuild year 4 from its components and confirm 106.8784, then say why the recovered figure and the opex figure are equal in that year. Then take year 1 and say what the answer becomes if royalty is subtracted a second time, and how you would spot that error in somebody else's ledger.
