# A coefficient that survives low pressure

A natural way to read the identity is to say that the coefficient is a real-gas effect, so it must fade away as the gas becomes ideal. The module says otherwise, and the table it prints is the cleanest argument in this section.

{{panel:fc-coldend-explorer}}

## The derivative across pressure

Holding the AGBADA gravity and inlet temperature fixed and moving only the pressure:

| psia | z | dz/dT, per degR | mu, degF/psi | mu, degF/100 psi |
| --- | --- | --- | --- | --- |
| 50.000000 | 0.992446573 | 0.000043882457 | 0.054913819 | 5.491382 |
| 200.000000 | 0.969846485 | 0.000179949122 | 0.056296379 | 5.629638 |
| 600.000000 | 0.910768035 | 0.000572602141 | 0.059712113 | 5.971211 |
| 1000.000000 | 0.855999257 | 0.000986027713 | 0.061694982 | 6.169498 |
| 1500.000000 | 0.801154097 | 0.001420038256 | 0.059233788 | 5.923379 |
| 2200.000000 | 0.766549366 | 0.001585158042 | 0.045082772 | 4.508277 |

## Read the lowest row against the highest

At 50.000000 psia the compressibility is 0.992446573, which is close to one, and the temperature derivative has fallen to 0.000043882457 per degR. Yet the coefficient there is 0.054913819 degF per psi. At 2200.000000 psia, where the compressibility is 0.766549366, it is 0.045082772.

The coefficient does not vanish as the pressure falls. The identity divides the derivative by the pressure, and that quotient tends to a finite limit even as the compressibility tends to one. A gas at near-atmospheric pressure still cools when it expands, and a method that treated the departure from ideality as the whole story would say it does not.

This is why a low-pressure let-down is worth marching rather than dismissing. The slope is still there, and a screening rule that switched the unit off below some pressure would be throwing away real cooling.

## The hard edge the correlation brings with it

The coefficient inherits every limit of the compressibility it is built on, and one of those limits is not a smooth fade. Sutton's pseudo-critical pressure correlation turns negative above a gas gravity of about 5.080000, and the module refuses rather than returning a number.

At the AGBADA gravity of 0.680000 the engine answers 0.061607962 degF per psi. At a gravity of 5.070000 it refuses with "Tpr 14.247 against 3.0 is above the DAK validity range of 1.0 to 3.0, at 1180 psia and 96 degF, so the z-factor is refused". At 5.080000 the refusal changes kind: "the Sutton pseudo-criticals are not physical at a gas gravity of 5.08: Tpc 35.0 degR, Ppc -1.6 psia. Sutton's pressure correlation turns negative above a gravity of about 5.08, and a gas that heavy is not a natural gas".

Two neighbouring gravities, two different faults, two different messages. The first says the correlation was asked for a state outside its band. The second says the correlation produced pseudo-criticals no gas can have, and names both of them so a reader can see the pressure has gone negative.

Neither refusal is a rounding of the other into a single generic fault string. That distinction costs the engine nothing and saves a caller the work of guessing which of the two happened.

## Exercise

Record the compressibility, the temperature derivative and the coefficient at 50.000000 psia and at 2200.000000 psia. Say which of those two states is nearer to ideal and what the coefficient does between them. Then record the two gravities at which the engine refuses and write down the difference between the two refusals in your own words.
