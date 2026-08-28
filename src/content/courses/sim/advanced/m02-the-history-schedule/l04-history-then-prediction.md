# History then prediction

A deck can carry both a history and a forecast, and the join between them is where two different sets of rules meet.

## The two halves

**History**, 36 periods, wells under WCONHIST and WCONINJH with observed rates, advanced by DATES on calendar months.

**Prediction**, one TSTEP block of 60 steps of 30.4375 days, wells under WCONPROD and WCONINJE with targets and limits.

The join is the moment the last DATES closes the history and the first TSTEP begins.

## What changes at the join

The control basis. Up to the join the wells are told what they did; after it they are told what to attempt.

That is a genuine discontinuity in the model's behaviour, and it shows in the output. A well producing an observed 32 stb/d on the last day of history and given a target of 1500 stb/d on the first day of prediction will jump, then fall back to whatever the reservoir and its pressure limit allow.

That jump is an artifact of the deck's design rather than a physical event, and a plot that runs history and forecast together without marking the join invites a reader to interpret it as one.

## Choosing the forecast controls

The honest default is to continue what the field was doing. If the last observed rate was 32 stb/d, a forecast starting at 1500 stb/d is asserting a step change nobody has planned.

Ekene's deck uses round numbers for the prediction because the prediction is illustrative rather than a real forecast, and the study should say so. A real forecast would carry the operating plan: current rates, planned interventions, facility limits.

## The other thing that changes

Time. History advances on calendar dates because the data has dates; prediction advances on uniform mean months because nothing in it is tied to a calendar.

So the report steps stop lining up with month ends at the join. That is fine and it surprises people reading a results file who expect every step to be a month.

## Why keep both in one deck

Because the forecast has to start from the history's end state, and the only way to get that state is to run the history.

A forecast run separately from an initialised state is possible through a restart, which is how long studies are usually organised: run the history once, save a restart file, and run many forecast cases from it. That is a performance optimisation and it changes nothing about the physics.

Ekene's deck keeps both in one file because it is small enough that the history costs seconds.

## What the join does not do

It does not reset anything. Pressures, saturations and cumulative volumes carry across continuously. Only the well control changes.

That means a mistake in the history is inherited by every forecast case run from it, which is the argument for getting the history right before running a single sensitivity.

## The misconception to avoid

"The forecast is independent of the history." It starts from the state the history produced, so every error in the history is an error in the forecast's initial condition. A history that put the water in the wrong place gives a forecast that breaks through at the wrong time, and no amount of forecast-side tuning fixes it.

## Exercise

First, name the two things that change at the history-to-prediction join and the two that do not.

Second, the last observed oil rate is about 32 stb/d per well and the forecast target is 1500 stb/d. Describe what the output will show at the join and say why it is an artifact rather than a result.
