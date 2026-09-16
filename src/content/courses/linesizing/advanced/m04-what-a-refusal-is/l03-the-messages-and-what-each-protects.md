# The messages, and what each protects

The engine's refusals are not one list. There are two classes with a real line between them, and the larger class has more entry points than sentences.

{{panel:fc-gasline-explorer}}

## Two classes, one distinction

A state the method has no answer for is one where every input was meaningful and the physics still leads nowhere. A gas line whose outlet meets its inlet has no flow to report.

An input with no physical meaning is a different failure. A negative roughness, an efficiency above one, a corrosion allowance that removes metal. Nothing has been attempted, because the question was malformed.

The engine refuses both the same way, and a reader who conflates them will hunt for a physical cause behind what was really a typing error.

## Twenty-four ways in, eighteen sentences

The catalogue of meaningless inputs has 24 entries carrying 18 distinct messages. Six messages appear twice, splitting evenly into two causes.

Three are one message guarding two different entry points. "absolute roughness is a length and cannot be negative" answers both a liquid friction call and a General Flow call. "elevation change cannot exceed line length" answers both a liquid line and a gas line. The corrosion allowance message answers both a wall call and a rating call.

The other three are one guard catching two kinds of bad value. Efficiency is refused above one and below zero by the same sentence. A gas line is refused for a zero length and for a negative one. A swept volume is refused for a missing bore and for a negative length.

## What the groups protect

Six protect dimensions: a roughness that is a length, a rise that cannot exceed the line it rises over, and the bores and lengths that must exist before a rate or a volume can. One protects the fitting resistance sum and explains itself: "a fitting resistance sum cannot be negative: fittings spend pressure, they do not return it". Six protect the gas state: gravity, temperature, compressibility, viscosity and the efficiency multiplier. Three protect the code factors in the wall calculation. One protects a traverse, which needs an absolute inlet pressure to march down from.

The eighteenth belongs to neither group cleanly: "the static gas column alone spends the inlet pressure: this line delivers nothing at any rate". Every input there is meaningful. The hill is taller than the inlet pressure can pay for, so it is a physical verdict wearing the shape of an input guard.

## The mistake

The mistake is identifying a failed call by its message text. Six messages serve two entry points each, so the sentence narrows the problem without naming the call.

The second mistake is reading a message as a complete specification. "a gas line needs a positive length in miles" names the unit as well as the sign, and a caller who passes feet satisfies the guard and sizes a line in the wrong unit entirely.

## Exercise

State the distinction between a state the method cannot answer and an input with no physical meaning, with an example of each. Then give the entry and message counts for the meaningless-input catalogue, explain the two reasons a message appears twice, and name the one message that is a physical verdict rather than an input guard.
