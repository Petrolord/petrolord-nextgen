# The fuel bill

{{panel:marine-voyage-calculator}}

Fuel is the running cost a voyage plan can put a figure on. The engine prices it in one step, the tonnes times a stated price a tonne, and this lesson reads that bill on the Ekene milk run and on the published figures the engine reproduces.

## Tonnes times the price

The fuel cost is the voyage's fuel in tonnes times the stated fuel price a tonne. The price is an input with no assumed value, in whatever currency the plan uses. The Ekene fixture states 870 a tonne, the price Skoko et al. use.

| case | total t | fuel cost |
| --- | --- | --- |
| Ekene PSV milk run, calm | 16.623636 | 14462.563636 |
| Ekene PSV milk run, factor on sailing and field | 19.876364 | 17292.436364 |
| Ekene PSV milk run, factor on every activity | 19.948364 | 17355.076364 |

The rainy-season allowance on sailing and field time adds 2829.872727 to the calm voyage's bill. Adding port time to the allowance adds 62.640000 more, because port burns only 0.03 t an hour.

## The published checks

Two sets of printed figures run through the engine and come back exactly.

A day of a PSV (Skoko et al., Tables 1 and 4). One dedicated voyage of 120 NM each way at 10 knots, with 24 port hours, burns of 0.5 and 0.03 t an hour and a price of 870, returns 24.000000 sailing hours, 12.000000 t of sailing fuel, 0.720000 t of port fuel and a fuel cost of 11066.400000. At the price, the sailing fuel is 10440.000000 and the port fuel 626.400000, the two daily figures the paper prints.

The AHTS optimal month (Skoko et al., Tables 5 and 7). Reading the maritime activities as 168 field hours at 0.5 t an hour, the navigation as a dedicated voyage of 79.2 NM each way at 11 knots, and 57.6 port hours, the engine returns 14.400000 sailing hours, 92.928000 t and a fuel cost of 80847.360000, the printed figure.

## A printed total the rounded days do not reproduce

The same tables give the PSV's optimal month too, with a printed fuel cost of USD 186,274.10. Put through the engine, the rounded days the table prints give 186214.104000, which is 59.996000 short. The rounded days cannot reproduce the printed total, so the course uses the AHTS row and leaves the PSV total out. Checking a source means running its inputs, and sometimes the inputs as printed do not reach the figure printed beside them.

## What the bill leaves out

The fuel bill is the only cost the engine computes. Vessel hire, port fees and the contract for the vessel are the procurement course's subject, and discounting a stream of such costs belongs to the cash flow course.

## Exercise

In the voyage and fleet calculator, set View to "The voyage plan" and Start from to "A day of fuel (Skoko Table 1)". Check the Total fuel cost tile against 11066.400000, then multiply the sailing and port fuel in the fuel table by 870 and compare with the two daily figures above. Set Start from to "The AHTS optimal month (Skoko Table 7)" and check its fuel cost. Finally, return to "Ekene PSV milk run, rainy season", change "Fuel price a tonne (stated)" from 870 to 0 and note which figures move and which do not.
