# The chain from line conditions to duty

Every figure the last four modules produced belongs to one chain, and the chain runs in one direction with no loops in it. This lesson puts it end to end so the shape is visible before the next three lessons start moving things.

{{panel:fc-water-explorer}}

## The chain, in order

Line conditions of 950.000000 psia and 104.000000 degF give a vapour pressure of 1.069612 psia. That over the total pressure is a mole fraction of 0.001125908. Through the pound mole and the molecular weight of water, the content is 53.450380 lb per MMscf.

A contract spec of 7.000000 lb per MMscf leaves a load of 46.450380 lb per MMscf. At 62.000000 MMscfd that is 2879.9235 lb a day. A chosen circulation of 3.200000 gal per lb makes it 9215.7553 gallons a day, which over the minutes in a day is 6.399830 gpm.

Each of those gallons takes 1386.1650 Btu to reach the still and 429.6875 Btu to give its water up, 1815.8525 Btu in all, and the reboiler is 0.697269 MMBtu an hour.

## What enters at each step

Two conditions enter at the top and never appear again. One contract number enters at the spec. One rate enters at the load. One design choice enters at the circulation. Three more design choices enter inside the heat terms, being the still temperature, the specific heat and the reflux ratio.

Nothing enters twice and nothing feeds back. The content does not depend on the circulation, the circulation does not depend on the duty, and no step ever revises a step above it. That is why this chain can be written as a list rather than drawn as a diagram with arrows going both ways.

## Why a closed form chain is worth spending a tier on

Most of what a process engineer meets is not like this. An absorber with stages, a flash with a composition, a compressor with an efficiency curve: all of them iterate, and when a number comes out wrong there is no single place to look.

Here there is. Every figure in the chain has exactly one parent and exactly one operation above it. If the duty is wrong, the gallons a day are wrong or one of the heat terms is wrong, and you can settle which in one reading. That property is worth more to a learner than any individual result in it.

## The two kinds of figure in the chain

Some figures in the chain are intensive and some are extensive. The content and the load and the Btu a gallon do not know the rate exists. The lb a day, the gallons a day, the gpm and the MMBtu an hour are those figures with the rate applied. Keeping that split in view is the discipline the whole tier has been building.

## Exercise

Write the OBIAFU chain as a single ordered list from 950.000000 psia to 0.697269 MMBtu an hour, naming every figure in between. Then mark each entry as intensive or extensive, and mark every point where an input entered the chain.
