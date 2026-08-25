# Elastic rebound

When the phantom section vanishes at 10 Ma, the source does something no real rock does: it gets thicker again. Version one's compaction is elastic, fully reversible with depth, and this lesson teaches the simplification, its footprint in the fixture, and the recorded plan for removing it.

## The behaviour

Compaction in this engine is a pure function of depth: porosity is $\phi_0 e^{-cz}$, thickness follows from conserved grain at the current burial, and nothing remembers how deep the rock has ever been. Bury a layer, it thins; unroof it, it re-expands to exactly the thickness that depth always implied. The source during the phantom decade: 400 m at its pre-event position, 390.577400265013 m while buried under the phantom, 400.000 m again from 10 Ma on. The porosity crushed out on the way down is restored on the way up as if the grains had sprung back.

## What real rocks do

Real compaction is dominantly plastic. Grain rearrangement, pressure solution and cementation do not reverse when overburden is removed; an unroofed shale keeps approximately the porosity of its maximum burial. The standard modelling treatment is max-burial hysteresis: porosity follows the compaction curve while depth increases, then freezes at the deepest-ever value during any subsequent uplift. This engine's version-one choice is documented in its own specification as a deliberate limitation, with hysteresis the recorded follow-on, and the honest reading of any of its unroofing episodes starts from knowing which convention is in force.

## The footprint in this fixture

Price the simplification where it acts. With hysteresis, the post-erosion source would stay at its 11 Ma state, 390.577400265013 m and phiAvg 0.11620882968385332, instead of re-expanding to 400 m and 0.13712772956463615. Temperature: the source centre would sit 4.7 m deeper mid-layer within an otherwise identical column, a difference of order 0.1 degC, at the edge of the final temperature's tolerance and no more. Maturity: kinetics see temperature, so the effect on the graded Ro is similarly marginal, and the erosion signature would survive essentially intact.

Where it genuinely bites is module 4's territory: the retention cap is thickness times porosity, so elastic rebound regrows the bucket after the event, from 3858.026119789524 back to 4662.34280519763 kg/m2. With hysteresis the bucket would stay squeezed, and expulsion after 10 Ma would resume at a lower threshold. In this fixture generation after 10 Ma is nearly stalled anyway, so the graded expelled mass is set before the convention matters; but shift the timing, a younger erosion event over a still-generating source, and elastic-versus-plastic becomes a first-order charge question. That conditional sentence is the exam's favourite kind.

## Reading models with known conventions

The general habit this lesson teaches: every forward model carries conventions, and competent reading means knowing which results are convention-robust and which are convention-sensitive. In this fixture, the six graded values are robust, which is checkable because the sensitivity analysis above is arithmetic you can do. A modeller who cannot run that analysis must treat every output as equally trustworthy, which means equally untrustworthy.

## Worked example

State the direction of each error elastic rebound introduces after an unroofing, relative to a hysteretic rock. Thickness: over-restored, model too thick. Porosity: over-restored, model too porous. Bulk conductivity: pore water conducts worse than matrix, so extra porosity makes the model column slightly more insulating above the source, temperatures marginally higher. Retention cap: over-restored, model retains too much and expels too little after the event. Every direction follows from the one fact that rebound restores porosity that a real rock would have surrendered permanently.

## Exercise

Define max-burial hysteresis in one line. Then answer in one sentence each: why are this fixture's graded values nearly immune to the rebound convention, and what change to the fixture would make the convention decisive?

As a self check: hysteresis freezes porosity at its deepest-burial value, letting it fall but never recover. The graded values are immune because the geometry error is metres against kilometres for temperature and Ro, and the expelled mass was locked in at 11 Ma while the bucket was squeezed, before rebound could regrow it. Move the erosion event earlier, while generation is still running strongly, and the regrown bucket would swallow later generation that a hysteretic model would expel, making the convention a first-order control on charge.
