# The small-field tranches

The onshore and shallow water royalty prices a year's barrels in tranches, so its rate is a blend of the tranche rates, a function of the daily rate that is almost never a round number. A marginal field pays the same blend.

{{panel:ec-fiscal-explorer}}

## The table

deriveOilRoyaltyRate onshore and in shallow water:

| bopd | onshore | shallow_water |
| --- | --- | --- |
| 1000 | 0.050000 | 0.050000 |
| 5000 | 0.050000 | 0.050000 |
| 6000 | 0.054167 | 0.054167 |
| 8000 | 0.059375 | 0.059375 |
| 10000 | 0.062500 | 0.062500 |
| 12000 | 0.077083 | 0.072917 |
| 20000 | 0.106250 | 0.093750 |
| 50000 | 0.132500 | 0.112500 |
| 60000 | 0.135417 | 0.114583 |
| 120000 | 0.142708 | 0.119792 |

The first 5000 bopd pay 5 percent, the next 5000 pay 7.5 percent, and the barrels above 10000 bopd pay 15 percent onshore or 12.5 percent in shallow water; the year's rate is the average across the year's barrels. That is why 10000 bopd gives exactly 0.062500, halfway between 0.050000 and 0.075000, and why the two columns agree up to 10000 bopd and part only above it. The onshore rate keeps rising past 50000 bopd and never reaches 0.150000: it approaches it from below, because the first 10000 bopd are always priced at the two lower tranches.

## The published case

pia_marginal_field_blend produces 2920000 bbl in 2025, 8000 bopd: the first 5000 bopd at 5 percent and the balance at 7.5 percent. Its production royalty is 13870000.00 on 233600000.00 of gross revenue, the 0.059375 in the table. The golden enters the terrain as marginal_field, which the engine refuses: a marginal field is onshore or in shallow water, and its conversion status is a separate input. The course runs it onshore with pia_marginal_field_pre_2021 true, so the hydrocarbon tax rate is 0.150000: HCT is 24111699.56 on a chargeable profit of 160744663.71, NPV 64298225.13, take 64.9792 percent. Run in shallow water it prints the same figures, because 8000 bopd sits below the tranche where the terrains differ.

AKATA with the flag set, still in shallow water, keeps its royalty: 10070350.00 in 2029 and 60324870.87 in total. What moves is the tax. Its 2029 HCT is 13604359.74 at 15 percent against 27208719.48 at 30, total tax falls to 171815891.58, and NPV is 97891150.04 against 59766796.57. For a marginal field the value sits in the flag and the tax rate it sets.

## The mistake

Reading the 8000 bopd row as 7.5 percent on every barrel. That is 0.075000, the frontier rate, and it overstates the royalty by the gap between 0.075000 and 0.059375 on every barrel of the year. The opposite mistake is reading the whole field at 5 percent on the strength of its first 5000 bopd; the onshore 60000 bopd row reads 0.135417, nearly three times that.

## What it refuses

The engine reads the year's crude oil plus condensate over the calendar days of the year, and says so in its own statements: the Regulations divide each month's production by the days oil was produced in that month, so a field that ramps inside a year is priced on its average here. The blend carries no price component; the price royalty is charged separately, and on the published case, on the Regulations (2021) base the engine uses by default, it adds 5585336.289727. And the blend does not set the tax rate: that is the pre-2021 flag.

## Exercise

Read the rate at 5000, 10000 and 20000 bopd onshore and in shallow water and say why the first two agree across the terrains and the third does not.
