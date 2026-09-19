# Missing stays missing

{{panel:carbon-inventory-explorer}}

## A blank box reaches the engine as missing

Every input box in the two apps can be left blank. A blank box reaches the engine as an empty string or null, and the engine treats it as missing. An argument left out of the call altogether takes the default the engine states for it. Those are two different things, and the carbon engine answers them differently.

Here is what carbonAbatement does with a blank, one call to the engine a row:

| function | the call | the engine says |
| --- | --- | --- |
| combustionCo2FromCarbon | flare, destruction efficiency blank | REFUSED: A destruction efficiency is required. It is not read as 100 percent: for a flare it is the answer, and it is contested. |
| combustionCo2FromCarbon | flare, destruction efficiency null | REFUSED: A destruction efficiency is required. It is not read as 100 percent: for a flare it is the answer, and it is contested. |
| combustionCo2FromCarbon | flare, fuel blank | REFUSED: A fuel quantity and the carbon per kilomole of fuel are required. |
| emissionLine | a line with no registered factor | REFUSED: A registered emission factor is required. |
| carbonIntensity | no boundary named | REFUSED: A boundary must be named. Tonnes per tonne charged and tonnes per tonne of saleable product are different numbers for the same plant, and an intensity without its boundary cannot be compared with anything. |
| carbonIntensity | a blank denominator | REFUSED: A positive denominator is required. |

## Why a blank is refused

Read the first two rows. A blank destruction efficiency and a null one get the same answer, and the answer gives its reason: "It is not read as 100 percent: for a flare it is the answer, and it is contested." The engine does not fill the box with 100 percent. Read at 100 percent, the Igbogene flare has no methane line at all.

The same rule runs through the other rows. A line with no registered factor is refused. An intensity with no boundary named is refused, and the refusal says why: tonnes per tonne charged and tonnes per tonne of saleable product are different numbers for the same plant. A blank denominator is refused. In every row the engine answers a missing value by saying what is missing.

## A default is stated, and it is for a burner

One argument does have a default. Left out of the call, the destruction efficiency takes its stated default of complete combustion:

| the call | destructionEfficiencyFraction | co2Tonnes | ch4Tonnes |
| --- | --- | --- | --- |
| combustionCo2FromCarbon({ fuelKmolPerYear: 1000, carbonPerKmolFuel: 1 }) | 1 | 44.009 | 0.000 |

The digest says who that default is for: "A burner is the case that default is for. A flare is asked for its efficiency every time." A burner call may leave the argument out and get complete combustion. A flare is asked for its efficiency every time, and a blank box reaches the engine as missing, so the flare is refused until a figure is typed.

The difference between the two is where the value came from. A default is written into the engine and stated. A blank box is a box nobody filled, and the engine does not guess what they meant.

## What the refusals protect

In practice, an inventory is read by people who never see the input boxes, so a figure that silently assumed the best case would look exactly like one that was measured.

Try it in the panel. Clear the flare's destruction efficiency and watch the flare line disappear from the inventory with the refusal in its place.

## Exercise

Read the two destruction efficiency rows and the default row. Say what the relationship between a blank box and an argument left out of the call shows about when the engine will assume complete combustion.

Self check: a blank and a null destruction efficiency are both refused with the same reason, that the value is not read as 100 percent because for a flare it is the answer and it is contested. Left out of the call, the argument takes its stated default of complete combustion, and 1000 kmol at one carbon a kilomole returns 44.009 t of CO2 and 0.000 t of methane. The engine assumes complete combustion only when the argument is left out, which is the burner case.
