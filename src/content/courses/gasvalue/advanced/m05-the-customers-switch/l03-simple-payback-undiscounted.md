# Simple payback, undiscounted

The bus operator's last question is how long the conversion takes to pay for itself. `conversionEconomics` answers with a simple payback, and it says on the result what kind of payback that is.

{{panel:gasvalue-rollout-explorer}}

## The bus's payback

Conversion 1200000 naira; extra maintenance 60000 naira a year. The engine returns:

| field | value |
| --- | --- |
| annualSaving (after maintenance) | 3825710.1400 |
| simplePaybackYears | 0.3137 |
| conversion cost over annualSaving | 0.3137 |
| paybackNote | Simple payback is undiscounted. Anything needing a discount rate belongs in the sanctioned economics engine. |

annualSaving is the saving after maintenance: 3825710.1400 naira a year. simplePaybackYears is 0.3137, printed in years to four decimals. It is the conversion cost over the annual saving, and the course prints that division beside the engine at the same 0.3137.

## The cash flow the engine hands on

The payback is simple and undiscounted. The annual cash flow the engine hands on:

| annualCashFlow | value |
| --- | --- |
| year0 | -1200000.0000 |
| recurring | 3825710.1400 |

year0 is the conversion, -1200000.0000 naira, as a negative. recurring is the annual saving after maintenance, 3825710.1400 naira. These two figures and the payback, 0.3137 years, are the whole of what this course reads about the bus's money.

## Undiscounted, by the engine's own note

The paybackNote is the engine's statement: "Simple payback is undiscounted. Anything needing a discount rate belongs in the sanctioned economics engine." This course grades the simple payback. A present value, a rate of return or any other discounted figure is outside it, and the note names where that work belongs.

In practice, the Economics module is where this academy teaches discounting.

## When there is no saving

With CNG at 1100 naira a kg there is no saving. The engine returns annualSaving -191681.1600, simplePaybackYears null, and the note "The conversion does not save money at these prices, so there is no payback to report."

A negative saving gives no payback. The engine prints null in the payback field and gives its reason in its own sentence. The saving is printed as a figure, -191681.1600 naira a year, and the payback is printed as null. A reader who writes a figure in the payback field on this case has written one the engine did not print.

## The payback beside the ratio

The payback moves with the efficiency ratio, as the last lesson showed: 0.3421 years at 0.8, 0.3137 at 0.92, 0.3004 at 1. With a measured consumption of 9.5 kg per 100 km it is 0.3030. Each is simple and undiscounted, and each rests on a year0 of -1200000.0000 naira.

## The emissions line

On the same result the engine prints kgCo2eAvoidedPerYear, 2365.8000, on illustrative emission factors of 2.3 kg CO2e a litre of PMS and 2.75 a kg of CNG. The course reads it as a printed figure. In practice, a fleet's emissions as an inventory line belong to the carbon course (`carbon`).

## What the switch refuses

| probe | engine |
| --- | --- |
| no annual distance | REFUSED: Annual distance, base consumption and both fuel prices are required. |

In practice, an operator who wants the conversion discounted takes the year0 and recurring figures into the economics tools.

## In the explorer

Open the customer's switch. Read annualSaving, simplePaybackYears, the paybackNote and the cash flow. Set the CNG price to 1100 and read the saving, the payback and the note.

## Exercise

Read the bus's result: annualSaving 3825710.1400 naira, simplePaybackYears 0.3137, the cash flow year0 -1200000.0000 and recurring 3825710.1400, and the paybackNote. Then read the case at 1100 naira a kg: annualSaving -191681.1600 and simplePaybackYears null. Say what the note says about discounting, what the engine hands on, and what it prints in the payback field when there is no saving.
