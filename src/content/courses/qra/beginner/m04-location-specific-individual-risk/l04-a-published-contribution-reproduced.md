# A published contribution, reproduced

{{panel:qr-event-tree}}

Everything so far has been checked against the engine's own oracle. This lesson checks it against a published source. Purple Book Appendix 6.B works one individual risk contribution at one grid point, for one toxic release, one weather class and one wind sector. The engine reproduces the published contribution. The way it does so also teaches something about reading any published worked example: a source can be internally rounded, and two honest routes through it can disagree in the third decimal.

## Where this course starts

The appendix's early steps, the concentration, the probit and the probability integral, are consequence modelling and belong to the consequence course. This course picks the chain up at the probability of death on the centreline and carries it forward. The inputs, golden: a loss of containment frequency f of 5e-7 per year, 12 wind sectors, and a distance R of 361 m.

## The chain, printed and computed

| step | printed in the source | the whole chain, golden |
| --- | --- | --- |
| probability of death on the centreline, Pcl | 0.835 | 0.832930245430 |
| effective cloud width ECW, m | 86.2 | 86.301293 |
| coverage probability Pci | 0.456 | 0.456574314811 |
| probability of death Pd = Pcl Pci | 0.381 | 0.380294556093 |
| weather and direction probability PM Pphi | 0.0368 | 0.0368 |
| contribution dIR = f PM Pphi Pd, per year | 7e-9 | 0.000000006997 |

The whole chain column is the golden record written by the engine's independent oracle, and the engine's own run agrees with it far inside the precision the source prints. The coverage probability spreads the centreline probability of death across the wind sector: a cloud of effective width ECW, at distance R, covers only part of the sector's arc. The last step is the LSIR arithmetic of this module: a frequency times a probability of death. Here the frequency is the loss of containment frequency times the probability of the weather class and the wind direction, and the probability of death is the one at the grid point. Everything before that step belongs to the consequence course, which is why this course reads Pcl as given and starts from it.

## The last step through the engine

Run step 6 alone through `locationIndividualRisk`, with f PM Pphi = 1.84e-8 per year and the printed Pd of 0.381, both golden. The engine returns 0.000000007010 per year, which the source prints as 7e-9. The golden case with-zero-frequency carries the same contribution, 0.000000007010 per year, beside a scenario of frequency zero.

## Two routes, two third decimals

Working step by step from the printed values, the printed ECW of 86.2 m gives a coverage probability of 0.456038429735, the printed values give Pd = 0.835 x 0.456 = 0.380760, and the contribution is 7.0104e-9 per year.

The whole chain gives Pd = 0.380294556093, which rounds to 0.380. The printed 0.381 follows only from the rounded ECW of 86.2. So the SOURCE is internally rounded: a later printed step was worked from an earlier rounded one. Both routes reproduce its printed contribution of 7e-9 per year to two significant figures, the precision at which the source prints it.

This is a statement about the published source, and it carries a lesson for reading any worked example. When your answer differs from a printed one in the third figure, check whether the source rounded along the way before assuming either of you is wrong.

## Exercise

Multiply the golden f PM Pphi of 1.84e-8 per year by the printed Pd of 0.381, and write your answer to twelve decimals. Compare it with the engine's 0.000000007010 and with the source's printed 7e-9. Then say, in one sentence, why the whole chain's contribution of 0.000000006997 differs from yours, naming the printed value responsible.
