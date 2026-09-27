# The capstone brief

{{panel:marine-voyage-calculator}}

The Associate capstone asks you to plan voyages from end to end, by the rules of this tier, in the voyage and fleet calculator. Its cluster is synthetic and is its own: its vessel, installations, cargo, route and terms appear in no lesson and in none of the Ekene files. This lesson tells you what the capstone gives you, what it states, what it grades and how to work it.

## What you are given

One case file comes with the capstone and is offered on the capstone card. It holds two calls under two block keys, voyagePlan:milk-run and voyagePlan:dedicated: the same vessel and installations, once on a milk run and once on dedicated voyages. Paste the whole file into the JSON box of "The voyage plan" view, then choose the block each value needs in the "Block of the case file" selector. Every control writes into the block you have chosen.

## What the capstone states

Every input a figure depends on is stated in the case file and the capstone text: the vessel with its speed, deck area, usable fraction, deck load, deadweight, every tank and every fuel burn; the products with their kinds and densities; the installations with their field hours and cargo; the milk run's stops and legs, and each installation's distance for the dedicated voyages; the port hours; the weather factor and the activities it slows; and the fuel price. Nothing is left for you to assume.

## What is graded

Six quantities, each a value the engine returns on the case file:

| graded quantity | block | where you met it |
| --- | --- | --- |
| the milk run's total hours | voyagePlan:milk-run | modules two and three |
| the milk run's fuel, in tonnes | voyagePlan:milk-run | module three |
| the milk run's fuel cost | voyagePlan:milk-run | module three |
| the milk run's deadweight load, in tonnes | voyagePlan:milk-run | module four |
| the utilisation of the milk run's binding constraint | voyagePlan:milk-run | module five |
| the total days of the dedicated voyages | voyagePlan:dedicated | module two |

Enter each to six decimals, as the panel prints it. The grading tolerance is set by the course in one place; you never need to guess it. No graded value depends on any reading the engine states, such as the tie rule, and none is a Monte Carlo figure.

## How to work it

Paste the file and choose the milk run block first. Check the feasible flag and the reasons before you copy anything. Read the hours, the fuel and its cost from the tiles, the deadweight from the constraints table, and the binding utilisation from the voyage table. Then choose the dedicated block and read the Total days tile, which adds the dedicated voyages for you.

## The traps this tier has shown you

The weather factor applies only to the activities the case names, so check which hours it moved. Port time is paid once a voyage. The deadweight adds every bulk product at its own density. The binding constraint is the highest utilisation, which may be a tank. A reason prints short figures and percentages; the graded field is the number in the table.

## Exercise

Rehearse on the Ekene cluster before opening the case file. In the voyage and fleet calculator, set View to "The voyage plan" and Start from to "Ekene PSV milk run, rainy season", and write down the six analogous figures: total hours, total fuel, fuel cost, the deadweight load, the binding utilisation, and then, from "Ekene PSV, dedicated voyages", the total days. Check each against the lessons of modules two to five.
