# Spread and the chance of a loss

{{panel:farmout-valuation-calculator}}

The farm-out raises EKO's EMV. It also changes how widely EKO's outcome can swing, and the chance that EKO loses money. This lesson reads both on the Ekene Deep positions (synthetic) and on the Penn State figures.

## The standard deviation falls

The standard deviation is closed form: the same terms give the same figure on any machine (engine).

| golden case | position | EMV | standard deviation | chance of a loss (draws) |
| --- | --- | --- | --- | --- |
| risk-ekene | EKO drills Ekene Deep alone (70%) | 18418808.982316 | 80399735.584206 | 0.752450 |
| risk-ekene | EKO after the farm-out (40% and the cash) | 19833033.704181 | 46115911.128875 | 0.747650 |

Drilling alone, EKO carries a standard deviation of 80399735.584206. After the farm-out it carries 46115911.128875. The farm-out gives FIN part of the prospect and part of the well cost, so EKO's success payoff shrinks and its dry-hole loss shrinks with it. On these terms EKO gets a higher EMV and a narrower spread in the same deal.

## The chance of a loss is an estimate

Both Ekene positions lose money on a dry hole and on nothing else, so each loses with the dry-hole chance: 100 less the stated 25.000000 percent, over 100, which is 0.750000. The engine does not compute that figure directly. It draws outcomes and counts the losses:

> EKO drills Ekene Deep alone (70%): EMV 18418808.98, standard deviation 80399735.58; chance of a loss 0.75245 (20000 draws, seed 20271111); low case -28000000, high case 157675235.93

With 20000 seeded draws it estimates 0.752450 and 0.747650, each within 0.015309 of 0.750000, which is five standard errors of a proportion at that chance. The two estimates differ from each other and from 0.750000 only because they are draws.

That is why no capstone grades a chance of a loss. The EMV and the standard deviation are return values on fixed terms; the chance of a loss is a sample.

## The Penn State figures

The risk view also runs the drill yourself or farm out problem of Penn State EME 801, Lesson 6, using its printed payoffs and chances (cited for its numbers only, CC BY-NC-SA 4.0). With seed 7 and 50000 draws (engine):

| golden case | position | EMV | standard deviation | chance of a loss (draws) |
| --- | --- | --- | --- | --- |
| risk-psu | drill yourself | 12500.000000 | 357727.200531 | 0.651800 |
| risk-psu | farm out | 17500.000000 | 23848.480035 | 0.000000 |

Farming out on those figures pays 0.000000 on a dry hole, so it never loses: its chance of a loss is 0.000000. Drilling yourself loses on every dry hole, and the draws estimate 0.651800 where the page states a dry-hole chance of 65.000000 percent.

## What the spread tells a farmor

A farmor comparing positions reads the EMV first and the spread beside it. When a deal raises the EMV and narrows the spread together, as it does here, the comparison is easy. When a deal lowers the EMV but narrows the spread, the choice depends on how much risk the company can carry, which is a question for the portfolio course.

## Exercise

Open the valuation calculator on the view "Risk sharing: spread, the chance of a loss, the low and high cases" and start from "The Ekene farmor alone and after the farm-out". Read the EMV, the standard deviation and the chance of a loss for each position, and the note under the table that says which figures are estimates. Work out the dry-hole chance from the chance of success in the box and compare it with both estimates. Then choose the start **The Penn State figures** and explain, from the payoffs in the box, why the farm out position shows a chance of a loss of 0.000000.
