# Havlena and Odeh

Module 1 closed the Ekene books with a single division. Module 2 unpacked what went into it. You now have, for every survey, an underground withdrawal $F$ in reservoir barrels and a total expansion $E_t$ in reservoir barrels per stock tank barrel of original oil, and you know that for a closed tank the two are tied together by

$$F = N \, E_t$$

One division per survey gives one estimate of $N$. Six surveys give six estimates. The obvious question is what to do with six answers, and the obvious wrong move is to average them. Havlena and Odeh, in the pair of papers that gave this course its solver name, saw the better move: stop treating the balance as an equation to be solved once per survey, and start treating it as the equation of a straight line.

## The rearrangement

There is nothing to rearrange. That is the point, and it is the reason the idea took so long to be noticed. Look at $F = N E_t$ next to the schoolbook form of a line:

$$y = m x + c$$

Put $F$ on the $y$ axis and $E_t$ on the $x$ axis. Then $m$, the slope, is $N$, and $c$, the intercept, is zero. The material balance equation for a closed undersaturated tank is already the equation of a straight line through the origin. Every survey is a point on that line, and the oil in place is not something you compute from a point, it is the direction the whole set of points travels.

Check the units before you go any further, because the unit check is where the idea earns its keep. The slope of a plot is a $y$ unit divided by an $x$ unit:

$$\frac{\text{rb}}{\text{rb/stb}} = \text{rb} \times \frac{\text{stb}}{\text{rb}} = \text{stb}$$

Reservoir barrels divided by reservoir barrels per stock tank barrel leaves stock tank barrels. The slope of this plot is a volume of oil, in the units a reserves report is written in. Nothing else on the plot has those units. Not the axes, not any single point, not the average of the points. Only the slope.

## Why the line beats the division

Six divisions and one line use the same data, so what does the line add? Three things, and each one is a question the division cannot answer.

The first is a single answer instead of six. The regression uses every survey at once, weighting the outer points more heavily because they carry more leverage, and returns one number for the tank.

The second is a measure of agreement. If the six points sit on one line, they agree about $N$. If they scatter, they do not, and the scatter is telling you something about your pressure surveys or your production allocation.

The third is the one this module is really about. A straight line has two parameters, and the balance only gives you permission to use one of them. The intercept is supposed to be zero. When the fit comes back with an intercept that is not zero, or with points that curve away from the line, the tank is not behaving like a closed container, and you have learned that without knowing anything else.

## The engine does not assume the line goes through the origin

This matters more than it sounds. The material balance engine fits an ordinary least squares line with a free intercept, $y = m x + c$, and then reads the slope as the oil in place. It does not force $c$ to zero. So the intercept it reports is evidence rather than an assumption.

On Ekene it reports an intercept of $-6.11180439591408 \times 10^{-10}$ rb. That is a negative six tenths of a billionth of a reservoir barrel, which is machine zero: the arithmetic on a computer that stores about sixteen significant figures cannot land on exact zero and this is as close as it gets. The line found the origin on its own, from six points that were never told to aim there.

## Work two surveys

Take survey 3, 2021-07-01. Its coordinates on the plot are

$$x = E_t = 0.0151319339712031 \ \text{rb/stb}, \qquad y = F = 183689.695545334 \ \text{rb}$$

The line through this point and the origin has slope

$$\frac{183689.695545334}{0.0151319339712031} = 12139208.1074967 \ \text{stb}$$

Now take survey 6, 2023-01-01, at $E_t = 0.0261900809071921$ rb/stb and $F = 317926.842484584$ rb:

$$\frac{317926.842484584}{0.0261900809071921} = 12139208.1074968 \ \text{stb}$$

Those two points are more than a year and 500 psi apart in the life of the field. They sit on the same ray from the origin to fourteen significant figures. Do the same for the other four surveys and you get 12139208.1074970, 12139208.1074967, 12139208.1074967 and 12139208.1074969. Six points, one direction.

That constancy is the whole subject of lesson 4, and it is the single most useful diagnostic in material balance. For now, notice only that it is a stronger statement than any one division. A division says "if the tank is closed, it held twelve million barrels." Six identical divisions say "the tank is closed, and it held twelve million barrels."

## What Havlena and Odeh actually contributed

The straight line form is not a new equation. It is the old equation plotted honestly. What the two authors added was the discipline of choosing the axes so that the unknown you want becomes a slope or an intercept, and then letting the shape of the plot testify about the model.

That discipline generalises. When a tank imports water, the balance gains a term, the plot gains an axis, and the unknown you want moves from the slope to the intercept. The Professional tier works those forms. At this tier you need only the simplest one, and you need to hold on to the habit it teaches: choose axes that turn your unknown into a slope, then look at the plot before you look at the number.

## Exercise

Form the plotting pair $(E_t, F)$ for survey 2, 2021-01-01, and for survey 5, 2022-07-01, using the survey table from module 2. Divide $F$ by $E_t$ in each case and write both answers down to as many figures as your calculator carries.

Then answer two questions in words. First, what are the units of each answer, and why is that the unit of an oil volume rather than of a reservoir volume? Second, survey 5 has an $F$ six times larger than survey 2. Why does that not make its estimate of $N$ six times larger?
