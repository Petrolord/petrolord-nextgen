# Rate buys gravity

Of the six inputs to the gravity number, five are properties of the rock, the fluids, or the structure. You do not get to choose the density contrast or the dip of the Ekene sand. The one lever the operator holds is the total rate, and it sits in the denominator: $G$ scales as $1/q_t$. This lesson walks that lever through a full ladder and shows what it costs to harvest gravity.

## The ladder

Hold the designed case fixed (k 250 md, A 20000 ft2, dip 10 degrees updip, gammaW 1.03, gammaO 0.8654434250764526, muW 0.5, muO 1.8) and vary only the rate:

| qt (rb/d) | G | Swf | EDbt |
| --- | --- | --- | --- |
| 500 | 0.0774684339580311 | 0.6392 | 0.511665846741284 |
| 1000 | 0.03873421697901555 | 0.6379999999999999 | 0.5102801711629814 |
| 2000 | 0.019367108489507776 | 0.6376 | 0.5095807170488317 |
| 8000 | 0.004841777122376944 | 0.6372 | 0.5090537496023166 |

Check the scaling first: halving the rate exactly doubles $G$, because nothing else in the formula moved. 0.0774684339580311 is exactly four times 0.019367108489507776. The engine is doing no modelling here, only arithmetic; the modelling is in what the enlarged $G$ does to the curve.

Now read the efficiency column. Cutting the rate from 8000 to 500 rb/d, a factor of sixteen, lifts EDbt from 0.5090537496023166 to 0.511665846741284. That is 0.0026 of displacement efficiency, about a quarter of a saturation point, purchased by making the flood sixteen times slower. Recall from the Associate tier that at 8000 bwpd the Ekene pattern reaches breakthrough in roughly nine hundred days; at 500 the same pore-volume throughput takes sixteen times as long. Slow floods harvest gravity. Whether the harvest pays for the calendar is an economics question, and on this favorable flood the answer is plainly no.

## The vanishing act at field rate

Look at the 8000 rb/d row. The front saturation reads 0.6372, which is exactly the flat-case front. Gravity has not switched off: $G$ is 0.004841777122376944, not zero, and EDbt still reads 0.5090537496023166 against the flat 0.5088773453049006. What happened is quantization. The Welge scan reports the front on a grid of 0.0004, and at this rate the corrected tangency no longer clears the next grid point, so the front snaps back onto the flat value while the efficiency, a continuous quantity, still carries the correction. Two lessons ago you were told to distrust small differences in Swf between similar cases; here is the concrete instance. When you want to detect a small physical effect, read EDbt, not Swf.

{{panel:sc-design-explorer}}

In dip mode, sweep the rate slider across the ladder values and watch three tiles: the gravity coefficient, the front saturation, and EDbt. The coefficient moves smoothly as 1 over rate, EDbt moves smoothly with it, and Swf moves in steps. Find the rate at which Swf first leaves 0.6372, and note that nothing special happens to EDbt there.

## What the ladder is for

The practical use of this table is not to pick a rate; rates are picked by facilities, well count, and voidage targets, as the Waterflood course will make explicit. The use is diagnostic. If someone presents two simulation cases that differ in rate and credits the slower one with better displacement, this ladder tells you how much of that credit can possibly be gravity: on Ekene-like properties, a few thousandths of ED. Anything larger is coming from somewhere else in their model, and you should go find it.

## The misconception: the term as a constant

Because $G$ is presented as "the gravity number of the case," it is tempting to compute it once and carry it between studies. It is not a rock property. Change the rate and it changes; change the completion so the same barrels flow through half the area and it changes; deepen the oil and both the viscosity and the density contrast change it twice over. The only safe habit is the one lesson 1 taught: rebuild the chain from its six inputs every time, and let the engine confirm.

## Exercise

First, using only the 1/qt scaling and the designed-case value 0.019367108489507776, write down $G$ at 4000 rb/d, then state which two rows of the ladder bracket the rate at which $G$ crosses 0.05.

Second, the EDbt gain from 8000 down to 500 rb/d is 0.0026. Using the Associate tier's breakthrough time of 926.6051908800841 days at 8000 bwpd, estimate the breakthrough time at 500 bwpd in years, and write the one-sentence recommendation you would actually give the asset team.
