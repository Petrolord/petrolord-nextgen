# The observed rate cannot flood it

Every forecast in the previous module used a design injection rate of 2000 reservoir barrels a day. The Ekene field did not inject at that rate. Running the same forecast at the rate the field actually used produces a result that cannot be reconciled with what the field actually did, and the irreconcilability is the finding.

## The observed rate

Over the 36 month record the field injected 224975.42705121648 barrels of water. In reservoir barrels at $B_w = 1.02$, over 1096 days, split between two elements:

$$i_w = \frac{224975.42705121648 \times 1.02}{1096 \times 2} = 104.68747061689818 \text{ rb/d per element}$$

A little over a hundred reservoir barrels a day, against a design case of 2000. The field is injecting at five percent of the design rate.

That is not a mistake in the field's operation. Ekene is a small field: four producers making a few hundred barrels of oil a day in total. Injecting at a rate sized to replace their voidage gives about a hundred barrels a day per element, and the field ledger confirms it has been hitting its voidage target throughout.

## The forecast at that rate

Same element, same everything, $i_w = 104.68747061689818$ rb/d, $E_V = 1$ this time so the element is not reduced:

| output | value |
|---|---|
| areal sweep at breakthrough | 0.6573574366303985 |
| water to breakthrough | 2436332.0258629364 rb |
| **breakthrough** | **none** |
| cumulative oil at the horizon | 943473.6143609865 stb |
| recovery factor of flooded oil in place | 0.1575013967147545 |
| final water oil ratio | 0 |
| elapsed | 10957.5 days |
| stopped by | the horizon |
| steps | 360 |

Thirty years, 360 monthly steps, and the water never reaches the producer. The run stops because the horizon ran out.

Check it directly. At 104.68747061689818 rb/d, reaching the breakthrough volume of 2436332.0258629364 rb takes

$$\frac{2436332.0258629364}{104.68747061689818} = 23272.431853651782 \text{ days}$$

which is 63.71644586899872 years. On this model, the Ekene element would break through in the mid 2080s.

## And the field broke through in 2024

Ekene-6 produced its first water on 2024-03-01, 425 days after the flood started.

Those two statements cannot both describe the same physical process. A model saying 63.72 years and a field saying 1.16 years are not in tension over a parameter; they are describing different things happening.

## What is NOT the explanation

**Not the mobility ratio.** Even at an extreme $M = 10$ the areal sweep at breakthrough only falls to 0.4982355982194101, cutting the breakthrough volume by a quarter. That takes 63.72 years to 48.29.

**Not the vertical sweep.** Running with $E_V = 0.5146907350993352$ reduces the pore volume by half and the breakthrough volume with it, giving 32.79426436223196 years. Still an order of magnitude too long.

**Not the allocation.** Even giving the whole field's injection to one element and halving the element's volume, the breakthrough is many years away.

**Not the pattern geometry.** A five-spot correlation applied to a non-five-spot arrangement is an approximation, and approximations of this kind are worth tens of percent, not factors of fifty.

No plausible adjustment of any parameter in this forecast produces a 425 day breakthrough at 104.7 rb/d into an element of this size. The model is not slightly wrong.

## What IS the explanation

The water is not sweeping the element. It is moving through a small fraction of it.

That is the only structural change that closes the gap, and it is quantifiable: work backwards from the observed breakthrough date to the pore volume the water COULD have contacted. The next lesson does that, and the answer is 1.4697005138728763 percent of the element.

## Why this is the tier's most valuable result

Because it is a case where a screening model, used correctly, produces a wrong answer, and the wrongness is informative.

A forecast that agreed with the field would have told you nothing you did not already know. A forecast that disagrees by a factor of fifty tells you that one of its structural assumptions is badly violated, and because the assumptions are stated you can work out which one. Here it is the assumption that injected water sweeps the pattern element, which is the assumption behind the whole areal sweep construction.

That is the correct use of a simple model: not to predict, but to establish what would have to be true, and then to notice that it is not.

## The misconception to avoid

"The forecast is useless on this field." It produced the single most useful number in the tier. A model whose disagreement with data is large, structural and interpretable is worth more than one that has been tuned until it matches. The tuning would have hidden exactly the fact that mattered.

## Exercise

First, compute the breakthrough date the forecast predicts at the observed rate with $E_V = 0.5146907350993352$ instead of 1, and confirm it is still decades away.

Second, list the four candidate explanations dismissed above and, for each, compute or estimate the factor by which it would shorten the breakthrough time. Then state the factor still unaccounted for.
