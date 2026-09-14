# IRR by Newton

The internal rate of return is the discount rate at which a ledger's NPV is exactly zero. The screening engine finds it by Newton iteration from a starting guess of 10 percent, and ISIALA's is 53.7148 percent.

{{panel:ec-screening-explorer}}

## What Newton does

Newton's method starts at a guess, measures the NPV and how fast the NPV changes with the rate, and steps to where a straight line through that point would cross zero. It repeats until it settles. On a well-behaved ledger such as ISIALA, which spends in 2027 and 2028 and earns every year after, there is one root and Newton finds it: 53.7148 percent.

Mid-year discounting does not move the root. Every term carries the same extra (1 + r)^-0.5, so the rate that zeroes the year-end NPV also zeroes the mid-year one. The published irr_known_21pct case, net cash flows of -100 then +121, solves (1 + r) = 1.21 and the engine returns 21.0000.

The IRR does not use the project's discount rate either. On the 10 year base case every discount sweep from 0 to 20 percent reports the same 41.0683, while NPV falls from 908.4827 to 234.9911.

## The returns that are not roots

The engine has fixed answers for ledgers Newton cannot handle, and they print exactly like rates.

| case | engine irr | what is true |
| --- | --- | --- |
| irr_no_sign_change | 0.0000 | all positive, no IRR exists |
| irr_all_negative | 0.0000 | all negative, no IRR exists |
| irr_two_roots | 10.0000 | roots at 10 and 20 percent |
| irr_beyond_clamp | 1000.0000 | the root is 9900 percent |
| irr_tiny_cash_flows_derivative_guard | 10.0000 | the root is 21 percent |

No sign change reports 0. So does the published two year hand case, which earns 10 and 35 with no negative year: IRR 0.0000 beside an NPV of 39.8721. A clamp at 1000 percent catches Newton when it runs away, and the engine reports the clamp. An absolute guard on the slope, |dNPV/dr| < 1e-5, fires on cash flows of order 1e-7 million USD and hands back the starting guess of 10 percent. Net cash flows of -100, 230 and -132 have two true roots, and Newton from 10 percent lands on 10.

## The mistake

The mistake is to trust any IRR because it is a number. The teaching field NTEJE loses 123.9923 million USD, never pays back, and reports an IRR of 1000.0000 percent: the Newton clamp, recorded as FINDINGS S1. A reader who sorts projects by IRR puts NTEJE first. A zero is just as treacherous: ISIALA's High scenario, which never goes below zero, reports an IRR of 0.0000 beside the best NPV of the three, 237.8860, while the Low scenario reports -3.5758, so the engine can print a negative rate when a root exists. Before quoting an IRR, check that the net cash flows change sign, and treat 0, 10 and 1000 as flags until the NPV agrees.

## What it refuses

It refuses to say which path produced its answer: a root, the clamp, the slope guard and the no sign change return all come back as one plain rate. It reports one root when there are two, and it measures return per unit of money at risk, so it cannot rank a small project against a large one.

## Exercise

State ISIALA's IRR and explain why the 12 percent discount rate plays no part in it. Then give NTEJE's NPV and IRR, name the finding, and list the three engine IRR values that should send you back to the net cash flow column.
