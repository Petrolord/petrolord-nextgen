# Writing the policy

{{panel:dq-monitor-explorer}}

A QC policy is the set of rules, settings and decisions that a stream of data passes through, written down before the data arrive. For EKENE-3's flowing wellhead pressure the monitoring half of it fits in a table: a phase one of 50 in-control days, with a centre of 611.380000 psig and an MRbar of 4.257143 psi; sigma 3.774063 psi as MRbar / 1.128; an individuals chart on that standard; EWMA at lambda 0.2 and L 3 with asymptotic limits; and a CUSUM at k 0.5 and h 4 in sigma units.

| policy line | EKENE-3 setting | whose choice |
| --- | --- | --- |
| phase one | 50 in-control days, 0 flags on its own chart | the plan |
| centre and MRbar | 611.380000 psig and 4.257143 psi | computed from phase one |
| sigma | 3.774063 psi, MRbar / 1.128 | computed from phase one |
| individuals chart | phase one as the standard, 3 sigma limits | NIST 6.3.2.2 |
| EWMA | lambda 0.2, L 3, asymptotic limits | lambda stated; L and limits NIST 6.3.2.4 |
| CUSUM | k 0.5 and h 4, units sigma, no reset | the plan; the unit stated |
| scorecard | weights 3, 2, 2, 1, 1 | the plan |

## What the policy states

A policy has four parts. The first is the data: which stream, which unit, which days form the history and why they were judged in control. The second is the order of checks and the setting of each, with the defaults it keeps and the ones it changes, each with a reason. The third is the monitoring: which charts, with which settings, against which standard. The fourth is what happens after a flag or a signal: who looks, what they look for, and what gets written down.

## Settings chosen before the data

Every chart setting in the table was fixed before phase two was charted. A lambda, a k or an h chosen after looking at which one gives the signals someone wanted would make the chart say what its author hoped. The same holds for the standard: phase one is chosen for being in control, and it is not re-estimated from the days being monitored. The first module showed what that costs: on its own averages the individuals chart signalled only on days 8 and 9.

## What a signal triggers

A signal is a question about the process. The policy says who answers it and how. On EKENE-3 the individuals chart signals on day 8 with a reading of 633.800000 psig; CUSUM first signals low on day 21 and EWMA on day 22. A policy for this stream might ask for the gauge record on day 8 and for an operations check on the days from the first low signal. Where a cause is found, the note records it; where none is found, it says so, and the days stay in the record.

## The scorecard line

The scorecard's weights say what the data are for, and the policy states them with the use they serve. It names no grade band, because the engine has none to offer. If the plan needs a decision rule, it writes one in its own words, for example a threshold on the weakest dimension, and it gives the reason for the threshold.

## Keeping the policy honest

A policy is revised when the process changes or when a setting proves wrong. Each revision says what changed, when and why, and a new phase one is chosen and recorded after any deliberate change to the process. Results computed under the old policy are kept with the settings that produced them, so nothing earlier has to be recomputed to be understood.

## Exercise

Open the monitor panel and run all three charts on EKENE-3 with the settings in the table, and confirm the first signals quoted above. Then write your own one-page policy for this stream in the four parts, using the table as the monitoring section and adding the order of checks from the first lesson of this module. Mark every setting as a default kept, a default changed or a plan choice.
