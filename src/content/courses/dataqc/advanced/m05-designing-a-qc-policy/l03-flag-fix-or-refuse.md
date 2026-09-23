# Flag, fix or refuse

{{panel:dq-checks-explorer}}
{{panel:dq-outliers-explorer}}

For every question it is asked, the engine does one of two things: it flags, or it refuses. It never fixes. On the Ekene teaching data, 22 defects were planted, and every one is found by a flag from a named check. Where an input makes the question unanswerable, such as a MAD of zero, a unit it does not list or a chart series with a gap, the engine refuses and names the field. Fixing, whether by converting a sentinel, filling a gap or dropping a reading, is the caller's decision.

| situation | what the engine does | the caller's decision |
| --- | --- | --- |
| -999.25 in a gamma ray | counts it present; the range check flags it | convert it to null, and say so |
| a gap in a chart series | refuses, naming the entry | fill or drop the day |
| a MAD of zero | refuses | use another test, or report the stuck stretch |
| a sonic in an unlisted unit | refuses; units are never converted | convert outside the engine, and record it |
| a Hampel spike | flags it, and returns a `cleaned` series beside the flags | whether to use the cleaned series |

## A flag is a question

Every flag carries the rule that fired and a reason sentence. One flag, exactly as the engine returns it: `index` 1, `rule` negative-rate, `reason` "rate -3 is negative", `value` -3. It does not say the value is wrong. On EKENE-3, day 47's -18.500000 bbl/d is an allocation back-out, a real bookkeeping entry that a rate check flags. Whether to keep it, move it or correct it is a question for the person who owns the allocation.

## Why the engine never fixes

A fix is a claim about what the value should have been. The engine has no way to know that. Hampel's replacement is the window median, and the engine returns it as a separate `cleaned` series; the flags stand beside it, and choosing to use it is the caller's decision. A policy that uses the cleaned series says so, names the half window and nSigma, and keeps the original.

## Why the engine refuses

A refusal is the engine declining to invent an answer. When the MAD is zero, a modified z-score is undefined, and the engine does not substitute a fallback scale. When a unit is unlisted, it does not guess a conversion. When a chart series has a gap, it does not interpolate. Each refusal names the field it could not accept, and a refusal carries no number. The alternative in each case would have been a number that looked like a result and rested on a choice nobody made.

## A tolerance can hide a defect

Fixing is not the only way to lose a defect. On EKENE-3 the cumulative oil falls on day 70 by 7496.700000 bbl against day 68, a keying error. With a tolerance of 8000 bbl the same drop is not flagged. A tolerance is for meter noise, and a tolerance wide enough to swallow a keying error hides it. A policy sets each tolerance from the noise it is meant to absorb, and writes that reason down.

## The sentinel, both ways

EKENE-7's gamma ray as delivered reads a completeness of 1.000000 and 4 range failures. Converted to null it reads 0.983333 and 0. Both results are correct for their input. The conversion is the fix, and it belongs to the caller, stated in the quality note with the entries it touched.

## Exercise

In the outliers panel's Hampel view, run EKENE-7's gamma ray and read the flags beside the cleaned series. Pick one flagged entry that is not one of the planted spikes at 70 and 170, and write two sentences: one on what the flag says, and one on what you would need to know before you used the cleaned value in place of the original.
