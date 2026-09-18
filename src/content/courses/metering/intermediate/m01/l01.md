# Why a valve equation stops working when the service gets hard

A control valve is the one item of process equipment where the ordinary sizing equation stops working exactly when the service gets difficult. The equation itself is arithmetic: a flow, a density, a pressure drop and a coefficient, with the coefficient falling out in one line. What the equation cannot see on its own is that a valve reaches a condition past which the pressure drop written into it and the pressure drop the valve can actually use are two different numbers.

## The march that shows it

This course marches one valve, the BELEMA valve, down its outlet pressure, and the boundary is crossed inside the table. At an outlet pressure of 200.000000 psia the engine reports a stated drop of 46.900000 psi, a drop used of 46.900000 psi, a coefficient of 37.431838 and the regime word `stable`. At an outlet pressure of 40.000000 psia the same valve reports a stated drop of 206.900000 psi, a drop used of 179.220032 psi, a coefficient of 19.148480 and the regime word `choked, cavitating`.

Two columns that carry the same figure on the first row carry different figures on the last one, and that is the whole subject of this tier. The engine counts the rows on which it reports choked flow: 4 of them. The tree is the 9 outlet pressures asked of the liquid valve, and the rule is that a row counts when the engine returns choked true.

## Where the boundary sits

The crossing was found by bisecting the engine's own choked flag rather than by reading it off a chart. The valve begins to choke at an outlet pressure of 67.679968 psia. The allowable drop there is 179.220032 psi and the coefficient there is 19.148480. None of that appears in the sizing equation as it is usually written, which is why a designer who never asks for it never sees it.

## What the engine says when it happens

Past the boundary the engine caps the drop it sizes on, and it says so in words the learner will see on the screen:

> `choked flow: the stated pressure drop is beyond what the valve can use, so sizing on it would undersize the valve badly. The allowable drop has been used instead, and this service wants a multistage or anti-cavitation trim`

Read that as a design instruction rather than as an error. The engine has still returned a coefficient, so a reader skimming for a number gets one. The sentence beside it is what changes the order that gets placed.

## Exercise

Read the row of the march at an outlet pressure of 110.000000 psia and write down the stated drop, the drop used and the regime word. Then read the row at an outlet pressure of 60.000000 psia and do the same. Say which of the two sits on the choked side of the boundary at 67.679968 psia.
