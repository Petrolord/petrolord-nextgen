# A noise dose with no TWA

{{panel:hy-noise-dosimeter}}

Eight hours at 85 dBA on the OSHA PEL setup give a noise dose of 0.000000 percent, and the engine reports the TWA as absent: it returns null. Nothing in that record reached the PEL threshold of 90.000000 dBA, so nothing was integrated, and a noise dose of zero has no TWA to restate it.

The reason is in the formula. TWA = K log10(D/100) + Lc needs the logarithm of the noise dose, and the logarithm of zero is not a number. The engine will not invent one.

## Two doors, two behaviours

The same fact shows up in two places, and the engine handles each in the way that suits it.

| door | input | what comes back |
| --- | --- | --- |
| `noiseDose` | eight hours at 85 dBA on the PEL setup | noise dose 0.000000 percent, TWA null |
| `noiseTwaFromDoseDbA` | a noise dose of 0 | a refusal on `dosePct` |

`noiseDose` is reading a real record, and a record with nothing above the threshold is a legitimate day. So it returns the noise dose it found, zero, and leaves the TWA empty. `noiseTwaFromDoseDbA` is asked a direct question with an impossible input, so it refuses:

> dosePct must be a finite percentage above zero: a zero dose has no TWA

A negative noise dose gets the same message on the same field.

## Small is still a TWA

The edge is at zero and nowhere else. A small noise dose has a perfectly good TWA. On OSHA Table A-1 a noise dose of 10.000000 percent gives 73.390000 dBA, well below the threshold of 90. That can look odd at first, because a TWA under the threshold seems to describe a day the criterion would ignore.

It does not. The TWA is the constant level that would give the same noise dose over 8 hours if the threshold were no obstacle. It is a restatement of the percentage, and it can sit below the threshold whenever the percentage is small. The OBEN PEL TWA of 80.752126 dBA sits below 90 for exactly this reason.

## Reading an empty TWA in a report

A report that shows a noise dose of zero and a blank TWA is telling you something useful: under that criterion, nothing on the record counted. It is worth reading the same record against another criterion before concluding the day was quiet. The ORONI record gives a PEL noise dose of 25.000000 percent while three of its hours sit below every threshold, and the OBEN record integrates 2 periods under the PEL and 5 under the action level. A null TWA under the PEL can sit beside a substantial action level noise dose on the same day.

Write the blank as absent or null. A TWA written as zero dBA would be a claim about a sound level, and nobody measured one.

## Exercise

Take the record of eight hours at 85 dBA. Using the OSHA action level threshold of 80.000000000000 dBA and the action level reference duration of 16.000000 h at 85.000000 dBA from the OSHA table, work out the noise dose the action level would report for the same record. Then say whether the action level would return a TWA for it, and why the PEL does not.
