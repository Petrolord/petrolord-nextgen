# Nominal and effective decline

Ask an engineer how fast a well is declining and you will hear a percentage: "about 35 percent a year." Ask a second engineer about the same well and you may hear "43.8 percent a year," and both of them are right. They are quoting different quantities that share a name. This lesson pins down which is which, because the gap between them is large enough to move a reserves booking.

## Nominal decline is a rate, not a fraction lost

The $D_i$ in every Arps formula is the **nominal** decline: the instantaneous fractional rate of change of the rate. It is a speed, in units of one over time, and like any speed it can be quoted per day or per year without changing what it says. Ekene-1's is 0.0012 per day, which is $0.0012 \times 365 = 0.438000000000000$ per year.

What it is not is a haircut. Lesson 1 already showed the trap: $120 \times (1 - 0.438) = 67.44$ stb/d is not Ekene-1's one-year rate, which is 77.4390939428753 stb/d. The nominal decline describes the rate of loss at an instant, and the well slows its losses continuously as the rate falls, so applying the instantaneous rate for a whole year overstates the damage.

## Tangent effective decline

The **effective** decline is the honest annual haircut: the fraction of the rate actually gone after one year. For a well whose decline stays exponential, that fraction is

$$D_e = 1 - e^{-D_i \times 365}$$

with $D_i$ per day. This is called the **tangent** effective decline, because it converts the tangent to the curve, the instantaneous $D_i$, into a percentage as if the well went on declining exponentially at that rate for the year. For Ekene-1:

$$D_e = 1 - e^{-0.438} = 1 - 0.645325782857295 = 0.354674217142705$$

35.4674217142705 percent per year. Check it directly against the rate: $120 \times (1 - 0.354674217142705) = 77.4390939428753$ stb/d, which is exactly $q(365)$. For an exponential well the tangent effective decline and the true one-year drop are the same thing.

The same conversion applied to the other three producers' nominal declines:

| Well | $D_i$ (per day) | $D_i$ (per year) | Tangent $D_e$ |
|---|---|---|---|
| Ekene-1 | 0.0012 | 0.438000000000000 | 0.354674217142705 |
| Ekene-3 | 0.002 | 0.730000000000000 | 0.518091009909798 |
| Ekene-5 | 0.0015 | 0.547500000000000 | 0.421606010621992 |
| Ekene-6 | 0.001 | 0.365000000000000 | 0.305803349122021 |

Notice that the effective value is always smaller than the nominal, and that the gap widens as the decline gets steeper. Ekene-6 goes from 0.365 nominal to 0.3058 effective, a gap of about six points; Ekene-3 goes from 0.730 to 0.5181, a gap of over twenty. The conversion is a curve, not a fixed offset, so you can never convert between the two conventions in your head.

## Secant effective decline

Here is where the second convention comes in. For a hyperbolic or harmonic well, the tangent formula above is a statement about the first instant only, and the well does not spend the year declining at that instant's speed; it eases off. So the fraction of rate actually lost in the first year is smaller than the tangent number says.

The petroleum industry's standard alternative is the **secant** effective decline, which is simply what the rate table shows:

$$D_e^{\text{sec}} = 1 - \frac{q(1\text{ year})}{q_i}$$

A secant is a straight line through two points on the curve, and this quantity is exactly that: the drop between the two ends of the first year, ignoring the path. For the three non-exponential producers:

| Well | $q_i$ | $q(365)$ | Secant $D_e$ | Tangent $D_e$ |
|---|---|---|---|---|
| Ekene-3 | 150 | 80.5055750110695 | 0.463296166592870 | 0.518091009909798 |
| Ekene-5 | 100 | 64.6203554119548 | 0.353796445880452 | 0.421606010621992 |
| Ekene-6 | 90 | 63.8356049879382 | 0.290715500134020 | 0.305803349122021 |

For Ekene-3 the two conventions differ by 0.0547948433169276, nearly five and a half percentage points on the same well in the same year. Report the tangent figure where the audience expects the secant and you have overstated the well's decline by more than a tenth of its own value. For Ekene-1, which is exponential, the two are identical at 0.354674217142705, which is why the distinction is invisible until a curved well arrives.

## Worked: Ekene-3 both ways

Do this one by hand. Start from $D_i = 0.002$ per day.

Tangent: $0.002 \times 365 = 0.730$, then $e^{-0.730} = 0.481908990090202$, so $D_e = 1 - 0.481908990090202 = 0.518091009909798$.

Secant: from the previous lesson, $q(365) = 150/1.365^2 = 80.5055750110695$ stb/d, so $D_e^{\text{sec}} = 1 - 80.5055750110695/150 = 0.463296166592870$.

Stop and confirm the second one on your calculator: divide, subtract from one. The number you get, 0.4633, is the fraction of Ekene-3's initial rate that is genuinely gone after twelve months. The 0.5181 is a statement about the curve's slope on day zero, converted to annual units.

## The industry reference

This is not a house convention. **SPEE REP #6, "Definition of Decline Curve Parameters," version 1.0, Spring 2002, Table 1 on page 7** tabulates the conversions between nominal and effective decline for a range of $b$ values, and it exists precisely because the two definitions were being mixed in reserves reports. Its worked row at a nominal 10 percent per year gives a tangent effective decline of **9.51625819640405 percent** and, for $b = 1$, a secant effective decline of **9.090909 percent**. You can reproduce both: $1 - e^{-0.10} = 0.0951625819640405$, and for the harmonic well $1 - 1/(1 + 0.10) = 0.0909090909090909$. When the Expert tier takes up governance, this document is the anchor.

## The misconception to retire

"Effective decline is just nominal decline expressed as a percentage." No. Turning 0.438 per year into "43.8 percent per year" is a change of notation and leaves you with a nominal number wearing a percent sign. Converting to effective requires the exponential, or the rate table, and produces a genuinely different value. Whenever you write a decline percentage down, write which convention it is next to it, and if it is effective, write tangent or secant too.

## Exercise

From $q_i = 90$ stb/d, $D_i = 0.001$ per day and $q(365) = 63.8356049879382$ stb/d, compute Ekene-6's tangent effective decline and its secant effective decline by hand, and check both against the tables above. Then explain, in one sentence, why the gap between the two conventions is smaller for Ekene-6 than for Ekene-3.
