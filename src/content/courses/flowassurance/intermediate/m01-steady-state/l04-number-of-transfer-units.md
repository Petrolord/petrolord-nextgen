# Number of transfer units

Two lines with the same ntu arrive at the same fraction of their inlet excess whatever their diameter, their rate or their insulation. It is the only group the arrival depends on.

{{panel:pd-line-explorer}}

## The group, and what it swallows

ntu is the length measured in relaxation lengths, U pi D L over m Cp. Six quantities go in and one dimensionless number comes out, and once the inlet and the ambient are fixed, that number decides the arrival by itself. On the published fluid at 120000.0 lb/hr and Cp 0.5 through the insulated build, the ntu values at one mile, five miles and twenty miles are 0.186519407987, 0.932597039935 and 3.730388159740, and the arrivals follow them.

## The whole exponential, as a sweep

Derived sweep points on a 180.0 degF inlet against a 40.0 degF ambient. These are generated rows, not published cases.

| ntu | exp(-ntu) | Arrival, degF | Excess remaining, degF |
| --- | --- | --- | --- |
| 0.1000 | 0.904837418036 | 166.6772385250 | 126.6772385250 |
| 0.2500 | 0.778800783071 | 149.0321096300 | 109.0321096300 |
| 0.5000 | 0.606530659713 | 124.9142923598 | 84.9142923598 |
| 1.0000 | 0.367879441171 | 91.5031217640 | 51.5031217640 |
| 1.5000 | 0.223130160148 | 71.2382224208 | 31.2382224208 |
| 2.0000 | 0.135335283237 | 58.9469396531 | 18.9469396531 |
| 3.0000 | 0.049787068368 | 46.9701895715 | 6.9701895715 |
| 4.0000 | 0.018315638889 | 42.5641894444 | 2.5641894444 |
| 5.0000 | 0.006737946999 | 40.9433125799 | 0.9433125799 |

## Where the 63 percent comes from

At ntu exactly 1 the retained excess is exp(-1) = 0.367879441171, so 63.21205588 percent of it has gone. That is the definition of the relaxation length restated: one relaxation length of pipe is one transfer unit, and the number in the module header is this row.

## Past four there is nothing left to insulate for

At ntu 4.0000 the fluid still holds 2.5641894444 degF of excess over ambient, and at 5.0000 it holds 0.9433125799 degF. Spending on U or on rate to move between those two rows moves an arrival by less than a degree. A line short against its relaxation length arrives hot whatever the ambient is, and a line long against it arrives at ambient whatever it started at, and the interesting design range is the middle of this table.

## The careful mistake

Treating an error in ntu as an error of fixed size in degF. It sits in an exponent, so what it is worth depends on where the line already sits. On the published buried build at 26400.0 ft the correct ntu is 0.49826854 and the arrival is 125.06144556 degF. The same fractional error in ntu is worth 3.80418823 degF at 5280.0 ft, 13.55773419 degF at 26400.0 ft and 15.39298092 degF at 105600.0 ft. Those three come from a derived case whose ntu is wrong by 42.209398 percent at every one of the three lengths. A tolerance quoted on ntu is not a tolerance in degrees until you say where on the curve it lands.

## Exercise

Read the arrival at ntu 0.5000 and at ntu 1.0000 off the sweep and record the excess remaining at each.

Then say what a line with ntu 4.0000 gains from more insulation, and how you would tell a customer why.
