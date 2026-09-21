# The correlation's range

Z in a CNG bank comes from the Dranchuk-Abou-Kassem correlation, and a correlation is fitted over a range. `gasMassInVessel` prints the range, says on each result whether the bank sits inside it, and still answers outside it with a note. This lesson reads that behaviour.

{{panel:gasvalue-rollout-explorer}}

## The range

lpgCng exports DAK_RANGE: ppr 0.2 to 30, tpr 1 to 3. ppr is the reduced pressure and tpr the reduced temperature, both on Sutton pseudo-criticals.

IBAFO's three banks sit inside it. At 30 C their tpr is 1.5266. Their ppr is 4.9479, 5.3782 and 5.8084. All three print correlationInRange true.

## A bank outside it

Outside the range the engine still answers and says so. The probe is IBAFO's Low bank at -80 C:

| probe | tpr | correlationInRange | correlationNote |
| --- | --- | --- | --- |
| the Low bank at -80 C | 0.9727 | false | Outside the range the Dranchuk-Abou-Kassem correlation was fitted over. The value is an extrapolation and should be checked against measured data. |

At -80 C the bank's tpr is 0.9727. DAK_RANGE's tpr runs from 1 to 3, and the result prints correlationInRange false.

## An answer with a note

The engine does not refuse this bank. It computes Z and a mass, sets correlationInRange to false, and attaches the note: "Outside the range the Dranchuk-Abou-Kassem correlation was fitted over. The value is an extrapolation and should be checked against measured data."

So there are two kinds of answer from this function. Inside the range, as on IBAFO's three banks at 30 C, correlationInRange is true. Outside it, as on the Low bank at -80 C, correlationInRange is false, and the note says the value is an extrapolation that should be checked against measured data.

## Refused, answered, noted

Set this beside the refusals the bank has already met. No pressure, a blank gas gravity and no temperature are each refused, with sentences that name the missing input: "REFUSED: A temperature is required." is the third. A temperature that puts the bank outside the correlation is answered, with the flag and the note.

## The oracle and the coefficients

The DAK and Sutton coefficients are pinned: they are part of the engine, and the oracle does not validate them. The oracle checks Z by bisection on reduced density with a second correlation as a plausibility check.

In practice, a bank run cold enough to leave the range is a case for the measured data the note asks for.

## In the explorer

Open IBAFO's Low bank. Read tpr, ppr, Z and correlationInRange at 30 C, where the bank sits inside the range. Set the temperature to -80 and read tpr, correlationInRange and the note.

## Exercise

Read DAK_RANGE, ppr 0.2 to 30 and tpr 1 to 3, and the Low bank at -80 C: tpr 0.9727, correlationInRange false, and the note. Say what the engine does with a bank outside the range, what the note asks for, and how that answer differs in kind from the answer to a bank with no temperature.
