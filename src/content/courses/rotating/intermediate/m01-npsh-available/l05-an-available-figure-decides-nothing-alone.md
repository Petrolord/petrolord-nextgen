# An available figure decides nothing on its own

NPSH available is a complete description of one side of a question. On its own it is not an answer to the question, and the reason is that the pump has not been consulted.

{{panel:fc-suction-explorer}}

## Two halves, and only one of them is here

The OKONO suction returns 52.808173 ft of available head. That figure is built entirely out of things on the suction side: a drum pressure, a vapour pressure, a gravity, a height and a friction. Nothing in it is a property of the machine.

What the machine contributes is a required NPSH, and that is a vendor figure. It comes off a pump test, it belongs to a specific impeller in a specific casing, and this package does not compute it and does not pretend to. Until it is stated, 52.808173 ft is a supply with no demand beside it.

## The required figure moves with flow, and this package has no curve for it

There is no required-NPSH-against-flow curve anywhere in these engines. That is a named seam of the course rather than an omission somebody forgot to write down, and it has a direct consequence: the required NPSH has to be read off the vendor curve at the duty flow before a suction margin means anything.

A required figure read at the wrong flow is hard to see. It is a real number off a real curve, it is in the right units, and it belongs to a duty the pump is not running at.

## What a bare available figure can and cannot support

It can support a comparison between two suctions on one installation. Padding a drum from 14.700000 psia to 24.500000 psia takes the available head from 31.040865 ft to 52.808173 ft, and that is a real statement about what the padding bought, with no vendor figure in it.

It cannot support a verdict. It cannot say the pump is safe, that it will cavitate, or that a margin is adequate, because every one of those sentences has a required NPSH inside it.

## The rule that turns two figures into a verdict

Once a required NPSH is stated, this package applies a margin rule and returns a margin, a required margin, a ratio, a pass flag and a severity. That rule is customary, and this repository holds no publication for it, so the course teaches it as a limit: no required margin, no pass flag and no severity is a graded answer anywhere here. The available head itself is gradeable, because every term in it is arithmetic the engine defines and performs.

## The mistake

The mistake is quoting an available head as a conclusion. A report that says a suction is fine because it has 52.808173 ft has stated a supply and called it a verdict, and nobody can check the sentence, because the figure it would be checked against is not in it.

## Exercise

Name the five conditions the OKONO available head of 52.808173 ft is built from, and say which of them is a property of the pump. Then state what has to be added before a verdict is possible, at what flow it has to be read, and which of the values a margin check returns this course will never grade.
