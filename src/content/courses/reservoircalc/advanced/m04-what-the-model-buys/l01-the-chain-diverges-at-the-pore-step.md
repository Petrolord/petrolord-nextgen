# The chain diverges at the pore step

A property model changes the booking. It is worth being precise about which part of the booking it changes, because the answer is narrower than most people expect and it makes the whole effect easy to audit.

## The two chains side by side

| Step | Constant 0.20 | Trend model | Changed |
| --- | --- | --- | --- |
| Oil bearing cells | 169 | 169 | no |
| Gross rock volume (10^6 m3) | 22.269036 | 22.269036 | no |
| Net volume (10^6 m3) | 17.815229 | 17.815229 | no |
| Pore volume (10^6 m3) | 3.563046 | 3.755847 | yes |
| HCPV (10^6 m3) | 2.315980 | 2.441300 | yes |
| STOIIP (MMstb) | 12.139208 | 12.796077 | yes |

The first three rows are identical, not merely close. Bit for bit the same numbers.

## Why the geometry cannot move

Porosity enters the chain at exactly one place, after the net volume has been formed. Everything above that point depends only on the structure, the contact and net to gross.

The oil bearing cell count is decided by the two surfaces and the contact. The gross rock volume is the sum of column times area over those cells. The net volume is the gross times net to gross, which is still a constant at this tier.

No porosity model, however elaborate, can reach any of those. That is a strong statement and it is worth using: if somebody's property model changed their gross rock volume, they changed something else at the same time.

## Why the three lower rows move together

Below the pore volume the chain multiplies by constants: oil saturation, then the formation volume factor and the barrel conversion. Multiplying by constants preserves ratios.

So the pore volume, the hydrocarbon pore volume and the STOIIP all change by the same factor. Check it against the table:

$$\frac{3.755847}{3.563046} = 1.054111, \qquad \frac{2.441300}{2.315980} = 1.054111, \qquad \frac{12.796077}{12.139208} = 1.054111$$

One ratio, three rows. The next lesson is about that ratio.

## What this buys you as an auditor

Three checks follow directly and each takes seconds.

Compare the cell counts, gross rock volumes and net volumes between a constant booking and a property model booking. They must be identical. Any difference means the geometry changed too, and the property model is not the only thing being compared.

Compare the ratio of the pore volumes with the ratio of the STOIIPs. They must match. A mismatch means one of the lower constants also changed.

Divide the pore volume by the net volume in each case to recover the effective porosity of each. Those two numbers, and their ratio, are the entire content of the comparison.

## Reading it off the panel

Switch the method between constant, trend and krige and watch the four chain tiles.

{{panel:rc-property-explorer}}

The cell count tile is labelled unchanged for this reason. The gross rock volume tile reads 22.2690 and the net volume tile 17.8152 for all three methods, without so much as a flicker in the fourth decimal.

The pore volume tile reads 3.6818, 3.7558 and 3.9148 for constant, trend and krige. Three quite different property models, three pore volumes, one geometry.

## Worked example

Confirm that the whole effect is one number by reconstructing the trend booking from the constant booking without touching the engine.

The constant booking is 12.139208 MMstb at a porosity of 0.20. The trend model's effective porosity is the pore volume over the net volume, $3.755847 / 17.815229 = 0.210822$.

Since the chain is linear in porosity and nothing else moved,

$$12.139208 \times \frac{0.210822}{0.20} = 12.796076 \ \mathrm{MMstb}$$

against the engine's 12.796077. The reconstruction reproduces the engine to six decimals from two numbers and a division.

That is the sense in which a property model, whatever its internal complexity, delivers exactly one number to the booking.

## Exercise

A colleague reports that switching from a constant porosity to a kriged grid raised their STOIIP by 9 percent and their gross rock volume by 2 percent. State what must have happened.

Self check: the gross rock volume cannot be affected by a porosity model, so something else changed at the same time. Most likely the contact, the surfaces or the extrapolation settings moved between the two runs, which means the 9 percent is not attributable to the property model and the comparison has to be redone with everything else held fixed.
