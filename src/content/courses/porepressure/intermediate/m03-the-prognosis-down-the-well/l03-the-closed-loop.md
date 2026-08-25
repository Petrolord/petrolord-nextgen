# The closed loop

This well was built by running Eaton backwards, and this tier runs it forwards. This lesson closes the loop deliberately and reads what the closure does and does not prove. It is the most important epistemic lesson in the course, because prognoses on real wells never come with this receipt, and knowing what a validated method looks like is how you keep your standards when validation is impossible.

{{panel:pp-eaton-explorer}}

## How the well was made

The construction order matters. First the pressure profile was decided: hydrostatic everywhere, plus a ramp of exactly 4 kPa per metre below 2500 m. Then the density column fixed the overburden, and the target effective stress at each sample followed by subtraction. Finally Eaton's relation was solved in reverse for the transit time that, against the header trend at $n = 3$, would yield exactly that pressure, and THOSE transit times became the sonic log. The pressures are not consistent with the log; the log was manufactured from the pressures.

So the forward run is a test with a known answer. If the pipeline is implemented correctly, the recovered overpressure must equal the imposed ramp at every sample, limited only by floating-point arithmetic.

## The receipt

It does. The worst disagreement across all 401 samples, on capstone settings, is 2.2351741790771484 times $10^{-8}$ pascals. Two hundredths of a millionth of a millipascal-scale error on pressures of tens of megapascals: fifteen significant figures of agreement, which is double precision saying exactly.

Above the ramp top the recovered overpressure is similarly zero to within $10^{-8}$ Pa. The loop tile on the panel reports this number live, and it is worth looking at once with the settings correct just to see what a truly closed loop reads like.

## What the closure proves

Three things, all real. The engine implements the pipeline it claims: trend, ratio, cube, budget, subtraction, with no hidden smoothing or unit slip. The pipeline is self-consistent: inverse then forward is the identity, so no information is lost rounding through transit time. And your own hand chain, when it matches the engine to ten decimals as it did last module, is the same mathematics.

This is not a small thing. Most numerical wrongness in practice is implementation wrongness, a unit, a sign, a rounded constant, an off-by-one sample, and the closed loop rules every one of those out at once.

## What the closure does not prove

It proves nothing about the earth. The loop closes because the well satisfies Eaton's relation exactly, and the well satisfies it exactly because the well was built from it. The closure cannot certify that real shale converts effective stress to transit time by a power law with exponent 3, that a single trend describes a real basin, or that real overpressure is undercompaction. Those are exactly the questions modules 2 and 4 flagged, and no synthetic well can answer them.

Said another way: the loop validates the arithmetic, and the arithmetic was never the risky part. Keep the two kinds of confidence separate. When your prognosis on a live well matches a competitor's, that is arithmetic agreement, both of you ran similar pipelines. It is not two independent confirmations of the pressure. Independent confirmation comes from measured pressures, drilling events, and methods with different physics, which is what the Bowers cross-check at the Expert tier is for.

## The loop as a working tool

The loop is not only philosophy; it is a debugging instrument you can use today. If you implement Eaton yourself, in a spreadsheet or a script, run it on this golden well first. Anything worse than $10^{-6}$ Pa of ramp disagreement is a bug, and the depth where the disagreement starts usually names it: wrong from the mudline is a units or gravity slip, wrong only below 2500 m is the ratio or exponent, drifting with depth is the trend, a constant offset is the hydrostatic.

That is what golden data is for, and it is why this course keeps insisting every number be derived: the well will catch you, which is a luxury; the field will not.

## Worked example

Predict what the loop tile reads at $n = 4$ on the well trend, before touching the control. At TD the $n = 4$ overpressure is 7.834533176889628 MPa against the encoded 6, so the disagreement at TD alone is 1.834533176889628 MPa, and the tile, which reports the worst disagreement anywhere, must read at least that. Check: the panel switches the tile to MPa units and reports 1.835 MPa. The worst error sits at TD because the amplification error compounds with the size of the anomaly, largest at the deepest sample.

## Exercise

A vendor demonstrates pressure software by showing it reproduces this golden well to machine precision, and offers that as evidence the software will predict pressure correctly in your basin. Write the two-sentence response.

Self check: reproducing the golden well proves the software implements the Eaton pipeline correctly, which is necessary and worth verifying. It says nothing about whether that pipeline, with any exponent or trend, describes our basin: for that we need calibration against measured pressures here, because the golden well was built from the equation and our rocks were not.
