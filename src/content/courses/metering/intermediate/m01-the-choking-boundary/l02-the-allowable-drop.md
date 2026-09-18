# The allowable drop, and where it comes from

{{panel:fc-choking-explorer}}

Every row of the BELEMA march carries three pressure drops, and a reader who treats them as one number will size the valve wrong on every row where the engine reports choked flow. The stated drop is what the process hands the engine. The allowable drop is what the valve can convert into flow. The drop used is the one the sizing equation is actually given.

## Three columns, one of which is constant

On this valve the allowable drop reads 179.220032 psi on every row of the march, from an outlet pressure of 200.000000 psia down to an outlet pressure of 20.000000 psia. That is the first thing to notice about it. The stated drop changes on every row, because the process is being asked for a different outlet pressure each time. The allowable drop holds still, because it is built from the valve, the fluid and the inlet pressure, and the march moves none of them.

It is built from the inlet pressure, the vapour pressure, a pressure recovery factor, which is a property of the trim, and a liquid critical pressure ratio factor, which for the BELEMA fluid the engine returns as 0.892161.

## What the columns do at the boundary

Above the crossing at 67.679968 psia the drop used follows the stated drop exactly. At an outlet pressure of 140.000000 psia the stated drop is 106.900000 psi and the drop used is 106.900000 psi. At an outlet pressure of 80.000000 psia the stated drop is 166.900000 psi and the drop used is 166.900000 psi. Below the crossing the drop used stops following. At an outlet pressure of 60.000000 psia the stated drop is 186.900000 psi and the drop used is 179.220032 psi, which is the allowable drop.

Once the drop used has stopped moving, so has everything downstream of it. The coefficient reads 19.148480 on every choked row, and the cavitation index reads 1.217275 on every choked row. An engineer who lowers the outlet pressure further and expects the answer to move is watching a number the valve has pinned.

## Why this is worth a lesson of its own

The allowable drop is the only one of the three that is a design judgement. It rests on a recovery factor taken from a table this engine states is its own, and the module that carries that table says a certified vendor figure for the specific trim always replaces it. That makes the allowable drop the figure to challenge first on any choked service, because everything past the boundary is computed from it and nothing past the boundary is computed from the stated drop at all.

## Exercise

Move the panel's outlet pressure from 200.000000 psia down to 60.000000 psia and watch the three drop columns. Write down the outlet pressure of the last row on which the stated drop and the drop used carry the same figure, and the outlet pressure of the first row on which they carry different figures. Then say which of the three columns you would ask a vendor to confirm before ordering the valve.
