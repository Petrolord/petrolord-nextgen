# Beyond the valve is not the same as not given

There are two ways for a travel check to end up without a maximum flow travel, and a tool that reports both of them the same way has thrown away the only thing that distinguishes a design problem from a missing input.

## The two states

The engine reports them as separate states. A maximum flow beyond the valve reports the state `beyond the valve`. A maximum flow not given reports the state `not given`.

Look at what the rest of each result does. On the case where the maximum flow is beyond the valve, the minimum travel is 47.956430 percent open, the normal is 74.737770 percent open, all 3 checks ran, the verdict is false and there is 1 warning. On the case where no maximum flow was given, the minimum travel is 47.956430 percent open, the normal is 74.737770 percent open, 2 of the 3 checks ran and the verdict is null with 0 warnings.

## Reading the difference

The first case is an answer. The check ran, it found that the duty asked of the valve is past what the trim can pass, and it returned a failing verdict and a warning. That is a finding about the design, and the action on it is to select a larger valve or a different trim.

The second case is a question. The check could not run, because the information it needs never arrived. Nothing at all has been established about whether this valve can pass its maximum duty, and the action on it is to go and get the flow.

Those two actions have nothing in common, which is why collapsing both into a single empty result is such an expensive simplification. A blank in a results table reads as absence, and absence reads as nothing to do.

## The same distinction on the low side

The minimum flow side carries it too. The case where the minimum flow is hard against the seat returns a travel of 0.000000 percent open, all 3 checks run, the verdict is false and there is 1 warning. The case where no minimum flow is given returns 2 of the 3 checks run and a verdict of null.

A travel of 0.000000 percent open is a number the engine computed and is prepared to defend. A missing minimum flow produces no travel at all. Both look like a gap at the bottom of the range on a quick read, and only one of them is a statement about the valve.

The general rule behind both pairs is that a result has to carry its own coverage. A number, a refusal and an absence are three different things, and a table that renders all three as an empty cell has destroyed the distinction before any reader gets to it.

## Exercise

Write down the state the engine reports for a maximum flow beyond the valve and for a maximum flow that is missing. For each of those two cases, write down how many checks ran, the verdict and the number of warnings. Then say what a reviewer should do next on each one.
