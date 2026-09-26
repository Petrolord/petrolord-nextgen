# Force majeure, maintenance and a buyer-caused day

{{panel:gsa-quantity-calculator}}

Not every gap between the gas nominated and the gas made available is the seller's fault. A storm may close the pipeline, the seller may carry out scheduled maintenance, or the buyer's facility may be unable to accept gas. A gas sales agreement excuses the seller for each of these, and the daily balance has an input for each.

## Force majeure and maintenance

Force majeure and scheduled maintenance are quantities stated for the day. The engine subtracts them from any gap before it counts a seller shortfall, and it subtracts them from the DCQ to give the adjusted DCQ, the quantity against which the buyer's take is measured. The engine's rule: adjusted DCQ = DCQ - force majeure - maintenance - seller shortfall.

| case | nominated | available | force majeure | maintenance | seller shortfall (engine) | adjusted DCQ (engine) | buyer shortfall (engine) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| part-day force majeure | 100.000000 | 40.000000 | 30.000000 | 10.000000 | 20.000000 | 40.000000 | 0.000000 |
| whole-day force majeure | 100.000000 | 0.000000 | 100.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 |
| power plant, 2027-01-28 | 10500.000000 | 10500.000000 | 0.000000 | 10500.000000 | 0.000000 | 10500.000000 | 0.000000 |

On the part-day case, 60 of the properly nominated 100 was not made available. Force majeure and maintenance excuse 40 of that, and the other 20 is a seller shortfall. The engine's reasons, verbatim:

> 2027-03-01: 40 not made available is excused by the force majeure and maintenance quantities stated for the day

> 2027-03-01: the seller made 40 available against a properly nominated 100: seller shortfall 20

## A whole day of force majeure

When force majeure and maintenance together cover the whole DCQ, nothing is owed either way. The power plant's 2027-01-12 and 2027-01-13 are such days, each with force majeure of 21000.000000:

> 2027-01-12: force majeure and maintenance cover the whole DCQ; no quantity is owed either way for the day

Force majeure and maintenance can never exceed the DCQ between them, and the engine refuses a day that says they do:

> days[0].forceMajeure must be a quantity that with maintenance 30 is at or below the DCQ 100; got 80

## A buyer-caused day

Sometimes gas is not made available because of the buyer: its plant cannot receive, or it has closed its own valve. The engine takes a flag, `buyerCaused`, and on such a day it counts no seller shortfall. The golden case nominated 100.000000, made available 20.000000 and took 20.000000; the seller shortfall is 0.000000 and the buyer shortfall 80.000000. The power plant's 2027-01-30 is the same situation at scale:

> 2027-01-30: 8400 of the properly nominated quantity was not made available for a cause on the buyer's side, so it is not a seller shortfall

> 2027-01-30: taken 12600 is below the adjusted DCQ 21000: buyer shortfall 8400

The flag takes only true or false:

> days[0].buyerCaused must be true or false when given; got "yes"

## Who carries the gap

Force majeure and maintenance lift the gap off both sides. A seller shortfall puts it on the seller, and a buyer-caused gap puts it on the buyer.

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose "The daily balance". Run the power plant's January 2027 and read the rows for 2027-01-12, 2027-01-28 and 2027-01-30. Then replace the box with a `dcq` of 100, `maxDcqPct` 120 and one day dated "2027-03-01": `nominated` 100, `available` 40, `taken` 40, `forceMajeure` 30 and `maintenance` 10. Run it and read the reasons. Now raise `forceMajeure` to 80 and read the refusal. Restore it, remove both excuses, add `"buyerCaused": true`, and compare the two shortfall columns.
