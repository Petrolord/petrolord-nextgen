# What a KPI cannot tell you

Nothing `computeKpis` returns is a comparison. It has no baseline, no second window and no verdict, so the strongest sentence it can support is what the field averaged, never that the field got worse.

{{panel:pd-ledger-explorer}}

## Two adjacent lines that guard differently

Liquid is formed with an explicit null check on both means: if either the oil mean or the water mean is null, liquid is null. The watercut on the very next line reads those same two means with a bare `oil + water > 0` and no null check at all.

A derived demonstration on a field day whose oil mean comes back null and whose water mean is 5 stb returns liquid null, a watercut of 1.000000000000 and a gas-oil ratio of null. The object therefore reports that the field has no liquid and that its liquid is entirely water, in two members formed one line apart from the same pair of means.

A watercut of exactly 1.000000000000 alongside a null liquid is the signature. Read on its own it looks like a field on water only, which is a real and unremarkable state for a mature field, and that is what makes it worth recognising.

## The other nulls, and what they mean

| The input | liquid | watercut | gor | uptimePct |
| --- | --- | --- | --- | --- |
| A field day of all zeroes | 0.000000 | null | null | null |
| A null oil mean with 5 stb of water | null | 1.000000000000 | null | not reported |

An empty field series is refused outright: `computeKpis` returns null rather than an object of zeroes, which is the one case a caller cannot mistake for a quiet field.

## What the return does not say

It does not say how many days it averaged, because `windowDays` comes back as asked and the window is a date window. It does not say which wells the uptime came from. It does not say what its two counts counted. And it does not flag its own nulls: a null gas-oil ratio and a gas-oil ratio the field genuinely did not have are the same value in the same field.

## The mistake

Reading a KPI move as a field change. Two `computeKpis` calls at different `windowDays` on identical rows return different oil, different watercut and different uptime, and comparing them measures the windows rather than the field. The function that compares two windows on purpose is `detectExceptions`, and it is a different call with a different convention inside it.

## Exercise

Run the panel on a field day of all zeroes and write down which three members come back null and which one comes back as 0.000000.

Then say what a watercut of 1.000000000000 beside a null liquid tells you about the oil mean that produced it.
