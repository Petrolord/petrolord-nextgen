# Why literature anchors

An engine that passes its own tests has proved one thing: it agrees with itself. That is worth having and it is not validation. Validation is agreement with something the engine did not produce, could not have produced, and cannot be quietly adjusted to match. In decline analysis that something is a published worked example: a real author, in a real document, with a page number, who stated inputs, turned a crank, and printed answers.

This module is about the eight such anchors the decline engine is held to, what each one catches, and what an honest fixture file looks like when it has not yet caught everything.

## The self-consistency illusion

Consider the round-trip test that every DCA codebase eventually writes. Generate a clean synthetic decline from known parameters, fit it, and check that the fit returns the parameters you planted. The Ekene wells are exactly this, and the engine recovers all four to fourteen decimal places. It is a genuinely useful test. It catches transform errors, sign errors in the regression, window handling, model selection.

It cannot catch a single thing about the cumulative.

The fitter never touches the cumulative formula. It regresses rates. So a rate-cumulative relation could be wrong in any way at all, and every round-trip test in the suite would still pass. That is not hypothetical. Before the SC1 oracle work of 2026-07-18, `calculateEUR` divided the hyperbolic branch by `(b - 1)` instead of `(1 - b)`, which returns a **negative** EUR for every $b$ that is not exactly 1. The code shipped. The self-consistency suite was green. The comment now sitting in `engines/dca/arps.js` records the fix and the three independent oracles that pin it: the closed form, a Simpson quadrature, and a hand-arithmetic case.

Name the failure mode and you will start looking for it: **the self-consistency illusion** is the belief that a test suite which only compares the code to itself has told you the code is correct. It has told you the code is stable.

## What an anchor is

An anchor is a case where somebody outside your codebase already computed the answer. The document is the oracle. Your job is to reproduce it, and if you cannot, the burden is on you.

Open `test-data/dca/dca-literature-fixtures.json` in the engines repo. Every case carries the same five things:

- an `id`, so a failing test names the source rather than a line number
- a `reference` string with the author, the document, the edition and the **page**
- `given`, the inputs exactly as the document states them
- `published`, the answers exactly as the document prints them
- `tolerances`, chosen per case and justified by the document's own rounding

There are eight cases and a `pending_references` list. Four are from Weaver's CED continuing-education course P03-004, fetched and read page by page on 2026-07-18. One is SPEE Recommended Evaluation Practice #6, Table 1, all 37 rows. Three are from Ahmed's *Reservoir Engineering Handbook*, 4th edition, chapter 16. The whole file is gated by `"armed": true`, which the test suite asserts before it asserts anything else, so nobody can disarm the oracle by editing a flag and get a green run.

## The rounding doctrine

Published tables are typeset, not exported. The fixture's `_notes` block states the doctrine that follows from that, and it is the most transferable idea in this module:

> printed RATES are rounded (e.g. 99 bbl/d for 98.73), while printed CUMULATIVES come from the author's unrounded spreadsheet.

So the tests do two different things with the two columns. They compare printed rates against the engine's unrounded rate with an **absolute** allowance big enough to swallow the typesetting. They recompute the unrounded end rate from the rate equation and feed **that** into the cumulative, then compare against the printed cumulative with a **relative** tolerance. Feeding a rounded rate into a cumulative formula is the single most common way to fail a validation that the engine actually passed. Lesson 2 shows you the exact size of that error.

## Worked example: the smallest anchor in the file

Case `ced-p03-004-exponential-oil`, Weaver P03-004, p. 11. Given: $q_i = 150$ bbl/d and an effective annual decline of 0.15. Published: at $t = 3$ years, $q = 92.1$ bbl/d and $N_p = 129995$ bbl. Tolerances: `rate_abs` 0.05, `np_rel` 0.0002.

Work it in three lines. The nominal decline is $-\ln(1 - 0.15) = 0.16251892949777494$ per year, which the engine holds as $0.000445257341089794$ per day. Then

$$q(3) = 150 \times 0.85^{3} = 150 \times 0.614125 = 92.11875 \text{ bbl/d}$$

against the printed 92.1, a gap of 0.0187500000000114, inside the 0.05 allowance. Now the cumulative, from the unrounded 92.11875 and not from 92.1:

$$N_p = \frac{365 \times (150 - 92.11875)}{0.16251892949777494} = 129995.049286177 \text{ bbl}$$

against the printed 129995, a relative error of $3.79139021766149 \times 10^{-7}$ against an allowance of $2 \times 10^{-4}$. The document and the engine agree to better than one barrel in a hundred and thirty thousand.

Stop and do the substitution yourself. Note what happened in the first line: $\exp(-3\ln(1/0.85))$ collapses to $0.85^3$ exactly, so this anchor is reachable on a pocket calculator. That matters. An anchor you cannot hand-check is an anchor you are trusting rather than using.

## An honest fixture records what it has not armed

The last thing in the file worth your attention is the thing that is missing. `pending_references` contains one entry:

> Poston and Poe, *Analysis of Production Decline Curves*, SPE 2008 - owner to supply PDF

The notes explain why: every located channel is paid, and the jest todo stays visible until the document arrives. Nobody typed the numbers from memory. Nobody quietly dropped the reference because sourcing it was inconvenient. The gap is a first-class object in the file, and it shows up in the test report every run.

Contrast that with what happened to SPEE REP #6 in the same file. It was originally listed as pending for the same reason, then turned out to carry an explicit reproduction grant, was sourced, typed, and armed. The pending list is a work queue, not an excuse.

That is the standard for your own validation work, and it is the standard a reserves auditor will apply to your fits: state what is anchored, state what is not, and never let the second category disappear.

## Exercise

Open the fixture file and answer four questions from it, without computing anything. How many cases are in `cases`, and how many distinct source documents do they come from? Which case carries a `misprint` note on one of its rows, and what does the note say the test does with that row? Which case has two different values of the same parameter in its `given` block, and what does the note say each one is used for? Finally, write one sentence explaining why the SPEE case's tolerances are `1e-13` and `1e-08` while the Weaver harmonic case allows 25 barrels absolute. The answer to the last one is the whole doctrine of this lesson.
