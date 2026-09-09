# The marginal blend

One terrain prices its barrels in tiers, so its royalty rate is a function of the daily rate and is almost never a round number.

{{panel:ec-fiscal-explorer}}

## The table

deriveOilRoyaltyRate for marginal_field:

| bopd | rate |
| --- | --- |
| 1000 | 0.050000 |
| 5000 | 0.050000 |
| 6000 | 0.054167 |
| 8000 | 0.059375 |
| 10000 | 0.062500 |
| 12000 | 0.077083 |
| 20000 | 0.106250 |
| 50000 | 0.132500 |
| 60000 | 0.135417 |
| 120000 | 0.142708 |

The shape is a blend. The first 5000 bopd pay 5 percent, the next 5000 pay 7.5 percent, and barrels above 10000 bopd pay 15 percent, the year's rate being the average across the year's barrels. That is why 10000 bopd gives exactly 0.062500, halfway between 0.050000 and 0.075000, and why the rate keeps rising past 50000 bopd (0.132500 at 50000 and at 50001, 0.142708 at 120000) where deep offshore stepped once and stopped. The marginal rate never reaches 0.150000; it approaches it from below, because the first 10000 bopd are always priced at the two lower tiers.

## The published case

pia_marginal_field_blend produces 2920000 bbl in 2025, 8000 bopd, and the digest describes the split as the first 5000 bopd at 5 percent and the balance at 7.5 percent. Its production royalty is 13870000.00 on 233600000.00 of gross revenue, the 0.059375 in the table. pia_marginal_field_pre_2021 is true, so the hydrocarbon tax rate is 0.150000 rather than 0.300000: HCT is 26361776.50 on a chargeable profit of 175745176.68. NPV 62918717.76, take 65.7305 percent.

AKATA as a marginal field lifts 2200000 bbl in 2029, a daily rate between the 6000 and 8000 bopd rows, and its production royalty is 10182990.00 against 22944240.00 as shallow water. But its HCT is 29251153.65 in 2029 against 25422778.65, because the pre-2021 flag was not set and the field pays 30 percent on a base that the smaller royalty has left larger. Total royalties fall to 60841733.38, total tax rises to 223261390.90, and NPV is 61154067.34 against 42943268.01. The terrain string cut the royalty in half and the tax took most of the gain back.

## The mistake

Reading the 8000 bopd row as a tier of 7.5 percent applied to every barrel. That is 0.075000, the frontier rate, and it overstates the marginal royalty by the gap between 0.075000 and 0.059375 on every barrel of the year. The opposite mistake is reading the low end as 5 percent for the whole field on the strength of its first 5000 bopd; the 60000 bopd row reads 0.135417, nearly three times that.

## What it refuses

The blend is computed on the year's barrels expressed as a daily rate, not month by month, so a field that ramps inside a year is priced on its average. The marginal rate carries no price component of its own; the price royalty is applied separately, and on the published case it adds 5584823.321583. And the blend does not switch the tax rate: that is the pre-2021 flag, a separate input.

## Exercise

Read the rate at 5000, 10000 and 20000 bopd and say why the second is exactly halfway between the first two tiers' rates while the third is not halfway to 0.150000.
