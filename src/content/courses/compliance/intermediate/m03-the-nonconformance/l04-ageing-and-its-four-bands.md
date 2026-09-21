# Ageing and its four bands

An NCR's age is a count of days the engine derives from two dates. ncrAgeDays measures from the date the NCR was raised to the as-of date while it is open, and to its closed date once it is closed or voided. Nobody types an age, and an age read without its as-of date means nothing.

{{panel:compliance-plan-explorer}}

## The ABAM ages at 2026-10-15

| code | status | raised | closed | age in days | ageBand |
| --- | --- | --- | --- | --- | --- |
| NCR-2026-031 | Actions in progress | 2026-09-02 | none | 43 | 31 to 60 days |
| NCR-2026-027 | Open | 2026-08-12 | none | 64 | 61 to 90 days |
| NCR-2026-019 | Disposition agreed | 2026-06-20 | none | 117 | Over 90 days |
| NCR-2026-022 | Closed | 2026-07-01 | 2026-07-09 | 8 | 0 to 30 days |
| NCR-2026-011 | Voided | 2026-05-11 | 2026-05-13 | 2 | 0 to 30 days |
| NCR-2026-006 | Closed | 2026-03-03 | 2026-04-20 | 48 | 31 to 60 days |

The three open ages, 43, 64 and 117 days, are true at the as-of date 2026-10-15. Read the register on another date and they are different. The three closed ages, 8, 2 and 48 days, stop at their closed dates and read the same on any date after closure.

## An open NCR keeps ageing

An NCR that stays open grows older every day, whatever its status word says. NCR-2026-019 reads Disposition agreed, a status that sounds settled, and at 117 days it is the oldest open NCR on the register. summarise prints the same figure as oldest open 117 days, beside a mean open age of 75 days. NCR-2026-031 reads Actions in progress, and its 43 days are counted to the as-of date as well. Only a closed date stops the count. Agreeing a disposition, raising actions and completing them all leave the clock running.

A voided NCR stops ageing too. NCR-2026-011, pipe ovality out of tolerance, was raised on 2026-05-11 and voided on 2026-05-13, and its age is 2 days.

## Four bands and their edges

ageBand sorts an age into one of four bands. The lab prints the edges:

| age in days | ageBand |
| --- | --- |
| 0 | 0 to 30 days |
| 30 | 0 to 30 days |
| 31 | 31 to 60 days |
| 60 | 31 to 60 days |
| 61 | 61 to 90 days |
| 90 | 61 to 90 days |
| 91 | Over 90 days |
| -1 | null |

Each band includes both of its printed ends. An age of 30 days is still in the first band, and 31 is the first day of the second. An age of 90 is in 61 to 90 days, and 91 is the first day Over 90 days. A negative age reads null. An NCR cannot be open for less than no time, and the engine does not force an impossible age into a band.

## Ageing by band and severity

ncrAgeing counts open NCRs only, by band and severity, at the as-of date:

| band | Critical | Major | Minor | Observation |
| --- | --- | --- | --- | --- |
| 0 to 30 days | 0 | 0 | 0 | 0 |
| 31 to 60 days | 0 | 1 | 0 | 0 |
| 61 to 90 days | 0 | 0 | 1 | 0 |
| Over 90 days | 1 | 0 | 0 | 0 |

The Critical in Over 90 days is NCR-2026-019, the Major in 31 to 60 days is NCR-2026-031, and the Minor in 61 to 90 days is NCR-2026-027. The closed and voided NCRs are absent from this grid. NCR-2026-006 carries an age of 48 days and the band 31 to 60 days in the age table, and it does not appear here, because the grid is a picture of what is still open. A manager reading the grid sees at a glance where open NCRs are piling up, and by which severity. On this register the one Critical open NCR sits in the oldest band.

## Exercise

Read NCR-2026-006's age, 48 days, and its row in the ncrAgeing grid, where it is absent. Then read NCR-2026-031's age, 43 days, and its count in the grid. Say what the two readings show about which NCRs the grid counts, and why NCR-2026-006's age reads the same on any date after 2026-04-20 while NCR-2026-031's does not.
