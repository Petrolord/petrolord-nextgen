# History-match vectors

A history match is a comparison, and the deck asks for both series so the comparison is in one file. Reading them correctly is less obvious than it looks.

## The pairs

For every observed quantity, two vectors: the simulated one and the observed one with a trailing H.

    FOPR   and  FOPRH
    FWPR   and  FWPRH
    FWCT   and  FWCTH
    WOPR   and  WOPRH

The H vectors are not simulator output. They are the numbers YOU put in the schedule, echoed back so they can be plotted together.

## The trap

Under WCONHIST with ORAT control, the model is TOLD the oil rate. So FOPR and FOPRH are equal by construction, every step, and plotting them together produces two identical curves.

That plot appears in a great many reports as evidence of a good history match. It is evidence of nothing at all.

## What actually carries information

The quantities the model was NOT told.

**Water.** FWPR against FWPRH. The model computed its water from the saturations and the relative permeability curves, so agreement here is real evidence about the sweep.

**Gas.** FGPR against FGPRH, likewise, and on an undersaturated field it tests the solution gas and the pressure.

**Pressure.** There is no observed pressure vector in this deck because the history carries no pressure measurements. On a field with shut-in surveys, the simulated bottom-hole or datum pressure against the measured one is the strongest single test of the model, because pressure integrates everything.

So the match on Ekene is tested through water and gas, and not through pressure, which is a limitation worth stating rather than discovering.

## Reading the water match

Three failure patterns and what each usually means.

**Water arrives too early everywhere.** The model's sweep is too poor, or its water is too mobile. Usual suspects are relative permeability and vertical communication.

**Water arrives too late everywhere.** Often a permeability that is too low or a connectivity the model does not have.

**Water arrives correctly on average and wrongly per well.** The field-level match is good and the per-well matches are not, which means the total water is right and it is coming from the wrong places. That is the most common and the most informative pattern, and it is invisible on a field plot.

That last one is why the deck requests per-well water cut as well as field water cut.

## What a good match does not prove

That the model is right. A model with compensating errors matches history and forecasts badly, and history matching is famously non-unique: many parameter sets reproduce the same past.

The defences are to match quantities you did not tune, to keep the number of tuned parameters small, and to hold something back to predict.

## The convention to record

Which control mode the history used, because it decides what the match tested. A match under ORAT tests water, gas and pressure. Under RESV it tests the oil-water split. Under BHP control it tests the rates themselves, which is the most demanding of all.

A history match report that does not state the control mode has not said what was tested.

## The misconception to avoid

"Matching the observed rates is the history match." Under rate control the observed rates are an input. The match is everything else the model then had to predict, and a report that leads with a perfect oil-rate plot is leading with its assumption.

## Exercise

First, explain in two sentences why FOPR equals FOPRH under ORAT control and what that means for a plot of the two.

Second, a field water cut matches well and three of four wells do not. State what that pattern means and which vectors you would need to see it.
