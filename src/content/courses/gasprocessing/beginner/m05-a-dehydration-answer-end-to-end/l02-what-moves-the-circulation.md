# What moves the circulation

The glycol circulation in gpm has three parents and nothing else reaches it. The load per MMscf, the rate, and the circulation ratio. This lesson takes each one on its own so that a circulation figure can be read backwards to whichever of the three moved.

{{panel:fc-water-explorer}}

## The spec, holding the rate and the ratio

| outlet spec, lb/MMscf | circulation, gpm |
| --- | --- |
| 7.000000 | 6.399830 |
| 4.000000 | 6.813163 |
| 2.000000 | 7.088719 |
| 1.000000 | 7.226497 |
| 0.500000 | 7.295386 |

A tighter spec raises the circulation, because it raises the load. The inlet content caps how far that can go, since a unit cannot remove more water than arrived.

## The rate, holding the spec and the ratio

| rate, MMscfd | circulation, gpm |
| --- | --- |
| 10.000000 | 1.032231 |
| 30.000000 | 3.096692 |
| 62.000000 | 6.399830 |
| 120.000000 | 12.386768 |
| 250.000000 | 25.805766 |

More gas, more water, more glycol. The rate reaches the circulation through the load a day, which is the one multiplication where it enters the chain.

## The ratio, holding the spec and the rate

| gal per lb | circulation, gpm |
| --- | --- |
| 2.000000 | 3.999894 |
| 3.000000 | 5.999841 |
| 3.200000 | 6.399830 |
| 4.000000 | 7.999788 |
| 5.000000 | 9.999734 |

A higher ratio means more gallons for the same pound of water, so the circulation rises. This is the lever that moves the circulation without anything having changed about the gas at all.

## What does not reach the circulation

The circulation follows from the load a day, the circulation ratio and the minutes in a day. Nothing else is in that expression, so nothing else can move it. The still temperature and the reflux ratio act on the heat terms and appear nowhere in the three factors above. The lean glycol strength acts on the loop water balance, which is what a gallon is carrying rather than how many gallons there are, and it is likewise absent from the three. The gas pressure and temperature reach the circulation only through the inlet water content, and once the content is fixed they have no further say.

A circulation that rose with nothing else on the data sheet changed has to be a ratio change, a rate change, or a conditions change working through the content.

## The rate and the ratio look alike and are not

Both of them raise the circulation, so on a single answer they are indistinguishable. They are completely different decisions. The rate is given to the plant by the reservoir and the contract, and a designer takes it. The ratio is chosen by a designer and can be changed in an afternoon.

They also differ in what they drag along. A rate change moves the water removed a day and every extensive figure below it. A ratio change leaves the water removed a day where it was, because the same pounds are still coming out of the same gas. It moves how much glycol carries them and what a gallon costs.

## Reading a circulation backwards

Given a gpm and nothing else, you cannot say which parent produced it. Given a gpm and the load a day, the ratio follows. Given a gpm and the ratio, the load a day follows. Two of the three always give the third, which is what makes a single quoted circulation almost useless on its own.

## Exercise

Record the circulation at each row of all three tables. Then take 6.399830 gpm and say what three figures you would need alongside it to know how it was arrived at, and name three inputs on the dehydration page that cannot have affected it.
