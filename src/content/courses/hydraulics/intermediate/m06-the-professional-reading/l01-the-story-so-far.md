# The story so far

Five modules, one annulus, and two things it is doing at once.

## The claim

The annulus is carrying cuttings and pressing on the formation at the same time, and the flow rate that helps one hurts the other.

## What each module established

**Module 1.** Only the annulus loss reaches the rock, because the pipe and the bit are inside the string. The equivalent circulating density is the mud weight plus the annulus loss over the TRUE VERTICAL depth, which is why a horizontal well's lateral raises it so sharply: every metre adds friction and no true vertical depth. It is a PROFILE and not a number, and the formation that fractures is not always the deepest one. Cuttings in the annulus raise its bulk density by about 11.6 kg/m3 per percent by volume, and the engine's pressure calculation does not include them.

**Module 2.** Annular velocity is flow rate over area, so the slowest place is the widest annulus, which is the shallowest. Slip velocity is a falling particle solved with Schiller-Naumann drag; it RISES where the annulus is tight, because the mud is sheared thinner there. Transport ratio is one less their quotient, and cuttings concentration is the feed over the area times the cuttings velocity, so it falls faster than the transport ratio rises. The worst of both is in the shallowest interval.

**Module 3.** The transport model has NO inclination term, and the proof is in the engine's own output: the horizontal well and the slant well return identical transport ratios at every flow rate. Cuttings beds at angle are moved by rotation first, then flow, then pipe movement, then mud, and rotation is entirely absent from the model. Six omissions in all, and the computed transport ratio is an upper bound on a deviated well.

**Module 4.** Cleaning wants more flow and the formation wants less, and the pump is usually the constraint that binds first. The minimum flow rate for a target is a bisection over a monotone response, and going from a transport ratio of 0.9 to 0.95 more than doubles the rate required. The nozzle area is the one lever that relieves the pump constraint without touching the other two.

**Module 5.** The goldens come from an independent numpy implementation of a seven-point method specification, four of whose points are conventions rather than derivations. The agreement is better than 1e-6 everywhere: machine precision on the short chains and 1e-7 on the pump pressure, which is the longest. That is verification and not validation, and field comparisons of computed against measured equivalent circulating density land within tens of percent rather than parts in a million.

## The numbers to carry

- Equivalent circulating density uses TRUE VERTICAL depth.
- Cuttings are worth about 11.6 kg/m3 of bulk density per percent by volume in this mud.
- The transport ratio on the slant well at 0.025 m3/s: 0.8284815558593573 for the heavy mud, 0.7699923145452399 for the light one.
- The flow rate for a 0.9 transport ratio: 0.04677230885801645 m3/s heavy, 0.06520377325712001 m3/s light.
- The oracle agreement: better than 1e-6 everywhere, machine precision on surge and swab.

## The one sentence

The annulus is where every hydraulic decision is settled, and this tier computed both of the things it is doing while stating clearly which one it computes badly.
