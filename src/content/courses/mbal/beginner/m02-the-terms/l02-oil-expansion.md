# Oil expansion

The right side of the balance is expansion, and its first and largest piece is the oil itself. The term is written $E_o$, and its definition is as simple as definitions get:

$$E_o = B_t - B_{ti}$$

How much bigger one stock tank barrel's worth of the original reservoir oil has become, now that the pressure has fallen. Units are rb/stb, the same as a formation volume factor, because that is exactly what it is: a difference between two formation volume factors.

## Per stock tank barrel of ORIGINAL oil

Read the units again, because this is where the term is most often misused. $E_o$ is quoted per stock tank barrel of oil that was ORIGINALLY in place, not per barrel produced. That is why the balance multiplies it by $N$, the original oil in place, and never by $N_p$.

$$\text{oil expansion volume} = N \, E_o$$

If you multiply $E_o$ by cumulative production you have computed how much the produced oil would have expanded had it stayed in the ground, which is a quantity nobody wants. Every stock tank barrel down there expands, including the ones that will never be recovered, and it is the whole tank's expansion that pushes production to the wells.

## What Ekene does to the term

Above the bubble point $R_s = R_{si}$, so the two-phase factor $B_t = B_o + B_g(R_{si} - R_s)$ loses its second term and becomes $B_t = B_o$. For this tank, therefore,

$$E_o = B_o - B_{ti}$$

which is a subtraction between two numbers sitting in plain sight on the survey rows.

Survey 3, dated 2021-07-01:

$$E_o = 1.20918514279964 - 1.20000000000000 = 0.00918514279964078 \text{ rb/stb}$$

Survey 6, the last:

$$E_o = 1.21589748101760 - 1.20000000000000 = 0.0158974810175951 \text{ rb/stb}$$

Do both subtractions yourself. They are the least intimidating arithmetic in the course, and they produce the single most important number in it.

## How small that number is, and why it still works

Sixteen thousandths of a reservoir barrel per stock tank barrel. After 1103.99173733300 psi of depletion, each barrel of original oil has swollen by 1.32479008479960 percent of its own volume. That is what an undersaturated oil does: it is a liquid, it is nearly incompressible, and squeezing that pressure out of it buys you very little volume.

The method survives that smallness because the tank is large. Multiply the tiny expansion by the whole in place volume:

$$N \, E_o = 12139208.1074968 \times 0.0158974810175951 = 192982.830457568 \text{ rb}$$

A hundred and ninety three thousand reservoir barrels of oil expansion, from a fluid that grew by 1.32479008479960 percent. Compare that with the total underground withdrawal of 317926.842484584 rb and you have already discovered the headline result of this module: oil expansion accounts for 60.7003891050582 percent of what was withdrawn. Something else supplied the other 39 percent, and the next two lessons are about what.

## Linear in the drawdown

There is a pattern in the $E_o$ column worth extracting. Divide each survey's oil expansion by that survey's pressure drawdown and you get the same number every time: 0.0000144000000000000 rb/stb per psi.

Check it at survey 3, where the drawdown is 637.857138863942 psi:

$$0.0000144000000000000 \times 637.857138863942 = 0.00918514279964078 \text{ rb/stb}$$

which is the value computed by subtraction above. The reason is that an undersaturated oil's formation volume factor grows linearly with drawdown at the rate $B_{oi} c_o$, where $c_o$ is the oil compressibility, and 1.20000000000000 times an oil compressibility of 0.000012 per psi is 0.0000144000000000000.

This linearity is a property of undersaturated oil, not a general law. Below the bubble point $B_o$ turns around and FALLS as pressure drops, because the oil is shrinking as its dissolved gas leaves, and the whole shape of the term changes. That is one of several reasons a saturated tank is a different piece of work.

## See it in the panel

{{panel:mb-tank-explorer}}

Read the Eo column against the pressure column. Confirm the linearity yourself by dividing any two entries in the Eo column and comparing that to the ratio of their drawdowns from 3200 psia. Then check the largest entry, 0.0158974810175951 rb/stb, against the last row's $B_o$ minus 1.20000000000000.

## Two misconceptions

**"Eo should be large because the pressure drop was large."** Pressure drop and volume response are related by compressibility, and liquid compressibilities are of order one part in a hundred thousand per psi. A thousand psi therefore buys about one percent. Anyone who expects a big number from $E_o$ has quietly assumed a gas.

**"Eo is per barrel produced."** Already named above, and it is worth naming twice because it is the error that produces in place volumes off by a factor of tens. If your recovery factor comes out near 100 percent, check this first.

## Exercise

Compute $E_o$ at survey 5, dated 2022-07-01, two different ways: by subtracting $B_{ti}$ from that row's $B_o$ of 1.21402206324464, and by multiplying the per psi slope of 0.0000144000000000000 rb/stb/psi by that row's drawdown of 973.754391988592 psi. Both should give 0.0140220632446355 rb/stb.

Then compute the volume that expansion represents for the whole tank by multiplying it by 12139208.1074968 stb, and compare your answer against that survey's underground withdrawal of 280421.174118849 rb. The shortfall is not an error. Name what must be making it up.
