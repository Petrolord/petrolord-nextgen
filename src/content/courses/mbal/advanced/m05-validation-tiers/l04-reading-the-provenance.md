# Reading the provenance

The tier word carries almost no information, as lesson 1 showed: eleven of twelve paths say the same thing. The tolerance carries some, but three paths do not have one. Everything else lives in `validation_reference`, a free text string the engine returns alongside the tier. Read it the way a reserves auditor does, assuming nobody has checked it since the day it was typed. That is not cynicism, and you are about to prove it on this engine's own strings.

## What a provenance string owes you

Five things, and you should be able to point at each of them in the text or note that it is missing.

**What was compared.** Not "the method" but the quantity: an oil in place, a table of influx, a set of drive indices.

**Against what.** Author, year, edition, chapter and example number, enough that a reader can open the same page.

**When.** A date. Code moves and printed books do not.

**With what result, in numbers.** The engine's value, the published value, the disagreement. A string that says "matched" without numbers has told you nothing you can audit.

**Under what scope.** What the comparison did and did not cover, the clause most often absent and most often decisive.

The strings in this engine run from 95 characters to 968, and length is not rigour. The shortest, on the oil pot path, gives the source and nothing else: Pletcher SPE 75354 (2002) Tables 10 to 13, multicell oil with pot aquifer, matched within stated tolerance. Four of the five questions unanswered, and it carries the tightest tolerance in the engine.

## Failure one: the string has gone stale

The Carter-Tracy string is the longest and most detailed in the file, and the one to distrust most, precisely because its detail is checkable.

It records a validation on 2026-05-17 against Dake Exercise 9.2, names the geometry in full, and reports the outcome in numbers: engine oil in place 301.0 MMSTB against Dake's 312 MMSTB, a 3.53 percent error, a fit statistic of 0.9998, and drive indices at year 10 of IDD 0.608, IWD 0.392, GDI 0, SDI 0.011, sum 1.010.

Now run the case today. The engine returns 307.221409553720 MMSTB, which is 2.06691347299667 percent above the recorded 301.0 and now 1.53159950201266 percent below Dake rather than 3.53 percent. The fit statistic is 0.999975248425736, which rounds to 1.0000 and not to 0.9998. The indices are 0.567843338103932 and 0.417877131928747, summing to 0.997165062762353 rather than 1.010. Of the six numbers the string reports, exactly one still holds: the rock and connate water index of 0.0114445927296736 still rounds to 0.011.

This is not fraud. The string was true on the date it names and the code has improved since, so the stated 3.53 percent is now conservative rather than descriptive. But the string has stopped being a record of what the code does. **A provenance string is a snapshot with a date on it. Read the date first.**

## Failure two: the string names a convention the runtime does not use

The oil pot with gas cap path is anchored on Ahmed Example 11-1, and its string says the engine reproduces the printed influx of 411,281 bbl and the printed indices 0.4385, 0.3465, 0.2112 and 0.0038, in what it calls the book index convention, denominator F minus Wp times Bw.

Go and read the drive index block that actually runs. It divides every index by gross withdrawal $F$ and folds the produced water into the numerator of the water index instead, giving 0.426087944551755, 0.336609476195887, 0.205250113623452 and 0.00364660265878877, summing to 0.971594137029883. Module 3 showed that sum is not a closure failure; it is exactly the ratio $A/F$.

Read the string a third time and it does not technically lie. It says the engine's per timestep terms reproduce the printed indices, and a harness case recomputes them in the book's convention. Both true. But the string sits on a payload whose `final_wdi` field is 0.205250113623452 while the string prints 0.2112, and a reader who takes the reference as a description of the result fields is wrong by 0.006 and does not know it.

The general rule: **a provenance string describes a test, not necessarily the field next to it.**

## Failure three: one tolerance, several claims

The oil Fetkovich path states 10 percent. Its string contains two distinct comparisons: the marching influx table reproduces the printed column within 1 percent, and the full oil path recovers an oil in place within 10 percent of Dake's 312 MMSTB. Two claims of very different strength, one number in the payload, and the payload carries the weaker one. Quote the 10 percent at an influx table and you have understated your evidence tenfold. Quote the 1 percent at an oil in place and you have overstated it.

The mirror image is the oil path with no aquifer, which states no tolerance while its string quotes an engine result of 291.3 MM STB against a graphical fit of 257 and a volumetric booking of 270.6, a spread of 13.3463035019455 percent between the first two.

That path has one more thing wrong with it, quietly the worst finding in this module. The function returns a fourth field on that path, `notes`, carrying the caveat that explains the spread: for the no gas cap case, the difference between a least squares fit and a graphical fit is the dominant source of disagreement on real data. The declared return type has three fields and the result assembly copies three, so the `notes` text is never attached to a result and no user has seen it. The most useful sentence written about the most heavily used path in the engine is present in the source and absent from the output.

## The badge is not the function

One more hazard, recorded in the engine's own comments. The resolver is exported so a generator can dump the whole tier mapping into a golden file that the application's pre run badge reads. That indirection exists because an earlier hand written mirror had drifted, going on displaying Carter-Tracy as `published_method` after the path was promoted. The tier you see on a screen may have been produced by something other than the code that computed your answer. When it matters, quote the result payload, not the badge.

## Worked example: a five question review

Take the Carter-Tracy string and answer the five questions in order. What was compared: an oil in place, a fit statistic and a set of drive indices. Against what: Dake 1978, Exercise 9.2, geometry printed out. When: 2026-05-17. With what result: 301.0 against 312, 3.53 percent, four index values. Under what scope: the string also records that the delta p convention and the finite aquifer treatment were corrected in the same release, which tells you the path was unstable at the time of the test.

Verdict for a memo: benchmark verified against Dake Exercise 9.2 as of 2026-05-17 at a stated 3.53 percent, re run on this engine version giving 307.221409553720 MMSTB and 1.53159950201266 percent, provenance not refreshed since. That last clause is what separates a reviewer from a user.

## Exercise

Pick any tool your team relies on that prints a validation or accuracy claim. Answer the five questions against it and write down which ones you cannot answer.

Then do the part that hurts. Re run whatever case the claim names, on today's version, and compare what you get to what the claim reports. Write down the result, including the case where everything matches, because a provenance string that survives a re run is worth quoting and you should know which ones those are.
