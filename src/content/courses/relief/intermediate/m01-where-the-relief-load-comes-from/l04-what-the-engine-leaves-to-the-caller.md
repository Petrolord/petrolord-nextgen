# What the engine leaves to the caller

{{panel:fc-fire-drum-explorer}}

An engine is honest when it says what it does not do. This one is unusually clear about it, and reading that list first saves a whole class of mistakes later in the tier.

## The four things this tier hands back

| left to the caller | why |
| --- | --- |
| the wetted height truncation at 25 ft | it depends on a plot elevation the engine is never told |
| which scenario is the governing case | a judgment, and no route takes it as an input |
| the conversion from a standard rate to an actual one | the drum route reads the actual rate only |
| the liquid density and vapour viscosity at drum conditions | fluid properties, which this module holds no tables for |

Each of those four is a place where a perfectly correct engine answer can be the wrong answer to your question. None of them is a defect. All four are boundaries, and the module states them.

## What is computed and what is typed

The closed forms this module can derive, it derives. The gas coefficient C from the specific heat ratio, the critical pressure ratio from the same, the subcritical F2, the viscosity correction from the Reynolds number, the Napier correction from the pressure, the exact circular segment behind every wetted area, the terminal velocity balance behind every settling answer, and the whole blowdown march.

The ones published as charts and tables enter as typed inputs with their references named. The balanced bellows back pressure factors Kb for gas and Kw for liquid, the steam superheat factor KSH, and the API 526 orifice table. A typed factor is a number somebody read off a curve, and the only honest way to carry one is to name where it came from.

## The return contract, and why a guard needs it

Every route that returns an object keeps one contract: either a finite result, or an object carrying an `error` string. Call the wetted area route with an orientation it does not recognise and it answers `orientation must be 'horizontal' or 'vertical'` rather than quietly defaulting to one of them. Call the drum route with a level fraction of one and it answers with an error about the fraction instead of dividing by a vapour area of zero.

That contract is what makes a caller's error check work. A non-finite number arriving with no error key is exactly what a guard reading the error key cannot see, so the module is built to never produce one.

Two routes carry a third kind of field. The pool fire duty comes back with its duty and a note, and the note is present on every duty this route returns. The fire relief load comes back with its load and a warning slot, and that slot holds a null when there is nothing to say. A warning slot holding a null is a promise that the check ran, which is worth more than a missing key.

## The habit for the rest of the tier

Read the boundary before the answer. For every figure this tier produces, ask which of the four handed-back items it depends on. A wetted area depends on a level somebody trimmed. A drum length depends on a rate somebody converted. A letter depends on a scenario somebody chose.

## Exercise

Write out the four things this tier leaves to the caller with the reason beside each. Then name the three typed factors and the one typed table the module carries, and state the contract every object-returning route keeps.
