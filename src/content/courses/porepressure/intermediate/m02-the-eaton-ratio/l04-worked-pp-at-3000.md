# Worked: pore pressure at 3000 m

One graded number, assembled end to end with every digit accounted for. The capstone asks for the pore pressure at 3000 m below mudline; this lesson computes it the way you will in the exam, from the frame, the trend, the log and the exponent, and nothing else.

## Step 1: the frame at 3000 m

From the Associate tier's machinery, at 3000 m the hydrostatic is

$$P_h = 9.80665 \times (1025 \times 100 + 1030 \times 3000) \ \mathrm{Pa} = 31.307730125 \ \mathrm{MPa}$$

and the trapezoidal overburden integration gives $S = 66.83114254343904$ MPa. The stress budget at this depth is therefore

$$S - P_h = 66.83114254343904 - 31.307730125 = 35.523412418439044 \ \mathrm{MPa}$$

Nothing new so far; this is the tier below doing its job. Notice the hydrostatic came out exact to the last digit with the unrounded g, which is the same discipline as before: 9.80665, never 9.81.

## Step 2: the trend at 3000 m

The well's own trend, the one the capstone specifies:

$$\Delta t_n(3000) = 220 + (656 - 220)\, e^{-0.0006 \times 3000} = 220 + 436 \times e^{-1.8}$$

$e^{-1.8} = 0.16529888822158656$, so $\Delta t_n = 220 + 72.07031526461174 = 292.07031526461174$ us/m.

The Associate tier read this same trend at 2500 m and got the graded 317.2847498247154; this is the identical evaluation 500 m deeper.

## Step 3: the log at 3000 m

The sonic reads 297.76677602422825 us/m at the 3000 m sample. The rock is slow: 5.7 us/m above trend, which the Associate tier identified as the departure. Now it becomes a number with consequences.

## Step 4: the ratio and the fraction

$$r = \frac{292.07031526461174}{297.76677602422825} = 0.9808693876607879$$

$$r^3 = 0.9436991025399956$$

$$1 - r^3 = 0.0563008974600044$$

The grains keep 94.37 percent of the budget; the fluid takes 5.63 percent.

## Step 5: the pressure

$$OP = 35.523412418439044 \times 0.0563008974600044 = 1.9999999999999851 \ \mathrm{MPa}$$

$$PP = P_h + OP = 31.307730125 + 2.0 = 33.307730125 \ \mathrm{MPa}$$

That is the graded value, tolerance 0.01 MPa. The overpressure came out at 2 MPa to thirteen decimal places because the well encodes exactly 4 kPa per metre over the 500 m below the ramp top, and the whole pipeline, trend, ratio, cube, budget, ran in reverse of the encoding.

## What to notice about the arithmetic

The exact result printed as 1.9999999999999851, not 2. That tail of digits is double-precision floating point doing repeated exponentials and multiplications; it is fifteen decimal places of agreement, which is what exact means in a computed pipeline. If your own chain produces 1.99999999 or 2.00000001, you have reproduced the engine. If it produces 1.98, you have rounded an intermediate value too early, and the usual culprits are the exponential in step 2 and the cube in step 4: carry them to full calculator precision and round only what you report.

Reporting to three decimals, 33.308 MPa, sits comfortably inside the 0.01 tolerance. As at the Associate tier, the long values are what the engine holds, not a demand on your typing.

## The same chain, everywhere

The capstone grades this chain at 3000 m and at total depth, but the prognosis runs it at all 401 samples. Every point of the red curve you have been drawing in the panel is steps 1 through 5 at one depth. There is no other machinery. If you can defend this page, you can defend the curve.

## Exercise

Run the identical chain at 3500 m and state the pore pressure there. The engine's inputs at that sample: log 282.5387777324301 us/m, overburden 78.90215933224332 MPa. Compute the hydrostatic and the trend yourself; the ratio arithmetic follows.

Self check: hydrostatic is $9.80665 \times (1025 \times 100 + 1030 \times 3500)$ Pa $= 36.358154875$ MPa. Trend at 3500 m is $220 + 436\, e^{-2.1}$ with $e^{-2.1} = 0.1224564282529819$, giving 273.3910027183001 us/m. Ratio $273.3910027183001 / 282.5387777324301 = 0.9676229398047687$; cubed, 0.9059797014636933; fraction 0.0940202985363067. Budget $78.90215933224332 - 36.358154875 = 42.544004457243325$ MPa; overpressure $42.544004457243325 \times 0.0940202985363067 = 4.0$ MPa on the nose, and the pore pressure is $36.358154875 + 4 = 40.358154875$ MPa. The engine holds 40.35815487499998 MPa: agreement to ten decimals, and the 4 MPa is the ramp at 1000 m below its top, recovered.
