# The vertical closed forms

The one case a third party can settle on paper.

{{panel:gm-stability-explorer}}

## The fixture

A vertical hole in a stress field chosen so every number is round:

| input | value |
|---|---|
| overburden | 55000000 Pa |
| SHmax | 60000000 Pa |
| Shmin | 45000000 Pa |
| pore pressure | 20000000 Pa |
| UCS | 40000000 Pa |
| friction angle | 30 deg |
| Poisson ratio | 0.25 |
| tensile strength | 0 Pa |
| SHmax azimuth | 0 deg |

Note that SHmax exceeds the overburden here, so this is not a normal faulting field. That is fine: the fixture is chosen for arithmetic, not for realism.

## The published answers

| quantity | value |
|---|---|
| collapse pressure | 33750000 Pa |
| fracture initiation pressure | 55000000 Pa |
| breakout angle | 90 deg |

## The engine's answers

The same three numbers, to the last digit. Not close: identical.

## Why this is the strongest check in the course

Because the answers were not produced by any implementation. They come from two lines of algebra that a reader can do independently.

A golden from another implementation says two programs agree. A closed form says the program agrees with the mathematics.

## The effective stresses

With a Biot coefficient of 1 and a pore pressure of 20000000 Pa:

    effective SHmax = 40000000 Pa
    effective Shmin = 25000000 Pa
    effective Sv    = 35000000 Pa

## The frictional ratio

At a friction angle of 30 degrees, q is exactly 3. That is what makes the arithmetic clean.

## Where the breakout is

At 90 degrees from the high side. The nominal azimuth is 0 and the SHmax azimuth is 0, so the high side is along SHmax, and 90 degrees from it is along Shmin.

Which is exactly where a vertical-well breakout should be. The fixture confirms the convention as well as the numbers.

## What to do with it

Run it whenever the engine changes. If the closed forms still come out exactly, the rotation, the Kirsch evaluation, the principal stress sort and both bisections are all still correct on at least this case.

It costs nothing and it is the fastest way to find out that something broke.

## Exercise

Compute the three effective stresses above from the totals and the pore pressure.

Then, without reading the next lesson, work out the largest and the smallest effective hoop stress at zero differential pressure.
