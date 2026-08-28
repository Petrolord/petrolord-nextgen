# WCONHIST and observed rates

A history period tells the simulator what the field actually did. It uses different keywords from a forecast period, and the difference is not cosmetic.

## The keywords

**WCONHIST** for producers. One record per well:

    'Ekene-1' 'OPEN' 'ORAT' 32.211 0.000 12.884 /

Name, status, control mode, then the observed oil, water and gas rates.

**WCONINJH** for injectors:

    'Ekene-2' 'WATER' 'OPEN' 92.699 /

Name, phase, status, observed injection rate.

The trailing H on both is what marks them as history.

## Why they are not WCONPROD

WCONPROD says what a well is TOLD to do. WCONHIST says what a well DID.

The difference shows in what the simulator does with the extra numbers. Under WCONPROD you give a target and limits, and the well produces the lesser of them. Under WCONHIST you give all three phase rates as observations, and the simulator honours the one named by the control mode while recording the others for comparison.

Here the mode is ORAT, so the model matches the observed OIL rate and computes its own water and gas. The observed water and gas are carried into the output as the H vectors, which is what makes a history match plottable.

## What this means for the match

The oil rate is not being matched, it is being IMPOSED. The model produces exactly the observed oil, by construction, every month.

So a history match on rate control tests nothing about oil rates. What it tests is everything the model then has to predict: the water cut, the gas-oil ratio, and the bottom-hole pressures. Those are the free responses, and agreement there is the actual evidence.

That is worth being blunt about, because a plot of modelled against observed oil rate under ORAT control is a straight line through the origin by definition, and it appears in more reports than it should.

## The control mode choice

Under WCONHIST the mode names which observation is honoured.

**ORAT** honours oil. Right for an oil field where oil is the best-measured stream.

**LRAT** honours total liquid. Right when the well is on a pump with a known liquid capacity and the oil-water split is the uncertain part.

**RESV** honours reservoir volume. Right when voidage is the quantity you trust, which is exactly the waterflood course's ledger.

Each choice makes a different quantity exact and leaves the others free, so it decides what the match is testing. Ekene uses ORAT.

## The status field

OPEN or SHUT. A well that was shut for a month appears with a status of SHUT and its rates ignored.

That matters for a real history where wells go down. A well left OPEN with a zero rate is a well the simulator will try to produce at zero, which constrains its pressure; a well marked SHUT is disconnected entirely. They are different models and the second is usually what happened.

## The misconception to avoid

"The history match reproduces the production history." Under rate control it reproduces the oil rate exactly, because it was told to. What it may or may not reproduce is the water, the gas and the pressure, and those are the only parts that carry information. A match quoted on the controlled phase is not a match.

## Exercise

First, under ORAT control, name the quantity the model reproduces by construction and the three it must predict.

Second, a well was shut for two months mid-history. Explain the difference between recording that as SHUT and recording it as OPEN with zero rates.
