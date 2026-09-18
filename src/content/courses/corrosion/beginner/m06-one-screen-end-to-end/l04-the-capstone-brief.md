# The capstone brief

{{panel:fc-chemistry-explorer}}

{{panel:fc-rate-explorer}}

{{panel:fc-inhibitor-integrity-explorer}}

The capstone for this tier hands you a stream and asks for six numbers. Every one of them is arithmetic you can carry out and check by hand, and none of them is a corrosion rate the correlation produced.

Three of the six are stream bookkeeping. A carbon dioxide partial pressure in bar, a hydrogen sulphide partial pressure in psia, and the hydrogen sulphide to carbon dioxide mole ratio. Each is a total pressure times a mole fraction, a conversion by the engine's bar to psia factor, or a ratio of two mole fractions. No correlation constant, no fugacity coefficient and no threshold is anywhere in those chains.

One is the flow definition. This module's Reynolds number is density times velocity times diameter over viscosity, which is a definition rather than a correlation. Note the collision while you work: the Pipeline & Line Sizing course computes its own Reynolds number and its own friction factor with a different correlation and a different transition, so the two will not agree on the same pipe. Nothing graded here reads a friction factor or a wall shear.

Two are the corrosion inhibitor arithmetic. The effective protection from an efficiency and an availability, and the metal loss ratio against the datasheet figure. Both are arithmetic over two typed percentages.

## How the brief states its conditions

The capstone states its conditions in the engine's units, in degrees Celsius, bar, metres a second, metres, kilograms a cubic metre and pascal seconds, and it says so on the page. That is deliberate. One of the studio's conversion factors is truncated, so a pressure taken through the app and a pressure taken through the engine's factor differ in the sixth significant figure, and grading a learner on which rounding an app happens to carry would measure the app instead of the corrosion.

## Practising on the shipped case

Every field has a worked twin on the case you have already walked. The carbon dioxide partial pressure there is 1.530013 bar. The hydrogen sulphide partial pressure is 0.739699 psia. The mole ratio is 0.033333333333. This module's Reynolds number is 416686.8569. The effective corrosion inhibition is 85.500000 percent, and the engine's own warning on that screen states the metal loss as 1.45 times the datasheet number. Reproduce all six from the inputs before you open the capstone, and you will be doing exactly what it asks.

## Exercise

Take the shipped inputs and produce those six figures yourself, without reading them off the rail first. Check each against the value above and write down the first place where you had to decide which quantity to use, for example a partial pressure against a fugacity, or mole percent against mole fraction. Then state which of the six would change if the total pressure moved, and which would not.
