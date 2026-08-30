# Inside the pipe

Where most of this system's pressure goes, and why.

{{panel:hy-rheology-explorer}}

## The numbers

Slant well, kcl_polymer, at three flow rates:

| flow rate | pipe loss | share of pump pressure |
|---|---|---|
| 0.015 m3/s | 3316099.4156169523 Pa | 63.4212 percent |
| 0.025 m3/s | 7998453.767490401 Pa | 67.9500 percent |
| 0.035 m3/s | 14277397.13302024 Pa | 68.3933 percent |

Two thirds of the pump pressure is spent getting the mud DOWN the string, before it has done any work at all.

## Why so much

Three reasons, in order.

**The bore is small.** The drill collars have an inside diameter of 0.05715 m. The drill pipe's is 0.1086104 m, nearly twice as wide, and area goes as the square, so the collars carry nearly four times the velocity.

**Velocity enters squared.** The pressure loss expression has v squared in it, so four times the velocity is sixteen times the loss per metre before the friction factor is even considered.

**The flow is turbulent there.** In turbulent flow the friction factor falls only slowly with Reynolds number, so the v-squared term is not offset the way it is in laminar flow.

## What that means in practice

The collars are 150 m of a 3000 m string, five percent of its length, and they carry a large share of its pressure loss.

That is why a bottom hole assembly's bore is a hydraulics decision as much as a mechanical one, and why running a smaller-bore assembly to get more weight can cost hundreds of psi at the pump.

## What it does NOT mean

It does not mean the pipe loss matters to the formation. It does not: the pipe loss is inside the string and the formation never sees it.

Pipe loss is a pump problem. Annulus loss is a formation problem. Confusing the two is the most common error in reading a hydraulics report.

## The one exception

A pipe loss so large that the pump cannot supply it caps the flow rate, and a capped flow rate is a hole cleaning problem, which IS a formation problem eventually.

So the two are connected, and they are connected through the pump's limit rather than directly.

## Exercise

From the table, compute the exponent relating pipe loss to flow rate between 0.015 and 0.035 m3/s.

Then compute the same exponent for the annulus loss, which goes from 1070941.731639342 to 2015705.7037686682 Pa over the same range, and explain the difference between the two exponents in one sentence.
