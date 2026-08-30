# The displaced volume

What actually has to move, and how much of it.

{{panel:hy-surge-explorer}}

## The question

A string moves down at speed v. How much mud has to flow up past it?

## The closed case

If the string is closed at the bottom, by a float valve, a plugged bit or a casing shoe with a float, then the whole cross section of the string is displacing mud.

    displaced volume rate = v x (pi/4) x d_outside^2

Everything the steel and its bore sweeps out has to come up the annulus.

## The open case

If the string is open, mud can flow up the INSIDE as the string goes down. Only the steel itself displaces mud into the annulus.

    displaced volume rate = v x (pi/4) x (d_outside^2 - d_inside^2)

For drill pipe at 0.127 m outside and 0.1086104 m inside, the steel is 0.2686329600000001 of the outside area.

So an open string displaces about a quarter of what a closed one does.

## What happens to it

The displaced mud flows up the annulus, on top of whatever is already there. Its velocity is the displaced rate divided by the annular area, and that velocity produces a friction loss exactly as a pumped flow would.

The engine computes it with the same element loss routine the circulating calculation uses. There is no separate surge physics: it is annular pressure loss with a different velocity in it.

## Why the open case is not four times smaller

Because the mud flowing up the inside of the string has its own pressure loss, and because the clinging term, which is the next lesson, does not scale with the displaced volume at all.

The ratio on this well at 0.5 m/s is 1.172219719213269, not 4.

## Why it matters so much in practice

Because running casing is the worst surge case on a well, and casing is almost always run with a float.

A closed 9 and 5/8 inch casing string displaces its whole outside area into a tight annulus, at whatever speed the crew lowers it. Surge pressures during casing runs are the commonest cause of losses at the shoe.

## The remedy

Fill the string as it goes in, or use a differential fill float that opens under a pressure difference, or simply run slower.

All three appear in a casing running procedure, and the calculation behind them is this one.

## Exercise

Compute the closed and open displaced volume rates for the drill pipe at 0.5 m/s.

Then take their ratio and compare against the 1.172219719213269 the engine reports, and explain the difference.
