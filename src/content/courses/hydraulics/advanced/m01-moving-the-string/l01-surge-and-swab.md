# Surge and swab

Pressure from motion, with no pump involved.

{{panel:hy-surge-explorer}}

## The mechanism

Run a string into a hole full of mud and the string has to go somewhere. The mud it displaces has to move out of the way, and moving mud through an annulus costs pressure.

That pressure is added to the hydrostatic column, so the formation sees more than the static mud weight. That is surge.

Pull the string out and the reverse happens: mud has to flow down to fill the space, and the pressure required to do that is SUBTRACTED. That is swab.

## Why they are symmetric

Because the same annular flow is happening with the sign reversed. The magnitude is identical and only the direction of travel differs.

The engine reports both from one calculation:

    surge EMW = mud weight + dp / (g x TVD)
    swab EMW  = mud weight - dp / (g x TVD)

## The numbers

Slant well, kcl_polymer, closed string:

| trip speed | pressure | surge EMW | swab EMW |
|---|---|---|---|
| 0.2 m/s | 681695.8775991246 Pa | 1467.7176473753025 | 1412.2823526246975 |
| 0.5 m/s | 981472.927055977 Pa | 1479.9065351493016 | 1400.0934648506984 |
| 1.0 m/s | 1485039.00940065 Pa | 1500.3814530111345 | 1379.6185469888655 |

The mud weight is 1440. Read the two EMW columns: each row is symmetric about it to the last digit.

## Why swab is the dangerous one

Because it LOWERS the pressure on the formation.

If it lowers it below the pore pressure, formation fluid enters the well. That is a kick, and it is happening while the string is coming out, which is when the well is least able to deal with it.

Most kicks on land wells happen while tripping out, and swab is why.

## Why surge is also dangerous

Because it RAISES the pressure. If it raises it above the fracture gradient, the formation breaks and mud is lost into it.

Losing mud lowers the level in the annulus, which lowers the hydrostatic pressure, which can then let a kick in. So a surge-induced loss can turn into an underbalance, which is how a single mistake becomes a well control event.

## The one input

The trip speed. It is the only thing about the motion the model takes, and it is the one thing the driller controls.

## Exercise

Compute the pressure at each of the three speeds as a fraction of the pressure at 0.5 m/s.

Then compute the speed ratios, and say what exponent relates the two.
