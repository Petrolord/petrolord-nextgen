# Thousand cubic feet a year

routeEconomics answers one question from the studio's question table: what does a route make, earn and cost in a year. Every figure in that year starts from one count, the parcel's Mscf a year.

{{panel:gasvalue-route-explorer}}

## The parcel

EGBEMA's four routes are run on 7.5 MMscfd and 355 days. mscfPerYear is the volume in Mscf a day times the on-stream days. The engine prints it for each route:

| route | mscfPerYear |
| --- | --- |
| Compressed natural gas | 2662500.0000 |
| Mini LNG | 2662500.0000 |
| LPG and condensate extraction | 2662500.0000 |
| Gas to power or gas to wire | 2662500.0000 |

All four rows print the same figure. The four routes share one parcel: the same volume and the same on-stream days. What differs route by route is what each makes of it.

The flare in the Associate tier was read on the same volume and days. Its year was printed in standard cubic feet: scfPerYear 2662500000. The route's year is printed in thousands of standard cubic feet: mscfPerYear 2662500.0000.

## Three figures built on the parcel

The whole parcel is the count the year is built on, and three of routeEconomics' figures use it:

- productPerYear is mscfPerYear times the yield times the recovery;
- operating cost is the fixed cost plus the variable cost per Mscf of the whole parcel;
- valuePerMscf is the margin over mscfPerYear.

The variable cost is charged on the whole parcel. The value per Mscf is spread over the whole parcel. Of the three, only productPerYear carries the recovery, and revenue is that product times the price. The next lesson of this module reads the recovery, and the one after it reads the product, the revenue, the cost and the margin together.

## On-stream days are required

The on-stream days are a required input. Typed blank on the CNG route, they are refused:

| probe | engine |
| --- | --- |
| CNG on-stream days left blank ('') | REFUSED: On-stream days are required, more than 0 and no more than 366. |

The same refusal appears in the flare's abatement in the Associate tier, for days typed blank and for days typed as 367. A blank box is missing. The Associate tier also printed what the flare does when the days are omitted from the call altogether: they take the stated default, and scfPerYear reads 2625000000. That default is printed for abatement. The course prints no omitted-days case for routeEconomics, so this lesson teaches only the blank one for a route: refused.

## One volume, many checks

The same 7.5 MMscfd is the actual in every Minimum volume check of module 1: 7.5000 against the CNG and LPG limits of 5, against mini LNG's 10, against gas to power's 3. The screen reads the volume per day. The year multiplies it by the days. Both rest on the same parcel, and so does the flare the Associate tier weighed at 215946.438 t/yr of CO2e on 7.5 MMscfd and 355 days.

In the panel, change the on-stream days and read mscfPerYear change on all four routes at once. Then clear the days box and read the refusal.

## Exercise

Read the mscfPerYear column and say what the four rows share. State the rule mscfPerYear follows, with EGBEMA's two inputs. Then give the flare's scfPerYear on the same volume and days, and quote what the engine answers when a route's on-stream days are left blank, with the range the refusal names.
