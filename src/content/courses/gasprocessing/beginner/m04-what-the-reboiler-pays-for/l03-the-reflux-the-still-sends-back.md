# The reflux the still sends back

The overhead term has a second half. A glycol still runs with reflux, which means some of what is boiled overhead condenses at the top of the column and runs back down to be boiled again. The reboiler pays for that returning water all over again.

{{panel:fc-water-explorer}}

## The reflux ratio adds a fraction again

The engine takes a reflux ratio as an input. On OBIAFU it is 0.250000, and what it does is add that fraction of the water vaporisation on top of itself. A gallon carrying 0.312500000 lb of water costs 343.7500 Btu with no reflux at all, and 429.6875 Btu at a reflux ratio of 0.250000.

| reflux ratio | overhead, Btu/gal | total, Btu/gal | reboiler, MMBtu/hr |
| --- | --- | --- | --- |
| 0.000000 | 343.7500 | 1729.9150 | 0.664270 |
| 0.100000 | 378.1250 | 1764.2900 | 0.677469 |
| 0.200000 | 412.5000 | 1798.6650 | 0.690669 |
| 0.250000 | 429.6875 | 1815.8525 | 0.697269 |
| 0.400000 | 481.2500 | 1867.4150 | 0.717068 |
| 0.600000 | 550.0000 | 1936.1650 | 0.743468 |

Read the columns together. The overhead rises with the reflux ratio, and so does the total and so does the duty. The sensible half is absent from this table because it never moves when the reflux ratio moves. Reflux is a water question and the sensible term is a solvent question.

## What the reflux is buying

The reflux is not waste, even though it is pure extra duty in this balance. A glycol still with no reflux at all sends glycol overhead with the water, so the loop loses solvent and the vapour going to the flare or the vent carries a product that was paid for. Reflux knocks the glycol back down the column and lets the water go.

So the reflux ratio is a trade between duty and glycol losses, and this module prices only one side of it. It tells you what the reflux costs in Btu. It has nothing to say about what it saves in glycol, because glycol carryover is not a quantity this engine computes.

A reader looking only at the table above could conclude that the cheapest still runs with no reflux. The table supports that and the plant does not.

## Where reflux sits in the duty

The full OBIAFU duty at a reflux ratio of 0.250000 is 1815.8525 Btu a gallon, of which 1386.1650 is sensible and 429.6875 is overhead. The reflux is inside that second figure. It is a component of a component, and it is easy to lose track of once the duty is quoted as a single number.

## Where the reflux ratio comes from

It is an input with a default, on the same terms as the circulation ratio. The engine does not derive it from the column, because deriving it would need a still model this module does not carry. Trays, top of column temperatures and a condenser duty are all absent. What the module has instead is a typed fraction with its consequence printed beside it.

That is the doctrine again. A design choice is visible and a chart value is visible, and the reader is told which one they are looking at. A reflux ratio arriving as a typed input with a default is honest in a way that the same fraction buried inside a single overhead coefficient would not be.

## Exercise

Record the overhead term at reflux ratios of 0.000000, 0.250000 and 0.600000, and record the total at each. Then explain why the sensible term does not appear in this table, and name one thing the reflux buys that this engine does not price.
