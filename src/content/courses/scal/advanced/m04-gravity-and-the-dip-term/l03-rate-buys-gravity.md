# Rate buys gravity

Of the six inputs to the gravity number, five are properties of the rock, the fluids, or the structure. You do not get to choose the density contrast or the dip of the Ekene sand. The one lever the operator holds is the total rate, and it sits in the denominator: $G$ scales as $1/q_t$. This lesson walks that lever through a full ladder and shows what it costs to harvest gravity.

## The ladder

Hold the geometry fixed at the worked example of lesson 2 (k 250 md, A 20000 ft2, dip 5 degrees updip, gammaW 1.03, gammaO 0.8654434250764526, muW 0.5, muO 1.8) and vary only the rate:

| qt (rb/d) | G | Swf | EDbt |
| --- | --- | --- | --- |
| 250 | 0.07776435079048831 | 0.6392 | 0.5116763590144309 |
| 500 | 0.038882175395244155 | 0.6379999999999999 | 0.5102855131161252 |
| 4000 | 0.004860271924405519 | 0.6372 | 0.5090544236725548 |
| 8000 | 0.0024301359622027597 | 0.6372 | 0.5089658690865421 |

Check the scaling first: halving the rate exactly doubles $G$, because nothing else in the formula moved. 0.07776435079048831 is exactly twice 0.038882175395244155. The designed case of the capstone, 10 degrees at 2000 rb/d, sits on a ladder of its own with $G$ 0.019367108489507776. The engine is doing no modelling here, only arithmetic; the modelling is in what the enlarged $G$ does to the curve.

Now read the efficiency column. Cutting the rate from 8000 to 250 rb/d, a factor of thirty two, lifts EDbt from 0.5089658690865421 to 0.5116763590144309. That is 0.0027 of displacement efficiency, about a quarter of a saturation point, purchased by making the flood thirty two times slower. Recall from the Associate tier that at 8000 bwpd the Ekene pattern reaches breakthrough in roughly nine hundred days; at 250 the same pore-volume throughput takes thirty two times as long. Slow floods harvest gravity. Whether the harvest pays for the calendar is an economics question, and on this favorable flood the answer is plainly no.

## The vanishing act at field rate

Look at the 4000 and 8000 rb/d rows. The front saturation reads 0.6372, which is exactly the flat-case front. Gravity has not switched off: at 8000 rb/d $G$ is 0.0024301359622027597, not zero, and EDbt still reads 0.5089658690865421 against the flat 0.5088773453049006. What happened is quantization. The Welge scan reports the front on a grid of 0.0004, and at this rate the corrected tangency no longer clears the next grid point, so the front snaps back onto the flat value while the efficiency, a continuous quantity, still carries the correction. Two lessons ago you were told to distrust small differences in Swf between similar cases; here is the concrete instance. When you want to detect a small physical effect, read EDbt, not Swf.

{{panel:sc-design-explorer}}

In dip mode, sweep the rate slider across the ladder values and watch three tiles: the gravity coefficient, the front saturation, and EDbt. The coefficient moves smoothly as 1 over rate, EDbt moves smoothly with it, and Swf moves in steps. Find the rate at which Swf first leaves 0.6372, and note that nothing special happens to EDbt there.

## What the ladder is for

The practical use of this table is not to pick a rate; rates are picked by facilities, well count, and voidage targets, as the Waterflood course will make explicit. The use is diagnostic. If someone presents two simulation cases that differ in rate and credits the slower one with better displacement, this ladder tells you how much of that credit can possibly be gravity: on Ekene-like properties, a few thousandths of ED. Anything larger is coming from somewhere else in their model, and you should go find it.

## The misconception: the term as a constant

Because $G$ is presented as "the gravity number of the case," it is tempting to compute it once and carry it between studies. It is not a rock property. Change the rate and it changes; change the completion so the same barrels flow through half the area and it changes; deepen the oil and both the viscosity and the density contrast change it twice over. The only safe habit is the one lesson 1 taught: rebuild the chain from its six inputs every time, and let the engine confirm.

## Exercise

First, using only the 1/qt scaling and the 5 degree value at 500 rb/d, 0.038882175395244155, write down $G$ at 2000 rb/d, then state which two rows of the ladder bracket the rate at which $G$ crosses 0.05.

Second, the EDbt gain from 8000 down to 250 rb/d on this ladder is 0.0027. Using the Associate tier's breakthrough time of 926.6051908800841 days at 8000 bwpd, estimate the breakthrough time at 250 bwpd in years, and write the one-sentence recommendation you would actually give the asset team.
