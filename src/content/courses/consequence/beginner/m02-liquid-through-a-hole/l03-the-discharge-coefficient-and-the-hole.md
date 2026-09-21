# The discharge coefficient and the hole

{{panel:cq-release}}

Two inputs sit outside the square root in Bernoulli's equation: the discharge coefficient and the hole area. Everything under the root, the head, the ullage and the density, enters as a square root. These two enter directly, so the mass rate is linear in each of them. That makes them the inputs an analyst should state most carefully.

## The discharge coefficient

The coefficient is the fraction of the ideal flow a real hole delivers. A sharp edged hole contracts the jet just past its edge, and the flow is smaller than the ideal. With everything else on the AMENAM line held:

| discharge coefficient, stated | mass rate kg/s |
| --- | --- |
| 0.6 | 18.730307 |
| 0.62 | 19.354651 |
| 0.8 | 24.973743 |
| 1 | 31.217178 |

A coefficient of one is the ideal flow and the upper bound. The engine accepts it and refuses anything larger:

> dischargeCoefficient: must lie in (0, 1]: the YB recommends 0.62 for a sharp orifice

The refusal names the Yellow Book's recommendation because it is the usual starting value. A rounded or smooth entry discharges more, and a study that wants a bounding case may state one. Because the rate is linear in the coefficient, moving from 0.62 to 0.8 raises the rate in the same proportion as the coefficient itself, as the table shows. There is no hidden interaction with the head or the ullage.

## The hole

With everything else held, the hole diameter swept:

| hole diameter m, stated | hole area m2 | mass rate kg/s |
| --- | --- | --- |
| 0.01 | 0.000078539816 | 0.774186 |
| 0.025 | 0.000490873852 | 4.838663 |
| 0.05 | 0.001963495408 | 19.354651 |
| 0.1 | 0.007853981634 | 77.418603 |

The mass rate is linear in the hole AREA, and the area goes as the square of the diameter. Doubling the diameter from 0.05 to 0.1 m multiplies the rate by, derived, 4.000000. For the same fractional change, the hole size therefore moves a result faster than any other input on this line. A study that is unsure of the hole should run a small ladder of sizes and report each, since a guess at the diameter is squared on its way into the answer.

## A published case the engine reproduces

The Yellow Book works a liquid outflow for acrylonitrile: a hole of 0.1 m, a coefficient of 0.62, a density of 812.5 kg/m3 and a liquid level of 11.12 m at 500 s. It prints 58.44 kg/s. The engine gives 58.429567 kg/s, a relative difference of 1.79e-4. The book prints the level to two decimals, which is why the golden test allows 0.0005 relative. The small gap comes from the printed inputs, and a book that rounds its level cannot reproduce itself to more places than it prints.

## Exercise

On the outflow view, start from the AMENAM defaults. Set the discharge coefficient to 1 and read the mass rate against the table. Then return the coefficient to 0.62, set the hole diameter to 0.025 m and then 0.1 m, and divide the two mass rates you read. Explain in one sentence why that ratio matches the ratio of the two hole areas in the table.
