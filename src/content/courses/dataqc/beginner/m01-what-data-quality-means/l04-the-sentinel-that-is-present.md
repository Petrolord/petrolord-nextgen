# The sentinel that counts as present

{{panel:dq-checks-explorer}}

A LAS file declares a null value in its header, and -999.25 is the one you will meet most often. It is a number written where a reading should be, to say that there is no reading. To the engine, which treats only null, undefined and NaN as missing, it is a present number until someone converts it. EKENE-7's gamma ray was delivered with -999.25 left in place at entries 236, 237, 238 and 239, the last four samples of the log, and two checks read those four samples very differently.

| gamma ray, as delivered or converted | completeness | missing | range failures |
| --- | --- | --- | --- |
| as delivered, -999.25 in place | 1.000000 | 0 | 4 |
| with -999.25 converted to null | 0.983333 | 4 | 0 |

## Two checks, two stories

As delivered, `completeness` reports 1.000000: every one of the 240 samples is present. That is correct by its rule, and it is also the reason a completeness figure on its own can mislead. A log whose bottom four samples say "no reading" scores as fully complete.

The range check tells the other half. The definitional minimum for the gamma ray in gAPI is 0, and -999.25 is below it, so the four samples fail. The first flag's reason, in the engine's words: "value -999.25 is below the minimum 0". Nothing in that sentence says "sentinel". The engine only knows the value crossed a limit.

Convert the four sentinels to null and both stories change together. Completeness falls to 0.983333 with 4 missing, and the range check now finds 0 failures, because a missing value is not checked against a limit. The four samples moved from one dimension to the other.

## Which reading is right

Both are, by their own rules. The as-delivered reading describes the file. The converted reading describes the rock the log actually measured. Converting is a decision the caller makes after reading the file header, and the engine leaves it to the caller on purpose: the null value is a convention of one file, and the same number in another channel or another file could be a reading.

The practical habit is to run completeness and a range check side by side on anything you receive, before you convert anything. A channel that reads complete and fails its range check at the same entries is what a sentinel left in place looks like.

## What this catches, and where it stops

The range check caught these four because the gamma ray minimum is 0 and the sentinel is negative. Its reach is the definitional limit and nothing more. The engine carries no plausibility range for any tool, so a placeholder that happens to sit inside a channel's definitional limits would pass the range check and read as present. Reading the file header for its declared null value remains the caller's first step, and nothing in the engine replaces it.

## Exercise

Open the checks explorer on the view for range limits and rate rules. Set the channel to gammaRay with unit gAPI and type four values, each -999.25, into the values box. Read the Checked and Failed tiles and copy one reason. Then switch to the view for completeness and coverage, type the same four values and read the completeness tile. Replace all four with `null` and read the completeness tile again. Explain in two sentences why the completeness view called the four values present while the range view flagged every one of them.
