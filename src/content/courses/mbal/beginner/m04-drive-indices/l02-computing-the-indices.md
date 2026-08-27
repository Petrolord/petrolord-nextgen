# Computing the indices

Every number you need for a drive index is already in the survey table. Nothing new is measured and nothing is fitted. This lesson does the arithmetic once carefully, then checks it at every survey.

## The four formulas

$$\text{DDI} = \frac{N E_o}{A}, \qquad \text{SDI} = \frac{N E_{fw}}{A}, \qquad \text{GDI} = \frac{N m E_g}{A}, \qquad \text{WDI} = \frac{W_e - W_p B_w}{A}$$

Read the pattern rather than memorising four expressions. Each numerator is one supplier's contribution converted into reservoir barrels. Each denominator is the same withdrawal for all four. The indices are shares of one job, so they share a denominator, and that is the only way a set of shares can sum to one.

$A$ is the withdrawal being apportioned. Lesson 3 pins it down. Everywhere in this lesson $A = F$, because Ekene produced no water at any survey, so $W_p B_w$ is zero and the distinction has nothing to bite on.

On Ekene, GDI is zero for two independent reasons: $m = 0$, so there is no gas cap to expand, and there is no free gas anywhere, since the tank stays above its 2000 psia bubble point. WDI is zero because there is no aquifer and no produced water. So the whole drive is DDI plus SDI, and the two must sum to one if the tank is closed.

## Work the last survey

The inputs, all from the survey table and the fitted slope:

- $N = 12139208.1074968$ stb
- $E_o = 0.0158974810175951$ rb/stb
- $E_{fw} = 0.0102925998895969$ rb
- $F = 317926.842484584$ rb, and $W_p = 0$, so $A = F$

Convert the oil expansion into reservoir barrels:

$$N E_o = 12139208.1074968 \times 0.0158974810175951 = 192982.830457568 \ \text{rb}$$

Convert the rock and connate water expansion into reservoir barrels:

$$N E_{fw} = 12139208.1074968 \times 0.0102925998895969 = 124944.012027016 \ \text{rb}$$

Before dividing anything, add those two together: $317926.842484584$ rb. That is $F$, to the last figure you can carry. The two suppliers between them account for the entire withdrawal, which is the balance closing in front of you.

Now divide:

$$\text{DDI} = \frac{192982.830457568}{317926.842484584} = 0.607003891050583$$

$$\text{SDI} = \frac{124944.012027016}{317926.842484584} = 0.392996108949419$$

$$\text{WDI} = \frac{0 - 0}{317926.842484584} = 0.00000000000000$$

$$\text{DDI} + \text{SDI} + \text{GDI} + \text{WDI} = 1.00000000000000$$

The engine reports exactly these values, with its own sum coming back as $1.0000000000000013$, the trailing digits being arithmetic rounding rather than a closure error.

## The shortcut, and why it works here

There is a faster route to the same two numbers on a closed tank. Since $F = N E_t$ exactly, substitute that into the definitions and the oil in place cancels:

$$\text{DDI} = \frac{N E_o}{N E_t} = \frac{E_o}{E_t}, \qquad \text{SDI} = \frac{N E_{fw}}{N E_t} = \frac{E_{fw}}{E_t}$$

So on a closed tank the drive indices are simply the shares of total expansion, and you never need the oil in place to compute them. Check it: $0.0102925998895969 / 0.0261900809071921$ is the share of $E_t$ that the rock and water term holds, which is $39.2996108949418$ percent, and that is SDI to fourteen figures.

That cancellation is a special case, not a general law. It works only because $F = N E_t$ with nothing left over. Add water influx and $F$ exceeds $N E_t$, the cancellation fails, and you are back to the full formulas with a WDI that is no longer zero. Use the shortcut to check your arithmetic on a closed tank, and never as a substitute for knowing where the denominator came from.

## Every survey, not just the last

Compute the pair at all six surveys and you get this:

| n | DDI | SDI | sum |
|---|---|---|---|
| 1 | 0.607003891050567 | 0.392996108949418 | 1.00000000000000 |
| 2 | 0.607003891050595 | 0.392996108949419 | 1.00000000000000 |
| 3 | 0.607003891050589 | 0.392996108949419 | 1.00000000000000 |
| 4 | 0.607003891050589 | 0.392996108949419 | 1.00000000000000 |
| 5 | 0.607003891050578 | 0.392996108949419 | 1.00000000000000 |
| 6 | 0.607003891050583 | 0.392996108949419 | 1.00000000000000 |

The split does not move. Not by a percentage point, not by a tenth of one. Ekene's drive is 60.7 percent depletion and 39.3 percent rock and connate water at six months and at three years alike.

The reason is worth understanding rather than memorising. Both expansion terms on this tank are proportional to the same pressure drop: $E_o$ at $0.000014399999999999886$ rb/stb/psi and $E_{fw}$ at $0.00000932307692307692$ rb/stb/psi, both constant. When two quantities are both proportional to the same third quantity, their ratio cannot change no matter what that third quantity does. The drawdown grew from 162.261240122535 psi at the first survey to 1103.99173733300 psi at the last, and the split did not notice.

That constancy is a property of this tank, not of drive indices in general. A tank that crosses its bubble point starts liberating gas and its split moves hard. A tank with an aquifer sees WDI grow as influx accumulates. Lesson 4 is about reading those movements. Ekene is the control case: a split that stays put is a tank whose physics did not change.

## See it in the panel

{{panel:mb-tank-explorer}}

Read the drive index tiles and check the three numbers above against them. Then work down the survey table and confirm two things by hand on any row you like: that $N E_o$ plus $N E_{fw}$ reproduces that row's $F$, and that $E_o / E_t$ on that row reproduces the depletion index. Doing this once on a row that is not the last one is the fastest way to convince yourself the indices are arithmetic rather than output.

## Exercise

Work survey 2, 2021-01-01, from the survey table: $E_o = 0.00600602311012888$ rb/stb, $E_{fw} = 0.00388851496232698$ rb, $F = 120111.856789091$ rb, $W_p = 0$.

Compute $N E_o$ and $N E_{fw}$ using $N = 12139208.1074968$ stb, confirm that they add to $F$, then compute DDI and SDI and check them against the table above. Finally, compute DDI a second way as $E_o / E_t$ using $E_t = 0.00989453807245586$ rb, and state in one sentence why the two routes had to agree.
