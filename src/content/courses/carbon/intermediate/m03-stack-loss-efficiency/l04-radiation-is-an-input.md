# Radiation is an input

Two of the four losses in the lab, the dry flue gas loss and the moisture loss, are built from the flue gas of modules one and two. The other two are typed: the unburned loss, 0 at Isiokpo, and the radiation and convection loss. In practice, the radiation and convection loss is heat that leaves a heater through its casing, and nothing in the stack gas measures it. This lesson reads how the engine handles that input.

{{panel:carbon-efficiency-explorer}}

## A figure typed off a chart

The lab gives the Isiokpo heater a radiation and convection loss of 1.8 percent, read off the heater vendor's chart. The chart and the reading are both invented for this course. The loss sits in the table beside the others, printed as 1.8000 in every one of the four rows, current and target, LHV and HHV.

It does not move with the oxygen and it does not move with the basis. The engine takes the figure it is given and carries it into the total loss.

## What a blank gets

The lab prints the engine's answer when the box is left empty:

REFUSED: A radiation and convection loss is required and is not defaulted. It comes off a published chart against surface area and firing rate, which this module does not reproduce.

The refusal says three things. The loss is required. It has no default. And the reason it has no default is that it comes off a chart against surface area and firing rate that the module does not reproduce. The engine does not hold the chart, so it does not hold a figure to fill the box with.

In practice, a radiation and convection loss is read for a particular heater from the manufacturer's or a standard's chart, and the reading belongs to that heater.

## The loss moves the efficiency one for one

The lab prints the current LHV efficiency at three radiation losses:

| radiation and convection loss percent | efficiency percent, LHV, current |
| --- | --- |
| 1.0 | 87.2029 |
| 1.8 | 86.4029 |
| 2.5 | 85.7029 |

The course's own sentence over that table is that the radiation loss moves the efficiency one for one. Nothing else in the heater changes between the rows: the same fuel, the same 5.5 percent oxygen, the same stack.

A reader who quotes the current LHV efficiency of 86.4029 percent quotes an efficiency with the vendor chart's 1.8 percent in it. Quoted without that input, the figure has lost a line of its ledger that no stack measurement produced.

## The other refusals in the same table

The radiation refusal is one of the refusals the engine returns for stackLossEfficiency:

| the call | the engine says |
| --- | --- |
| radiation loss blank | REFUSED: A radiation and convection loss is required and is not defaulted. It comes off a published chart against surface area and firing rate, which this module does not reproduce. |
| HHV with no latent heat | REFUSED: On a higher-heating-value basis the moisture loss needs both the latent heat of water and the vapour specific heat. |
| stack temperature blank | REFUSED: A stack temperature and a combustion air temperature are required. |
| flue gas cp blank | REFUSED: A flue gas specific heat is required. |
| radiation loss -3 | REFUSED: The radiation and convection loss cannot be negative: a loss below zero would add to the efficiency. |
| unburned loss -1 | REFUSED: The unburned and other loss cannot be negative: a loss below zero would add to the efficiency. |

Each one is a box whose figure the engine will not invent. The last two guard the typed losses from the other side: a radiation loss of -3 and an unburned loss of -1 are refused, because a loss below zero would add to the efficiency.

## Exercise

Read the three rows of the radiation table in the lab. Say what the efficiency does as the radiation loss goes from 1.0 to 1.8 to 2.5 percent, using the course's own description of the relationship, and why the engine refuses a blank radiation loss when it could have filled the box itself.
