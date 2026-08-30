# The fixtures this course runs

Two wells, two muds, one string and one bit.

{{panel:hy-rheology-explorer}}

## The four combinations

| case | well | mud | density |
|---|---|---|---|
| slant, KCl polymer | 40 degree slant to 3000 m | kcl_polymer | 1440 kg/m3 |
| slant, light water-based | the same well | light_wbm | 1200 kg/m3 |
| horizontal, KCl polymer | horizontal to 2800 m | kcl_polymer | 1440 kg/m3 |
| horizontal, light water-based | the same well | light_wbm | 1200 kg/m3 |

Two wells crossed with two muds. Every other input is shared.

## The muds

| reading | kcl_polymer | light_wbm |
|---|---|---|
| 600 rpm | 64 | 45 |
| 300 rpm | 38 | 28 |
| 6 rpm | 7 | 5 |
| 3 rpm | 6 | 4 |

Four dial readings each, from a Fann viscometer. That is what a mud engineer measures and it is the whole of what the rheology models get.

## The string and the bit

Drill collars, heavy weight drill pipe and drill pipe, the same string the torque and drag course runs. The bores matter here in a way they did not there: the collars have an inside diameter of 0.05715 m, which is a two and a quarter inch bore, and that restriction is where most of the pipe pressure loss happens.

The bit carries a total nozzle flow area of 0.000461814 m2 with a discharge coefficient of 0.95.

## The flow rates

The lessons run at 0.015, 0.025 and 0.035 m3/s, which is 15, 25 and 35 litres a second, or roughly 240, 400 and 550 gallons a minute.

## The trip speeds

The lessons run surge and swab at 0.2, 0.5 and 1.0 m/s.

## What the capstone runs

A different mud, a different flow rate and a different trip speed from any of the above. That is deliberate: every graded number is one you have to produce rather than one a lesson printed.

## Exercise

Open the panel and read the three fitted models for both muds.

Note which parameters get larger with the heavier mud and which get smaller, and see whether the pattern is what you would expect from the dial readings.
