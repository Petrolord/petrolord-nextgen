# Controls

A well needs to be told what to do. Producers and injectors get different keywords, and every control carries a target and at least one limit.

## Producers

WCONPROD gives a producer its mode, its target and its limits. Ekene's four producers run:

    mode         ORAT   (oil rate control)
    target       1500 stb/d
    minimum BHP  1200 psia

ORAT means the well tries to produce 1500 stock tank barrels of oil per day. It will do that as long as it can, and the BHP limit is what stops it: if delivering 1500 stb/d would require pulling the bottom-hole pressure below 1200 psia, the well switches to producing whatever 1200 psia gives.

That switch is normal and it is the most important behaviour in the block. A well on rate control is on rate control until it is not, and a study that reports "the well made 1500 stb/d" without saying whether it was ever pressure-limited has left out the interesting part.

## Injectors

WCONINJE gives an injector its phase, its target and its limits:

    phase        WATER
    target       3000 stb/d
    maximum BHP  4500 psia

The structure mirrors the producer: a target rate, and a pressure limit that takes over when the target cannot be delivered. For an injector the limit is a maximum rather than a minimum, because injection pushes pressure up.

That maximum is a real operating constraint. Push above the formation parting pressure and the rock fractures, and the flood changes character entirely. A deck whose BHP limit sits above parting pressure is a deck that will happily fracture the field and not tell you.

## The other modes

A producer can be controlled on liquid rate, gas rate, reservoir volume rate or bottom-hole pressure directly. Which you choose depends on what you know.

Rate control is right when the well is constrained by facilities or by an allocation. Pressure control is right when the well is producing against a fixed system and you want the model to tell you the rate. Reservoir volume control is right when you care about voidage, which is exactly what the waterflood course's whole ledger was about.

## Limits are a list, not a single value

A real WCONPROD record carries several limits at once: oil rate, water rate, liquid rate, gas rate, reservoir rate, and BHP. The well honours the most restrictive of them at every timestep.

That is worth knowing because it means a well can be limited by something you did not intend to set. A default water rate limit left in place can shut a well in mid-run and the reported cause will be the limit, not the physics.

## What this deck's controls are for

Ekene's deck spends 36 months on HISTORY, where the wells are told their observed rates and the controls above never apply. The prediction tail after it is where WCONPROD and WCONINJE take over.

So these targets are a forecast assumption, not a description of the field. 1500 stb/d per producer is a round number chosen for the prediction period, and nothing about the history depends on it.

## The misconception to avoid

"The rate in WCONPROD is what the well produces." It is what the well ATTEMPTS. What it produces is the lesser of that target and what the reservoir will give at the pressure limit, and over a field's life most wells spend most of their time on the limit rather than on the target. Always check which control a well was actually on.

## Exercise

First, a producer is on ORAT at 1500 stb/d with a BHP minimum of 1200 psia. Describe in two sentences what happens as reservoir pressure declines over several years.

Second, explain why an injector's pressure limit is a maximum while a producer's is a minimum, and name the physical constraint the injector's limit is standing in for.
