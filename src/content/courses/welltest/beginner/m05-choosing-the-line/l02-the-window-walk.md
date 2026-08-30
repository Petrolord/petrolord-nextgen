# The window walk

The same forty points, five straight lines, and five different reservoirs.

{{panel:wt-buildup-explorer}}

## The experiment

Take the buildup. Fit a Horner line to every point. Then throw away the points before half an hour of shut-in and fit again. Then before one hour. Then before two.

Nothing else changes. Same data, same software, same reservoir parameters, same least-squares fit. The only variable is which points are in it.

| window | points | permeability (mD) | skin | r squared |
|---|---|---|---|---|
| every point | 40 | 23.12907021605519 | -2.6837412661474804 | 0.9004033647584739 |
| at or after 0.5 h | 23 | 69.67866147403232 | 4.085087112633436 | 0.9795049460140368 |
| at or after 1 h | 20 | 77.62210530894819 | 5.312614237354773 | 0.9979060289526748 |
| at or after 2 h | 16 | 81.1750471708196 | 5.8681757929772935 | 0.9997269766852961 |
| at or after 5 h | 13 | you produce this one | and this one | and this one |

The planted values are 85 mD and plus 6.5. The last row is the capstone and the panel will give it to you.

## Reading the table

Three things are happening at once and they are worth separating.

**The permeability rises monotonically towards the truth.** From under a quarter of it to within a few percent. Every point removed from the front of the window was pulling the line steeper.

**The skin rises with it and crosses zero.** At the widest window the skin is negative, which says stimulated. Somewhere between the widest window and the next one it crosses zero and becomes damage. That crossing is the subject of the next lesson.

**r squared rises too, and it rises last.** The jump from 0.9004 to 0.9795 corresponds to a permeability change from 23 to 70. The change from 0.9979 to 0.9997 corresponds to 78 to 81. By the time the fourth digit of r squared is moving, the permeability has almost stopped.

## Why it converges from below

The permeability approaches 85 and does not reach it. Even the narrowest window in the table is still a few percent low.

The reason is that the transition out of storage does not end abruptly. It decays, and there is always a little of it left in whatever window you choose. Every remaining trace of transition steepens the line slightly, and a slightly steeper line is a slightly lower permeability.

So the sequence approaches the truth from one side, monotonically, and stops when you run out of points. It never overshoots.

This is worth internalising because it is a bias rather than a scatter. The classical semilog analysis of a storage-affected buildup systematically UNDERSTATES permeability, by an amount that depends on how much of the transition you left in. It does not average out over many tests.

## When to stop narrowing

The obvious question is why not keep going: throw away everything before 20 hours and fit the last few points.

Two reasons not to. First, you run out of points and the fit becomes unstable; a line through four points has very little to say. Second, and more important, narrowing the window from the FRONT to escape storage eventually starts including whatever is happening at the BACK, which on a bounded reservoir is a boundary and on this one is nothing but is not guaranteed to be.

The right window is bounded at both ends by physics: after the storage transition, before the first boundary. Finding those two bounds needs the derivative, which is the next tier's subject. Without it, the walk above is the best available substitute: narrow until the answer stops moving.

## What the walk costs in a real decision

The widest window reports a reservoir less than a third as permeable as the real one and a stimulated well. The narrow window reports a good reservoir and a damaged well.

Those two reports send a development in different directions. The first says the rock is disappointing and the wells are fine. The second says the rock is good and the wells need work. Same test.

## The misconception to avoid

"Using all the data is more rigorous." Using all the data is correct only when all the data obey the model being fitted. Here they emphatically do not: three quarters of these points are describing a wellbore rather than a reservoir. Fitting them with a reservoir model is not rigour, it is a category error with a good r squared attached.

## Exercise

Open the panel and step through all five windows, recording the permeability each time.

Compute the percentage change in permeability between consecutive windows. Then say at which window you would have stopped, if you did not know the answer, and what evidence you would have used to justify stopping there.
