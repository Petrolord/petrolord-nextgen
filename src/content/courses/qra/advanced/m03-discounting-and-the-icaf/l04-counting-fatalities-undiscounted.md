# Counting fatalities undiscounted

{{panel:qr-alarp}}

The ICAF divides a discounted cost by an undiscounted count of fatalities prevented. That mix is a declared choice of the engine, and it is the one most easily got wrong by hand. This lesson shows the number the engine returns, the number the other reading gives, and why the engine counts lives the way it does.

## The two divisions

The firewall at the 2003 checklist limits has a present value of the cost of 321062.02. Two denominators are possible.

| denominator | its value | ICAF |
| --- | --- | --- |
| fatalities prevented, undiscounted, the engine | 0.040000 | 8026550.41 |
| fatalities prevented, discounted, derived | 0.034337 | 9350246.71 |

The engine divides by 0.040000, which is the deltaPLL of 2e-3 times 20 years, and returns 8026550.41. Dividing instead by the DISCOUNTED fatalities, the present value of the benefit over the VPF, 0.034337, gives 9350246.71, a different number the engine never returns.

## Why the engine counts lives undiscounted

The fatalities a measure prevents are people. The engine's definition, following R2P2's cost per fatality prevented, counts them as deltaPLL times the life in years, so a person saved in the twentieth year counts the same as one saved in the first. Only the cost is discounted. That is the engine's declared choice, and the basis model string shows it: the denominator is dPLL x years, with no rate anywhere in it. The fatalities prevented stay at 0.040000 whatever the rate, and the ICAF moves with the cost alone: 8750000.00 undiscounted, 8026550.41 at the checklist limits and 7683740.15 under R2P2.

## Why the other number looks familiar

The discounted division gives 9350246.71. Set it beside the VPF of 1000000 and it is the cost to benefit ratio at the checklist limits, 9.350247, written in money. That is no coincidence: dividing the cost by the discounted fatalities is the same as dividing it by the benefit and multiplying by the VPF. So the figure only restates the ratio in other units. It adds nothing the ratio does not already say, and it hides a choice to discount lives. An ALARP note that reports 9350246.71 as this measure's ICAF has divided by the wrong count.

## Two figures, moving opposite ways

The undiscounted count is also why the ICAF and the ratio move in opposite directions under discounting. For the firewall, going from undiscounted to the checklist limits, the ratio rises from 8.750000 to 9.350247 while the ICAF falls from 8750000.00 to 8026550.41. The ratio discounts both sides; the ICAF discounts only the cost. Neither is wrong. They answer different questions, and a note that quotes both names the convention beside each, so a reader never compares one convention's ratio with another's ICAF.

## Exercise

Take the checklist row. Write the engine's ICAF, 8026550.41, and the derived figure, 9350246.71, side by side with the denominator each used. Say which denominator the engine uses and why. Then set 9350246.71 beside the VPF of 1000000 and the ratio of 9.350247, and write one sentence for a reviewer explaining why that figure is the ratio in money and is never reported as the ICAF.
