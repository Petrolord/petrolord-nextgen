# Four knobs, four targets

Equal counts, and why that does not mean an exact fit.

## The naive expectation

Four unknowns and four equations should have a solution. That is true for a linear system with independent equations.

Neither condition holds here. The system is strongly non-linear, and the targets are not independent because three of them share the stock-tank volume.

## What the counts actually are

**Four knobs**, of which one, the volume shift, cannot affect the phase equilibrium at all. So the equilibrium is being fitted by three.

**Four targets**, of which three are coupled through one quantity. So there are fewer than four independent pieces of information about the surface.

Counted properly the problem is closer to three effective parameters against something under four effective constraints, which is a well-posed least-squares problem rather than a solvable system.

## The frontier

The achievable combinations of the four errors form a surface. Points on it trade against each other; points inside it are not reachable.

The regression finds a point on that surface, chosen by the objective. Change the weights and it finds a different point on the same surface. There is no setting of any weights that reaches a point inside it.

This is the honest shape of a bounded tuning problem and it is worth being able to say to somebody who asks why the fit is not exact.

## What would make it exact

**More knobs.** Splitting the plus fraction into several pseudo-components gives the composition of the stock tank liquid room to change independently of its density, which breaks the coupling. It also gives the regression enough freedom to fit noise.

**Fewer targets.** Fitting two targets with four knobs is exactly solvable and tells you very little, because the model then reproduces two numbers by construction and has been checked against nothing.

Neither is obviously an improvement. Both are worth knowing as options.

## The relationship to the residual

The sum of squared residuals fell by a factor of 23.157104602764026, from 0.007631032308112891 to 0.00032953309314853003.

That remaining residual is not solver error. It is where the frontier is. Running the solver longer, or from a different start, lands in the same place, because the limit is the parameterisation rather than the optimisation.

Distinguishing "the solver stopped early" from "the model cannot do better" matters, and the way to tell is to restart from a different point and see whether it converges to the same residual.

## The parallel elsewhere in the series

The simulation course calibrated one parameter against one target and its lesson was that one degree of freedom fixes one number: it could match the booked volume or the booked area, and not both.

This is the same statement with larger numbers. Four coupled targets and four constrained knobs do not give four exact matches, for the same reason one knob does not give two.

The general form: you can match as many independent quantities as you have independent parameters, and both words are doing work.

## The misconception to avoid

"If the fit is not exact, add parameters until it is." An exact fit to four coupled targets requires enough freedom to reproduce the measurement noise as well as the signal, and a model that has done that predicts badly. The residual at the frontier is information about the parameterisation, and the response to it is to understand it rather than to remove it.

## Exercise

First, explain why four knobs and four targets do not give an exact fit here, naming both reasons.

Second, describe the experiment that distinguishes a solver that stopped early from a model that has reached its frontier.
