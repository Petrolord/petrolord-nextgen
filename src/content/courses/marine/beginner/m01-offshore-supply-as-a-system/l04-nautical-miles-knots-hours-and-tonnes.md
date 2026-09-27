# Nautical miles, knots, hours and tonnes

{{panel:marine-voyage-calculator}}

A voyage plan mixes distances, speeds, times, areas, weights and volumes, and every figure is only as good as its unit. This lesson fixes the units the engine reads, the first calculation it makes, and how it compares two figures.

## The units

Distances are in nautical miles (NM) and speeds in knots, which are nautical miles an hour. Times are in hours unless a name says days. Deck areas are in square metres (m2), weights and fuel in tonnes (t), bulk in cubic metres (m3), and densities in tonnes a cubic metre. Money is in one currency, whatever unit the caller uses: the Ekene fuel price is 870 a tonne, and the course reads it as dollars because Skoko et al. print USD 870.

## Sailing hours are distance over speed

The first calculation is the simplest. A leg's calm hours are its distance in NM divided by the speed in knots. The PSV sails the Ekene milk run at 11 knots, leg by leg:

| leg | from | to | NM | calm hours |
| --- | --- | --- | --- | --- |
| 1 | base | EKA | 62.000000 | 5.636364 |
| 2 | EKA | EKJ | 9.000000 | 0.818182 |
| 3 | EKJ | EKB | 12.000000 | 1.090909 |
| 4 | EKB | EKF | 28.000000 | 2.545455 |
| 5 | EKF | base | 95.000000 | 8.636364 |

The voyage sails 206.000000 NM in all. Days are hours over 24, so a vessel at 10 knots covers 240.000000 NM in a day of sailing, the figure Skoko et al. print for a PSV at its economic speed (their Table 4).

## No speed curve

The engine reads one stated speed and applies it to every leg. It fits no curve of speed against fuel or sea state. If a vessel sails slower loaded than empty, the planner states the speed that fits the voyage.

## Comparing two figures

Computers hold decimals as binary fractions, so a sum such as a tenth plus two tenths comes back a hair above three tenths. The engine therefore treats two figures as equal when they agree to 12 significant digits. A load passes a capacity check when its twelve-digit figure is at or below the capacity's, and a count rounded up takes the ceiling of the twelve-digit figure. You will see this tie rule act on the binding constraint in module five.

## How figures are printed

Every numeric field the engine returns keeps full precision, and the course quotes it to six decimals. Inside a sentence the engine writes, such as a reason, it rounds money to the cent and a computed quantity to six decimals, half away from zero, with trailing zeros dropped; a stated input prints as you typed it. So a reason may read "540 m2 of 600 m2" while the field beside it is 0.900000.

## Exercise

In the voyage and fleet calculator, set View to "The voyage plan" and Start from to "Ekene PSV milk run, rainy season". Before you look, divide each leg's NM by 11 and write down its calm hours. Then check your figures against the legs table the panel prints. Next, change "Speed, knots (stated)" from 11 to 10 and predict, before reading the panel, whether the sailing hours and the total fuel rise or fall, and whether the binding constraint changes. Check your prediction, then restore the speed to 11.
