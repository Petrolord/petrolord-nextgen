# Port and field time

{{panel:marine-voyage-calculator}}

A supply vessel spends only part of a voyage sailing. It loads at the base before it leaves and it works alongside each installation it serves, lifting deck cargo off and pumping bulk across. The engine counts these as two more kinds of time, port and field, each stated by the planner. This lesson reads both on the Ekene PSV.

## Three kinds of time

The engine knows three activities, and every hour of a voyage belongs to one of them: "sailing", "port" and "field". Sailing hours come from the legs and the speed. Port hours are the stated port hours, counted once a voyage at the base. Field hours are the sum of the stated field hours of the installations the voyage serves. Each activity also carries its own fuel burn, which is why the engine keeps them apart.

## The Ekene voyages, hour by hour

With the rainy-season factor of 1.2 on sailing and field time:

| voyage | sailing hours | port hours | field hours | total hours |
| --- | --- | --- | --- | --- |
| milk-run | 22.472727 | 12.000000 | 27.600000 | 62.072727 |
| EKA | 13.527273 | 12.000000 | 7.200000 | 32.727273 |
| EKJ | 14.836364 | 12.000000 | 9.600000 | 36.436364 |
| EKB | 16.145455 | 12.000000 | 4.800000 | 32.945455 |
| EKF | 20.727273 | 12.000000 | 6.000000 | 38.727273 |

The milk run's field hours are the four installations' stated hours added up, 6, 8, 4 and 5, which is 23.000000 in calm weather, and the factor lifts them to 27.600000. A dedicated voyage carries only its own installation's field hours: EKA's 6 become 7.200000. Port time stays at 12.000000 hours on every voyage, because the factor is not stated on port time here.

## Field time is often the largest share

On the milk run the vessel spends more hours alongside the installations than sailing between them. That is typical of a compact cluster, and it is why field hours deserve the same care as distances. A planner who underestimates the time alongside a busy drilling unit will find the voyage running long however fast the vessel sails.

## Stated as numbers

Port hours must be a number at or above zero. Typed as text in quotation marks, they are refused:

> portHours must be a finite number at or above 0; got "12"

The quotation marks in the message show that the engine received a string. It never turns text into a number for you, because a figure that looks right and is read wrong is worse than a refusal.

## Exercise

In the voyage and fleet calculator, set View to "The voyage plan" and Start from to "Ekene PSV milk run, rainy season". In the voyage table, check the sailing, port and field hours against the table above. Now change "installation EKJ: field hours (stated)" from 8 to 12. Before reading the panel, predict which of the three hour columns moves, and whether the binding constraint changes. Check, then restore 8. Change "Port hours a voyage (stated)" from 12 to 24 and make the same prediction for the port hours. Finally, in the JSON box, put the port hours in quotation marks and read the refusal.
