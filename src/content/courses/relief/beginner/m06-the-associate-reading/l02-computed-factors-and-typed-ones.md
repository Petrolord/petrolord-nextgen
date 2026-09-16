# Computed factors, and typed ones

{{panel:fc-sizing-explorer}}

This is the reading the whole tier has been building to. Of every number in front of you, which did the engine work out, and which did somebody copy off a chart?

## One computed, one typed, on every route

| route | computed | typed |
| --- | --- | --- |
| gas and vapour | critical ratio 0.551208 | Kb 1.000000 |
| liquid | Kv 0.984776 | Kw 1.000000 |
| steam | KN 1.021727 | KSH 1.000000 |

That is the shape of API 520 Part I as this engine implements it. Each route carries one correction the engine derives and one it takes on trust.

The computed side is longer than that table suggests, because the coefficient C and the subcritical factor are computed too. Every one of them comes from a published closed form the engine evaluates on the inputs it was given.

## The typed side, with the caveat each one needs

Four things in this tier are held for literature, meaning they are taught as stated limits and never as facts the package can stand behind.

The balanced bellows factors Kb and Kw are published charts. They arrive typed, with their references named, and on the gas route the engine warns you once the back pressure ratio passes 0.300000000000 that a balanced bellows valve needs its chart factor. The superheat factor KSH is a published table with the same status, and no route in the package can check a single entry in it.

The viscosity fit is the subtlest of the four. Its three coefficients, 0.993500000000, 2.878000000000 and 342.750000000000, are an empirical fit that no route here derives, and the validation oracle shares the same three on purpose, so the oracle cannot check them either. What is checked around them is the Reynolds constant and the leading constant of the area equation.

The API 526 orifice table is the fourth. Fourteen published areas that nothing in the package computes, checked only by behaviour.

## Why the distinction is the skill

A number on a screen carries no label saying where it came from, and the two kinds behave completely differently when something goes wrong. A computed factor is wrong only if the inputs to it are wrong or the implementation is, and both of those are checkable here. A typed factor is wrong if the chart was read at the wrong condition or transcribed with two digits swapped, and nothing in this engine can see either.

So when an answer is questioned, the first move is to sort the numbers into the two piles, because it changes what you go and look at.

## The certified coefficient is always stated

Kd stands apart from both lists. It is the valve manufacturer's own certified discharge coefficient, measured on a real device on a test stand, and whatever this engine defaults to is a placeholder for it. The gas and steam streams state 0.975000 and the liquid stream states 0.650000, and those are properties of certified hardware rather than of any equation.

Every coefficient is validated on the way in. Each has to be a fraction of an ideal, above zero and no more than one, and a value outside that range is refused rather than quietly used.

## Exercise

For each of the three routes, write down the computed factor and the typed factor, then mark beside each typed one what a reader would have to go and read to check it. Finish by saying what Kd is and why it belongs in neither list.
