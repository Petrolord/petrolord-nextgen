# Vsh transforms

The gamma ray index from the previous lesson is a normalised radioactivity, a number between 0 and 1. Shale volume, $V_{sh}$, is a volume fraction of rock. The function that converts one into the other is called a Vsh transform, and choosing it is the second interpretation decision of this module.

## Why IGR overstates clay

Empirical core studies going back to Larionov in the late 1960s found that in most sands, especially geologically young ones, the measured clay volume is lower than IGR at every point except the two ends. A sample with IGR of 0.5 typically contains much less than 50 percent clay.

The physical reasons are worth understanding rather than memorising. Radioactive elements concentrate preferentially in the clay fraction, so a little dispersed clay produces a lot of signal. Fine micas, feldspar grains and adsorbed uranium add radioactivity without adding clay volume. Compaction and diagenesis change the relationship with age, which is why the correction depends on rock age. The result is that the true $V_{sh}$ versus IGR curve sags below the one-to-one line, and it sags most in young, unconsolidated tertiary sediments.

## The transform families

All the common transforms agree at the end points, $V_{sh}(0) = 0$ and $V_{sh}(1) = 1$, and differ in how far they sag in between:

* Linear: $V_{sh} = IGR$. The most conservative (pessimistic) choice, treating the index as the volume directly. Still used for quick looks and as an upper bound.
* Larionov, tertiary rocks:

$$V_{sh} = 0.083\,(2^{3.7\,IGR} - 1)$$

  The standard for young clastic sections, and the transform used for the typewell interpretation.
* Larionov, older rocks: $V_{sh} = 0.33\,(2^{2\,IGR} - 1)$. A milder correction for consolidated pre-tertiary rocks.
* Clavier: an intermediate empirical curve of similar shape, sitting between linear and Larionov tertiary. You should recognise the name; the formula is not needed at this tier.

The names are conventions from the original core calibrations. In a real study you would pick the transform that best matches local core data if you have it, or the age-appropriate default if you do not.

## Worked example

Compute Larionov tertiary for $IGR = 0.50$, step by step:

1. Exponent: $3.7 \times 0.50 = 1.85$.
2. Power of two: $2^{1.85} = 3.605$.
3. Subtract one: $3.605 - 1 = 2.605$.
4. Scale: $0.083 \times 2.605 = 0.2162$.

So a sample that sits half way up the gamma ray scale carries an estimated clay volume of about 22 percent, less than half the linear estimate of 50 percent. That factor-of-two difference flows straight into net pay: with the course cutoff of $V_{sh} \le 0.5$, a sample at IGR 0.5 passes comfortably under Larionov tertiary and sits exactly on the fence under the linear rule.

Two more points on the same curve, which you can verify with a calculator:

* $IGR = 0.25$: $2^{0.925} = 1.899$, so $V_{sh} = 0.083 \times 0.899 = 0.0746$.
* $IGR = 0.75$: $2^{2.775} = 6.845$, so $V_{sh} = 0.083 \times 5.845 = 0.4852$.

Notice the shape: the transform hugs zero across the whole clean-to-moderate range and then climbs steeply toward 1. Small amounts of radioactivity are forgiven; only strongly radioactive samples are called shaly.

## Checking the end points

It is a good habit to confirm any transform behaves at the ends. At $IGR = 0$: $2^0 = 1$, so $V_{sh} = 0.083 \times 0 = 0$. At $IGR = 1$: $2^{3.7} = 13.00$, so $V_{sh} = 0.083 \times 12.00 = 0.996$, which is 1 within the precision of the empirical constant. That 0.996 will reappear in the next lesson when we evaluate the typewell shale.

## Choosing in practice

For this course the choice is made for you: the typewell is a young clastic section and the interpretation uses Larionov tertiary throughout, matching the app's default. In your own work the decision tree is short: core calibration if available; otherwise Larionov tertiary for tertiary basins (the Niger Delta and the Gulf of Mexico are classic examples), Larionov older rocks for consolidated pre-tertiary sections, and linear when you deliberately want a conservative upper bound on clay.

Keep one principle in mind: the transform only reshapes the index. If the clean and clay anchors from the previous lesson are wrong, no transform will rescue the result.

## Exercise

Compute $V_{sh}$ by Larionov tertiary for IGR values of 0.10 and 0.90, and compare each against the linear transform. As a self-check: for 0.10, $2^{0.37} = 1.292$ and $V_{sh} = 0.024$, far below the linear 0.10; for 0.90, $2^{3.33} = 10.06$ and $V_{sh} = 0.752$, now much closer to the linear 0.90. State in one sentence why the gap closes at high IGR.
