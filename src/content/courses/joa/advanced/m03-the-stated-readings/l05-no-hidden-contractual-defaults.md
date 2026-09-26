# No hidden contractual defaults

{{panel:joa-agreement-calculator}}

Outside its three readings, the engine makes no choice for a contract: a term is stated in the call or refused. It holds no rate, multiple, share, tolerance, scale, lag or grace of its own, and the panels hold none either.

## What must be stated

Every contract term below is required, and a call without it is refused by name: the interest method and the grace hours (0 when the contract gives none), the day basis, the rate, the reconciliation lag, the negative call rule, the uplift type, the recovery share, the premium multiple, the refundable kinds under basis "contract", the overhead scale of every category, the budget tolerance, the cost oil limit and its base, and the opening pool.

A threshold, a cap and a set of consequences are optional. The engine applies each only when the call states it.

## Refusals that say "no default"

The engine's messages say plainly when a term has no default. A few, verbatim:

> uplift must be an object { type } with type "none", "compound" or "multiple" (no default); got nothing

> interest must be an object { annualRatePct, dayBasis, interestMethod, graceHours } (no default rate or method); got nothing

> premiumMultiplePct must be a number at or above 100 (a stated contract figure; 100 recovers the cost alone); got nothing

A term a text prints is still a stated input. The Norwegian agreement prints one thousand percent for entry, 10 percent for a budget item and the lower of 5 percent and NOK 75 million for a budget; the Kenya model prints seventy-two hours of grace and leaves the margin over LIBOR blank. The engine holds none of these: each call states its own.

## How the panels keep the rule

Every required term has a visible control on the calculator. A control shows the term as the box states it, or "not stated", and writes your choice into the box. Choosing "not stated" removes the key, so the engine refuses by name, and the panel prints a note under the controls saying which term the box does not state. Nothing reaches the engine that the box does not show.

## Why it matters for a report

A figure computed on stated terms can be recomputed by anyone holding them, which is why a partner report lists the terms before the figures.

## Exercise

Open the agreement calculator on the view "Sole risk: the premium recovered from production". Set the control "Premium multiple, percent (stated)" to "not stated" and read the note and the refusal. Restore it, set "Mode (stated)" to "not stated" and read the refusal that names the mode. Then switch to "A default and forfeiture" and set, one at a time, the rate, the day basis, the interest method and the grace to "not stated", reading each refusal and restoring the term after each. Last, open "A carry, its recovery and the NPV" and set the uplift to "not stated".
