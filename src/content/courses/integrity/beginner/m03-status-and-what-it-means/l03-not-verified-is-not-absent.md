# Not verified is not absent

The element may be perfectly sound. Nobody knows. The standard treats not knowing as a degradation, and this is the rule that matters most on this tier.

{{panel:wi-envelope-explorer}}

## The rule

`not-verified` does not mean the element is missing. It does not mean the element is broken. It means there is no current test, so the element cannot be relied on as a barrier.

The engine states the reasoning in a comment beside the rollup: an untested element is not a qualified barrier. A barrier you cannot demonstrate is not a barrier you can lean on when the well is trying to flow.

## The sweep that settles it

Take an envelope where every element is verified, then re-rate exactly one element and read the verdict off the engine.

| One element set to | Envelope verdict | Category against an intact secondary |
| --- | --- | --- |
| verified | intact | green |
| degraded | degraded | yellow |
| not-verified | degraded | yellow |
| failed | failed | orange |

Look at the middle two rows. **`not-verified` and `degraded` give the identical envelope verdict and the identical category.** The engine even returns the same sentence for both: `Barrier degradation (or unverified elements); no failure.`

The digest records this directly. With one element not verified the envelope is degraded, with one element degraded the envelope is degraded, and the flag saying those agree is set to true.

## Where the two do differ

Not in the verdict. In the paperwork.

Re-rate the published roster's DHSV and compare. At **degraded**, the primary envelope is degraded, the category is yellow, and no check fails. At **not-verified**, the primary envelope is degraded, the category is yellow, and the `all-verified` check fails and names the element.

The well is in the same condition either way, and only the not-verified case tells you what to do about it. A degraded element needs an intervention. An unverified element needs a test, and the test may come back clean.

## Why this is the consequential one

Because it is the status people quietly round down to verified. The valve has always worked. The cement was good when it went in. Nobody has any reason to think anything is wrong.

None of that is evidence, and the engine will not let you spend it as if it were. An envelope with an unverified element is a degraded envelope, and the well is yellow.

## Exercise

1. In the panel, produce two rosters that both come out yellow, one using a degraded element and one using a not-verified element. Confirm the verdicts match.
2. Read the checks on both and write down the single difference.
3. For one unverified element, state the test that would clear it and what the verdict becomes if the test passes.
