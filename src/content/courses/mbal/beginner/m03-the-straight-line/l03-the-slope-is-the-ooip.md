# The slope is the OOIP

The engine has fitted the six Ekene points and reports four numbers about the line. Learn to read all four, because three of them are usually ignored and each of the three can save you from publishing a wrong booking.

| quantity | value | unit |
|---|---|---|
| slope | 12139208.1074968 | stb |
| intercept | -6.11180439591408e-10 | rb |
| R squared | 1.00000000000000 | none |
| points in fit | 6 | none |

## The slope

The slope is the original oil in place, $N = 12139208.1074968$ stock tank barrels. Twelve point one million barrels, from a pressure gauge and a production report.

It is worth saying plainly why the slope carries oil units and no other number on the plot does. Lesson 1 did the algebra: reservoir barrels divided by reservoir barrels per stock tank barrel leaves stock tank barrels. Here is the physical reading of the same statement. $E_t$ answers the question "how many reservoir barrels of space does one stock tank barrel of my original oil create when the pressure falls this far?" $F$ answers "how many reservoir barrels of space did I actually create?" Divide the second by the first and you have counted how many stock tank barrels of original oil there must have been. The slope is a count.

That is also why the number does not depend on which survey you use. Each survey asks the same question at a different pressure and gets the same count back.

## The intercept

The intercept is where the fitted line crosses the $F$ axis: how much withdrawal the model has to explain at the instant when nothing has yet expanded. Physically it must be zero, because at initial pressure nothing has been produced.

The engine does not impose that. It fits a free intercept and reports $-6.11180439591408 \times 10^{-10}$ rb, which is zero to the precision the arithmetic can carry. So the intercept is a test the tank passed rather than an assumption it was granted.

A materially non zero intercept is one of the most informative failures in this method. A positive one says withdrawal is being explained by something the expansion terms do not contain. A negative one says the opposite. Either way the tank in front of you is not the tank the model describes, and the slope you were about to publish is not an oil volume.

## R squared

$R^2 = 1.00000000000000$ on Ekene. That is the fraction of the variation in $F$ that the line accounts for, and on this dataset the line accounts for all of it.

Two warnings come attached to that number, and they matter more here than in most places you meet $R^2$.

The first is that a high $R^2$ tests straightness and nothing else. Straight is not the same as right, and lesson 4 shows a version of this tank where the plot is a perfect straight line with $R^2$ of one and the slope is 25.3658536585366 percent too high because one term was built wrongly. The regression cannot audit your inputs. It can only tell you whether they are self consistent.

The second is that $R^2$ is easy to earn on data that spans a wide range. Any six points that march steadily outward will look correlated. What earns confidence is not the value of $R^2$ but the residuals: are they small, are they patternless, and do they stay small at both ends of the line? On Ekene they are billionths of a barrel with alternating signs, which is as clean as this diagnostic gets.

## How sensitive is the answer

You will be asked to defend the slope, so know what a slip in it costs. One percent of $N$ is

$$0.01 \times 12139208.1074968 = 121392.081074968 \ \text{stb}$$

Ekene has produced $261475.039999678$ stb in total. So a one percent error in the slope is 46.4258772367404 percent of everything the field has ever produced. Material balance is a high leverage measurement: small movements in a slope are large volumes of oil, which is why the residuals and the intercept get checked before the slope gets quoted.

## Work it: how much data does the slope need

Fit the line on subsets of the Ekene surveys and see how quickly it settles. Using the same ordinary least squares the engine uses:

| points used | slope (stb) |
|---|---|
| surveys 1 and 2 only | 12139208.1074964 |
| surveys 1 to 3 | 12139208.1074966 |
| surveys 4 to 6 | 12139208.1074971 |
| all six | 12139208.1074968 |

Every subset returns the same twelve million barrels to fourteen significant figures, including a two point fit from the first year of production and a three point fit that never sees the first year at all.

Read that carefully, because it is a property of this dataset rather than of the method. Noise free data with an exactly linear model needs only two points, and the extra four buy nothing. Real surveys carry gauge error, allocation error and pressure that has not fully built up, and then subset fits disagree, sometimes by tens of percent. Running the fit on the early half and the late half separately is the cheapest diagnostic in material balance, and the gap between the two slopes is a far better statement of your uncertainty than any confidence interval the regression will print.

## The shortcut that looks right and is not

A tempting simplification is to skip the expansion terms and plot $F$ against pressure drop, since pressure is measured directly and $E_t$ has to be computed. On Ekene that plot is also a perfect straight line, because $E_t$ on this tank is exactly proportional to drawdown. Its slope is

$$\frac{317926.842484584}{1103.99173733300} = 287.979367719385 \ \text{rb/psi}$$

That number is real and useful. It is the stiffness of the tank: 287.979367719385 reservoir barrels of space created per psi of drawdown. It is not an oil volume and it can never become one, because nothing in it knows how much a barrel of this particular oil expands per psi. The conversion from a reservoir volume to an oil count lives entirely in $E_t$, which is exactly the quantity the shortcut threw away.

## See it in the panel

{{panel:mb-tank-explorer}}

Read the four tiles: slope, intercept, R squared and the volumetric comparison. Confirm the slope against the table above. Then find the tile that reports the geoscience booking for the same field and note how close the two are. Module 5 is about that agreement and about what it is worth. For now, register only that the two numbers were produced by methods with no shared inputs.

## Exercise

Using $N = 12139208.1074968$ stb, work out what a 5 percent error in the fitted slope would amount to in stock tank barrels, and compare it against the cumulative production of $261475.039999678$ stb.

Then state, in one sentence each, what you would conclude if a real field's plot came back with an $R^2$ of 0.999 and an intercept of 40000 rb, and what you would check first.
