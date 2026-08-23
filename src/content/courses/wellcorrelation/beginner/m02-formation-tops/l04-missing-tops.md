# Missing tops

A tops table with a gap in it is normal. Wells are drilled for different reasons, to different depths, through different structure, and no real dataset has every surface picked in every well. Handling those gaps honestly is a skill, and getting it wrong is one of the easier ways to produce a section that lies.

## Why a top goes missing

There are four common reasons, worth separating because they mean different things.

**The well reached total depth above the surface.** The bit stopped before the surface was ever penetrated. Nothing was faulted, nothing was eroded; the well simply ended too shallow. This is a drilling fact, not a geological one, and it says nothing about whether the surface exists there.

**The section was faulted out.** A fault cut the well path and removed part of the stratigraphy. The surface exists in the area, but this borehole missed it because the rock that carried it was displaced. Neighbouring wells will usually still have it.

**The surface was eroded.** The rock that carried the surface was removed before the overlying section was deposited. Here the absence is real geology, and often the most interesting kind, because the pattern of where a surface survives maps out an old land surface.

**Nobody has picked it yet.** The logs go deep enough and the rock is there, but the entry is missing because the work is incomplete or the interpreter was not confident enough to commit. This is the only one of the four that a person can fix at their desk.

Notice that the tops table records none of this. It records absence, and absence alone. The reason lives in the well report, the seismic, or the interpreter's head. When you inherit a gap, finding out which of the four you are looking at is part of the job.

## The teaching case: Ekene-4

The Ekene section is built with exactly one gap so you can watch how it propagates.

Ekene-1, Ekene-2 and Ekene-3 each carry all four tops: `TOP_A`, `TOP_SAND`, `BASE_SAND` and `TOP_B`. Ekene-4 carries only three. It has `TOP_A` at 1530 m, `TOP_SAND` at 1590 m and `BASE_SAND` at 1615 m, and no `TOP_B` at all, because the well terminated above that surface.

So three of the four wells carry `TOP_B`, at 1640 m in Ekene-1, 1662 m in Ekene-2 and 1628 m in Ekene-3. That is the first case above: a drilling decision, not a geological statement. `TOP_B` almost certainly exists under Ekene-4. Nobody has seen it there.

Two numbers follow, and both come back later in the course. The `TOP_B` correlation line reaches 3 wells, not 4. And the structural relief on `TOP_B`, the deepest reading minus the shallowest across the wells that have it, is 1662 minus 1628, which is 34 m. That relief is measured over three wells, so quoting it as if it covered the whole section would overstate what the data supports.

## What the engine does about it

The section engine handles missing tops in two distinct places, and the behaviour differs because the consequences differ.

**Correlation lines.** When the engine builds the polyline for a top, it walks the wells in section order and asks each one for that top's depth. A well that does not have it is skipped: no point is added and the line moves on. So the `TOP_B` line is drawn through three wells and does not reach the fourth. There is no interpolation across the gap and no zero-depth point dragging the line to the top of the display. The line stopping short is the honest picture, and reading a section means noticing where lines stop.

**Flattening.** This case is more dangerous, so it is treated more loudly. Flattening works by shifting each well vertically so the chosen datum top lands on the datum line, and the shift comes from that well's depth for that top. A well lacking the datum top has no shift to compute. Rather than guess one, the engine gives that well no shift at all, draws it at true depth, and flags it as lacking the datum top.

The reason for the flag is worth stating plainly. If the software silently assigned a shift of zero and said nothing, the well would appear alongside the others and look as though it had been hung on the datum when it had not. Every depth read off that column would be wrong relative to its neighbours, and nothing on the picture would say so.

The same logic applies to zone fills. A zone needs both of its bounding tops, so if either is missing the well's column shows no fill rather than a fill of guessed extent.

## The rule

Two sentences, and they are the ones to carry out of this module.

**Missing is not zero.** An absent top is not a top at depth zero, not a top at the surface, and not a thickness of zero metres. It is the absence of information, and every calculation that touches it should either exclude that well or report that it did.

**Never invent a top to make a line look complete.** The temptation is real, because a line that crosses all four wells looks finished and a line that stops at three looks like unfinished work. It is not unfinished work. It is a correct statement about what has been observed. Filling that gap with an estimate turns an observation into a guess, and once the number is in the tops table nothing downstream can tell the difference. There are legitimate ways to estimate where an unpenetrated surface would lie, and they belong in later tiers, but the estimate is always labelled as an estimate. It does not go in the picks.

Try it yourself: the panel below draws the Ekene section from the same engine, with the datum under your control.

{{panel:wc-section-explorer}}

## Exercise

State how many wells carry `TOP_B`, compute its structural relief across those wells, and say what the engine does with Ekene-4 when you flatten the section on `TOP_B`.

Self-check: 3 wells carry `TOP_B`, at 1640, 1662 and 1628 m. The relief is 1662 minus 1628, which is 34 m. Flattening on `TOP_B` gives Ekene-4 no shift, so it is drawn at true depth and flagged as lacking the datum top rather than being hung on the datum as though it had one.

Second self-check: name the four reasons a top can be missing, and say which of them applies to Ekene-4. The reasons are total depth above the surface, faulted out, eroded, and not yet picked. Ekene-4 is the first: the well terminated above `TOP_B`.
