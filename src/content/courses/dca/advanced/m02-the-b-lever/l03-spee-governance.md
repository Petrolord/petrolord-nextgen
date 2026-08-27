# SPEE governance

A parameter that moves a booking by a factor of 3.51 and cannot be measured is not a technical problem. It is a governance problem, and the industry treats it as one. The document that does the treating sits in our fixture file as case `spee-rep6-table1-effective-nominal`: SPEE Recommended Evaluation Practice #6, "Definition of Decline Curve Parameters", version 1.0, adopted Spring 2002, Table 1, p. 7.

Read the title again. A professional body of evaluation engineers found it necessary to publish a recommended practice whose subject is what the words mean.

## Why the sourcing of this case is part of the lesson

The fixture's notes record the history. REP #6 was originally listed alongside Poston and Poe as a paid document that could not be typed, and the case sat unarmed. On 2026-07-18 it turned out to carry an explicit grant on its face, "Copyright by Society of Petroleum Evaluation Engineers 2000 - Reproduction with Attribution Granted", and to be openly served. All 37 rows of Table 1 were then extracted mechanically from the PDF text layer and, critically, **verified row by row against the REP's own closed forms before being committed**:

$$D_e = 1 - e^{-D} \qquad\text{and}\qquad D_{esi} = 1 - (1 + bD_i)^{-1/b}$$

Two layers of checking, because a mechanical extraction can drop a digit as easily as a human can. Poston and Poe meanwhile stays in `pending_references`. Same file, same discipline, both outcomes recorded.

## What Table 1 actually governs

The table tabulates, for nominal declines from 1 percent to 10000 percent, the tangent effective decline and the secant effective decline at $b$ of 0, 0.5, 1, 1.5 and 2. Its `given.note` states the construction plainly: consistent units, $q_i = 1$, $t = 1$ period, so the table **is** the engine's Arps rate forms evaluated at one time unit. The tangent column is printed to fourteen decimal digits of percent and the secant columns to six, and our tolerances are $10^{-13}$ and $10^{-8}$, because there is no rounding doctrine to accommodate: the document printed full precision.

Two of the 37 rows carry the governance argument on their own, side by side below.

| convention | nominal 10 %/yr | nominal 100 %/yr |
|---|---|---|
| tangent effective | 9.51625819640405 | 63.21205588285580 |
| secant, $b = 0.5$ | 9.297052 | 55.555556 |
| secant, $b = 1$ | 9.090909 | 50.000000 |
| secant, $b = 1.5$ | 8.896561 | 45.711648 |
| secant, $b = 2$ | 8.712907 | 42.264973 |

At a conventional oil-field decline the family spans 0.8033511964040496 percentage points, and being sloppy about which convention you meant costs almost nothing. At a shale-scale decline the same family spans 20.947082882855803 percentage points. **The convention is worth more than the fit.** That is what REP #6 exists to stop people discovering the expensive way, and why the practice is about definitions rather than methods.

## The inversion, which is where money is actually lost

The table reads forward. The dangerous direction is backward, because that is the direction a received number travels.

Somebody hands you a well and says it declines at 65 percent a year, which is the Weaver shale gas case. You need a nominal decline to run anything. If the 65 percent was a tangent effective decline, $D_i = -\ln(1 - 0.65) = 1.04982212449868$ per year. If it was a secant effective decline at $b = 1.2$, inverting $D_{esi} = 1 - (1 + bD_i)^{-1/b}$ gives

$$D_i = \frac{(1 - 0.65)^{-1.2} - 1}{1.2} = 2.10389088694457 \text{ per year}$$

The same three words, "sixty five percent", carry two nominal declines differing by a factor of two. One books the well roughly twice as fast as the other, and nobody made an arithmetic error.

So the reporting rule is a triple, none of it optional: **the effective decline, the convention it is quoted in, and the $b$ it was computed at.** A decline quoted alone is not a decline. If you inherit one and cannot establish the triple, ask, and record the value as unresolved while you wait.

## Governing b itself

REP #6 governs the vocabulary. The rules that govern the exponent are a layer above it and vary by jurisdiction, by company and by play, but they are recognisably the same four everywhere:

1. **A ceiling by play.** A maximum $b$ for the flow regime and rock type, set from analogs rather than from the fit. The Professional tier's alarm is the software-level detection of a fit pressing against one.
2. **A terminal decline requirement.** No hyperbolic forecast may run to the economic limit unbounded; the tail must be capped at a minimum decline. Lesson 4 works the arithmetic.
3. **Analog support.** A $b$ above some threshold must be supported by mature wells in the same play that have actually produced the tail the exponent claims, not by a fit over eighteen months of the subject well.
4. **Window disclosure.** The $b$ is reported with the window it was fitted over and the flow regime that window represents, because the exponent describes a regime and not a rock.

All four restrict the analyst rather than refine the method, and that is deliberate. When a parameter cannot be measured and moves the answer by a factor of three, the profession's response is not a better optimizer. It is to take the parameter out of the analyst's discretion and put it under a rule.

## Worked example: resolving an inherited decline

An operator's report says a gas well "declined 50 percent in its first year", and the well is harmonic, $b = 1$. If that 50 percent is a secant effective decline, Table 1 answers directly: the $b = 1$ secant column reads exactly 50.000000 on the row whose nominal is 100 percent per year. If it was meant as a tangent effective decline, the tangent column reads 45.118836 at nominal 60 and 50.341470 at nominal 70, so the answer is a shade under 70 percent per year.

Two readings of the same three words, 100 and roughly 70 percent per year, a ratio of about 1.4285714285714286. Do both lookups in the fixture file yourself rather than taking them from this page: resolving a quoted decline against a table instead of against an assumption is the deliverable of this lesson.

## Exercise

You are reviewing three submissions for the same asset. A reports $b = 1.4$, an effective decline of 62 percent, no convention stated, fitted over 14 months. B reports $b = 0.9$, a secant effective decline of 55 percent, fitted over 40 months, with two analog wells named. C reports a nominal decline of 1.05 per year and $b = 1.2$, fitted over 24 months, with a terminal decline of 6 percent per year applied.

Rank them by how much of the reported reserve you could defend as it stands, write the single question you would send back to each, and state which of the four governance rules each one fails. Only one is complete, and it is not the one with the most conservative exponent.
