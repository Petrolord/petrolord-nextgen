# Units are never converted

{{panel:dq-checks-explorer}}

Every definitional limit is keyed by a unit, and the engine only checks a channel in a unit it lists. It does not convert. Give it a sonic log in a unit it does not know and it refuses, naming the field and listing the units it will take:

> unit must be one of us/ft, us/m for channel sonic: units are never converted here

The field named is `unit`. The last clause of the message is the policy, stated where you cannot miss it.

## Why no conversion

A converter would seem kinder. It could read a unit name, look up a factor and carry on. The trouble is that unit names in real files are not reliable enough to act on silently. Some headers carry a unit that was never true of the data. A converter that guessed well most of the time would, on the occasions it guessed wrong, produce a result that looked exactly like a correct one. Refusing puts the decision in front of the person who can read the file header and knows what the tool recorded.

The same thinking applies to the channel. Asked for a channel it does not list, the engine refuses and lists the ten it does:

> channel must be one of fraction, rate, cumulative, gammaRay, resistivity, bulkDensity, sonic, caliper, absolutePressure, temperature

## What a unit check cannot see

Here is the honest limit of the rule. EKENE-7's sonic, declared in us/m, passes the range check with 240 checked and 0 failed.

| EKENE-7 sonic, declared unit | checked | failed |
| --- | --- | --- |
| us/m | 240 | 0 |

Both us/ft and us/m are listed for sonic, and in both the definitional limit is the same: a slowness is positive, with the minimum excluded. A log recorded in one unit and labelled with the other still satisfies that limit at every sample. The label is wrong and the check cannot tell, because nothing about positivity changes between the two units.

So a unit mislabel is invisible to a definitional limit. The label is the caller's responsibility. The engine checks that the unit is one it lists; it cannot check that the unit is the one the tool used. A caller range in the right unit might catch a mislabel, since the numbers would sit in the wrong place for the rock, but that is the caller's knowledge doing the work, and the engine carries none of it.

## The working habit

Read the unit from the file header before you run a range check, and write it into the call yourself. If the header and the numbers disagree, settle it before the check runs, because no check downstream of a wrong unit can put it right. The engine's refusal protects you from an unlisted unit; nothing protects you from a listed one that is false except reading the file.

## Exercise

Open the checks explorer on the view for range limits and rate rules. Set the channel to sonic and read the unit options it offers. Choose us/ft, type a few positive values into the values box and read the Failed tile. Switch the unit to us/m and read it again. Then choose the option for a unit the engine does not list, copy the refusal, and write one sentence saying why the two listed units gave the same result.
