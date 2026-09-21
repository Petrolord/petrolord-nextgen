# Pricing the giveaway

Giveaway is measured in the property's own unit: octane numbers, kg/l, ppm. A commercial reader wants it in money. The engine does that, and it is careful about where the money comes from.

## Where a price per unit comes from

A giveaway is only worth money where a unit of the property has a price. So valueGiveaway takes a value per unit from the user and values the gap over the volume blended. Where no unit value is given, the gap is reported without a price. The engine never supplies a price per octane number of its own.

## The Apapa giveaway in money

The digest types two unit values and leaves the third blank:

| specification | giveaway | unit value $ per unit per bbl (typed) | value $ over the batch |
| --- | --- | --- | --- |
| RON | 3.5010 | 0.6 | 16804.7174 |
| MON | 3.4928 | 0.4 | 11176.9355 |
| Density | 0.0203 | not given | not priced |

Specifications with no giveaway (binding) are not listed: Sulfur, RVP.

Read each column in turn. The giveaway is the octane handed over per barrel of the blend. The unit value is what the user says one octane number is worth on one barrel: 0.6 $ for RON and 0.4 $ for MON, both invented. The value is the gap times the unit value over the whole 8000 bbl batch: 16804.7174 $ for RON and 11176.9355 $ for MON. Density's gap of 0.0203 carries no price, because none was typed, and the engine reports it as not priced. It does not report it as zero.

The binding specifications are left out, and that is correct: they give nothing away, so there is nothing to price.

## Two different questions about money

Module four reads the value of one unit of relief on each specification. At Apapa the RON minimum's value of relief is 0.0000, and the RON giveaway, priced at the user's 0.6 $, is 16804.7174 $. Those two figures answer different questions, and reading them together is one of the most useful things in this tier.

The value of relief asks what the cargo would save if the limit moved. For RON the answer is nothing: the recipe is held by sulfur and RVP, and a lower RON minimum changes nothing about the cheapest barrels.

The priced giveaway asks what the quality already delivered would fetch at the user's price per unit. It is a statement about value handed to the buyer.

A planner holds both at once. The recipe is the cheapest that meets the specifications, and it still hands over 16804.7174 $ of RON at the typed price.

## The unit discipline

The unit value is per unit of the property per barrel, which is why the value scales with the batch. It is typed, so nothing but the user vouches for it.

{{panel:crude-recipe-explorer}}

In the panel, type a unit value for density and watch its row gain a price. Clear the RON value and watch its row lose one.

## Exercise

Read the RON row: giveaway 3.5010, unit value 0.6 typed, value 16804.7174 $ over the batch. Then read the RON minimum's value of one unit of relief in the price table, 0.0000. Say what each figure measures, and say what it shows that one is positive and the other zero for the same specification.
