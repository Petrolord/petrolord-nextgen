# The calculator panels and the refusals

{{panel:marine-voyage-calculator}}

This is an app course. The practicals run in the course's own calculator panels, which call the same engine the lessons quote, and a Suite user will find the same figures in the Marine Logistics Planner, in the Suite's Midstream & Downstream module. You never need the Suite to finish an exercise. This lesson shows how the voyage and fleet calculator works, what a refusal is, and what the course grades.

## One panel, two views

The voyage and fleet calculator has a View selector with two choices: "The voyage plan", which this tier uses, and "Fleet sizing for a period", which the Professional tier uses. A Start from selector loads a teaching case into a text box that holds the call's inputs as JSON. Above the box sits a labelled control for every required input, from the speed to each installation's cargo. Each control shows the value the box states, or "not stated", and writes your change into the box. When a case file holds several calls, the "Block of the case file" selector chooses one.

## A refusal is the engine's answer to a bad input

When an input is missing, out of range or unknown, the engine returns no figure. It returns an error and the name of the field it refused, and the message begins with that name. The panel prints it under the heading "THE ENGINE REFUSED, IN ITS OWN WORDS". Two to meet now. With the speed left unstated:

> vessel.speedKnots must be a finite number above 0; got nothing

With a key the engine does not read, such as fuelPrice typed in place of fuelPricePerT:

> fuelPrice is not an accepted key; the accepted keys at the top level are vessel, products, installations, route, portHours, weather, fuelPricePerT

The first says the engine guesses no speed. The second says it drops no input silently: a misspelt key is refused, so you never believe an input applied when it did not. When a box has both faults, the unknown key is refused first.

## A result with a reason is no refusal

When a voyage's cargo is larger than the deck, the engine still returns a full voyage plan and names each overloaded constraint in its reasons. That is a result, and the course calls it an overloaded voyage. The course keeps the word "refused" for an input the engine would not accept.

## What is graded

Every graded number is a value the engine returns on fixed inputs written down in advance, so a graded question has exactly one right answer. The Associate capstone runs a synthetic cluster of its own, which appears in no lesson, and you work it in this calculator. Each graded figure is quoted to six decimals, as the panel prints it.

## Exercise

In the voyage and fleet calculator, set View to "The voyage plan" and Start from to "Ekene PSV milk run, rainy season". Clear the "Speed, knots (stated)" control and check that the refusal matches the first message above, word for word; then type 11 back. Next, in the JSON box, rename the key fuelPricePerT to fuelPrice and read the second refusal. Check that the message begins with the field the panel names, then restore the key and confirm that the Ekene plan returns.
