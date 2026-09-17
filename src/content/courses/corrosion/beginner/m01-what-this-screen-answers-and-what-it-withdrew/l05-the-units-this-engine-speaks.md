# The units this engine speaks

{{panel:fc-chemistry-explorer}}

The engine works in the units the correlations behind it are published in. Temperature in degrees Celsius, pressures in bar, rates in millimetres a year, velocity in metres a second, diameter in metres, density in kilograms a cubic metre and viscosity in pascal seconds. The studio in front of it takes field units and converts, which is why a number you read on the screen has two layers behind it rather than one.

The shipped case shows every conversion at work. A temperature typed as 140 F reaches the engine as 60.000000 C. A pressure typed as 725 psig reaches it as 51.000427 bar. Carbon dioxide typed as 3 mol% reaches it as a mole fraction of 0.030000 and hydrogen sulphide typed as 0.1 mol% reaches it as 0.001000. A velocity of 10 ft/s becomes 3.048000 m/s, a line inside diameter of 6 in becomes 0.152400 m, a density of 56 lb/ft3 becomes 897.036000 kg/m3 and a viscosity of 1 cp becomes 1.000000 mPa s. An allowance typed as 0.125 in becomes 3.175000 mm. On the way back out every rate is printed in both units, so 0.754524 mm/yr appears beside 29.705656 mpy.

## One factor is truncated

The studio converts a psig pressure to bar by adding the atmospheric offset and dividing by 14.5038. The engine exports the exact factor, which is 14.503773800722 and is exact by the definition of the bar and of the pound force. The studio's divisor is therefore larger than the exact factor by 1.806e-6 as a fraction.

Measured rather than argued, that is worth the following on the shipped case. Through the studio's divisor the total pressure is 51.000427474179 bar and the rate is 0.754523654262 mm/yr. Through the engine's exact factor the same case gives 51.000519600160 bar and 0.754524736514 mm/yr. The two rates differ by 1.434e-6 as a fraction, which is far below anything a screening decision turns on and is still far above zero.

That gap is the reason no graded field in this course is converted through the studio. All three capstones state their conditions in the engine's units and say so on the page. Grading a learner on which rounding an app happens to carry would measure the app instead of the corrosion.

## The same truncation in a threshold

A sour screening threshold of exactly 0.05 psia is a figure people carry around, and it is not the one this engine works to. The value the engine uses is 0.050763208303 psia, and a threshold of exactly 0.05 psia would be 0.003447378640 bar, which is 1.503467 percent below the threshold the engine uses. The engine derives and prints both numbers so a reader can see which one a comparison is made against.

## Exercise

Take the shipped pressure of 725 psig and convert it to bar twice, once by dividing by 14.5038 and once by dividing by 14.503773800722, then compare your two answers against the 51.000427474179 bar and 51.000519600160 bar this lesson prints. Say at which decimal place your two answers first differ, and then say whether that difference would change the film risk word on the screen or the rate you would act on.
