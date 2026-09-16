# Computed, typed, and never checked

Every number a calculation returns rests on other numbers, and those divide into three classes. Some the engine derived. Some it took as published inputs and named. And some nothing in the package can derive or contradict. The third class is the one this lesson exists for.

{{panel:fc-blowdown-explorer}}

## The three columns

A figure this engine COMPUTES is derived from a closed form it can state, and its oracle reaches the same figure by an independent route. A figure it TYPES is a published chart or table it names the reference for. A figure HELD FOR LITERATURE is one the oracle cannot derive by any route, so nothing here would notice if it drifted.

The computed set here is large: the gas coefficient C at 520.000000000000 times a bracket in the isentropic exponent, the critical pressure ratio, the subcritical leading constant 735.000000000000 and F2, the liquid leading constant 38.000000000000, the liquid Reynolds constant 2800.000000000000, the steam leading constant 51.500000000000, the Napier fit, the exact circular segment, the terminal-velocity balance, the solid angle 12.566370614359, the universal gas constant 1545.349000000000, and the whole blowdown march.

The typed set is short: Kb for gas, Kw for liquid, KSH for steam, and the API 526 orifice table of 14 rows. Nothing derives them, by design.

## The held set, in full

Six things. The Kv viscosity fit's three coefficients. The sphere-drag correlation and its low-Reynolds cap of 240.000000000000. The Napier boundaries at 1500.000000000007 psia and 3200.000000000003 psia. The pool fire constants 21000.000000000000 and 34500.000000000000 with the exponent 0.820000000000. The 25 ft wetted-height limit. And the four customary allowable intensities with their labels.

## Where the line sits, exactly

The Napier boundaries are held, but the suite pins both, so they cannot move silently. The pool fire pair is held, but the oracle checks the unit conversion between the USC and SI statements, so a packaging error would be caught even though the constants themselves are not in question. The 25 ft limit is held because it is not a physical constant at all: it is a decision the caller applies, and the engine returns a note saying so.

Computing a balance can also sidestep a held figure entirely. A publication may print a rounded coefficient or an exact fraction for the settling relation, and no copy of the standard is here to say which. The engine evaluates the balance, which is the derivation both forms come from, and the digest recovers the coefficient out of the returned pair as 1.333333333333.

The Kv fit and the drag correlation are held with nothing hedging them at all. No pin, no partial check, no unit conversion standing in for the physics, and the next four lessons are about what that means and how to teach a figure in that position without either hiding it or overstating the problem.

## Exercise

Define computed, typed and held for literature in your own words, and say what distinguishes the second from the third. List the typed set. List the held set in full with the figure for each where the digest prints one. Then say which held items are pinned as behaviour, which is hedged by a unit check, which is a caller decision rather than a constant, and which two have nothing standing behind them.
