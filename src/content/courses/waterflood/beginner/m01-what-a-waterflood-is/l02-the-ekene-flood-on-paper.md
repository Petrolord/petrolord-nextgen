# The Ekene flood on paper

Every number in this course comes from one field. Ekene is the teaching field the Petrolord courses have been building since the geoscience module mapped it: a single sand, six wells, a mapped oil water contact at 1560 m, and a booked volume of 12139208.107496763 stock tank barrels of oil in place. The reservoir courses put it on production. This course puts it on water injection.

## The wells and why two of them inject

Six wells penetrate the sand. Their positions and the depths at which they found the top of the sand were mapped in the geoscience course, and they decide everything about the flood.

| well | x, y (m) | top sand (m) | role |
|---|---|---|---|
| Ekene-1 | 1000, 1000 | 1548 | producer |
| Ekene-2 | 2200, 1150 | 1565 | injector from 2023-01-01 |
| Ekene-3 | 1400, 2300 | 1541 | producer |
| Ekene-4 | 2600, 2500 | 1590 | injector from 2023-01-01 |
| Ekene-5 | 600, 1900 | 1552 | producer |
| Ekene-6 | 1900, 1800 | 1546 | producer |

Ekene-2 and Ekene-4 are not injectors because someone chose them for their geometry. They are injectors because they were drilled as producers, found the top of the sand at 1565 m and 1590 m, and both of those depths are BELOW the 1560 m oil water contact. They were wet. A wet well in a sand you are about to flood is a gift: it is already completed in the right rock, it will never produce oil, and converting it costs a pump and a line rather than a well.

That is worth pausing on, because it is how flood patterns are usually chosen in practice. Textbook floods are drawn as regular five-spots on graph paper. Real floods inherit the wells that already exist, and the pattern is whatever the drilling history left behind. Ekene's injectors sit on the east side of the field. Everything about the flood's behaviour, including the imbalance the Professional tier uncovers, follows from that accident of geology.

## The timeline

Production started 2020-01-01. The flood started 2023-01-01. The record this course reads ends with the month 2025-12, so there are exactly 36 monthly periods of flood history.

At the flood start the field had produced 261475.03999967827 stock tank barrels and the tank pressure had fallen from 3200 psia to 2096.0082626669955 psia. That is 1104 psi spent to recover a little over two percent of the oil in place, and it puts the reservoir 96 psi above its 2000 psia bubble point. The flood did not arrive early. It arrived just before the reservoir would have started dissolving its own drive mechanism.

## What the flood was designed to do

The design has three parts and all three matter later.

The **injection split** sends 0.6 of each month's injection to Ekene-2 and 0.4 to Ekene-4. That split is fixed for the whole record.

The **target profile** ramps the voidage replacement ratio from 0.85 in the first month up by 0.04 each month, reaching 1.05 in month five, and then holds 1.05 for the remaining 31 months. Deliberate under-injection at start-up is normal: facilities are commissioning, and there is no point pushing hard into a system that is not yet reliable. The 1.05 that follows is a deliberate slow repressurization, buying back margin above the bubble point.

The **injectivity model** sets each injector's wellhead pressure as 2050 psia plus the daily injection rate divided by an injectivity index of 0.5 barrels per day per psi. Ekene-4's injectivity degrades to 0.35 from 2025-01-01. That degradation is invisible in the rate data, because the flood keeps hitting its volume target; it shows up only in pressure, and finding it is a Professional tier exercise.

## A worked reading of the record

Take the last month, 2025-12. The field produced 3670.7384235169648 stock tank barrels of oil and 962.9824550781937 barrels of water, and injected 5605.427788705937 barrels. Convert to reservoir barrels:

$$3670.7384235169648 \times 1.21584 + 962.9824550781937 \times 1.02 = 5445.272709028624 \text{ rb produced}$$

$$5605.427788705937 \times 1.02 = 5717.536344480056 \text{ rb injected}$$

and the ratio is 1.05, the design target, exactly. Every month from the sixth onward hits 1.05 exactly, because the injection volume was computed FROM the produced voidage rather than set independently. That is a fixture built to teach: when a number comes out exactly on a round design value, that is a sign the case was constructed, not measured. Real ledgers wobble. Recognising the difference between a designed dataset and a measured one is part of reading any teaching field honestly.

## The misconception to avoid

It is tempting to read a well map and assign each producer to its nearest injector, then treat those pairings as facts. Distance is a hypothesis, not a measurement. Ekene-6 is 715.8910531638176 m from Ekene-2 and 989.9494936611666 m from Ekene-4, so a distance argument says most of its support comes from Ekene-2. That is a reasonable starting allocation and it is roughly what the Professional tier uses. It is still a judgement, and this course will show you two independent diagnostics that fail to confirm it.

## Exercise

First, compute the straight-line distance from Ekene-4 to each of the four producers using the coordinates in the table. Rank the producers by distance from Ekene-4 and say which producer you would expect to see water first if distance were the only thing that mattered.

Second, the flood targets a VRR of 1.05 rather than 1.00. Given that the reservoir sat 96 psi above its bubble point at the flood start, write two sentences explaining what the extra 0.05 is buying and what it costs.
