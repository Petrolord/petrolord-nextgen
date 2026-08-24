# Why everything downstream is metric

The platform works in metres. That is a decision, made once, and every application above the registry is built on it. A petrophysics module computing net pay, a correlation panel hanging tops, a mapping tool gridding a surface, a well tie converting depth to time: none of them carries a unit switch, and none of them asks a well what unit it is in. They read a depth and treat it as metres.

Which means a file arriving in feet is not a defective file. It is a foreign one, and the difference matters, because you handle defects and foreignness differently. A defect you flag and send back. Foreignness you translate.

## What a unit decision buys

The reason to fix an internal unit at all is that it removes a question from every piece of code and every conversation downstream of the registry.

Without it, a depth is not a number. It is a number plus a unit that has to travel with it, be read correctly at every hop, and survive every copy, join, export and plot on the way. Every function that touches a depth needs a unit argument. Every comparison between two depths needs a check that both are in the same unit. Every well in a correlation panel needs its own conversion applied before the panel can draw a single line.

With it, a depth is a number. The unit lives in one place, at the boundary, and nothing above the boundary has to think about it again. Two wells can be compared directly. A top picked in one well and a top picked in another are in the same frame by construction. A grid built from twenty wells does not need to know where any of them came from.

That is the entire value proposition of a unit standard, and it explains why the standard has to be enforced at exactly one point. A standard applied in most places is not a standard. It is a probability.

## Convert at import, not at use

There are only two places a conversion can live, and choosing between them is the whole architectural argument.

Converting at use means each consumer converts as it reads. The registry stores whatever arrived, alongside a label saying what unit it is in, and the petrophysics module, the mapper, the correlation tool and the exporter each check the label and convert.

Converting at import means the conversion happens once, at the boundary, and the registry holds metres. Consumers do no conversion at all.

Convert at use fails, and it fails in a specific and instructive way. It fails because the number of places that can get it wrong is the number of consumers multiplied by the number of curves, and that product grows every time somebody adds a feature. It fails because a new consumer written next year has to know the rule, and nothing forces it to. It fails because a unit label is metadata, and metadata is what gets dropped when data is exported to a spreadsheet, pasted into a report, or joined into a table that has no column for it. It fails because the conversion for depth and the conversion for a per-length curve go in opposite directions, so a consumer that gets the depth right can still get the sonic wrong.

And it fails silently. A depth in feet stored as a depth in feet with the label lost is a plausible depth. Nothing about the number itself objects.

Convert at import has exactly one place to get it wrong, that place is code you can test, and the result of getting it right is a registry in which every depth means the same thing.

## What the boundary looks like

At the boundary, three things happen and all three are visible.

The declared unit is read from the file rather than inferred from the numbers. The factor is looked up rather than guessed, and an unrecognised unit stops the import rather than defaulting to anything. The conversion is recorded with the data, so every converted curve carries the unit it came from and the factor applied.

That last one is what keeps the decision reversible. A converted depth with its provenance can be checked, undone, or explained. A converted depth without provenance is an assertion.

## The habit this asks of you

Inside the project, depths are in metres and you can say a depth without qualifying it. At the boundary, and in any sentence about a file, always attach the unit. The file feet_20.las starts at 4900 ft. Its converted start depth is in metres. Those are two different facts about the same well, and running them together in a sentence is the first step toward running them together in a database.

The same discipline applies to the word converted. A converted depth is a derived quantity. Quote it without saying so and you have handed someone a number whose history they cannot see.

## Exercise

A project decides to store every well in whatever unit it arrived in, with a unit column on the well record, and to convert in each application as it reads. List three distinct ways this arrangement produces a wrong depth in production, where each way is a different mechanism rather than a different person making the same mistake. Then say, in one sentence, what the convert-at-import arrangement does with each of those three mechanisms.

Self-check: the mechanisms include a new consumer written without knowledge of the rule, which import handles by leaving nothing for a consumer to know; the unit label being lost in an export, a paste or a join that has no column for it, which import handles by making the stored number self-consistent with no label needed; and a consumer converting depth correctly while missing a per-length curve such as the sonic, or converting it in the wrong direction, which import handles by converting every curve at the same boundary and recording which ones it touched. A fourth acceptable answer is two wells being compared without either being converted, since both look like plain numbers.
