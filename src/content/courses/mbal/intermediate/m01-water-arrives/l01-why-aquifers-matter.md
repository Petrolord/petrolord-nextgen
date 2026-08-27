# Why aquifers matter

The Associate tier worked one tank, and that tank was closed. Nothing crossed its boundary in either direction, so every reservoir barrel withdrawn had to be supplied by something already inside expanding. That is what let a single division answer the whole question.

Ekene was chosen for that property. Most reservoirs do not have it.

## Where the water is

An oil accumulation is not a container with walls. It is the top of a rock body that continues past the oil water contact and keeps going, often for miles, filled with water. Whether that water leg matters to you is a question about pressure communication, not about geology: if a pressure drop in the oil column is felt in the water leg, the water leg will respond.

And it responds in the only way water can. Drop its pressure and it expands, its pore space compacts, and the freed volume has somewhere to go. It crosses into the reservoir, filling space the produced oil vacated.

The volume that crosses is written $W_e$, cumulative water influx, in reservoir barrels. The balance gains one term:

$$F = N \, E_t + W_e$$

That is the entire structural change, and everything in this tier follows from it.

## The term you cannot measure

Look at what the other symbols are. $N_p$, $G_p$ and $W_p$ come off metered production. The pressure comes off a gauge. $B_o$, $R_s$ and $B_w$ come from a laboratory. Every quantity in the closed tank balance was measured by an instrument somebody can point at.

$W_e$ is not like that. It is a volume crossing a subsurface boundary that no instrument sits on. There is no meter at the oil water contact and there never will be. Produced water, which you can measure, is a different quantity entirely: it is water that arrived, travelled to a well and came back out, and on many water drive fields the influx runs for years before the first barrel of water is produced.

So $W_e$ has to be modelled. Not looked up, not measured, modelled, which means choosing a description of the aquifer and letting that description generate an influx history. Choosing well is what this tier is about, and module 1 lesson 4 is where the choice gets made.

## What influx does to a field

Water arriving holds the pressure up, and holding the pressure up lets a field produce more oil before it reaches any given pressure. Put a number on that.

Here is a tank constructed for this tier. It is not a fixture and it is not a real field. It exists because the answer has to be known before a signature can be read honestly.

| property | value |
|---|---|
| survey dates and pressures | identical to Ekene, six surveys over 1096 days |
| oil in place $N$ | 12000000 stb |
| $B_o$ at drawdown $\Delta p$ | $1.2 \, e^{0.000012 \Delta p}$ rb/stb, a curved undersaturated path |
| $R_{si}$, $S_{wi}$, $c_f$, $c_w$, $m$ | 400 scf/stb, 0.35, 0.000004, 0.000003, 0 |
| aquifer | a pot aquifer of 20000000 rb, or none, as stated |

Give it no aquifer and run it down the Ekene pressure path to 2096.00826266700 psia. It produces 259497.841573946 stb.

Now give it a 20000000 rb aquifer and run it down the same pressure path to the same final pressure. It produces 386601.813549014 stb.

Same rock, same oil, same pressure decline, 48.9807434251238 percent more oil. The extra is exactly the water that arrived, 154558.843226620 rb at the last survey, divided by the withdrawal the closed version managed, 315550.219164991 rb. Nothing was recovered that would not otherwise have been recovered eventually; what changed is that the pressure budget bought more of it.

## What influx does to your answer

Now make the mistake this module is here to prevent. Take that same aquifer tank, hand its six surveys to a closed tank model, and read the slope.

The engine returns 17874138.5678105 stb against a truth of 12000000 stb, high by 48.9511547317538 percent. The R-squared is 0.999999892672973 and the intercept is 151.296075046121 rb, which on withdrawals of several hundred thousand reservoir barrels is nothing. Six points, a beautiful line, and six million barrels of oil that do not exist.

The direction of that error is not a coincidence and it never varies. Divide the balance through by $E_t$:

$$\frac{F}{E_t} = N + \frac{W_e}{E_t}$$

$W_e$ is positive whenever water is arriving and $E_t$ is positive whenever pressure has fallen, so the apparent oil in place is always above the true oil in place, at every survey, on every field. Ignored water influx flatters the booking. Water is doing work your model has attributed to oil, so your model needs more oil to do it.

Notice also the second, quieter symptom. This tank's pressure fell to the same 2096 psia as its closed twin while producing half as much again, so its pressure decline per barrel produced is shallower. A field on strong water support looks larger and looks like it is declining more gently, and both appearances have the same single cause.

## Worked example

Take the aquifer version of the constructed tank at its last survey. The withdrawal is 470109.062391613 rb and the total expansion is 0.0262958515970827 rb/stb.

Divide them: 470109.062391613 / 0.0262958515970827 = 17877689.2110149 stb. That is what one survey says the tank holds, and it is 48.9807434251238 percent above the true 12000000 stb.

Now recover the water. The truth is $N = 12000000$ stb, so the withdrawal the oil can account for is

$$N \, E_t = 12000000 \times 0.0262958515970827 = 315550.219164991 \ \text{rb}$$

and the remainder is

$$W_e = 470109.062391613 - 315550.219164991 = 154558.843226622 \ \text{rb}$$

which is the influx quoted above, to the figures the arithmetic carries. That subtraction is the whole diagnostic in one line, and the only reason you could do it here is that somebody told you $N$. On a real field you do not get told, which is why the next three lessons are about reading the signature instead.

## Exercise

Using the same constructed tank, work the first survey rather than the last. Its withdrawal with the aquifer present is 68935.9195224602 rb and its total expansion is 0.00385161215877544 rb/stb.

Compute the apparent oil in place, express its excess over 12000000 stb as a percentage, and compare that percentage against the 48.98 percent you got from the last survey. Then answer in words: the apparent oil in place is too high at both ends of the history, but by different amounts. Which end is more wrong, and what does that tell you about whether a single survey can ever detect water influx on its own?
