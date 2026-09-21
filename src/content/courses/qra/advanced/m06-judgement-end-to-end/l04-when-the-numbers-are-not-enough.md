# When the numbers are not enough

{{panel:qr-alarp}}

The engine returns a band and a verdict, and both are exact on the stated inputs. Three situations show where an exact verdict stops and the duty holder's judgement begins. None of them is a gap in the arithmetic. Each is a limit of what arithmetic alone can decide, and each has a sentence of its own in an ALARP note.

## A verdict at the boundary

A verdict at the boundary is still reasonably practicable. In the golden case exactly-at-df, a cost of 9000.000000000002 against DF 3 times a benefit of 3000.00 returns NOT_GROSSLY_DISPROPORTIONATE with `atBoundary` true. The duty to adopt the measure stands. The note says the verdict came from the edge, and shows what a small change in the VPF, the DF or a rate would do to it, so a reader sees how narrow the margin was.

## TOLERABLE is a region with a condition

An individual risk in the TOLERABLE region is not acceptable until the demonstration is made. The EREMOR supervisor's IRPA of 0.000008743500 per year is TOLERABLE, 8.743500 times the lower limit. The band on its own permits nothing: it says that the individual risk may be tolerated if it has been reduced as low as reasonably practicable, and the demonstration is the evidence that it has.

## Rejected on cost, still weighed

A measure rejected on cost is still weighed against good practice, which the engine does not know. The EDIKAN firewall is GROSSLY_DISPROPORTIONATE at DF 3 undiscounted, with a ratio of 8.750000. That verdict settles the cost benefit question at those choices. Whether good practice for the installation expects the measure anyway is a separate question, which the analyst answers in the note from sources the engine never read.

The arithmetic and the judgement sit side by side in the note. The engine's figures show what the stated choices imply; the analyst's sentences show why those choices were made, and what else was considered.

## Writing the three sentences

Each situation above earns one sentence in the note. The boundary sentence names the flag and the sensitivity. The TOLERABLE sentence names the region and points to the demonstration. The good practice sentence names the measure, its verdict and the source of the expectation, so the reviewer can follow each step.

| situation | what the engine returns | what the duty holder still does |
| --- | --- | --- |
| cost at the limit | NOT_GROSSLY_DISPROPORTIONATE, atBoundary true | adopts the measure and shows the sensitivity |
| individual risk in the middle region | TOLERABLE | makes the demonstration |
| measure rejected on cost | GROSSLY_DISPROPORTIONATE | checks it against good practice |

## Exercise

Take the firewall's verdict at DF 3, GROSSLY_DISPROPORTIONATE with a ratio of 8.750000, and the golden edge case, a cost of 9000.000000000002 against DF 3 times a benefit of 3000.00. For each, write one sentence stating what the duty holder must still do after reading the engine's verdict, and name the input that would move each verdict soonest.
