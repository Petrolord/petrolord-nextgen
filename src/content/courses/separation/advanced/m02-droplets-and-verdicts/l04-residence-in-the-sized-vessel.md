# Residence in the sized vessel

A droplet verdict is only as good as the residence time it is compared against, and that residence comes from the vessel that was actually sized. On AGBAMI the vessel is 12.311666 ft long, and it gives the oil 300.0000 s and the water 480.0000 s.

{{panel:fc-slug-explorer}}

## Residence is a length divided by a throughput

A phase stays as long as its share of the drum takes to fill at its own rate. The length is one number for the whole vessel, so the residence each phase gets depends on the cross-section it was given and the rate it carries. Change the diameter, the level or the split and both residence times move.

That is why the verdicts are computed after sizing rather than beside it. A droplet check run against a residence somebody assumed is a check on a vessel nobody built.

## The proportional case reads an input back

Under the retention-proportional split the residence times are the retention times that were typed in, converted to seconds. AGBAMI holds its oil 5.000000 minutes and its water 8.000000 minutes, and `residenceOilS` comes back as 300.0000 s with `residenceWaterS` at 480.0000 s.

That is neither a coincidence nor a defect. The split was built to give both phases the same length, so each phase gets exactly the time it was designed for. It does mean that quoting a proportional residence as a result is quoting an input, and this course does not grade it.

## The pinned case separates them

| split | oil residence s | water residence s |
| --- | --- | --- |
| proportional | 300.0000 | 480.0000 |
| pinned at a water share of 0.300000 | 746.6667 | 480.0000 |

Pin the water share at 0.300000 and the oil residence rises to 746.6667 s while the water stays at 480.0000 s. The vessel length was set by the water, which needed 21.181362 ft, and the oil was handed a band of 2.925687 ft in a drum sized for somebody else. It sits there far longer than its own 5.000000 minutes asked for.

This is where a residence becomes a real output. It is the consequence of a length one phase forced and a split another phase was given.

## What the verdicts do with it

The comparisons on AGBAMI are 111.4796 s of falling against 300.0000 s of oil residence, and 217.8010 s of rising against 480.0000 s of water residence. Both clear. Tighten the water specification to 150.000000 micron and the falling time becomes 1238.6620 s against the same 300.0000 s, and the verdict turns.

## The mistake

The mistake is quoting a residence time as evidence that a vessel was checked. On a proportional split it is the retention time from the input form, so a report saying the oil was given 300.0000 s of residence has restated the 5.000000 minutes somebody typed.

The second mistake is comparing a droplet time against the wrong phase. A falling water drop is judged against the oil residence and a rising oil drop against the water residence, because each drop is racing the phase it is trying to leave.

## Exercise

State the AGBAMI oil and water residence times under the proportional split and explain why each one equals an input. Then give both residence times under a pinned water share of 0.300000, say why the oil figure moved and the water figure did not, and name which residence each droplet check is compared against.
