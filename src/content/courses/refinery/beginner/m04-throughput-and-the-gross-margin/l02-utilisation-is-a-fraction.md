# Utilisation is a fraction

Utilisation is an input easily typed wrong, because people say it as a percentage and the engine reads it as a fraction. modularRefinery closes that gap by refusing any figure outside 0 to 1, and its refusal tells you what to type instead.

{{panel:refinery-screen-explorer}}

## What the engine accepts

| utilisation typed as | what the engine returns |
| --- | --- |
| 90 | REFUSED: "Utilisation is a fraction between 0 and 1 (0.9 for 90 percent)." |
| -0.1 | REFUSED: "Utilisation is a fraction between 0 and 1 (0.9 for 90 percent)." |
| 0 | answered: annual throughput 0.00 bbl |

And from the supply scenarios, the three values the screen itself uses: 0.9200 for firm supply, 0.7500 for tight and 0.5000 for disrupted.

## Why 90 is refused

A utilisation of 90 read as a fraction describes a plant running far beyond its nameplate every on-stream day. The throughput would be absurd, and a screen that printed it would put an absurd revenue into every year of the streams. The engine does not try to guess that you meant 90 percent. It refuses, states the range, and gives the example: 0.9 for 90 percent. The fix is one keystroke, and the sentence tells you which.

The same refusal covers a negative figure, such as -0.1. A plant cannot run below zero, and the range excludes it.

## Why 0 is answered

Zero is inside the range. A plant with a utilisation of 0 runs nothing on its on-stream days, and the engine says so: annual throughput 0.00 bbl. That is a legitimate question to ask of a screen, for instance to see what the fixed costs and capital look like with no barrels at all against them. So the engine answers it.

This is the same distinction the first module drew for blank boxes. A typed value inside the range is a statement, and the engine takes it at its word. A value outside the range cannot be a statement about a real plant, and the engine refuses it.

## Where utilisation comes from on this screen

On this screen, utilisation usually comes from the supply scenario you pick: each scenario carries its own utilisation, and the utilisation replaces the plant's. So when you choose firm supply, the screen runs OKORDIA at 0.9200; when you choose tight, at 0.7500. The fifth module works through what that does to the margin as well as the throughput.

## The mistake

Reading utilisation as the share of the year the plant runs. That share belongs to on-stream days. Utilisation is how hard the plant runs on the days it is running. OKORDIA runs 330 on-stream days at a utilisation of 0.9200, and the two multiply into the annual throughput with capacity. Folding one into the other counts the downtime twice or not at all.

## Exercise

Type 90, then -0.1, then 0, then 0.9200 into utilisation on the panel and read what the engine returns each time. Quote each result. Say which two are refused and why, and what the 0.00 bbl answer for a utilisation of 0 tells you about the rule for annual throughput.
