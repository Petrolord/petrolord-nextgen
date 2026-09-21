# The scope totals

{{panel:carbon-inventory-explorer}}

## Three totals

buildInventory returns three totals, and each one is labelled with what it covers. For the complete Igbogene inventory on "IPCC AR6 GWP100, fossil methane", with every activity and factor invented for this course:

| total | tCO2e |
| --- | --- |
| Scope 1 (direct) | 30030.777 |
| Scope 2 (purchased energy) | 12915.000 |
| Total, Scope 1 and Scope 2 | 42945.777 |

The engine also reports its status beside the totals: gwpSetLabel: IPCC AR6 GWP100, fossil methane. computed: true. reportable: true. blocked lines: 0. unsourced lines: 0.

## Each line as a share

The lab divides each line by the total. These shares are the course's arithmetic on the engine's figures:

| line | share of the total |
| --- | --- |
| Fired heaters (CO2) | 0.538387 |
| Flaring (CO2) | 0.051037 |
| Flaring (unburned CH4) | 0.011315 |
| Vented and fugitive methane | 0.098534 |
| Purchased electricity | 0.300728 |

Read the rows. The fired heaters are 0.538387 of the total, the purchased electricity 0.300728, the vented and fugitive methane 0.098534, the flare's CO2 0.051037 and the flare's unburned methane 0.011315. The two methane lines enter the total in tCO2e on the course's set.

The course adds a rounding note, and it matters when you check the shares: the shares as printed sum to 1.000001, because each is rounded to six decimals from the unrounded quotient. The unrounded shares sum to 1. A sum of 1.000001 is the rounding, and it is not an error in the inventory.

## What a total contains

A total contains only the lines that computed. The Igbogene steps show it. In the first pass, with the electricity factor blank, the electricity line is blocked and Scope 2 is 0.000 tCO2e. Once the factor is entered with its source, Scope 2 is 12915.000 tCO2e. The 0.000 in the first pass is not a measurement of zero purchased power. It is the Scope 2 total with its only line blocked, and the inventory says so: reportable false, with a line that could not be computed among its reasons.

A total also contains nothing off the two scopes. Add a scope 3 business travel line and it is blocked with the reason "scope 3 is not Scope 1 or Scope 2, which is all this inventory totals", and the total stays 42945.777 tCO2e.

## Read a total with its status

A total without its status can mislead. The first pass total is 23121.448 tCO2e, and it is computed: true. It is also reportable: false. Both facts belong beside the number, and the engine returns them together.

In practice, a share table is a common way to summarise an inventory for management.

Open the panel's inventory table and read the three totals, then step back to the first pass and read Scope 2 there.

## Exercise

Read Scope 2 in the first pass and in the complete inventory, and the reportable flag at each. Say what the relationship between the two Scope 2 figures shows about what a scope total contains.

Self check: Scope 2 is 0.000 tCO2e in the first pass, where the electricity line is blocked for want of a factor value, and 12915.000 tCO2e once the factor is entered with its source. The first pass is not reportable. A scope total contains only the lines that computed, so 0.000 there is a blocked line and not a measured zero.
