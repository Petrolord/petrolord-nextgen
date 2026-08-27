# Why rates decline

Open any oil field's production report and you will see the same shape: a well comes on strong, and then, month after month, it makes less. Not because anyone turned a valve, and not because the equipment is wearing out. The decline is the reservoir itself speaking, and learning to read that speech is what this course is about.

## Where the energy comes from

A reservoir produces because it is compressed. The oil, the water in the pores, and the rock framework itself are all squeezed by the pressure of the fluid column and the weight of the overburden. Open a well and you give that compressed system somewhere to expand into. Expansion pushes fluid to the wellbore, up the tubing, and into the stock tank.

Every barrel produced spends some of that stored compression. The reservoir pressure falls, the push weakens, and the next barrel comes a little slower. That is the whole mechanism in one sentence: **production drains the pressure that drives production.**

In the Ekene field, the reservoir this course lives in, the oil sits above its bubble point during the early years, so the only energy available is the modest compressibility of oil, water and rock. A tank like that gives up only a small fraction of its oil before pressure sags noticeably, which is exactly why its rates decline from the very first month and why, three years in, the operator reaches for water injection. You will watch all of that happen in the data.

## Rate follows drawdown

A well flows roughly in proportion to its drawdown, the difference between reservoir pressure and the flowing pressure in the wellbore. Hold the wellbore side steady, let reservoir pressure decline, and the drawdown shrinks. The rate falls with it.

So a decline curve is really a pressure story told in rate units. We rarely have continuous pressure data; pressure surveys are occasional and expensive. But rates are metered every day as a matter of commerce. Decline curve analysis is the art of extracting the forecast from the measurement we already have.

## Arps: description, not physics

In 1945 J.J. Arps catalogued the shapes production declines actually take and wrote down a small family of curves that fit them: exponential, hyperbolic, and harmonic, distinguished by a single exponent called $b$. You will meet all three properly in module 2.

Hold on to this from the start: the Arps curves are **empirical descriptions**, not derivations from physics. They say "rates like these have tended to follow curves like this," nothing more. That is a strength and a warning at the same time. The strength: you need only a rate history, no core, no fluid samples, no simulation model. The warning: the description is only as good as the assumption that tomorrow keeps behaving like yesterday.

## The one assumption that matters

Every decline forecast rests on a single load-bearing assumption: **operating conditions do not change.** Same completion, same choke policy, same drive mechanism, same drainage area. If any of those change, the old curve describes a well that no longer exists.

Things that break the assumption are ordinary field life: a workover, a choke change, a new offset well stealing drainage, an artificial lift installation, and, most dramatically in this course, a waterflood. Ekene starts injecting water on 2023-01-01, and from that month the producers stop obeying the curves they had followed for three years. Module by module, you will learn first to use the curves where they are valid, and then to recognise exactly where validity ends.

## A course built on a field you can trust

The Ekene data you will work with is deliberately noise free. Each producer follows its planted decline exactly, so when you fit a curve in module 4 the engine will recover the truth to machine precision, and every number the course grades can be reached by hand with the formulas you are about to learn. Real field data is messier; the skills transfer, but here nothing hides behind scatter. When a number surprises you in this course, the surprise is real structure, not noise.

## Stop and think

Before moving on, answer this for yourself: if a pump is installed on a declining well and the rate jumps up, has the reservoir gained energy?

It has not. Artificial lift lowers the flowing pressure in the wellbore, which widens the drawdown at the same reservoir pressure. The decline resumes from the higher rate, usually steeper, because the reservoir is still draining the same store of compression. Rate is not energy; it is energy times plumbing.

## Exercise

Write down three specific events in the life of a producing well that would violate the "unchanging conditions" assumption behind a decline forecast, and for each one, say whether you would expect the rate to step up or step down when it happens. Keep your list; when the flood arrives in the Ekene data you will see one of your events in the numbers.
