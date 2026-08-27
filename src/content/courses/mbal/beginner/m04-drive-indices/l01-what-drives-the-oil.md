# What drives the oil

Module 3 answered how much oil was in the tank. This module answers the other half of the question module 1 asked: what is pushing it out.

The two questions are the same arithmetic read in two directions. The balance says the volume withdrawn equals the volume supplied by expansion. Module 3 used that to count the oil. Module 4 uses it to ask which part of the expansion did the supplying, and reports the answer as a set of shares called drive indices.

## The candidates

When a barrel of oil leaves the reservoir, something has to occupy the space it vacated. In a general oil tank there are four candidates.

The oil itself expands. Drop the pressure on a compressed liquid and it takes up more room. This is the depletion drive contribution.

The rock and the connate water squeeze in. The grain framework compacts as the pressure supporting it falls, shrinking the pore volume, and the immovable water in those pores expands at the same time. Both effects push oil out and both are collected in the $E_{fw}$ term.

A gas cap expands, if there is one. Free gas above the oil is far more compressible than anything else in the tank, so where a gas cap exists it usually dominates. Ekene has none: the fixture sets $m = 0$, meaning zero reservoir barrels of gas cap per reservoir barrel of oil, and the tank never falls below its bubble point of 2000 psia, ending at 2096.00826266700 psia, so no gas comes out of solution either.

Water arrives from outside. An aquifer in pressure communication with the tank pushes water across the boundary as the tank's pressure falls. Ekene has none of this either, and module 3's flat $F/E_t$ column is exactly how you know.

So on Ekene there are two live candidates, and one of them is the one beginners assume does not matter.

## Shares before you divide anything

You can see the answer before you compute a single index, because the drive split is already visible in the expansion terms per psi of drawdown.

Ekene's oil expands at $0.0000144$ reservoir barrels per stock tank barrel per psi, which the engine returns as $0.000014399999999999886$, and its rock and connate water term contributes $0.00000932307692307692$ reservoir barrels per stock tank barrel per psi. Multiply each by the twelve million stock tank barrels in the tank and you get the whole tank's response to one psi:

| contribution | rb per psi of drawdown |
|---|---|
| oil expansion | 174.804596747953 |
| rock and connate water | 113.174770971432 |
| total | 287.979367719385 |

Every psi Ekene loses creates 287.979367719385 reservoir barrels of room, of which oil expansion supplies about 175 and the rock and water term supplies about 113. That is the drive split, in engineering units, before anyone has divided anything.

## From shares to indices

An index is that same share written as a fraction of the withdrawal it is explaining. Take each expansion term, multiply by the oil in place to turn it into a reservoir volume, and divide by the withdrawal being apportioned:

$$\text{DDI} = \frac{N E_o}{A}, \qquad \text{SDI} = \frac{N E_{fw}}{A}, \qquad \text{GDI} = \frac{N m E_g}{A}, \qquad \text{WDI} = \frac{W_e - W_p B_w}{A}$$

$A$ is the withdrawal the indices apportion. Lesson 3 defines it exactly and explains why it is not always the same as $F$. On Ekene the two are identical, because no water has been produced at any survey.

Indices are dimensionless, they are shares of one job, and if the books close they sum to one. That last property is the reason they are worth computing at all: an index set that does not sum to one is telling you something is missing or double counted, and lesson 3 is about the commonest reason for that.

## Work the split by hand

Divide the oil expansion contribution by the total, using the per psi numbers above:

$$\frac{174.804596747953}{287.979367719385} = 0.607003891050582$$

The engine, working from the full survey history rather than from a per psi rate, reports a final depletion drive index of $0.607003891050583$. The two agree to fourteen significant figures, and they should, because they are the same ratio computed two ways.

That is worth pausing on. The drive index is not a fitted quantity, not a tuned quantity, and not a model output in any interesting sense. It is the ratio of one expansion term to the withdrawal, and you can get it from a per psi stiffness on the back of an envelope.

## Read the definition, not the acronym

One naming trap, and it will bite you the first time you compare this engine's output against a textbook.

In this engine's oil path the gas cap has its own index, GDI, and the letters SDI carry the rock and connate water compressibility term. The engine mirrors the same value into a field named for compressibility drive, and the source comment defines it plainly as the rock plus water contribution. Some textbooks and some commercial packages use SDI for segregation drive, meaning the gas cap, which here is GDI.

The acronyms are not standard across the industry. The formulas are. Whenever you read an index set, find the numerator that produced each number before you interpret it, and if a report does not tell you its numerators, treat its labels as unverified.

## Why the rock and water share is not a footnote

Most introductions say the rock and connate water term is negligible and can be dropped from undersaturated oil calculations. On Ekene it is 113.174770971432 of every 287.979367719385 reservoir barrels created, which is nearly two fifths of the drive.

The reason is that undersaturated oil is not very compressible. Above the bubble point no gas is coming out of solution, so oil expansion is limited to the modest swelling of a liquid. The rock and the connate water are stiffer than the oil per unit volume, but there is a great deal of rock, and the $1 - S_{wi}$ in the denominator of the $E_{fw}$ term amplifies it further on a tank like this one where 35 percent of the pore space is connate water. Two modest contributions of comparable size, not one dominant one.

Lesson 4 returns to what that means for the field's future. For now, take the general rule: the term you were told to neglect deserves a calculation, not an assumption.

## Exercise

Using only the per psi table above, predict the two Ekene drive indices to three decimal places before you compute anything else, and predict what the water drive index must be.

Then answer this in words. If a second tank had the same oil in place and the same rock and water properties but a much more compressible oil, would its depletion drive index be higher or lower than Ekene's, and would its total reservoir barrels created per psi go up or down?
