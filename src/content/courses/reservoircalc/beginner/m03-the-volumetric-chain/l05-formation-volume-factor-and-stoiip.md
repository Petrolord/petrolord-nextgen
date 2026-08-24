# Formation volume factor and STOIIP

The hydrocarbon pore volume is 2.315980 million cubic metres. That is oil, it is in the reservoir, and it is measured under reservoir conditions. It is not yet a number anyone will trade, budget or book, because oil is never sold at reservoir conditions. This last step of the chain moves the volume from where the oil is to where it will be measured, and then changes the unit.

## What Bo is doing physically

Down in the reservoir the oil is hot and under high pressure, and it has gas dissolved in it. A cubic metre of that live oil is not a cubic metre of the liquid you would put in a tank at surface. Bring it up the tubing and three things happen to it.

Pressure falls, so the dissolved gas comes out of solution. That is the dominant effect. Gas that occupied space inside the liquid phase leaves it and becomes a separate phase, and the liquid that remains is smaller than the live oil was.

Temperature falls, from reservoir temperature to something near ambient, and the liquid contracts as it cools.

The pressure on the remaining liquid falls too, and liquids are slightly compressible, so the oil expands a little on that account. This effect works the other way but it is much the smaller one.

The net result for almost every oil is shrinkage. The volume that arrives in the stock tank is less than the volume that left the pore space. The oil formation volume factor is the bookkeeping term for that:

$$B_o = \frac{\text{volume of oil at reservoir conditions}}{\text{volume of the same oil at stock tank conditions}}$$

It has units of reservoir volume per stock tank volume, usually written rb/stb or rm3/stm3, and it is greater than 1.0 for any oil with gas in solution. The value here is

$$B_o = 1.2$$

which says that 1.2 cubic metres of oil in the reservoir become 1.0 cubic metre of oil in the tank. Roughly a sixth of the reservoir volume was dissolved gas and thermal expansion, and it is gone from the liquid by the time anyone measures it.

Typical values run from about 1.05 for a heavy, undersaturated oil with little dissolved gas up to 1.6 or more for a light volatile oil. A higher $B_o$ means more shrinkage on the way up and fewer stock tank barrels from the same reservoir volume.

## Dividing, not multiplying

Because $B_o$ is reservoir volume divided by stock tank volume, converting from reservoir volume to stock tank volume means dividing by it:

$$\text{stock tank volume} = \frac{\mathrm{HCPV}}{B_o}$$

Dividing by a number greater than one makes the answer smaller, which is the direction shrinkage requires. If your surface volume came out larger than your reservoir volume, you multiplied when you should have divided, and you have invented oil that does not exist.

## The unit conversion

The volume is now in stock tank cubic metres, and the industry books oil in stock tank barrels. The conversion is fixed:

$$1 \text{ m}^3 = 6.2898 \text{ stb}$$

A barrel is 42 US gallons, which works out at about 0.159 cubic metres, so one cubic metre is a little under six and a third barrels. The factor is a definition rather than a measurement, so it never changes with fluid, field or temperature.

## STOIIP

Putting the division and the conversion together gives stock tank oil initially in place:

$$\mathrm{STOIIP} = \frac{\mathrm{HCPV}}{B_o} \times 6.2898$$

$$\frac{2.3159797972902343}{1.2} \times 6.2898 = 12.139208107496763 \text{ MMstb}$$

Rounded for reporting, the Ekene accumulation at a contact of 1560 m holds 12.139208 MMstb. The MM prefix means million, so that is a little over twelve million stock tank barrels.

Read the name carefully, because each word is a limitation. **Stock tank** means measured at surface conditions after shrinkage, which is what the last two steps did. **Oil** means liquid hydrocarbon only, with the associated gas booked separately if at all. **Initially** means at the moment of discovery, before a single barrel is produced, so STOIIP does not decline as the field is produced. **In place** is the important one. It is the oil in the ground. It is not the oil you will get out.

What you will get out is the recoverable volume, which is STOIIP multiplied by a recovery factor. For an oil field that factor is commonly somewhere between 0.15 and 0.45 depending on drive mechanism, rock quality and how much money is spent. Quoting a STOIIP as though it were reserves is not a rounding error, it is a category error, and it is the fastest way to lose credibility in a review.

## The whole chain in one place

| Step | Operation | Result |
| --- | --- | --- |
| Gross rock volume | 169 cells times column times 10,000 m2 | 22.269036 million m3 |
| Net rock | multiply by NTG 0.8 | 17.815229 million m3 |
| Pore volume | multiply by porosity 0.20 | 3.563046 million m3 |
| Hydrocarbon pore volume | multiply by $1 - S_w$, that is 0.65 | 2.315980 million m3 |
| STOIIP | divide by $B_o$ 1.2, multiply by 6.2898 | 12.139208 MMstb |

Four multiplications and one division stand between a map and a booked volume. Every one of them is a fraction whose meaning you can state in a sentence, and if you cannot state it, that is the step to go back to.

The panel below runs the whole chain and lets you move the contact.

{{panel:rc-volume-explorer}}

## Exercise

Suppose the laboratory revises $B_o$ from 1.2 to 1.4 and nothing else changes. Say what happens physically to justify a higher value, state whether the booked STOIIP rises or falls, and give the factor by which it changes.

Self check: a higher $B_o$ means more shrinkage between reservoir and tank, typically because the oil is lighter and carries more dissolved gas that comes out of solution on the way up. Since the chain divides by $B_o$, the booked STOIIP falls. The same hydrocarbon pore volume of 2.315980 million cubic metres is now divided by 1.4 rather than 1.2, so the answer is multiplied by the ratio 1.2 divided by 1.4, which is about 0.857, a reduction of roughly 14 percent. If your answer rose, check the direction of the division.
