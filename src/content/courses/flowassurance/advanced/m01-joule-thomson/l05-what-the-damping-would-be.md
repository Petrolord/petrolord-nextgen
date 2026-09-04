# What the damping would be

The correct weighting is (1 - exp(-ntu))/ntu, and its shape says which lines the undamped term ruins.

{{panel:pd-hydrate-explorer}}

## One factor, two limits

As ntu tends to zero the weighting tends to one, so on a line much shorter than its relaxation length the undamped term is nearly right. As ntu grows it falls toward one over ntu: the cooling was made far up the line and the sea has handed it back.

On TEACHING LINE AKASO SPUR, a construct this course designed for itself and not a published case, ntu is 1.219288832549, exp(-ntu) is 0.295440199685, and the factor ntu/(1 - exp(-ntu)) is 1.730568266886. The full term of 25.2000000000 degF should reach the far end as 14.5616907938 degF.

## Push the line longer

The engine forms ambient plus the decayed inlet excess, then subtracts the whole drop. Lengthen the line and the excess goes to nothing while the drop does not. The rows are a derived sweep on teaching inputs.

| Length, ft | Heat loss, degF | Damped, degF | Engine, degF |
| --- | --- | --- | --- |
| 60000.0 | 89.3160299527 | 74.7543391589 | 64.1160299527 |
| 90000.0 | 69.0877170663 | 57.5218146220 | 43.8877170663 |
| 120000.0 | 58.0927367385 | 48.6608369236 | 32.8927367385 |
| 150000.0 | 52.1164799400 | 44.2415841059 | 26.9164799400 |
| 180000.0 | 48.8681207564 | 42.1565155820 | 23.6681207564 |
| 210000.0 | 47.1024942545 | 41.2801820293 | 21.9024942545 |

## Read the size, not the sign

The engine column crosses the 45.00 degF seabed and keeps going, to 21.9024942545 degF. That looks like the finding. It is not: the damped column crosses too, from 150000.0 ft. A Joule-Thomson term is a real heat sink, and a real sink can hold fluid below what surrounds it, so a sub-seabed arrival is not on its own wrong.

What is wrong is the distance. At 180000.0 ft the correct reading sits 2.8434844180 degF under the seabed and the engine 21.3318792436 degF under it, an excess of 18.4883948256 degF.

## The same file, a different question

At 180000.0 ft `uForArrivalTemp`, asked for the temperature the profile returned, refuses it: "A line cannot arrive above ambient (45 F) no matter how well it is insulated." It carries no Joule-Thomson term, so it refuses a target unreachable by heat loss alone. Each is right about its own question, and neither knows the other was asked.

## The mistake

Reading the sign and stopping. The module handles cold fluid without a special case: an inlet 20.0 degF below the 40.0 degF ambient arrives at 39.5203295082 degF with `ok` true.

## Exercise

Divide the full term of 25.2000000000 degF by the factor 1.730568266886 and say what should have reached the far end. The weighting applied is that factor's reciprocal, so multiplying is the trap.

Then say why a sub-seabed arrival is not on its own a defect, and what makes this one.
