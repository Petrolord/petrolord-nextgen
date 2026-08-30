# What the line is not

Four things that look like a semilog straight line and are not one.

## A straight line is not evidence of radial flow

This is the central confusion of the tier, so it is worth stating flatly: on a semilog plot, several completely different flow regimes plot as straight lines, and a straight line by itself tells you nothing about which one you are looking at.

Data affected by wellbore storage plot as a curve, but a short stretch of any curve looks straight. A fractured well in linear flow plots as a curve on semilog axes that is easily mistaken for a line. A well between two parallel faults settles onto a straight semilog line whose slope means something quite different from the radial one.

The straight line is a consequence of radial flow. It is not a diagnosis of it. The diagnosis needs the derivative, which is the Professional tier's subject.

## A better fit is not a better answer

Least squares will fit a line to anything and report a coefficient of determination. On this buildup, fitting all forty points returns an r squared of 0.9004033647584739, which in most parts of engineering would be regarded as a decent correlation. The permeability behind it is wrong by a factor of nearly four.

The reason is that the points really do lie close to a line; the line is just not the radial one. Curvature that is gentle relative to the total pressure change makes very little difference to r squared and all the difference to the slope.

Module 5 returns to this with the full progression. For now: r squared measures how well a line describes the points you chose, and says nothing about whether those were the right points.

## The middle of the data is not automatically the right window

A common shortcut is to fit "the middle", on the reasoning that the early data are storage and the late data are boundaries. It is a reasonable instinct and it fails often enough to be dangerous.

In this buildup, the radial line is in the last third of the record, not the middle. In the fault fixture, the first radial stretch is early and there is a second, steeper straight line late that also looks like radial flow and reports half the permeability. In the fracture fixture there is no radial flow at all until nearly the end.

Where the line is depends on the well and the reservoir, which is what the test is trying to find out, which is why the choice cannot be made by a rule about position.

## A line through a buildup is not a line through a drawdown

Both are semilog lines with the same slope equation, but the horizontal axes are different quantities and the skin formulas differ correspondingly. A buildup is plotted against a transform of shut-in time that carries the production history in it, and a drawdown is plotted against elapsed time.

Putting buildup pressures on a drawdown's axis, or reading a buildup's one-hour pressure with a drawdown's skin formula, produces answers that are wrong by an amount that depends on the producing time and can be small enough not to look wrong. Module 4 keeps them separate deliberately.

## What actually justifies a window

Three things, in order of strength.

The derivative is flat over it. That is the real test, and it belongs to the next tier.

The window is bounded by identifiable events: after storage has died, before a boundary appears. Both of those can be argued for from the shape.

The answer is stable across reasonable variations of the window. If moving the start by half a decade moves the permeability by 40 percent, you have not found the line yet.

## The misconception to avoid

"If the points lie on a line, the analysis is valid." The points lying on a line is a necessary condition and not remotely a sufficient one. The single most useful habit this tier can leave you with is to ask, every time, which flow regime the line is supposed to represent and what evidence there is for that regime other than the line's own straightness.

## Exercise

Take the four claims in this lesson and turn each one into a question you could ask about a test report that arrived on your desk with a permeability, a skin and an r squared in it.

Then say which of your four questions the report you usually see would actually be able to answer.
