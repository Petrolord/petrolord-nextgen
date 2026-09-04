# IPO and PPO

Which fluid the dome is balanced against decides where the setting lands, and on the published production operated case it also produces a number that cannot be a valve property.

{{panel:pd-valve-explorer}}

## The same balance, the roles swapped

An injection pressure operated valve gives the casing the large area and the tubing the port, so its dome ends up near the casing pressure at depth. A production pressure operated valve gives the tubing the large area, so its dome ends up near the tubing pressure at depth. The settings that come out are not slightly different, they are on different scales.

| | westTexasOil valve 1, IPO | constantPressurePPO valve 1, PPO |
| --- | --- | --- |
| Injection at depth, psia | 1068.362497529 | 1177.150217878 |
| Production at depth, psia | 326.624999472 | 357.547660568 |
| Dome at temperature, psia | 1021.076842603 | 409.797201414 |
| Dome at 60 degF, psia | 895.736722296 | 367.697480115 |
| Rack opening, psia | 956.727988968 | 392.734228645 |

Both valves sit in a 0.77 in2 bellows with a 0.25 in port and an R of 0.063749851. The casing at the PPO valve is higher than at the IPO valve and its rack setting is less than half as large, because the dome is answering to the tubing. Down that PPO string the domes at temperature climb 409.797201414, 549.605506795, 670.260984966, 774.397901322, 864.285550601 and 875.996561503 psia, tracking a tubing pressure that rises with depth.

## A spread that cannot be a spread

A spread is how far a pressure has to fall from opening before the valve shuts, so it cannot be negative. On the published PPO string every one of them is: -52.249540846, -45.958644888, -40.534581117, -35.856877306, -31.822047314 and -31.296561503 psi, valve 1 through valve 6.

The engine hands its spread helper the production pressure as the opening side and the casing as the other side. On this well the casing runs far above the tubing at every valve, so the difference comes out negative at every valve. That is not a property of production operated valves. It is the two sides swapped, and it is the same choice of acting fluid that makes the closing test judge this string against the casing.

## The mistake

Reading a negative spread as a curiosity of the PPO family and moving on. It is the loudest available signal that the sides are the wrong way round, it is visible on every valve of the case without running a single stage, and it went unremarked. What did get reported was the closing verdict, which is subtler and needs the whole unloading sequence to see. The simplest symptom is not always the one somebody notices.

## What it refuses

This is a pinned known divergence, not a fixed defect and not a thing to design on. The engine is consumed by a live application, so the sign stands. Nothing clamps it, nothing warns on it, and the PPO rows of the valve table will keep reporting spreads below zero.

## Exercise

Record the dome at temperature, the rack opening and the spread for all six valves of constantPressurePPO.

Then say which fluid each of those three numbers is answering to, and which one is answering to the wrong one.
