# IRR by Newton

The internal rate of return is the discount rate at which a ledger's NPV is exactly zero. The screening engine finds it by Newton iteration from a starting guess of 10 percent, and ISIALA's is 53.7148 percent.

{{panel:ec-screening-explorer}}

## What Newton does

Newton's method starts at a guess, measures the NPV and how fast it changes with the rate, and steps to where a straight line through that point would cross zero, repeating until it settles. On a well-behaved ledger such as ISIALA, which spends in 2027 and 2028 and earns every year after, there is one root and Newton finds it: 53.7148 percent.

Mid-year discounting does not move the root. Every term carries the same extra (1 + r)^-0.5, so the rate that zeroes the year-end NPV also zeroes the mid-year one. The published irr_known_21pct case, net cash flows of -100 then +121, solves (1 + r) = 1.21 and the engine returns 21.0000.

The IRR does not use the project's discount rate either. On the 10 year base case every discount sweep from 0 to 20 percent reports the same 41.0683, while NPV falls from 908.4827 to 234.9911.

## What comes back when there is no root

Every result carries an `irrStatus`, so a ledger Newton cannot solve reports null and names the reason.

| case | engine irr | irrStatus | what is true |
| --- | --- | --- | --- |
| irr_no_sign_change | null | no-sign-change | all positive, no IRR exists |
| irr_all_negative | null | no-sign-change | all negative, no IRR exists |
| irr_two_roots | null | multiple-roots | roots at 10.0000 and 20.0000 percent |
| irr_beyond_clamp | null | above-clamp | the NPV is still positive at 1000 percent |
| irr_tiny_cash_flows_derivative_guard | 21.0000 | ok | the root is 21 percent |

There are five statuses. `ok` is a root the search landed on. `no-sign-change` is a ledger that never crosses, so no rate can zero it: the published two year hand case earns 10 and 35 with no negative year and reports irr null beside an NPV of 39.8721. `no-root` changes sign and still has no rate in the engine's band that zeroes its NPV. `above-clamp` is an NPV still positive at 1000 percent. `multiple-roots` lists every root in `irrRoots` and reports irr null, so -100, 230 and -132 come back as 10.0000 and 20.0000 percent together. Before the 2026-09-15 repair each printed a plain rate instead, 0.0000 where no sign change exists and 1000.0000 for the clamp.

## The mistake

The mistake is to quote an IRR without the status beside it. The teaching field NTEJE loses 123.9923 million USD and never pays back, and the engine reports irr null with irrStatus no-root. Before the 2026-09-15 repair it reported 1000.0000 percent, the Newton clamp recorded as FINDINGS S1, and a reader sorting projects by IRR put NTEJE first. ISIALA's High scenario is the other shape: it never goes below zero, so it reports irr null with irrStatus no-sign-change beside the best NPV of the three, 226.0140, while the Low scenario reports -0.6992 percent with irrStatus ok, a real negative root.

## What it refuses

It refuses to choose between two true answers: 10.0000 and 20.0000 percent both zero the same cash flows, and the engine hands back the pair with no headline. It measures return per unit of money at risk, so it cannot rank a small project against a large one. And a null is not a verdict on a project: it is a question the rate cannot answer.

## Exercise

State ISIALA's IRR and explain why the 12 percent discount rate plays no part in it. Then give NTEJE's NPV, its IRR and its irrStatus, and name the status the engine reports for a ledger whose net cash flow never changes sign.
