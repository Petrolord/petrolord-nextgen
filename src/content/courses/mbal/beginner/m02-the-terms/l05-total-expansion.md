# Total expansion

The right side of the balance is now complete. Total expansion is the sum of every mechanism that made room in the tank, per stock tank barrel of oil originally in place:

$$E_t = E_o + m E_g + E_{fw}$$

Three terms: the oil expanding, a gas cap expanding, and the rock and connate water. Ekene has no gas cap, so $m = 0$ and the middle term is absent from every calculation in this tier. What remains is a sum of two numbers you already know how to compute.

$$E_t = E_o + E_{fw}$$

## Work it at the last survey

Oil expansion, from lesson 2 of this module:

$$E_o = 1.21589748101760 - 1.20000000000000 = 0.0158974810175951 \text{ rb/stb}$$

Rock and connate water expansion, from lesson 3:

$$E_{fw} = 0.00000932307692307692 \times 1103.99173733300 = 0.0102925998895969 \text{ rb/stb}$$

Total:

$$E_t = 0.0158974810175951 + 0.0102925998895969 = 0.0261900809071921 \text{ rb/stb}$$

Add those two on your own calculator now, and then do the check that closes the module. Multiply each piece by the tank size of 12139208.1074968 stb:

$$N E_o = 192982.830457568 \text{ rb} \qquad N E_{fw} = 124944.012027016 \text{ rb}$$

$$192982.830457568 + 124944.012027016 = 317926.842484584 \text{ rb}$$

which is $F$, the underground withdrawal at that survey, to the last figure. Everything that came out is accounted for by something that expanded. That is material balance, closed, on real numbers.

## The number that surprises people

Divide the rock and water contribution by the total:

$$\frac{E_{fw}}{E_t} = \frac{0.0102925998895969}{0.0261900809071921} = 0.392996108949418$$

Rock and connate water supply 39.2996108949418 percent of the total expansion. Oil supplies the remaining 60.7003891050582 percent. In a reservoir where the oil is the only thing anybody talks about, nearly two fifths of the drive comes from the container and the water that will never be produced.

Most learners guess a few percent. The reason the true share is so large is a matter of what each compressibility acts on. The oil's own compressibility of 0.000012 per psi is the biggest single number in play, but it acts only on the oil. The rock and water group of 0.00000505000000000000 per psi is smaller, but the division by $1 - S_{wi} = 0.650000000000000$ scales it up onto the oil basis, giving 0.00000932307692307692 rb/stb/psi against the oil's 0.0000144000000000000 rb/stb/psi. Two numbers of the same order, and a split near 39 to 61 is the arithmetic result.

This is precisely why the $E_{fw}$ term is in the equation at all. On an undersaturated tank it is not a refinement. It is a third of the answer.

## The share is constant, and that is a clue

Look at the ratio at every survey, not just the last. It is 39.2996108949424 percent at survey 1 and 39.2996108949418 percent at survey 6, identical for practical purposes across the whole history.

The reason is structural. Both terms are proportional to the same drawdown, with fixed slopes of 0.0000144000000000000 and 0.00000932307692307692 rb/stb/psi. Their sum has a slope of 0.0000237230769230768 rb/stb/psi, and the ratio of a constant to a constant does not move.

Keep that fact. When you meet drive indices in module 4 you will find the engine reporting a solution and rock expansion drive index of 0.392996108949419 and a depletion drive index of 0.607003891050583 for this tank. Those are not new calculations. They are the same split you just computed by dividing one expansion by another, which is what makes the drive indices readable rather than mysterious.

A tank whose expansion shares DRIFT over time is telling you something has changed: a new mechanism has entered, or the model is missing a term. Constant shares mean one steady physical story.

## See it in the panel

{{panel:mb-tank-explorer}}

Add the Eo and Efw columns row by row and confirm the Et column. Then compute the Efw share for two or three rows and watch it stay put. Finally, read the drive index tiles and match them against the shares you computed by hand. The panel and your calculator should agree everywhere; if they do not, it is your bracket, not the engine.

## The misconception, one last time

**"Et is per barrel produced, so it should grow with production."** $E_t$ grows with DRAWDOWN, not with production. The two happen to rise together on Ekene because producing is what lowers the pressure, but the term itself contains no production at all: it is built from formation volume factors, compressibilities, saturations and a pressure difference. A tank that was shut in for a decade and slowly repressurised would see its $E_t$ FALL while its cumulative production sat still.

## Exercise

Compute $E_t$ at survey 5, dated 2022-07-01, from its parts: $E_o = 0.0140220632446355$ rb/stb and $E_{fw} = 0.00907838710069364$ rb/stb. Check yourself against 0.0231004503453291 rb/stb.

Then do three more things with it. Compute the rock and water share and confirm it lands on the same 39.2996108949418 percent as the last survey. Divide that survey's withdrawal of 280421.174118849 rb by your $E_t$ and confirm you recover 12139208.1074969 stb. Finally, recompute $E_t$ with the misread compressibility group from the previous lesson, and write down how many barrels of booked oil that single bracket would have added at this survey.
