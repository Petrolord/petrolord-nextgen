# A controlled disturbance

Every other measurement in the subsurface looks at a sample. A well test looks at the reservoir.

## What is actually measured

A pressure gauge in a wellbore records one number against time. That is the whole raw dataset of a well test: a pressure history, sampled every few seconds, next to a record of what the well was doing.

Nothing else is measured. Permeability is not measured. Skin is not measured. The distance to a fault is not measured. All of those are things somebody works out afterwards from the shape of that pressure history, and the working out is what this course is about.

That gap between what is recorded and what is reported is the reason well test analysis is a skill rather than a readout. Two competent engineers can put the same pressure history through the same software and hand you different permeabilities, and neither of them has made an arithmetic mistake.

## Why disturb the reservoir at all

A reservoir at rest tells you its pressure and nothing more. To learn how easily fluid moves through it, you have to make fluid move and watch what the pressure does about it.

So you change the rate. Open a well that was shut, or shut a well that was open, and hold the new rate steady. The pressure responds, and it responds differently depending on what is out there:

- how permeable the rock is, because that sets how fast the disturbance spreads;
- how damaged the immediate neighbourhood of the wellbore is, because that adds a pressure drop right at the sandface;
- how much fluid the wellbore itself stores, because early on the well is producing its own contents rather than the reservoir's;
- what the reservoir runs into as the disturbance spreads outward, which is faults, fluid contacts, other wells, and the edges of the tank.

The pressure history carries all four, mixed together, in time order. Roughly speaking, the earliest data are about the wellbore, the middle data are about the rock, and the latest data are about the boundaries.

## The volume a test actually sees

A well test is often described as a measurement of a large volume of rock, and that is fair, but the size is worth being precise about. The disturbance spreads outward roughly as the square root of time. Doubling the length of a test does not double the radius investigated; it multiplies it by about 1.41.

For the well this course analyses, the transient has travelled a bit over a thousand feet from the wellbore after a day and a half of production. That is a far larger volume than any core plug or log ever sees, and it is still a small fraction of a field.

## What can go wrong before any analysis starts

Three things spoil more tests than any interpretation error.

**The rate is not what the report says.** Every equation in this course assumes you know the rate exactly, and it appears linearly in the permeability. A rate 10 percent wrong makes the permeability 10 percent wrong, silently, and no amount of care in the analysis recovers it.

**The gauge is in the wrong place.** A pressure recorded at surface and converted to sandface through a changing fluid column carries the errors of that conversion. Modern tests put the gauge downhole for that reason.

**The well was not really shut in.** A buildup assumes the rate goes to zero. If the well keeps producing into the wellbore after the surface valve closes, and it always does for a while, the early data are describing the wellbore rather than the reservoir. That is wellbore storage, it is the subject of module 5, and it is the single most common cause of a well test being read wrong.

## The misconception to avoid

"The software analyses the test." The software fits a straight line, or a model, to whichever points you give it. Which points to give it is not a detail the software can decide, and the answer depends on it strongly enough that a good test analysed over the wrong interval can invert the conclusion the test was run to reach. You will do exactly that in module 5 and watch it happen.

## Exercise

Write down, in one sentence each, what the following would do to a reported permeability: a rate that was actually 500 stb/d rather than the 450 recorded; a gauge that read 3 psi high at every point; and a well that took two hours to stop flowing after the valve was closed.

Only two of those three change the permeability. Say which, and say why the third one does not.
