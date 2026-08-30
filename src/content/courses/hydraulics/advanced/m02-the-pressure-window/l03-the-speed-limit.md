# The speed limit

Solving for the fastest trip the window allows.

{{panel:hy-surge-explorer}}

## The question

Given a fracture pressure and a pore pressure, how fast can the string be moved without leaving the window?

## The two conditions

    surge EMW <= fracture EMW      going in
    swab EMW  >= pore EMW          coming out

Both have to hold, and because surge and swab are symmetric about the mud weight, whichever limit is CLOSER to the mud weight is the binding one.

## The solver

Bisection on the trip speed, over a bracket from zero to a maximum.

    if neither limit is given, return the maximum
    if speed zero already fails, return zero
    otherwise bisect

The response is monotone: faster always means more pressure, in both directions. So bisection converges.

## The zero check

If speed zero fails, no trip speed works.

That means the STATIC mud weight is already outside the window, which is a mud weight problem rather than a trip speed problem. Returning zero rather than a small number says so.

## What it produces

A number in metres per second, which converts to a stand time: 27 m of stand at 0.5 m/s is 54 seconds of running, plus the time to set the slips and make up the next stand.

That is how a computed speed limit becomes a rig procedure.

## The asymmetry to watch

The two conditions are not usually equally tight.

If the mud weight sits closer to the pore pressure than to the fracture pressure, the SWAB binds first and the limit is set by pulling out. If it sits closer to the fracture pressure, the surge binds and the limit is set by running in.

The engine's solver applies both and returns the smaller, so the answer is the same either way, and knowing WHICH one bound tells you what to change.

## The open string case

An open string produces less pressure, so it permits a faster trip.

That is why the speed limit is quoted separately for running casing, which is closed, and for tripping drill pipe, which is usually open. The two numbers can differ by a fifth or more.

## Exercise

Use the panel's window view on the slant well with a fracture gradient of 1520 and a pore pressure of 1380 kg/m3.

Read the closed and open speed limits, take their ratio, and say which of the two conditions was binding.
