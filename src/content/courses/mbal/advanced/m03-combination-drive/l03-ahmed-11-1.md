# Ahmed Example 11-1

This is the published case the engine's combination drive path is benchmarked against, and it is the source of three of the six values your capstone grades. Work it once, slowly, with every term written out. The point of a benchmark is not that you get the right answer. The point is that you can see which step you would have got wrong.

## The case

A combination drive reservoir with both a gas cap and an aquifer, worked over a single pressure step from 3000 psia to 2800 psia, with the oil in place given.

| given | value |
|---|---|
| $N$ | 10000000 stb |
| $m$ | 0.25 |
| $p_i$ | 3000 psia |
| $p$ | 2800 psia |
| $N_p$ | 1000000 stb |
| $G_p$ | 1100000000 scf |
| $W_p$ | 50000 stb |
| $S_{wi}$ | 0.2 |
| $c_w$ | 0.0000015 per psi |
| $c_f$ | 0.000001 per psi |

| PVT | 3000 psia | 2800 psia |
|---|---|---|
| $B_o$ rb/stb | 1.58 | 1.48 |
| $R_s$ scf/stb | 1040 | 850 |
| $B_g$ rb/scf | 0.0008 | 0.00092 |
| $B_t$ rb/stb | 1.58 | 1.655 |
| $B_w$ rb/stb | 1.0 | 1.0 |

The book prints $R_p$ 1100 scf/stb, $W_e$ 411281 bbl, a variant of 417700 bbl when rock and fluid expansion is neglected, a net influx of 361281 bbl, a net withdrawal of 1710000 rb, and four drive indices: DDI 0.4385, SDI 0.3465, WDI 0.2112, EDI 0.0038. Those printed values are the thing you are checking against, so write them down before you compute anything, not after.

## Worked example: every term, in order

**Withdrawal.** From lesson 1, $R_p = 1100.00000000000$ scf/stb and

$$F = N_p \left[ B_t + B_g (R_p - R_{si}) \right] + W_p B_w = 1760200.00000000 \ \text{rb}$$

**Oil expansion.** Above or below the bubble point the definition is the same, the two phase factor minus its initial value:

$$E_o = B_t - B_{ti} = 1.655 - 1.58 = 0.0750000000000000 \ \text{rb/stb}$$

**Gas cap expansion.** From lesson 2:

$$E_g = \frac{B_{ti}}{B_{gi}} (B_g - B_{gi}) = 1975 \times 0.00012 = 0.237000000000000 \ \text{rb/stb}$$

**Rock and connate water expansion.** With the $(1+m)$ factor and the bracket grouped as $S_{wi} c_w + c_f$:

$$E_{fw} = B_{ti}(1+m)\frac{S_{wi}c_w + c_f}{1 - S_{wi}}\Delta p = 1.58 \times 1.25 \times \frac{0.0000013}{0.8} \times 200$$

$$E_{fw} = 0.000641875000000000 \ \text{rb/stb}$$

**Water influx, by subtraction.** Everything else is now known, so rearrange the balance:

$$W_e = F - N \left( E_o + m E_g + E_{fw} \right)$$

$$W_e = 1760200 - 10000000 \times \left( 0.075 + 0.059250 + 0.000641875 \right)$$

$$W_e = 1760200 - 1348918.75 = 411281.250000001 \ \text{bbl}$$

Against the printed 411281 bbl. The trailing digits are floating point, not disagreement.

That is the first of the three values the Expert capstone grades from this fixture: **$W_e$ = 411281.250000001 bbl**, graded to a tolerance of 500 bbl. The tolerance is wide because the printed number is rounded to whole barrels and because a reader who carries four significant figures through the intermediates should still pass.

## The variant the book also prints, and what it is for

Ahmed prints a second influx, 417700 bbl, obtained by dropping the rock and connate water term. Compute it:

$$W_e' = F - N \left( E_o + m E_g \right) = 1760200 - 1342500 = 417700.000000000 \ \text{bbl}$$

The difference between the two published numbers is

$$417700 - 411281.25 = 6418.74999999977 \ \text{bbl}$$

which is exactly $N E_{fw}$. That is worth more than it looks. The book gives you two printed numbers whose difference isolates a single term, so the pair is a test of your $E_{fw}$ convention that does not depend on trusting either number on its own. Get the $(1+m)$ factor wrong, or group the compressibilities as $S_{wi}(c_w + c_f)$, and your two variants will still differ by something, but not by 6418.75 bbl. The fixture's own provenance note makes exactly this argument, and it is why this example anchors the engine's $(1+m)$ convention and its compressibility bracket rather than merely its final answer.

Note also the size of the thing. The rock and connate water term is 0.475844078822390 percent of the total expansion on this tank, against 39.2996108949418 percent on the undersaturated Ekene tank. Below the bubble point, with gas coming out of solution and a gas cap expanding, the rock has almost nothing left to contribute. That is not a general rule about $E_{fw}$ and it is not a licence to drop it. It is what happens when the other expanders get large.

## What this benchmark does and does not certify

The engine's validation string for the gas cap plus pot aquifer path names this example and reports the terms and the printed indices reproduced. Read its scope note carefully, because it is unusually honest: the published truth is a single pressure step with $N$ given, so it anchors the combined balance term math and the drive indices, and nothing else. The regression that recovers $N$ when nobody gives it to you is gated separately, by a synthetic multi step round trip that recovers both the oil in place and the aquifer volume to numerical precision.

Two different claims, two different pieces of evidence. A benchmark on a one step example with the answer supplied cannot tell you whether a regression converges, and a synthetic round trip cannot tell you whether the term definitions match the literature. The engine needs both, and it says so. When you cite a tool's validation, cite the claim, not the badge.

## Exercise

Rework the influx with the compressibility bracket misread as $S_{wi}(c_w + c_f)$, which is the single most common slip in this term and the one the Associate tier warned you about on a different tank.

Compute the wrong bracket, the wrong $E_{fw}$, and the water influx it produces. You should find a bracket of $5.00000000000000 \times 10^{-7}$ against the correct 0.0000013, a term error of $-61.5384615384615$ percent, and an influx of 415231.250000000 bbl against the correct 411281.250000001 bbl.

Now the part that matters. The term was wrong by more than sixty percent, but the influx moved by only 0.960413342451123 percent, which is inside the noise of any real aquifer estimate. Say in two sentences where that error would show up in a form you could actually catch, and why the drive indices are a better detector of it than the influx is. Then check yourself: the expansion index computed from the wrong bracket is 0.00144354461466495, which rounds to 0.0014 against the book's printed 0.0038.
