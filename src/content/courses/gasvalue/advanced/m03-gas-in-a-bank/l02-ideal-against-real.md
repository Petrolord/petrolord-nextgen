# Ideal against real

`gasMassInVessel` gives a bank's mass as real gas, with Z from a correlation. Beside that mass it prints a second one, idealMassKg, the ideal gas figure, and a column that states the relationship between the two. This lesson reads that pair on IBAFO's banks.

{{panel:gasvalue-rollout-explorer}}

## The two masses

The engine's mass is m = P V M over Z R T, with Z by Dranchuk-Abou-Kassem on Sutton pseudo-criticals. IBAFO's banks hold gas of specific gravity 0.62 at 30 C, each 2 m3:

| bank | pressure bar(a) (input) | z | massKg | idealMassKg | realVersusIdeal |
| --- | --- | --- | --- | --- | --- |
| Low | 230 | 0.8181 | 400.5918 | 327.7131 | 1.2224 |
| Mid | 250 | 0.8369 | 425.6293 | 356.2099 | 1.1949 |
| High | 270 | 0.8584 | 448.1628 | 384.7067 | 1.1649 |

massKg is the real gas figure, with the engine's Z. idealMassKg is the ideal gas figure. realVersusIdeal is the engine's own ratio of the two, and it is the column that states the relationship.

## Z below one, more gas

The engine reads these rows in one sentence: at these pressures Z is below one, so every bank holds more gas than the ideal gas law says (realVersusIdeal above one).

On the Low bank, Z is 0.8181. The real mass is 400.5918 kg and the ideal mass is 327.7131 kg. realVersusIdeal is 1.2224.

On the Mid bank, Z is 0.8369. The real mass is 425.6293 kg and the ideal mass is 356.2099 kg. realVersusIdeal is 1.1949.

On the High bank, Z is 0.8584. The real mass is 448.1628 kg and the ideal mass is 384.7067 kg. realVersusIdeal is 1.1649.

Every realVersusIdeal is above one, and every Z is below one.

## Reading the ratio column down

Read the ratio down the three banks: 1.2224, 1.1949 and 1.1649. Read Z down the same banks: 0.8181, 0.8369 and 0.8584. Z is in the denominator of the engine's rule, and realVersusIdeal is the ratio the engine prints. The course reads both columns as printed and does not compute a ratio of its own.

## The ideal figure is the shortcut

The ideal gas mass is the reading the engine does not use for the bank's mass. It is printed beside the engine's figure, and realVersusIdeal states the relationship. On the Low bank the ideal mass is 327.7131 kg and the engine's mass is 400.5918 kg. On the High bank they are 384.7067 kg and 448.1628 kg.

## The oracle

The validation oracle checks Z independently of the engine: Z by bisection on reduced density, with a second correlation as a plausibility check. The DAK and Sutton coefficients themselves are pinned, and the oracle does not validate them.

In practice, P, V, M, R and T in the engine's rule are read as the pressure, the volume, the molar mass, the gas constant and the temperature, and a station that has measured Z for its own gas at its own pressures reads the engine's Z against that measurement.

## In the explorer

Open IBAFO's banks. Read z, massKg, idealMassKg and realVersusIdeal on each. Set one bank's pressure lower and watch Z and the ratio together, reading each figure the panel prints.

## Exercise

Read the three banks' Z, massKg, idealMassKg and realVersusIdeal. Say what the engine's sentence reads from Z below one, quote realVersusIdeal on each bank, and say which of the two masses is the engine's figure for the bank.
