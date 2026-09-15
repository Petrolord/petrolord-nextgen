# Oil is not gas

EGINA's oil P50 is 130.0000 MMbbl and its gas P50 is 70.0000 Bcf. Adding them gives 200.0000 of nothing, and the engine will not do it.

{{panel:ec-plan-explorer}}

## Two totals, two units

| fluid | unit | rows | sum of P50 |
| --- | --- | --- | --- |
| Oil | MMbbl | 2 | 130.0000 |
| Gas | Bcf | 1 | 70.0000 |

A million barrels of oil and a billion standard cubic feet of gas are different physical things sold into different markets under different contracts. The engine returns one total per fluid, each in that fluid's own unit, and the list of fluids it found alongside them. For EGINA that list is Oil and Gas.

## The published cases say the same thing

The engine's own test cases are built around this. A breakdown of 85 MMbbl of oil and 30 Bcf of gas returns fluids Oil and Gas, an oil P50 of 85.0000 MMbbl and a gas P50 of 30.0000 Bcf, and no combined figure anywhere. A three fluid case with two oil rows returns fluids Oil, Gas and Condensate, with oil P50 105.0000 MMbbl, gas P50 30.0000 Bcf and condensate P50 4.0000 MMbbl. Condensate is measured in MMbbl like oil and is still kept apart from it, because a condensate barrel and a crude barrel are not the same barrel and are not priced the same way.

A case of strings and blanks returns fluids Oil and an oil P50 of 4.5000 MMbbl. An empty list returns no fluids and no rows, which is the honest answer to a table that holds nothing.

## Where the sum comes from

The 130.0000 MMbbl is 95.0000 from Egina Main plus 35.0000 from Egina Deep, both oil. The 70.0000 Bcf is the Egina Gas Cap on its own. There is no third total, because there is no unit a third total could be written in.

## Converting is a decision, not a display

Gas can be expressed on a barrel of oil equivalent basis, and that conversion is a commercial assumption about heating value and about price. It is a decision somebody has to make and defend. The reserves table is not the place it gets made silently, which is why the studio keeps two columns and leaves the combining to a person who will say what factor they used.

## The mistake

The mistake is the addition itself, and it is easy to make because both columns print to four decimals in the same typeface. A reader who writes 200.0000 has produced a figure that is neither barrels nor cubic feet and cannot be checked against anything. The related mistake is to rank two fields by a total built that way: a gas heavy field and an oil heavy field can show the same combined figure and be worth entirely different money, because the plan prices barrels and the gas total never enters the screening case at all.

## Exercise

Write the oil and gas P50 totals for EGINA with their units, and say in one sentence what 200.0000 would be a total of. Then give the three fluid totals from the case with two oil rows, and say why condensate is kept apart from oil when both are in MMbbl.
