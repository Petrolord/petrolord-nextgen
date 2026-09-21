# The capstone brief

{{panel:qr-event-tree}}

The Associate capstone asks this tier's question: how often, and what individual risk does one person carry. It gives you a facility of its own with every input stated in the prompt, and you produce the chain from a release to a person. Nothing in it asks you to make a probability of death, to look a value up in a table, or to draw a contour. The figures below are EREMOR's, used only to show the shape of each step.

## What you will be asked to produce

| step | what you return | the EREMOR illustration |
| --- | --- | --- |
| 1 | event tree outcome frequencies | explosion 0.000054000000 per year |
| 2 | LSIR at stated places | process deck 0.000148150000 per year |
| 3 | IRPA of stated people over those places | operator 0.000017541379 per year |

Every input is stated: the release frequencies, every ignition probability, the flash fire and explosion split, each probability of death at each place, and each person's hours or fractions. The ignition probabilities and the split are stated because the direct ignition table and the 0.6 and 0.4 preset rest on one reading of one source, so the capstone's answers rest on the stated numbers alone.

## Three things that decide most marks

The first is the tree. Hang delayed ignition under no immediate ignition, since it is conditional, and use the split exactly as stated. Pool every leaf that shares an outcome. On EREMOR, taking delayed ignition as unconditional gives 0.000060000000 per year for the explosion, and every place and person downstream inherits the slip.

The second is occupancy. Convert hours at 8760 hours a year, and remember that a person is in one place at a time. Leave out any vulnerability factor the prompt does not state; the default is 1.

The third is precision. Answers are per year at twelve decimals. Carry the full figures through the chain and round once at the end, because a figure rounded at the tree cannot be recovered at the person.

## How to check your own answer

Three sums catch almost every slip. The outcome frequencies of each tree must add back to its initiating frequency, as EREMOR's overfill leaves add back to 0.002000000000 per year. The contributions at each place must add to its LSIR. And each person's contributions must add to their IRPA, over a total occupancy no greater than one, as the EREMOR operator's does over 0.497716894977 of the year.

If any of the three fails, recheck the step before it. The engine would refuse a tree that does not close or a roster over one whole year, and your own sums should refuse them too.

## Exercise

Rebuild the first line of the EREMOR operator's IRPA: multiply the process deck LSIR, 0.000148150000 per year, by the occupancy fraction for 1000 hours, 0.114155251142, and write the contribution to twelve decimals. Confirm that you reach 0.000016912100 per year, then say which of the three self-checks above this contribution feeds into.
