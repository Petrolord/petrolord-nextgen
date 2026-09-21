# A product that boils at ambient is refused

The loss relations in this module have a range, and the input that takes them outside it is the true vapour pressure. Past a point the relations do not merely become inaccurate. They stop having a defined answer, and the engine refuses rather than returning one.

## The refusal, in the engine's own words

> a true vapour pressure of 15.4 psia is at or above the stated atmospheric pressure of 14.7 psia: the product boils at ambient and this is not a fixed-roof tank problem. It needs a pressure vessel or a refrigerated tank, and these relations do not apply to it

Two things are being said there. One is arithmetic and one is engineering, and both matter.

## The arithmetic

The vapour space expansion factor carries the difference between atmospheric pressure and the vapour pressure in a denominator. As the vapour pressure approaches atmospheric that difference goes to zero, and at or above it the difference is zero or negative, so there is no standing loss to return.

On this tank the true vapour pressure is 2.370000 psia and the expansion factor comes back as 0.042556.

## Why the total would hide it

This is the part worth remembering. The working loss does not carry that denominator. A package that computed both halves and returned only their sum could return a total that looked like a loss on a product that boils at ambient, because the working half would still produce a number.

A reader seeing only the total has no way of knowing that one of its two components was undefined. That is why the refusal is raised on the calculation rather than left to a reader to notice, and it is a good argument for engines returning their components rather than only their sums.

## The engineering

The second half of the message is the more useful half in practice. A product whose true vapour pressure is at or above atmospheric is not a fixed-roof tank problem at all. A fixed-roof tank is a vessel at very close to atmospheric pressure, and a product boiling at ambient will not sit quietly in one. The engine names the alternatives: a pressure vessel or a refrigerated tank.

That is a refusal that redirects. It does not only say the calculation cannot be done. It says the equipment in the question is the wrong equipment, which is the answer the person asking actually needs.

## The pattern across this tier

Three refusals in this tier are three different kinds. A fill height below zero is an impossible input. A product boiling at ambient is a valid input outside the relations' range. A fire vent capacity is a question the package cannot source an answer for. Which kind you are looking at tells you what to do next.

## Exercise

Read the boils at ambient refusal quoted in this lesson and say which of the two loss halves carries the denominator that fails. Then say what a package returning only the total would show for the same case.
