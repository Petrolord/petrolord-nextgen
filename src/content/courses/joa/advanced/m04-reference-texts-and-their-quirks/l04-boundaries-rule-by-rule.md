# Boundaries, rule by rule

{{panel:joa-agreement-calculator}}

Every rule the engine applies meets its limit somewhere: a forecast equal to a threshold, an overrun equal to a tolerance, a default cured on the day a consequence would start. No single rule covers every boundary. Each rule has its own, and the texts it reads decide which side the boundary falls on. This lesson reads them one at a time, because a report that assumes one rule for all of them will be wrong somewhere.

## The table

Each row was probed by a call on a golden input.

| rule | at the boundary | engine result |
| --- | --- | --- |
| no-call threshold | a forecast equal to the threshold (500.000000) | called; one below it is not |
| budget item | an overrun of exactly the tolerance (5.000000 on 50.000000) | inside; 5.500000 is beyond |
| budget total | an overrun equal to the allowed overrun (50.000000) | inside |
| overhead band | a base exactly at a band's upper limit (1000.000000) | that band only; the next band gets 0.000000 |
| default interest | cured on the due date | 0 days, 0.000000 |
| grace | cured exactly graceHours after the due date (72 hours) | inside the grace, no default interest |
| a consequence | cured on the trigger date | not triggered; a day later it is |
| forfeiture, uncured | asOf equal to the trigger date | not triggered; a day later it is |
| carry recovered exactly | available equal to the balance | recovered that year |
| premium on the last barrel | a share equal to the balance | reversion from the next period; 0 that year |
| net value | deductions above the gross value | 0, nothing recovered |
| PIA participation | a target equal to 60 | accepted; 61 refused |

## Where the texts put the edge

Several of these edges come straight from the wording of a text. The Norwegian budget clause lets the operator exceed an item "by up to 10%" (Norway JOA Art. 12.5), so an overrun of exactly the tolerance is inside. The Act lets the Government participate "up to 60%" (PIA s.85(4)(a)), so a target of exactly 60 is accepted:

> targetPct must be at most 60 under basis "pia-s85-4" (the right to participate up to 60%, PIA s.85(4)(a)); got 61

Late payment interest runs "starting on and including the due date of payment and ending on, but excluding, the value date" (Norway Accounting Agreement Art. 1.2.2), so a default cured on its due date carries 0 days of default interest.

Other edges are the engine's stated conventions, and its reasons say which side a figure fell on. A consequence applies when the default is open after the whole trigger date, so a cure on the trigger date escapes it. On the Ekene March default the suspension starts after 2027-03-08: a cure on 2027-03-08 leaves it not triggered, a cure on 2027-03-09 triggers it.

## Two rules, two edges, one ledger

The premium recovery and the carry recovery look alike: a balance recovered from a share. Their edges read the same way. When the year's available amount equals the balance, it is recovered that year and the party receives nothing more in it. On the premium ledger that is the last barrel:

> C 2031: the balance 400 is recovered exactly by the 400 available; the non-consenting party receives 0 of its share 400

Deductions above gross value give a net value of 0, and the engine recovers nothing that year.

## Why a report names the edge

A figure that sits on a boundary is the one most likely to be read wrongly by a partner. A report that quotes such a figure says which rule applied and which side of the edge the case fell on, in the engine's own words.

## Exercise

Open the agreement calculator on the view "A default and forfeiture", which starts on the Ekene March default. Change PB's `curedOn` to 2027-03-08 and read the suspension column and the reason; change it to 2027-03-09 and read them again. Change it to 2027-03-01 and read the days and the default interest. Then open "Sole risk: the premium recovered from production", paste the last-barrel case from the first module of this tier, and read C's 2031 row and reason. Write one line per probe naming the rule, the boundary and the side the case fell on.
