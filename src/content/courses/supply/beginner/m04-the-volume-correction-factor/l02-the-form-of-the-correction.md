# The form of the correction

{{panel:supply-tank-explorer}}

## Two lines of algebra

volumeCorrectionFactor computes the ASTM D1250 (API MPMS Chapter 11.1) form. It has two lines.

alpha = K0 / rho^2 + K1 / rho + K2

VCF = exp( -alpha x dT x (1 + 0.8 x alpha x dT) )

Here rho is the density at 15 C in kg/m3, and dT is the observed temperature less 15 C. K0, K1 and K2 are coefficients.

Read the second line first. dT is the observed temperature less 15 C, and alpha multiplies it. The product alpha x dT sits in the exponent twice: once on its own, and once more inside the bracket with 0.8 in it. The digest prints the VCF the form gives, and no size for either part. When dT is zero, at 15 C, the exponent is zero and the VCF is exactly one; the synthetic row prints 1.000000 there. Away from 15 C the VCF moves off one: on the synthetic row at 741.6 kg/m3 it reads 1.006736 at 10 C, 0.993236 at 20 C and 0.965932 at 40 C.

Now the first line. alpha is not one number for all fuels. It is built from the density at 15 C with three coefficients. They are what makes the form fit a commodity group, they are published per commodity group, and the engine ships none and has no default. The next lesson reads what it does when they are missing.

## The synthetic row

To show the form working, this course uses SYNTHETIC coefficients, invented for this course and not any commodity group's published row:

K0 = 520, K1 = 0.3, K2 = 0

They show the form only. No stock in the course is corrected with them.

## The form with density swept

Here the temperature is held at 31.5 C and the density is swept:

| density kg/m3 | alpha | VCF (synthetic) |
| --- | --- | --- |
| 700 | 0.001489796 | 0.975246 |
| 741.6 | 0.001350036 | 0.977583 |
| 796.8 | 0.001195545 | 0.980162 |
| 846.3 | 0.001080514 | 0.982080 |
| 900 | 0.000975309 | 0.983832 |

Read the alpha column. It falls as the density rises, from 0.001489796 at 700 kg/m3 to 0.000975309 at 900 kg/m3. That is the first line of the form at work: density appears under K0 and K1, so a denser product has a smaller alpha on this row. The VCF column moves the other way, from 0.975246 to 0.983832. A smaller alpha puts a smaller product alpha x dT into the exponent at the same temperature, and the printed VCF sits closer to one.

In the temperature sweep of the previous lesson, alpha stayed at 0.001350036 in every row. That is also the form speaking. alpha depends only on density and the coefficients, and temperature enters the second line alone.

No AKODO stock is corrected with this row. The form is taught so you can read a VCF as two measured inputs, density and temperature, plus one published input, the coefficients, and know which to look for when a VCF is missing or disputed.

In the panel, open the SYNTHETIC box, hold the temperature at 31.5 C and slide the density from 700 kg/m3 to 900 kg/m3.

## Exercise

Read the density sweep at 700 kg/m3 and at 900 kg/m3: alpha and the synthetic VCF at each. Say which way each column moves as the density rises, and which line of the form makes alpha depend on density.

Self check: alpha reads 0.001489796 at 700 kg/m3 and 0.000975309 at 900 kg/m3, and the VCF reads 0.975246 and 0.983832. The first line, alpha = K0 / rho^2 + K1 / rho + K2, puts density in alpha.
