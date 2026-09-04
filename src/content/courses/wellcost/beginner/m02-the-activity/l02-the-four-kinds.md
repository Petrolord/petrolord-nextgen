# The four kinds

Four activity kinds, no more, and the engine rejects anything else.

{{panel:wc-time-explorer}}

## The list is closed

The engine exports its own vocabulary as a fixed list of activity kinds: drill, trip, casing, flat. Any activity whose kind is not one of those four raises an error naming the unknown kind, and the programme does not evaluate.

That is deliberate. A closed list means every activity in every programme has a known formula, so a schedule can never contain a duration whose provenance nobody can explain.

## What each kind is for

**drill** advances the hole. It is the only kind that does. It takes a depth interval and a rate of penetration.

**trip** moves the string out of the hole and back in, or in and back out. It is a round trip by definition, which is why the depth is doubled inside the formula.

**casing** runs a string to a depth and then does everything else that a casing job involves. It has a running part that depends on depth and speed, and a flat part that does not.

**flat** is time you assert directly. No depth, no rate, just hours.

## How the golden programme uses them

| Kind | Activities | Productive hours |
| --- | --- | --- |
| drill | 3 | 220 |
| trip | 2 | 20 |
| casing | 3 | 60 |
| flat | 2 | 84 |

Three drill activities, one per hole section, carry 220 of the 384 productive hours. The two round trips carry 20 hours between them, which is less time than the rig move alone.

That ranking is worth internalising. On a conventional well the bit turning and the flat time between sections dominate, and tripping, which crews talk about constantly, is often the smallest block on the list.

## The kind decides the formula

Nothing else about an activity changes how its duration is computed. The label is free text and is used only in messages and reports. The identifier matters only because cost items link to it. The kind, and the kind alone, selects the arithmetic.

## Exercise

In the panel, change the kind of the round trip at total depth to casing and record what the engine now requires from you before it will evaluate.

Then set the kind to something that is not on the list and copy out the exact error.

Finally, rank the four kinds by hours on your own most recent well and compare the ranking with the table above.
