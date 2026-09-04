# The pore volume idea

Why an acid volume is a pore volume multiplied by a number somebody chose.

{{panel:st-acid-explorer}}

## The volume that actually exists

Acid travels in pores. It does not travel through quartz grains. So the first honest question about a sandstone treatment is not "how much acid" but "how much space is there to fill out to where I want the acid to be".

Take the annulus of rock between the wellbore radius and the target front radius. Its bulk volume is the annular area times the interval height. Multiply by porosity and you have the PORE volume of that annulus, which is the amount of fluid it takes to fill it once.

That is the physical anchor of the whole calculation. Everything else is a correction to it.

## The factor, and what it is doing

The engine writes the planning volume as the pore-volume factor times that annular pore volume. The published cases use a factor of 1.5, so half as much acid again as a perfect fill would need.

The extra half is not chemistry. It is an allowance for the fact that displacement in a real interval is nothing like a piston. Acid fingers into the highest permeability streaks, it overrides on density contrast, it leaves the tight layers barely touched, and some of it is spent before it gets anywhere.

Set the factor to 1 and you have assumed perfect piston displacement of every pore in the annulus. Nobody gets that.

## What the factor is not

It is not stoichiometry. The engine tracks the acid front volumetrically and says so, with reaction chemistry, preflush design and mineralogy left out of scope and with the laboratory. You cannot recover an acid strength or a dissolving power from this number, because neither one went into it.

It is also not a safety factor in the structural sense. Multiplying by 1.5 does not make the job half again as likely to work. It makes the volume half again as large, and whether that helps depends on where the acid goes.

## The one refusal

The engine rejects a pore-volume factor that is not positive, and it rejects a porosity that is not strictly between 0 and 1. Both are guards against nonsense rather than judgements about design. A factor of zero would say the treated annulus needs no acid at all.

## Exercise

First, in the panel, change the pore-volume factor while holding everything else fixed, and confirm that the planning volume moves in direct proportion to it.

Second, on paper, write down three physical reasons the factor should be above 1, and say which of the three the engine could ever detect on its own. The answer is none of them, and being able to say why is the point.
