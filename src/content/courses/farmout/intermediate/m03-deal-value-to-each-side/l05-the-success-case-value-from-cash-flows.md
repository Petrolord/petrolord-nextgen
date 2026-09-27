# The success-case value from cash flows

{{panel:farmout-deal-calculator}}

A deal call takes the success-case value in one of two forms: a single NPV stated directly, or the success case's net cash flows with a discount rate and a base year, which the engine discounts itself. This lesson reads both forms on the Ekene Deep deal, shows how each party's participating interest of the value is scaled, and names the refusals a success-case value can meet.

## Two forms, one field

The engine refuses a missing success-case value and names both forms it accepts:

> project.successValue must be an object { npv } or { cashFlows, discountRate, baseYear }; got nothing

The Ekene Deep deal states cash flows from 2029 to 2045, discounted at 0.100000 (a fraction) to 2027. The engine's reason prints the value it computed:

> success-case value at 100%: 271250337.04 (the canonical npv of the stated cash flows at 0.1 to 2027); chance of success 25%

The field behind that reason is 271250337.041807. The cash flow course teaches discounting and NPV; this course imports the canonical npv and quotes what it returns.

## Scaling to a participating interest

Each party's share of the success-case value is the canonical working-interest scaling of the cash flow course's engine:

> every interest of the success-case value is the canonical applyJV of engines/economics/cashflow.ts on the 100% value (or on each year's net flow before the canonical npv), with no royalty, tax or cost

No royalty, tax or cost enters the scaling: the success-case value is taken as stated, and the Petroleum Industry Act course teaches the fiscal terms that would sit inside it.

## The same deal with the NPV stated

The course also states the Ekene Deep deal with the success-case value as a single NPV of 271250000.000000, the fixture's figure rounded to the nearest thousand. Every other term is the same.

| position | EMV with cash flows stated | EMV with the NPV stated |
| --- | --- | --- |
| EKO drills alone | 18418808.982316 | 18418750.000000 |
| EKO after the farm-out | 19833033.704181 | 19833000.000000 |
| FIN farms in | -1806224.721864 | -1806250.000000 |

The EMVs differ by the rounding, scaled by each participating interest and the chance. They are figures of two sets of inputs, and a report quotes each with its own. The best actions are the same on both: EKO farms out and FIN declines.

## What the engine refuses

A box that states both forms is refused, and the message prints the cash flows it found:

> project.successValue.cashFlows must be left out when npv is stated; got [{"year":2029,"net":-240000000},{"year":2030,"net":-360000000},{"year":2031,"net":-120000000},{"year":2032,"net":250000000},{"year":2033,"net":250000000},{"year":2034,"net":220000000},{"year":2035,"net":193600000},{"year":2036,"net":170368000},{"year":2037,"net":149923840},{"year":2038,"net":131932979},{"year":2039,"net":116101021},{"year":2040,"net":102168898},{"year":2041,"net":89908630},{"year":2042,"net":79119594},{"year":2043,"net":69625242},{"year":2044,"net":61270212},{"year":2045,"net":53917786}]

Cash flows need a stated rate, a fraction:

> project.successValue.discountRate must be a finite number above -1 (a fraction: 0.1 is 10%); got nothing

And their years run without a gap:

> project.successValue.cashFlows[1].year must be 2030, the year after 2029 (years are consecutive); got 2031

## Exercise

Work in the course's own deal calculator.

1. Open the view "The value of the deal to each side" and start from "The Ekene Deep deal, cash flows stated". Read the success-case value tile and the first reason line.
2. Start from "The same, the success-case value stated". Compare the three EMVs with the table and confirm that both best actions are unchanged.
3. Back on the cash flows start, add `"npv": 271250000.000000,` as the first entry inside `"successValue"` in the box and read the refusal. Remove it again.
4. Delete the `"discountRate"` line from the box and read the refusal. Restore it and change the second year to 2031.
