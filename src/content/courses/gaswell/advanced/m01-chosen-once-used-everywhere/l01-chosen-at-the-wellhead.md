# Chosen at the wellhead

`recommendCorrelation` reads one pressure and returns a name. It has no other argument, and nothing in it knows where that pressure was measured.

{{panel:pd-remedy-explorer}}

## One comparison, one boundary

The test is a strict comparison against the Coleman pressure limit of 1000.0 psia. Below the limit the function returns coleman, at the limit and above it turner. `LOADING_ADJUSTMENT.coleman` is 1.000000 and `LOADING_ADJUSTMENT.turner` is 1.200000, so the name the function returns settles one factor and nothing else.

| Pressure, psia | Correlation |
| --- | --- |
| 400.00 | coleman |
| 850.00 | coleman |
| 980.00 | coleman |
| 999.04 | coleman |
| 999.88 | coleman |
| 999.96 | coleman |
| 1000.00 | turner |
| 1000.04 | turner |
| 1000.50 | turner |
| 1500.00 | turner |
| 2500.00 | turner |

The switch is a step. Everything on one side of it is treated identically.

## The sentence beside the name

At 850.00 psia the function returns: "At 850.0 psia wellhead this well sits inside the low-pressure range Coleman's data covered, where the unadjusted equation fitted better." At 1500.00 psia it returns: "At 1500.0 psia at the 7,500 ft shoe this well is above the range Coleman studied, so Turner's 20 percent adjustment is the usual choice." The second sentence names a station only because the caller supplied one. The station is an argument, not something the function worked out.

## The pressure an operator hands it

The teaching well EBOCHA-5, which is not a published case and which no oracle has ever checked, flows 3100.0 Mscf/d on 3.548 in tubing. The wellhead pressure an operator reads is 880.0 psia, the shoe pressure the liquid sees is 1500.0 psia, and the ratio between them is 1.70454545. Handed 880.0 psia, the function returns coleman: "At 880.0 psia wellhead this well sits inside the low-pressure range Coleman's data covered, where the unadjusted equation fitted better."

Both of those pressures exist on the same well on the same day, and they sit on opposite sides of 1000.0 psia.

## The mistake

Reading the returned name as a property of the well. It is a property of one pressure. A gauge reading 980.00 psia and a gauge reading 1000.04 psia send different factors into every critical rate in the study, and no part of the returned object records which pressure produced the answer.

## What it refuses

It refuses to switch the correlation for anybody: it returns guidance, and a caller who ignores it gets no complaint. It cannot see which station the pressure came from, because it was never told. And it refuses to grade its own confidence, so 999.96 psia and 400.00 psia come back with the same name and the same shape of sentence.

## Exercise

Run the eleven pressures in the panel and write down the name each returns, then say which single pair of adjacent pressures the whole decision sits between.

Then hand it 880.0 psia and 1500.0 psia and say in one sentence what it means that one well produced both names.
