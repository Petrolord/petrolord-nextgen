# Why an outer string is derated

Two strings of the same steel, both sound, both tested. One is allowed 0.8 of its rating and the other only 0.5. The difference is not metallurgy, it is access.

{{panel:wi-annulus-explorer}}

## The two factors side by side

Take one candidate with a limit of 40000000 Pa at a TVD of 1435.457478934607 m, with 1200 kg/m3 in the annulus and 1030 kg/m3 behind it, and run it under each of the two burst roles:

| Role | Factor | Rated limit, Pa | Allowable surface pressure, Pa |
| --- | --- | --- | --- |
| inner-casing-burst | 0.8 | 32000000 | 29606905.05541501 |
| outer-casing-burst | 0.5 | 20000000 | 17606905.05541501 |

The hydrostatic term is 2393094.944584991 Pa in both rows. Every unit of the difference comes from the factor.

## Three reasons the outer string is trusted less

**It is harder to inspect.** An inner string can be logged with a caliper or an electromagnetic tool on a routine wireline run. To see an outer string you must look through the inner string, which blurs the reading, or pull the inner string, which is a workover.

**It is harder to repair.** A worn inner casing can be patched, lined or scab liner covered while the well stays a well. Restoring an outer string usually means a section milled out or a sidetrack, so the practical answer to a defect found there is often to live with it.

**Its failure is harder to detect.** A leak from an inner string shows up as pressure in the annulus you are watching. A leak from an outer string vents into a formation, into a shallower annulus, or to the seabed, and the first sign may be a sustained pressure you cannot bleed down or a shallow gas indication a long way from the wellhead.

## What the factor is really buying

The factor is not a guess at the strength of the pipe. The rating already carries the manufacturing allowance for that.

The factor is buying time and evidence. Half of the rating leaves room for wear you have not measured, corrosion you have not logged, and a leak you may not notice for weeks. On the inner string you expect to see the problem, so you keep more of the capacity.

## Exercise

Run the same candidate under both burst roles and confirm you reproduce the two allowables above.

Then ask what evidence would justify moving a string from the outer role to the inner role, and decide whether a single successful pressure test is enough.
