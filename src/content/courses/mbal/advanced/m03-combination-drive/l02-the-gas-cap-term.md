# The gas cap term

A gas cap is the easiest drive mechanism to picture and the easiest one to write down wrongly. It is a body of free gas sitting on top of the oil, and when the reservoir pressure falls that gas expands and pushes the oil down towards the wells. Nothing subtle about the physics. The subtlety is entirely in the bookkeeping, because the material balance does not describe the gas cap in its own units. It describes it per stock tank barrel of oil.

## The term

$$E_g = \frac{B_{ti}}{B_{gi}} \left( B_g - B_{gi} \right)$$

and the gas cap's contribution to the balance is $N m E_g$, where $m$ is the ratio of the gas cap's reservoir volume to the oil zone's reservoir volume at initial conditions.

Take the two factors apart. The group $B_{ti}/B_{gi}$ has units of reservoir barrels per stock tank barrel divided by reservoir barrels per standard cubic foot, which leaves standard cubic feet per stock tank barrel. On the published case,

$$\frac{B_{ti}}{B_{gi}} = \frac{1.58}{0.0008} = 1975.00000000000 \ \text{scf/stb}$$

That is a real quantity with a plain reading: if the gas cap were exactly the same reservoir volume as the oil zone, it would hold 1975 standard cubic feet of gas for every stock tank barrel of oil in place. Multiply by $m$ and you have the actual gas cap, in scf per stb.

The second factor, $B_g - B_{gi}$, is the reservoir volume that one standard cubic foot of that gas gains as the pressure falls. Multiply the two and you have reservoir barrels of gas cap expansion per stock tank barrel of oil in place, at $m = 1$. On the published case, with $B_{gi} = 0.0008$ and $B_g = 0.00092$ rb/scf,

$$E_g = 1975 \times 0.00012 = 0.237000000000000 \ \text{rb/stb}$$

and the gas cap of ratio 0.25 therefore contributes

$$m E_g = 0.0592500000000000 \ \text{rb/stb}$$

Compare that against the oil expansion over the same step, $E_o = B_t - B_{ti} = 0.0750000000000000$ rb/stb. The ratio $E_g / E_o$ is 3.16000000000000, so barrel for barrel the gas is more than three times the expander that the oil is. The cap only ends up second in the drive split because it is one quarter of the volume.

## Why per barrel of oil

The honest answer is that it keeps the equation solvable.

Suppose you wrote the gas cap the way it exists in the ground, as a volume $G$ of gas in place with its own expansion:

$$F = N E_o + G B_{gi} \left( \frac{B_g}{B_{gi}} - 1 \right) + N E_{fw} + W_e$$

Now the equation has two in place unknowns instead of one. Both multiply a term that is roughly proportional to the pressure drop, so a regression cannot tell them apart unless the two expansions curve differently across your surveys, and over a modest drawdown they do not curve differently enough. You would be solving for two numbers with one usable direction of information, which is the same trap the Professional tier walked into with an unnecessary aquifer, and it produces the same kind of answer.

Writing the cap as $m$ times the oil zone's volume ties the gas cap to $N$, so the whole hydrocarbon expansion collapses back to a single unknown scale:

$$F = N \left( E_o + m E_g + E_{fw} \right) + W_e$$

One unknown in place volume, and $m$ supplied from outside as a number you can defend. That is the trade the convention makes: it buys identifiability by requiring you to know the gas cap ratio independently.

And you usually can. $m$ is a volume ratio between two mapped bodies, the gas cap and the oil column, bounded by a gas oil contact and an oil water contact that a well log reads directly. It is a geometric quantity from the same map that produced the volumetric booking. Gas in place, by contrast, would need the map plus the gas PVT plus a saturation. The convention asks for the number that is easier to know.

The engine follows the same convention in its rock and connate water term, which carries a factor of $(1+m)$:

$$E_{fw} = B_{ti} (1+m) \frac{S_{wi} c_w + c_f}{1 - S_{wi}} \Delta p$$

The reason is the same bookkeeping. The pore volume that compresses is the whole hydrocarbon pore volume, oil zone plus gas cap, and the gas cap is $m$ times the oil zone. So the rock term scales with $(1+m)$ for exactly the reason the gas term scales with $m$: both are being measured against one stock tank barrel of oil.

## Worked example: two routes to the same 592500 barrels

Route one is the term as written. $N m E_g$ with $N = 10000000$ stb, $m = 0.25$ and $E_g = 0.237$ rb/stb:

$$N m E_g = 10000000 \times 0.25 \times 0.237 = 592500.000000000 \ \text{rb}$$

Route two never mentions $E_g$ at all. The gas cap's initial reservoir volume is $m$ times the oil zone's initial reservoir volume:

$$m N B_{ti} = 0.25 \times 10000000 \times 1.58 = 3950000.00000000 \ \text{rb}$$

That gas, at $B_{gi} = 0.0008$ rb/scf, is $4937500000.00000$ scf. As the pressure falls from 3000 to 2800 psia the same gas occupies $B_g / B_{gi} = 1.15000000000000$ times its original volume, an expansion of 15.0000000000000 percent:

$$3950000 \times 0.15 = 592500.000000000 \ \text{rb}$$

The same number to the last figure. Route two is the physics and route one is the same physics rearranged so that $N$ can be factored out. If you ever doubt a gas cap term, compute it the second way as a check. A gas cap contributing more reservoir barrels than it originally occupied has told you something is wrong with your $B_g$ ratio, and that check is easier to make in absolute volumes than in barrels per stock tank barrel.

## Exercise

The map is re-picked and the gas oil contact moves. The gas cap now works out at $m = 0.35$ instead of 0.25, with every other input unchanged.

Compute the cap's initial reservoir volume, the standard cubic feet it holds, and its expansion over the 200 psi step. You should find 5530000.00000000 rb, 6912500000.00000 scf and 829500.000000000 rb.

Then compute the water influx the balance now requires, given $F = 1760200$ rb, $E_o = 0.075$ rb/stb and the $(1+m)$ form of $E_{fw}$ above. You should find 173767.750000000 bbl against the 411281.250000001 bbl the published $m$ gives, a fall of 57.7496542815895 percent.

Finish with one sentence on the reviewer's question: the gas cap ratio moved by one tenth and the water influx more than halved, so what does that tell you about which of the two numbers this field's reserves case is actually sensitive to?
