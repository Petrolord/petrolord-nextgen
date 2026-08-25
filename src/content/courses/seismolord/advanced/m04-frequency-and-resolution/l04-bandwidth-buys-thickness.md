# Bandwidth buys thickness

The two capstone frequencies are 25 Hz and 40 Hz, and the difference between what they can resolve is the practical payoff of the whole tier. This lesson converts the model's numbers into the statements that get used when a survey is being planned or a reprocessing is being argued for.

## What changes and what does not

| Quantity | 25 Hz | 40 Hz | Changes? |
| --- | --- | --- | --- |
| Tuning thickness | 16 ms | 10 ms | Yes, inversely with frequency |
| Tuning amplitude | 0.1155948 | 0.1155948 | No |
| Isolated amplitude | 0.0800000 | 0.0800000 | No |
| Brightening at tuning | 1.4449 | 1.4449 | No |
| Thickness at which isolation is reached | 50 ms | 32 ms | Yes |
| Peak drift on the thinnest bed | 6 ms early | 4 ms early | Yes |

Every quantity that is a **time** moves with frequency. Every quantity that is an **amplitude ratio** does not.

That is the sentence to carry out of this module. Bandwidth is bought to change times: the thickness that tunes, the separation at which two events become independent, the time error on a thin bed pick. It does not change how bright anything is relative to anything else.

## Resolution in the units a project uses

Two way time is the model's currency. A project's currency is metres of rock. The conversion needs an interval velocity, and it halves the two way time because the wave travels down and back:

$$\Delta z = \frac{V \Delta t}{2}$$

At the course velocity of 2000 m/s, a 16 ms tuning thickness is a 16 m bed and a 10 ms tuning thickness is a 10 m bed. The 60 percent increase in frequency has bought a 37.5 percent reduction in the thinnest bed that can be resolved.

At a more typical reservoir velocity of 3200 m/s the same two frequencies give 25.0 m and 15.6 m. The velocity matters as much as the frequency, and a resolution claim quoted without it is not checkable by anyone.

## The three statements that survey planning needs

**The resolution limit.** Beds thinner than the tuning thickness cannot have their top and base separated. At 25 Hz and 3200 m/s that is 25 m, so a 12 m target sand will never appear as two events no matter how good the processing is at that bandwidth.

**The detection limit.** A bed can still be detected well below the resolution limit, because it still produces an event; it simply produces one event whose amplitude carries its thickness. Detection is limited by noise rather than by bandwidth. The classic working figure for detection is about a quarter of the resolution limit, which the model supports: at 25 Hz the amplitude at 4 ms is 0.0468, well above zero and easily visible if the noise floor is low.

**The consequence for the amplitude map.** Whichever bandwidth is delivered, beds near its tuning thickness will map brightest. Changing the bandwidth changes which beds those are. A reprocessing that raises the dominant frequency from 25 Hz to 40 Hz moves the bright ring on an amplitude map from around 16 ms of bed to around 10 ms of bed, and an interpreter who has not noticed will read the change as a change in the reservoir.

## What higher frequency costs

Nothing in this model is free either, and the argument for bandwidth is not one sided.

High frequencies attenuate faster with depth, so the dominant frequency that reaches a target is not a choice. Broadening the spectrum in processing raises the noise along with the signal, and a wedge model built on the promised bandwidth rather than the delivered one is a wedge model that will mislead. The honest input to this exercise is the frequency measured from the data at the target level, which the Professional tier's wavelet work is the way to obtain.

## Worked example

A target sand is expected to be 18 m thick at an interval velocity of 3000 m/s. Processing currently delivers about 22 Hz at that level, and a reprocessing is proposed that would deliver about 35 Hz. State what each bandwidth can say about the sand.

Two way time thickness of the sand: $2 \times 18/3000 = 0.012$ s, or 12 ms.

At 22 Hz the tuning thickness is $389.8484/22 = 17.7$ ms, so a 12 ms sand is below tuning. Its top and base cannot be separated, and its amplitude sits on the rising limb where brightness tracks thickness.

At 35 Hz the tuning thickness is 11.1 ms, so a 12 ms sand is just above tuning, near the apex of the curve. Its top and base are marginally separable and its amplitude is near the ceiling.

The reprocessing therefore moves the sand from the thin bed regime to the tuning regime. That is a real gain in thickness information and a real loss in amplitude interpretability, because near the apex the amplitude changes very little with thickness. Whether it is worth the money depends on which of the two the project needs.

## Exercise

A survey delivers 30 Hz at a target where the interval velocity is 2800 m/s. Compute the tuning thickness in metres. Then state what would happen to the tuning amplitude of an unchanged bed if the bandwidth were doubled, and why.

As a self-check: the tuning thickness in two way time is $389.8484/30 = 13.0$ ms, and at 2800 m/s that is $13.0 \times 10^{-3} \times 2800/2 = 18.2$ m of bed. Doubling the bandwidth would not raise the tuning amplitude at all, because the ideal peak is the reflection coefficient times $1 + 2e^{-3/2}$ with no frequency in it; what would change is that the tuning thickness falls to about 9.1 m, so a bed that was at tuning is now well above it and its own amplitude would fall toward the isolated level.
