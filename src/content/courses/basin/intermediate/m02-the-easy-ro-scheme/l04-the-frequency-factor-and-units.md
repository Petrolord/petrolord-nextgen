# The frequency factor and units

Two of the numbers in the Arrhenius formula never change in this tier, and precisely because they never change they are where implementation errors hide. This lesson is about the frequency factor and the unit conversions, and about the historical bug in this engine's own ancestry that makes the point better than any invented example could.

## The frequency factor

$A = 10^{13}$ per second, for every vitrinite bin, fixed by the publication. Its scale is worth a moment of respect: it is the attempt frequency of the reaction, the rate the bin would empty at if the exponential factor were 1, and $10^{13}$ per second is the order of molecular vibration frequencies. Everything slow about geology comes from the exponential factor fighting it. At 100 degC the 46 kcal bin's exponential factor is about $10^{-27}$, and $10^{13} \times 10^{-27} = 10^{-14}$ per second, which is the geological rate you computed in the last lesson.

The kerogen clock of module 4 uses the same $10^{13}$ as its default but allows a per-type override, carried in the library beside the potentials. The vitrinite A has no override. Same asymmetry as the weights, same reason.

## The units that must line up

The formula $k = A e^{-E/RT}$ only means something when the exponent is dimensionless. The engine stores activation energies in kcal/mol because the publication does, R in J/(mol K) because SI does, and so it must convert: E times 4184 J/kcal, divided by 8.314 times T in kelvin. Temperature arrives in this engine as degrees Celsius everywhere humans touch it and is converted with the full 273.15.

Time must be seconds, because A is per second. The spec pins one Ma at $3.1536 \times 10^{13}$ s, a 365-day year. If you check that constant: $10^6 \times 365 \times 86400 = 3.1536 \times 10^{13}$ exactly. The oracle uses the same value, which matters, because a Julian-year convention differs in the third decimal and the two implementations would drift visibly at 1e-9 agreement.

## The bug worth remembering

An earlier version of this engine computed the exponent as $E / (1.987 \, T)$ with E in kcal, using the calorie value of R. Written that way the formula is legitimate, and 1.987 cal/(mol K) is a correct constant. The defect was that E was passed in kcal while R was in cal: a factor of 1000 sitting silently in the exponent's numerator.

Work out what that does. The exponent at 100 degC for the 46 kcal bin should be about $-62$; divided by an R a thousand times too generous relative to E, it becomes about $-0.062$, and $e^{-0.062}$ is essentially 1. Every bin's rate collapses to A itself, $10^{13}$ per second. Every reaction in every rock completes in the first time step at any temperature above absolute zero. The audit that caught it described the symptom exactly that way: every bin reacted instantly.

The lesson is not that someone once typed the wrong constant. It is that unit errors in an exponent do not degrade an answer, they destroy it, and yet the code that produces the destruction looks one character away from correct. The defence, which this engine now carries, is an anchor test: assert that the scheme reproduces its published endpoints, 0.20189651799465538 and 4.687971627022019, and any factor-of-1000 in the exponent fails the assertion instantly.

## Worked example

Verify the exponent for the 46 kcal bin at 150 degC and confirm the rate from module 1. The exponent is $-46 \times 4184 / (8.314 \times 423.15) = -192464 / 3518.07 = -54.7075$. Then $k = 10^{13} \times e^{-54.7075} = 10^{13} \times 1.7415 \times 10^{-24} = 1.7415 \times 10^{-11}$ per second, matching 1.7415225556963263e-11. If you had used 1.987 with E in kcal: exponent $-46/(1.987 \times 423.15) = -0.0547$, rate $9.5 \times 10^{12}$ per second, twenty-three orders of magnitude wrong.

## Exercise

State the four unit conventions of the scheme in one line each: A, E, T, time. Then answer: why does an anchor test on the two closed-form endpoints catch a units error in the exponent, in one sentence?

As a self check: A is $10^{13}$ per second for vitrinite with no override; E is stored in kcal/mol and converted with 4184 J/kcal; T enters the exponent in kelvin, converted with 273.15; time steps enter in seconds at $3.1536 \times 10^{13}$ s per Ma. An exponent units error changes every rate by many orders of magnitude, so the integrated F, and therefore the endpoint reflectances, land nowhere near 0.2019 and 4.688, and the anchor assertion fails on the first run.
