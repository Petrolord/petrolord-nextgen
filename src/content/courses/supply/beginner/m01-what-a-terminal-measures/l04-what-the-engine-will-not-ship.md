# What the engine will not ship

## Two kinds of data a module could carry

A module could carry two kinds of fixed data. One kind is a unit conversion. fuelPricing exports two as constants: LITRES_PER_M3 at 1000 and M3_PER_BBL at 0.158987294928.

The other kind is a rate or a coefficient: a duty, a levy, a regulated margin, a published correction coefficient. The engine ships none of that kind. This lesson reads what it ships in its place.

## Templates with every rate absent

fuelPricing carries two templates. IMPORT_TEMPLATE lists the nine line items of an import build-up, from ocean freight to a demurrage provision, and each row names its basis and its stage. PUMP_TEMPLATE lists the seven line items from the depot gate to the nozzle, each with its basis and the party who receives it. In both templates, the column headed rate shipped reads none on every row.

The engine attaches one sentence to them, its RATE_DISCLAIMER:

"Line items only. Every rate is a required input: duties, levies and regulated margins are set by regulation, differ by market and change. Confirm each against the regulation in force."

So the template tells you which charges exist and what each is charged on. It never tells you how much. Every rate you meet later in this course is invented for the course, and each lesson says so where the rate first appears.

## Typical densities, labelled as a starting point

fuelPricing does ship one table of numbers about products, PRODUCT_REFERENCE:

| code | label | typical density kg/m3 | range kg/m3 |
| --- | --- | --- | --- |
| PMS | Petrol / gasoline | 745 | 720-775 |
| AGO | Automotive gas oil / diesel | 840 | 820-860 |
| DPK | Kerosene / jet | 800 | 775-840 |

The engine labels these as a starting point. Nothing in the module reads them unless a caller passes one in, and the certificate of quality is the authority. A typical density is a label on a shelf; the density of the product in a given tank is a measured input.

## No correction coefficients

The volume correction factor needs three coefficients for the product's commodity group. They sit in a published table, and the engine ships none of them and has no default. Asked for a VCF without them, it refuses:

REFUSED: The volume correction factor needs the API MPMS Chapter 11.1 coefficients for your commodity group, which are a published table this package does not ship. Supply K0, K1 and K2, or enter a VCF read from your own tables.

That refusal is a held limit of the engines, taught and never graded. Module four teaches the form of the correction on a synthetic row invented for this course, and it corrects AKODO's stock with a VCF typed off the terminal's own tables, also invented.

The engine ships no coefficient and no rate, so each one has to be typed by the caller. By refusing, the engine puts the question back to the caller, and the refusal names what is missing.

## Exercise

Read the rate shipped column of both templates and the refusal from volumeCorrectionFactor. Say what those two readings show about who supplies a rate and who supplies a coefficient.

Self check: every rate in both templates is none and the coefficients are refused, so both come from the user, from the regulation in force or the terminal's own tables. The engine supplies the form and the order of the walk.
