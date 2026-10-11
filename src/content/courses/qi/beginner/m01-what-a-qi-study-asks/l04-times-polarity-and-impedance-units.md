# Times, polarity and impedance units

A QI study moves between a log in depth and a trace in time, and between units that differ by factors of a thousand or a million. An impedance read in the wrong unit, a one-way time read as two-way or a peak read as a trough each corrupts everything after it. Four conventions settle them for the Ekene pack: depth in feet, the engines in SI, time as two-way time in milliseconds, and SEG normal polarity.

## Depth in feet

Every depth a learner reads in this course is in feet, measured below the kelly bushing; 1 ft = 0.3048 m, and feet = metres / 0.3048. The kit writes metres, so the top of the Ekene Sand at Ekene-1, 1548.000000 m in the kit, is 5078.740157 ft in the course. When a depth looks too shallow for the field, the first question is whether it is still in metres.

## Velocity, density and impedance

Velocities are in metres per second and density in kilograms per cubic metre: a density log in g/cc times 1000. The engines work in SI throughout. AI (acoustic impedance) is Vp x density, in kg/(m2 s). The same impedance is written three ways in practice, and a study states which one it uses.

| quantity | Ekene-1 oil-leg mean |
| --- | --- |
| Vp, m/s | 2865.750738 |
| density, kg/m3 | 2316.676923 |
| AI of the means, kg/(m2 s) | 6639018.603084 |
| the same in units of 10^6 kg/(m2 s) | 6.639019 |
| the same as (m/s)(g/cc), that is AI / 1000 | 6639.018603 |

All three are one number. The AI here is computed from the mean Vp and the mean density of the leg, the AI of the means.

## Time

Seismic time is two-way time (TWT) in milliseconds: down to the reflector and back. A checkshot records one-way time (OWT) from the reference. At Ekene-1 the checkshots either side of the top of the Ekene Sand are at 4687.500000 ft (OWT 585.055000 ms) and 5079.002625 ft (OWT 644.438000 ms). Read linearly between them, the top sits at OWT 644.398189 ms, which is TWT 1288.796378 ms. That places the top inside the RMS slice window of 1250 to 1350 ms and the spectrum window of 800 to 1600 ms that module three measures. Read as two-way, the one-way figure would sit above both windows.

## Polarity

The kit's seismic is SEG normal polarity: an increase in acoustic impedance downwards is a peak, a positive number. At Ekene-1 the cap rock, the Ogbia Shale above the sand, has a mean AI of 4697628.723902 kg/(m2 s) on its 130 samples, and the oil leg 6639018.603084 kg/(m2 s) on its 65. The sand is harder than the shale above it, so its top is a peak on the Ekene seismic.

{{panel:qi-feasibility-explorer}}

## Exercise

In the feasibility explorer, set View to The elastic set and Data to "Ekene pack: Ekene-1". Read the AI column for the three layers and write each value in all three units from the table above. Then change "Cap rock thickness above the top, ft (stated)" to a thinner and a thicker value and watch the cap rock row. Check whether the sign of the change in AI from cap rock to oil leg stays the same, and say what that sign means for the polarity of the top on SEG normal data.
