# Gap runs, one flag per run

{{panel:dq-checks-explorer}}

EKENE-7's density and neutron are both incomplete, and completeness alone makes them look like milder and worse versions of one problem. The gap runs show two different problems. A gap run is a maximal stretch of consecutive missing values, and `completeness` raises one flag for each run, carrying where it starts and how long it is.

| EKENE-7 channel | missing | completeness | gap runs (start, length) | longest gap |
| --- | --- | --- | --- | --- |
| RHOB | 12 | 0.950000 | 80, 12 | 12 |
| NPHI | 3 | 0.987500 | 25, 1; 118, 1; 205, 1 | 1 |

RHOB loses 12 samples in 1 run and NPHI 3 in 3 runs.

## One flag per run

Why does a whole run get a single flag? Because a run is usually one event. The density lost twelve samples in a row because the pad lifted off the borehole wall; that is one thing that happened, and one flag says so. Twelve flags would describe the same event twelve times and bury the neutron's three separate events under it.

The engine words each flag for its own run. The density flag reads, verbatim: "samples 80 to 91 are missing (12 in a row)". A neutron flag reads: "sample 25 is missing". The entries are counted from 0, as the engine always counts them.

## What the shape tells you

The two channels suggest different questions. A single run of twelve is a hole in the record: a stretch of rock with no density at all. A twelve-sample hole in a half-foot log is 6 ft of rock with no density, derived as twelve times the step. A thin bed inside that stretch cannot be recovered from the density.

Three runs of one are isolated dropouts. Each loses one sample with present neighbours on both sides. Whether that matters depends on the question: for a zone average it may not, and for picking a thin bed it may. The engine does not decide which. It reports the shape, and the person using the data decides whether the shape is acceptable for the job.

## The production sheet has shapes too

On EKENE-3 the oil column has one gap run: day 31, 3 days long, a meter outage. The water cut has three runs: day 31 for 3 days, then day 47 for 1 and day 60 for 1. The first run coincides with the oil outage. The other two fall on days you will meet again in module three: day 47 is the day an allocation back-out was booked as a negative rate, and day 60 is a shut-in day. The gap runs point you at the days to look at; they do not explain them.

## A present value ends a gap run

The definition says consecutive. One present value between two missing ones splits them into two runs, however close they are. That is a stated rule, and it means the count of runs and the length of the longest run are both sensitive to a single sample. Read them together with the missing count.

## Exercise

Open the checks explorer on the view for completeness and coverage. The default stretch of EKENE-7 density contains its gap. Read the Gap runs and Longest gap tiles and the flag beneath them. Now type any density value in place of one `null` in the middle of the gap. Read the tiles and the flags again, and explain why the missing count fell by one while the number of gap runs went up.
