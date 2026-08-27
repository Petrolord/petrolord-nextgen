# Reading semilog plots

Decline analysts spend their working lives looking at one particular plot: rate on a logarithmic vertical axis against time on a linear horizontal axis. It is called a semilog plot, and it is not a presentation choice. It is a diagnostic instrument that turns the question "which Arps model is this?" into the question "is this line straight?", which your eye can answer in a second.

## Why the log axis straightens the exponential

Take the exponential rate equation and take logarithms of both sides. In base ten,

$$\log_{10} q(t) = \log_{10} q_i - \frac{D_i}{\ln 10}\,t$$

That is the equation of a straight line in $t$: intercept $\log_{10} q_i$, slope $-D_i/\ln 10$. Since the vertical axis of a semilog plot is spaced by $\log_{10} q$, an exponential decline plots as a perfectly straight, falling line. Nothing else in the Arps family does.

The $\ln 10$ appears because the model decays naturally and the axis is ruled in decades. It is a fixed conversion factor, $\ln 10 = 2.30258509299405$, and it is the only awkward constant in this lesson.

## Derive Ekene-1's slope by hand

Ekene-1 has $D_i = 0.0012$ per day. Work in years, because that is how slopes are quoted in practice: how far does the line fall, in log cycles, per year?

The nominal decline per year is $0.0012 \times 365 = 0.438$. Divide by $\ln 10$:

$$\text{slope} = \frac{0.438}{2.30258509299405} = 0.190220983073624 \text{ log cycles per year}$$

I ran that division rather than trusting my memory of it, and 0.190220983073624 is the value. Now check it against the rate table, which is the point of the exercise. Ekene-1 starts at 120 stb/d and $\log_{10} 120 = 2.07918124604762$. After one year it is at 77.4390939428753 stb/d and $\log_{10} 77.4390939428753 = 1.88896026297400$. The difference is

$$2.07918124604762 - 1.88896026297400 = 0.190220983073624$$

the same number to the last digit. Do the second year too: $\log_{10} q(730) = 1.69873927990038$, and $1.88896026297400 - 1.69873927990038$ is again 0.190220983073624. Equal time steps, equal drops on the log axis. That is what straight means.

Stop and run the division yourself: 0.438 divided by 2.30258509299405. If your calculator gives 0.19022, you have just measured the slope of a decline curve without plotting anything.

Two more readings fall straight out of that slope. A full log cycle, a factor of ten in rate, takes $1/0.190220983073624 = 5.25704359131061$ years, equivalently $\ln 10 / D_i = 1918.82091082837$ days; at that day Ekene-1 is producing exactly 12 stb/d, one tenth of where it began. And the slope per day, if you prefer the raw axis units, is $-0.0012/\ln 10 = -0.000521153378283902$ log cycles per day.

## What the other two models look like

Harmonic and hyperbolic wells do not plot straight. They start out steep and bend upward, flattening as time goes on, because their instantaneous decline is shrinking. The bend is always in that direction: **concave up, never down.** A decline curve that bends downward on semilog is telling you the well is fading faster than the Arps family allows, which means something changed.

Measure the bend on Ekene-5, the harmonic well ($q_i = 100$, $D_i = 0.0015$ per day), by taking the same year-by-year log drops:

| Year | $\log_{10} q$ at start | $\log_{10} q$ at end | Drop (log cycles) |
|---|---|---|---|
| 1 (t = 0 to 365) | 2.00000000000000 | 1.81036934230784 | 0.189630657692156 |
| 2 (t = 365 to 730) | 1.81036934230784 | 1.67881597269769 | 0.131553369610159 |
| 3 (t = 730 to 1095) | 1.67881597269769 | 1.57798500402054 | 0.100830968677150 |

Read the last column downward. The drop shrinks every year: the line is getting flatter, which is the visual signature of the whole harmonic story from lesson 2.

Now compare the first row with Ekene-1's 0.190220983073624. The harmonic well's first-year drop is 0.189630657692156, different from the exponential well's by 0.000590325381468665 log cycles. Over the first year these two utterly different models are, on a semilog plot, indistinguishable to the naked eye. The models separate later, in the tail, which is exactly the part of the curve you extrapolate and cannot yet see. Hold on to that discomfort; module 4 turns it into a working caution and the Professional tier makes it a central theme.

Ekene-3, the $b = 0.5$ well, bends the same way and harder: its yearly log drops run 0.270265302753550, then 0.205826903504041, then 0.166275848347037. Ekene-6, with $b = 0.35$ and a gentler $D_i$, runs 0.149179530770709 then 0.133153946511981.

## Read it in the panel

{{panel:dca-fit-explorer}}

Put the rate axis on Semilog and step through the four producers with the window on Primary. Ekene-1 is a ruler-straight line. The other three curve upward, and across these four wells the amount of curve happens to order with $b$: Ekene-6 at $b = 0.35$ is nearly straight, Ekene-3 at $b = 0.5$ is visibly bent, and Ekene-5 at $b = 1$ is the most bent of all. Keep in mind that each well also carries its own $D_i$, which sets how steep the line is before any bending; $b$ is what makes it bend.

Then flip the same wells to Linear. Every one of them now looks like a sagging curve and they all look alike. That is the argument for the semilog plot in one gesture: the linear axis shows you how much oil, the log axis shows you which model. You need both, for different questions.

## The misconception to retire

"The curve bends upward, so the well is recovering." It is not. On a semilog plot, upward bending means the rate is still falling but falling more slowly than an exponential would. The rate is decreasing at every instant in every Arps model. A genuine recovery, a rate that actually rises, is not a bend in the line at all; it is the line turning around, and when you see that on real data you have left the Arps family entirely. Ekene-1 does exactly that after the flood starts, which is why module 1 fenced the primary window off before you ever reached this plot.

## Exercise

By hand: compute Ekene-1's total log-cycle drop over two years, both as $2 \times 0.190220983073624$ and as $\log_{10} 120 - \log_{10} 49.9734439224456$, and confirm the two agree at 0.380441966147248. Then, using the slope alone, estimate the day on which Ekene-1's rate first falls to 60 stb/d, remembering that halving is a drop of $\log_{10} 2 = 0.301029995663981$ log cycles, and check your answer against the 577.622650466621 day half-life from lesson 1.
