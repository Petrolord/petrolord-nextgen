# Exactly at the critical ratio

{{panel:cq-release}}

Every boundary in a model forces a decision about the point that sits exactly on it. For gas through a hole the question is this: when ambient over upstream equals the critical pressure ratio to the last digit, is the flow choked or subsonic? The engine answers in its basis, verbatim: "choked when Pa/P0 <= (2/(gamma+1))^(gamma/(gamma-1)) (exactly at the ratio counts as choked)". This lesson shows why the choice carries no cost.

## The Yellow Book's own test

The Yellow Book writes the test the other way up. It asks whether P0 over Pa is AT OR ABOVE ((gamma + 1) / 2) to the power gamma / (gamma - 1). Inverted, that is the engine's test on Pa over P0, at or below the critical value. So a ratio exactly at the critical value is CHOKED in the book, and it is choked in the engine for the same reason.

## Psi equals one on both sides

The subsonic outflow coefficient psi equals one at the critical ratio. On the choked side psi is one by definition. On the subsonic side psi rises smoothly to one as the ratio falls to the critical value. The two branches therefore meet at the same mass rate, and the regime flag flips there with no jump in the answer.

The golden cases around the boundary, through the engine:

| golden case | Pa over P0 | critical pressure ratio | regime | psi | mass rate kg/s |
| --- | --- | --- | --- | --- | --- |
| air-barely-subsonic | 0.53328947368421054 | 0.52828178771717416 | SUBSONIC | 0.999944960481 | 0.112711 |
| air-barely-choked | 0.52773437499999998 | 0.52828178771717416 | CHOKED | 1.000000000000 | 0.113903 |

The first case sits just above the critical ratio and reads SUBSONIC with psi a hair below one. The second sits just below and reads CHOKED with psi exactly one.

## The AMENAM line at the boundary

On the AMENAM methane line the upstream pressure that puts the ratio at the critical value is, derived, 186284.176006 Pa. There the engine reports CHOKED with psi 1.000000000000. One part in a billion lower it reports SUBSONIC, with psi still printing as 1.000000000000, and the two mass rates differ by, derived, 1.00e-9 relative. The regime is a label on a continuous curve.

## Why the label still matters

If the mass rate is continuous, why report a regime at all? Because it tells the reader which inputs the result is sensitive to. A choked result ignores ambient pressure; a subsonic one does not. It also tells the reader whether a small change in upstream pressure scales the rate in proportion or by something less. A study should report the regime beside the rate, and should not treat a flip of the label near the boundary as a change in the physics.

## Exercise

On the outflow view, set the AMENAM gas line to 186284.176006 Pa and read the regime and psi. Then lower the pressure by a few pascals and read them again, and compare the two mass rates. Write one sentence on why the regime label changes while the mass rate barely moves.
