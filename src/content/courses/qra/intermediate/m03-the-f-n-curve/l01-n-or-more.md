# N or more

{{panel:qr-societal}}

The PLL adds every scenario into one expected value and so cannot tell a frequent event that kills one from a rare event that kills three hundred. Societal risk needs a picture that keeps them apart. The F-N curve is that picture: for each number of deaths N it gives the frequency per year of all scenarios that kill N or more. This lesson builds it for the JISIKE off-site scenarios.

## The definition, in the engine's words

> F(N) = sum of f_i with N_i >= N, at each distinct N_i > 0 (left-continuous step function)

Read it left to right. Take every scenario whose expected deaths are at least N and add their frequencies. Do that at each distinct N the scenarios carry, above zero. The result is cumulative, so F can only fall as N rises: every scenario counted at N = 40 is also counted at N = 12.

## The JISIKE off-site scenarios

| scenario | frequency per year, stated | N, stated |
| --- | --- | --- |
| toxic cloud over the town | 2e-7 | 300 |
| vapour cloud explosion | 1.5e-6 | 40 |
| flash fire at the road | 8e-6 | 12 |
| jet fire at the fence | 3e-5 | 3 |
| second jet fire at the fence | 1e-5 | 3 |
| release that reaches no one | 5e-5 | 0 |

Each N is a stated input. How many people a toxic cloud would kill in the town is the output of consequence modelling, which belongs to the consequence course, and this engine receives it as given.

## The curve

| N | F(N), N or more, per year |
| --- | --- |
| 3.000000 | 0.000049700000 |
| 12.000000 | 0.000009700000 |
| 40.000000 | 0.000001700000 |
| 300.000000 | 0.000000200000 |

At N = 3 every scenario with deaths counts: both jet fires, the flash fire, the explosion and the toxic cloud, which gives 0.000049700000 per year. At N = 12 the two jet fires drop out and 0.000009700000 per year remains. At N = 300 only the toxic cloud is left, 0.000000200000 per year.

## Two things the table shows

The two jet fires share N = 3, so they make one corner carrying both frequencies. A corner is a distinct N, never a scenario. And the release that reaches no one is absent: a scenario with no deaths is kept out of the curve, and the engine reports its frequency beside it, 0.000050000000 per year. The engine also returns the expected fatalities per year of the whole set, the sum of f times N, which is 0.000336000000.

## Why "or more"

The word is deliberate. A societal judgement asks how often an event at least this bad happens, because a criterion that allows a certain frequency of ten deaths must allow no more for events worse than ten. Counting N or more puts every worse event into the frequency at each N. The Purple Book's equation says N or more, and the engine follows it; the fourth lesson of this module shows the other reading and why it is wrong.

## Exercise

Starting from the stated frequencies, add the scenarios with N of 40 or more, then those with 12 or more, and confirm the engine's 0.000001700000 and 0.000009700000 per year. Then say which scenario's frequency makes up the difference between those two figures.
