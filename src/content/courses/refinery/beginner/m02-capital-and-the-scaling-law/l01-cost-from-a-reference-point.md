# Cost from a reference point

A screen does not estimate a refinery's capital from a list of equipment. It starts from one price somebody has already paid or been quoted, and scales that price to the size being screened.

{{panel:refinery-screen-explorer}}

## The reference point

OKORDIA's reference point is a vendor quotation of 64000000.00 US dollars for a 5000 bpd plant. That pair, a cost and the capacity it buys, is the only capital information the screen holds. Everything else about capital is derived from it.

The derivation is one line. scaleCapex computes:

cost = reference cost x (capacity / reference capacity) ^ exponent

The capacity you screen is divided by the reference capacity, the result is raised to an exponent, and the reference cost is multiplied by what comes out. At the reference capacity the bracket is 1, and 1 raised to any exponent is 1, so the screen returns the quotation itself: 64000000.00 at 5000 bpd, on either law.

## Three inputs and a choice

The function needs a reference cost, a reference capacity and a target capacity. It also needs an exponent, which is the choice the next lesson is about. When no exponent is passed, scaleCapex uses the modular one. At 20000 bpd with no exponent passed it returns a cost of 222860944.20 and reports its exponent as 0.9.

That default is worth knowing before you trust a figure. A panel that shows one cost and hides the exponent has made a choice for you. The screen explorer shows the exponent beside the cost so the choice is visible.

## When there is no reference

Take away any of the three inputs and scaleCapex has nothing to scale. Given a capacity of 0, a blank reference cost or a blank reference capacity, it returns null for the cost and null for the cost per bpd. The screen does not invent a quotation.

This is the same discipline the first module showed for money boxes. A screen that makes up a number where an input is missing hides the gap in a result that looks like any other.

## Where the reference comes from

In a real screen the reference point is the most important number on the page, because every capital figure on the capacity axis is a multiple of it. A quotation for a plant of a similar configuration, from a similar supplier, close in date, is a good reference. A quotation for a very different plant makes every scaled figure inherit its differences. The formula is exact; its input is an estimate, and scaling cannot improve an estimate.

It follows that the reference point deserves its own line in any screening note: who quoted it, for what scope, and when. The scaled figures deserve a line saying which exponent produced them.

## The mistake

Reading a scaled cost as a second quotation. A cost at 20000 bpd of 222860944.20 is the 5000 bpd quotation carried through an exponent. Nobody quoted it. If the vendor were asked for a 20000 bpd plant, the answer would replace the scaled figure.

## Exercise

On the panel, set the capacity to 5000 bpd and read the cost under both laws; then set it to 20000 bpd and read the cost with no exponent chosen. Using the formula, explain why both laws return 64000000.00 at 5000 bpd, and say which law produced the 222860944.20 figure and how you can tell from what the engine reports.
