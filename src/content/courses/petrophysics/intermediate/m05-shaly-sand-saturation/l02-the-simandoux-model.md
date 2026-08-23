# The Simandoux model

Simandoux (1963) is the oldest shaly-sand equation still in daily use, and the one this course reaches for first. It comes from laboratory experiments on artificial sand and clay mixtures, and its idea is exactly the parallel-path picture from the previous lesson: total conductivity is the clean Archie term plus a clay term, added together.

## The equation

The engine uses the classic form, in conductivity terms:

$$\frac{1}{R_t} = \frac{\phi^m S_w^2}{a R_w} + \frac{V_{sh} S_w}{R_{sh}}$$

Read it path by path. The first term on the right is Archie rearranged: brine conductivity scaled by porosity and saturation. The second term is the clay path: shale volume divided by shale resistivity, scaled by $S_w$. Setting $V_{sh} = 0$ deletes the second term and leaves Archie with $n = 2$ exactly, which is why the model returned the clean-sand 0.4324 at 2020 m in the previous lesson.

Notice that the saturation exponent does not appear as a free $n$; the quadratic $S_w^2$ carries an inherent $n = 2$. If your basin's core work demands a different $n$, Simandoux in this classic form cannot honour it. That is a real limitation and worth stating in a report.

## Solving for saturation

Because $S_w$ appears both squared and linearly, the equation is a quadratic. Define two helper quantities:

$$C = \frac{\phi^m}{a R_w}, \qquad D = \frac{V_{sh}}{R_{sh}}$$

Then the equation reads $C S_w^2 + D S_w - 1/R_t = 0$, and the positive root is:

$$S_w = \frac{-D + \sqrt{D^2 + 4C/R_t}}{2C}$$

The negative root has no physical meaning and is discarded. The structure is worth a moment: $D$ is the clay conductivity, and it enters with a negative sign in the numerator. The more conductive the clay path, the more of the measured signal is explained without water, and the lower $S_w$ falls.

## Where the inputs come from

$V_{sh}$ is the linear transform from module one, a deliberate upper bound on clay. $R_{sh}$ is read directly from the log: find a thick, representative shale near the zone, confirm the deep resistivity is flat and unaffected by adjacent beds, and take that reading. On the typewell the thick shale reads a steady 2 ohm.m, so $R_{sh} = 2.0$. The remaining parameters $R_w$, $a$ and $m$ are the same Archie set validated by the Pickett fit in module four.

## Worked example

Evaluate Simandoux at the 2000 m shale point: $\phi = 0.1803$, $V_{sh} = 1.0$, $R_t = 2$ ohm.m, with $R_w = 0.05$, $a = 1$, $m = 2$, $R_{sh} = 2.0$. Step by step:

1. Clean-path coefficient: $C = \phi^2 / (a R_w) = 0.1803^2 / 0.05 = 0.032508 / 0.05 = 0.65016$.
2. Clay-path coefficient: $D = V_{sh} / R_{sh} = 1.0 / 2.0 = 0.5$.
3. The discriminant term: $4C/R_t = 4 \times 0.65016 / 2 = 1.30032$.
4. Square root: $\sqrt{D^2 + 4C/R_t} = \sqrt{0.25 + 1.30032} = \sqrt{1.55032} = 1.24512$.
5. Positive root: $S_w = (1.24512 - 0.5) / (2 \times 0.65016) = 0.74512 / 1.30032 = 0.5730$.

So Simandoux reads 57 percent water where Archie read 88 percent. The 0.5 subtracted in the numerator is the clay path doing its work: half the measured siemens per metre, in these units, came from the shale and is removed before water is blamed.

It is good practice to sanity-check the collapse to Archie as well. Set $V_{sh} = 0$ so $D = 0$: the root becomes $\sqrt{4C/R_t}/(2C) = \sqrt{1/(C R_t)}$, which is precisely Archie with $n = 2$. At 2020 m this gives back 0.4324.

## Behaviour and habits

Two behaviours to internalise. First, the correction scales with $V_{sh}/R_{sh}$, so a low shale resistivity makes the clay term strong; saline-water basins, where shales conduct well, are where Simandoux earns its keep. Second, because the model was calibrated with dispersed clay in mind, it is the usual default when clay is smeared through the pore system rather than layered.

The habit to build now: whenever you quote a Simandoux saturation, quote the Archie value beside it. The difference is the size of the correction, and a reviewer who can see the correction can judge it.

## Exercise

Evaluate Simandoux at a hypothetical shaly-sand sample with $\phi = 0.20$, $V_{sh} = 0.4$, $R_t = 5$ ohm.m, $R_w = 0.05$, $a = 1$, $m = 2$, $R_{sh} = 2.0$. Self-check the stages: $C = 0.04/0.05 = 0.8$, $D = 0.4/2.0 = 0.2$, $4C/R_t = 0.64$, $\sqrt{0.04 + 0.64} = \sqrt{0.68} = 0.82462$, and $S_w = (0.82462 - 0.2)/1.6 = 0.3904$. Then recompute with $V_{sh} = 0$ and confirm you get the Archie value $\sqrt{1/(0.8 \times 5)} = 0.5$. State in one sentence why the shaly-sand answer is lower.
