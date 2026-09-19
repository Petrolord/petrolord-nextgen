# The boiling point at pressure

The vaporizer's three terms meet at one temperature: the boiling point. Warm the liquid to boiling ends there, Boil it happens there, and Superheat the vapour starts there. `vaporizerDuty` takes that boiling point as an input, and it is the boiling point at the vaporizer's pressure.

{{panel:gasvalue-rollout-explorer}}

## The boiling point that matters

The boiling point that matters is the one at the vaporizer's pressure. KANO's vaporizer boils at 38 C at its pressure. The liquid enters at 18 C and the vapour leaves at 55 C, so the boiling point sits between the inlet and the outlet. On those inputs the engine gives dutyKW 85.8215 and designDutyKW 98.6948.

LPG_REFERENCE prints a typical boiling point for each component: -42 C for propane and -0.5 C for n-butane. n-butane's -0.5 C is its typical ATMOSPHERIC boiling point.

## An atmospheric boiling point typed for a liquid under pressure

Here is the shortcut the engine does not take. n-butane's typical atmospheric boiling point, -0.5 C, typed as the boiling point for a liquid entering at 18 C:

| probe | engine |
| --- | --- |
| boiling point -0.5 C, liquid in at 18 C | REFUSED: The liquid enters at 18 C, above the boiling point given (-0.5 C). A liquid above its boiling point is not liquid: give the boiling point at the vaporizer's operating pressure. |

The engine refuses it. The refusal states the two temperatures, 18 C and -0.5 C, and asks for the boiling point at the vaporizer's operating pressure.

## The outlet has a rule too

The vapour must leave above the boiling point. Vapour out at 30 C, below the 38 C boiling point:

| probe | engine |
| --- | --- |
| vapour out at 30 C, below the 38 C boiling point | REFUSED: The vapour leaves at 30 C, below the boiling point given (38 C), so it would condense. Give an outlet above the boiling point at the vaporizer's pressure. |

So the engine holds two rules on the boiling point. A liquid in above its boiling point is refused. A vapour out below it is refused. Both refusals name the boiling point at the vaporizer's pressure.

## A blank boiling point

A boiling point left blank is not refused. The engine gives the boil alone:

| field | with the boiling point blank |
| --- | --- |
| dutyKW | 71.8176 |
| missingTerms | Warm the liquid to boiling; Superheat the vapour |

71.8176 kW is the Boil it term from KANO's full result. The two terms that need the boiling point are named in missingTerms. The engine attaches a note that lists the same two terms, says that the duty covers only the terms supplied, and calls the figure a floor. It is a floor on the duty. The duty on KANO's full inputs is 85.8215 kW.

That gives three cases on one input. The boiling point at the vaporizer's pressure, 38 C, gives the full duty. An atmospheric boiling point below the inlet is refused. A blank gives the boil as a floor, with the missing terms named.

In practice, the boiling point at a vaporizer's pressure is read from the product's vapour pressure data for that pressure.

## In the explorer

Open KANO's vaporizer. Type -0.5 as the boiling point and read the refusal. Type 38 again, then set the outlet to 30 and read the second refusal. Restore 55, clear the boiling point and read dutyKW and missingTerms.

## Exercise

Read the three results on KANO's vaporizer: the boiling point 38 C giving dutyKW 85.8215; the boiling point -0.5 C refused with the liquid in at 18 C; the boiling point blank giving dutyKW 71.8176 with two missing terms. Say which boiling point the engine asks for, what each refusal names, and what the engine calls the figure it returns when the boiling point is blank.
