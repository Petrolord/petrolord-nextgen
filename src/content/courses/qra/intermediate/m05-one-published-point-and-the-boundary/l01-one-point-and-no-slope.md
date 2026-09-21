# One point and no slope

{{panel:qr-societal}}

R2P2, the HSE's published statement of its approach to tolerability, prints no F-N line of the Dutch kind. What it prints is one sentence, and that sentence gives a single point on the F-N plane. The engine carries it as its second criterion preset, exactly as printed, and gives it no slope. This lesson reads the point, runs the JISIKE off-site curve against it, and shows what the engine does when a caller names a preset it does not have.

## What R2P2 paragraph 136 says

An accident killing 50 or more people in one event should be regarded as intolerable if its frequency is more than one in five thousand a year. The preset r2p2-para-136 is that one point: N = 50 at 0.000200000000 per year. Note the words "50 or more": the point is read on the same "N or more" curve the engine builds, so the curve's F(50) is what it is compared with.

## No slope

R2P2 defers the extrapolation to other N to a reference the engine did not read. So the engine gives the point no slope. It checks the curve at N = 50 and nowhere else. A line through the point with a slope of its own is a different criterion, and the engine will not draw one on R2P2's behalf; the next lesson shows how an analyst supplies it.

## The JISIKE curve against the point

| N | F(N) per year | point per year | ratio | state |
| --- | --- | --- | --- | --- |
| 50.000000 | 0.000000200000 | 0.000200000000 | 0.001000 | BELOW |

F(50) is the frequency of 50 or more deaths. On the JISIKE off-site set only the toxic cloud over the town, at N = 300, has 50 or more, so F(50) is its stated frequency alone. The curve sits at a thousandth of the point, and the state is BELOW. The same curve EXCEEDS the Dutch line with a worst ratio of 18.000000. Two published criteria, two different verdicts on one curve: which criterion a report uses is a choice it must state.

## A preset the engine does not have

A caller who guesses a preset name is refused, with the list of names that do exist:

> criterion: unknown preset 'r2p2-line'; one of vrom-establishments, r2p2-para-136, or give { constantC, exponentAlpha } or { points }

There is no R2P2 line in the engine, so that name is unknown. The message lists what the caller may give instead.

## A name every object inherits

The engine looks a preset name up only among the names it defines itself. A name that every JavaScript object carries, such as valueOf, is refused like any other unknown name:

> criterion: unknown preset 'valueOf'; one of vrom-establishments, r2p2-para-136, or give { constantC, exponentAlpha } or { points }

That matters because a lookup that walked into those inherited names would hand back something that is no criterion at all, and the comparison would run against it silently. The engine refuses instead, and names the field.

## Exercise

Divide the JISIKE curve's F(50) of 0.000000200000 per year by the point's 0.000200000000 per year and confirm the ratio 0.001000. Then say how many times larger the toxic cloud's stated frequency would have to be for the state to reach the point, and which state word the engine would then return.
