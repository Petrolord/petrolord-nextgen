# Real gas at storage pressure

The CNG half of this tier moves to Ibafo, on the Lagos-Ibadan expressway, where the course places an invented CNG mother station. The station stores compressed gas in banks of cylinders and fills buses from them. The first question about a bank is how much gas it holds. `gasMassInVessel` answers it as real gas, at absolute pressure.

{{panel:gasvalue-rollout-explorer}}

## Every pressure is absolute

Every pressure in lpgCng is absolute. The engine says so on every CNG result: pressureBasis "absolute (bar(a))". The bank pressures below are typed in bar(a), and the engine reads them that way. A later lesson in this module reads what happens when a gauge reading is typed in their place.

## The mass in a bank

The engine's rule for the mass: m = P V M over Z R T, with Z by Dranchuk-Abou-Kassem on Sutton pseudo-criticals.

The course prints what each letter is: P the pressure in Pa (bar(a) times 100000), V the volume in m3, M the gas's molar mass (its specific gravity times the molar mass of air, in kg/kmol), T the temperature in K, R the gas constant, and the ideal mass is the same with Z taken as one. The Z factor comes from the gas Z factor in production/gasProperties, which lpgCng calls.

## IBAFO's three banks

IBAFO's banks hold gas of specific gravity 0.62 at 30 C. Each is 2 m3:

| bank | volume m3 (input) | pressure bar(a) (input) | z | ppr | tpr | correlationInRange | massKg |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Low | 2 | 230 | 0.8181 | 4.9479 | 1.5266 | true | 400.5918 |
| Mid | 2 | 250 | 0.8369 | 5.3782 | 1.5266 | true | 425.6293 |
| High | 2 | 270 | 0.8584 | 5.8084 | 1.5266 | true | 448.1628 |

Read one row across. The Mid bank is 2 m3 at 250 bar(a). Its reduced pressure, ppr, is 5.3782 and its reduced temperature, tpr, is 1.5266. Z is 0.8369. The correlation is in range, and the bank holds 425.6293 kg.

## Reading down the rows

Read down. tpr prints 1.5266 on all three banks. All three hold one gas, 0.62, at one temperature, 30 C. ppr prints 4.9479, 5.3782 and 5.8084 at 230, 250 and 270 bar(a). Z prints 0.8181, 0.8369 and 0.8584. The mass prints 400.5918, 425.6293 and 448.1628 kg.

Every row reads correlationInRange true. The next lesson reads the ideal gas column beside these masses, and the last lesson of this module reads a bank the correlation was not fitted for.

## What a bank refuses

| probe | engine |
| --- | --- |
| no pressure | REFUSED: A pressure is required. |
| gas gravity left blank ('') | REFUSED: A gas specific gravity is required. |
| no temperature | REFUSED: A temperature is required. |

Each of the three inputs the rule needs from the station is required. A pressure, a gas specific gravity and a temperature are each refused when missing, and the gravity is refused when its box is left blank.

## The banks carry forward

The cascade module runs on these same three banks: Low 2 m3 at 230 bar(a), Mid 2 m3 at 250 bar(a), High 2 m3 at 270 bar(a). The cascade lessons read what the banks deliver to a bus and what stays behind, and the cascade result prints the same pressureBasis, absolute (bar(a)).

In practice, a station's bank pressures come from its own instruments, and the station records which reading it took.

## In the explorer

Open IBAFO's banks. Read z, ppr, tpr, correlationInRange and massKg on each bank, and the pressureBasis beside them. Clear the gas gravity and read the refusal. Then restore 0.62 and read the three masses again.

## Exercise

Read IBAFO's three banks: pressures 230, 250 and 270 bar(a), Z 0.8181, 0.8369 and 0.8584, tpr 1.5266 on each, and masses 400.5918, 425.6293 and 448.1628 kg. Say what pressureBasis the engine prints, which correlation gives Z and on which pseudo-criticals, which column prints the same figure on every bank, and what the engine answers when the gas gravity is left blank.
