# The IRR that says why it is missing

The screening engine returns either a rate it solved, with `irrStatus` ok, or null with a word for why there is no answer. The five statuses are ok, no-sign-change, no-root, above-clamp and multiple-roots.

{{panel:ec-risk-explorer}}

## Three fields, three readings

| field | npv | irr percent | irrStatus | payback | paybackStatus |
| --- | --- | --- | --- | --- | --- |
| NTEJE | -123.9923 | null | no-root | null | not-recovered |
| OKPOMA | 167.4389 | -54.7919 | ok | 0.0000 | recrossed |
| ISIALA | 81.0464 | 53.7148 | ok | 3.2746 | ok |

NTEJE loses 123.9923 million USD at 12 percent and its cumulative ends at -154.5906. No rate in the engine's band zeroes its NPV, so the IRR is null and the status names the reason: no-root. It never pays back either, and the payback is null with not-recovered rather than a number that looks like a year.

## A solved root can be negative

OKPOMA's IRR is -54.7919 percent with irrStatus ok, which is a rate the engine found rather than a failure it hid. Its cash flow earns 9.2498 million USD in 2027, loses 11.4786 in 2028 and earns 57.8806 in 2029, and a project worth 167.4389 at 12 percent can still have its root below zero when the flow starts positive. A status of ok says a rate zeroes the NPV. It never says the rate is a sensible screening number.

## What the statuses replaced

History, before the 2026-09-15 repair: NTEJE reported an IRR of 1000.0000 percent, the Newton clamp (finding S1), and a payback of 20.0000, which was the project life. OKPOMA reported the same 1000.0000 percent. One rate stood on a project that destroyed value and on one that created it, and it zeroed the NPV of neither. Anyone ranking projects by IRR put NTEJE at the top of the list.

## The published cases now

| case | irr | status |
| --- | --- | --- |
| `irr_beyond_clamp`, ncf -1 then 100 | null | above-clamp |
| `irr_two_roots`, ncf -100, 230, -132 | null | multiple-roots, irrRoots 10.0000 and 20.0000 percent |
| `irr_no_sign_change`, all-positive flow | null | no-sign-change |
| `fdp_never_pays_back` | -36.6747 | ok |

Each null names a different thing. above-clamp says a root exists beyond 1000 percent, and that golden records it at 9900. multiple-roots says several rates zero the NPV, lists every one, and reports no single IRR. no-sign-change says the flow never turns. The fourth row is the other half of the lesson: a solved rate of -36.6747 percent on a project whose NPV is -92616.5020 and which never pays back.

## The payback on the same field

OKPOMA's cumulative is 9.2498 after 2027, so the payback, which is the first crossing, is 0.0000. The second capex half takes the cumulative to -2.2287 in 2028, so the status is recrossed and `paybackLast` records where it turns non-negative for good: 2 + 2.2287 / 57.8806 = 2.0385 years. Both crossings are reported, and the status says which number is which.

## The mistake

The careful mistake is reading a null as a zero. A null IRR is the engine declining to name a rate, and the status word says whether a root sits past the clamp, sits in several places, or does not exist. Read the status before the number, and read a payback of 0.0000 with its status too: on OKPOMA it means recrossed, and 2.0385 is the year a reader wants.

## Exercise

For NTEJE and OKPOMA, give the NPV, the IRR with its status and the payback with its status, and say for each whether a rate its cash flow earns exists. Then explain what paybackLast 2.0385 records on OKPOMA and why the payback still reads 0.0000.
