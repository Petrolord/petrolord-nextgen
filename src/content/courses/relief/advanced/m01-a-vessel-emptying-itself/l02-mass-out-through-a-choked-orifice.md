# Mass out through a choked orifice

The march has two halves and they run on different physics. Outside the vessel, mass leaves through a hole at a rate the hole and the upstream state decide. Inside, whatever is left expands. This lesson is the outside half.

{{panel:fc-blowdown-explorer}}

## Why the outlet does not appear in the rate

While the flow through the orifice is choked, the rate depends on the pressure and temperature upstream and on the throat, and the pressure downstream cannot reach back through the throat to change it. That is the same result the Associate tier met on the valve, where the required area in critical flow did not move with the back pressure at the relief valve outlet at all. The evidence there is a printed column rather than a quoted count: read that sweep from the top and the area is the same figure on every row until the branch turns. Here the same result earns the march its simplicity, with one state variable, one rate and one step.

It also earns the march an assumption, which the engine states rather than hides.

## The floor the assumption has

Every blowdown call returns the pressure below which the choked assumption stops holding. On AFIESERE that floor is 26.758009 psia. The course recovers the engine's default outlet pressure from it: the floor times the engine's own critical pressure ratio is 14.700000000000, which is how a constant this route never exports was measured.

AFIESERE ends at 145.000000 psia, well above the floor, and its warning field reads `null`. Take the same vessel down to 25.000000 psia instead and the call still succeeds, still marches, still returns a time, and attaches this warning: `the march assumes choked flow throughout, and it stops being choked below 26.8 psia against a 14.7 psia back pressure: the time below that is optimistic`. Those are the engine's own words.

Read the last word of it. The error is signed. A march that keeps assuming choked flow after the flow has stopped being choked overstates the rate and so understates the time, which is the direction that makes a vessel look safer than it is.

## The gas constant nobody typed

The march reports the mass it started with. On AFIESERE that is 3469.2925 lb, and 648.7449 lb remain at the end, a fraction of 0.813004 of the inventory removed.

That start mass is a measurement instrument. Rearrange it against the stated volume, pressure, temperature, molecular weight and compressibility and only one number is left over: 1545.349000000000 ft.lbf per lbmol degR, the universal gas constant this march stands on. Nothing in the module exports it. Asking the engine a question whose answer is a constant and nothing else is how you find out what is inside a routine that will not tell you.

Do that habitually. A number you recovered is a number you can check. A number you assumed will be wrong quietly.

## Exercise

State in one sentence why the downstream pressure does not enter the rate while the flow is choked. Record the AFIESERE choked floor, the default outlet pressure the course recovers from it, the start mass, the mass remaining and the fraction removed. Then quote the warning the engine attaches at an end pressure of 25.000000 psia and say which way the resulting time is wrong.
