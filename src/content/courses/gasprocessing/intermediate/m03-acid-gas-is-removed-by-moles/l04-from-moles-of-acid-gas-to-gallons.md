# From moles of acid gas to gallons

This is the step where the mole balance finally becomes a volume. Everything before it is counted. Everything after it is pumped, and the conversion runs through four properties of the solution, each of which is an input or a declared table value rather than something the engine works out.

## The chain, one step at a time

| step | what carries it |
| --- | --- |
| acid gas a day, in lbmol | 10666.2009 |
| into moles of amine a day | the swing, 0.430000000 mol per mol |
| into pounds of amine a day | the molecular weight, 119.160000 for MDEA |
| into pounds of solution a day | the strength, 45.000000 weight percent |
| into gallons a day | the solution density, built from a gravity of 1.040000 |
| into gallons a minute | the minutes in a day, 1440.000000000 |

The answer on UBIE is 525.893013 gpm.

{{panel:fc-absorber-explorer}}

## What each property is doing

The swing turns the duty into an amount of amine. It is the only step that is about the process rather than about the fluid.

The molecular weight is the one piece of real chemistry in the chain. It is a property of the molecule and there is nothing customary about it.

The strength turns amine into solution. A solution is mostly water, so this step carries an amount of active chemical into a much larger amount of liquid, and what the multiplier is on any given day is entirely a matter of operating practice.

The density turns pounds into gallons. The engine builds it from each amine's solution gravity, which the property table carries alongside the molecular weight, and on MDEA that gives 64.883034 lb per ft3. That same density appears again in the last module of this tier, where it is what a sweetening contactor is sized against, so it is worth noticing here that one number is doing two jobs in two different parts of the answer.

The minutes in a day are the one figure in that chain carrying no judgement at all. Everything above them is either a property of a fluid or a decision somebody took.

## Why the order matters for reading an answer

A circulation figure is the end of a chain of five multiplications and divisions, and every one of them is a place a wrong input lands. That is why the engine reports the loading, the strength and the duty per gallon it actually used alongside the gallons per minute, rather than only the gallons.

When a circulation looks wrong, work backwards up the chain rather than doubting the arithmetic. The acid gas rate is a gas-side answer and is usually right. The swing, the strength and the gravity are all values somebody chose, and one of them is nearly always the reason.

## One number that is not in the chain

The contactor's diameter is nowhere in this. A circulation of 525.893013 gpm says how much solution has to move and says nothing whatever about how wide the vessel has to be. That is a separate calculation with separate inputs, and the last module of this tier is about it.

## Exercise

Record the acid gas rate, the swing, the molecular weight, the strength and the solution gravity for UBIE, then the circulation they give. Then name which of those five is chemistry, which is process, and which are operating practice.
