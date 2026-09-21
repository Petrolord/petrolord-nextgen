# The templates carry line items

The `fuelPricing` module ships two templates: the line items of an import build-up and the line items from the depot gate to the nozzle. Each line has a label, a basis and a place in the order. None of them has a rate. This lesson reads what the templates carry and why the one column they leave empty is the column the rest of this tier is about.

{{panel:supply-price-explorer}}

## The import template

`IMPORT_TEMPLATE` lists 9 lines, each with the base it bites on and the stage of the walk it belongs to:

| order | id | label | basis | stage | rate shipped |
| --- | --- | --- | --- | --- | --- |
| 1 | freight | Ocean freight | per_tonne | freight | none |
| 2 | insurance | Marine insurance | percent_of_cf | insurance | none |
| 3 | duty | Import duty | percent_of_cif | landed | none |
| 4 | port | Port and harbour charges | per_tonne | landed | none |
| 5 | regulator | Regulatory and inspection charges | per_litre | landed | none |
| 6 | jetty | Jetty throughput and discharge | per_m3 | landed | none |
| 7 | storage | Storage and handling | per_m3 | landed | none |
| 8 | finance | Financing and letter of credit | percent_of_cif | landed | none |
| 9 | demurrage | Demurrage provision | per_cargo | landed | none |

The bases the engine knows are the module's `CHARGE_BASIS` list: per_tonne, per_m3, per_litre, per_bbl, per_cargo, percent_of_fob, percent_of_cf and percent_of_cif. A basis is a unit and a base at once. A per-tonne line needs the cargo in tonnes, a per-litre line needs it in litres, and a percent line needs a value the walk has already formed. That is why the previous three lessons put the cargo in every unit before any money appears.

## The pump template

`PUMP_TEMPLATE` lists 7 lines from the depot gate to the nozzle, each with the party it pays:

| order | id | label | basis | recipient | rate shipped |
| --- | --- | --- | --- | --- | --- |
| 1 | depot | Depot and terminal margin | per_litre | Terminal | none |
| 2 | bridging | Bridging or equalisation | per_litre | Chain | none |
| 3 | transport | Transport to station | per_litre | Transporter | none |
| 4 | marketer | Marketer margin | per_litre | Marketer | none |
| 5 | dealer | Dealer margin | per_litre | Dealer | none |
| 6 | levies | Statutory levies at the pump | per_litre | Government | none |
| 7 | vat | Value added tax | percent_of_running | Government | none |

Its bases are the module's `PRICE_ELEMENT_BASIS` list: per_litre, percent_of_landed and percent_of_running. The recipient column is what lets the engine say later who receives each naira of a litre's price.

## The column that is empty

Every rate in both templates is absent. The module states why in its `RATE_DISCLAIMER`:

> "Line items only. Every rate is a required input: duties, levies and regulated margins are set by regulation, differ by market and change. Confirm each against the regulation in force."

Read that as a rule about authority. The disclaimer sends every rate back to the regulation in force, and the module ships none of its own.

The two templates also fix an order. The import lines run from freight to demurrage in the order the walk reaches their stages, and the pump lines run from the depot margin to the value added tax, the one line whose basis is a percent of the running total. The order is shipped, and the next module shows it is part of the answer, because a percentage can only bite on a base the walk has already formed.

So every rate you meet from here to the end of this tier is invented for this course. The BADAGRY cargo's freight, insurance, duty, port, regulatory, jetty, storage, finance and demurrage rates are invented, and so is every margin, levy and tax on its pump price, and so is its exchange rate. None is a published figure, and none describes any market as it is.

## Exercise

Count the lines in each template and the rates each ships, and record the basis of the insurance line and of the value added tax line. Then quote the `RATE_DISCLAIMER` and say what the rate column, read against the basis column, shows about which part of a build-up the engine owns and which part the user must supply.
