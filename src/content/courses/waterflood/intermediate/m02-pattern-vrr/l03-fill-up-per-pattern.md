# Fill-up per pattern

The Associate tier met the fill-up marker on the field record: cumulative VRR crosses 1.0 at period index 11, labelled 2023-12. Applied to the two elements, the same function returns two answers that are not dates, and both of them are more informative than a date would have been.

## The three return shapes

The function looks for the first period whose cumulative VRR reaches 1.0, and reports one of three things.

**A crossing.** An index, a label, and `startedAbove: false`. The record contains the moment the flood caught up.

**A crossing at the first defined period, with `startedAbove: true`.** The cumulative VRR is already at or above 1.0 in the earliest period that has one. The function reports that period, and the flag warns that the crossing itself happened before the record starts, or never happened because the flood was in surplus from the beginning.

**Null.** The cumulative VRR never reaches 1.0 anywhere in the record.

## What Ekene's elements return

**North**: index 0, label 2023-01, `startedAbove: true`.

**South**: null.

Neither is a date you can put in a report as "fill-up occurred on". That is the point.

## Reading the North element's answer

The North element's cumulative VRR is above 1.0 in the very first month of the flood. Look back at the January 2023 pattern period: it took 2825.7643895409715 barrels of injection against production of 2322.1683044997553 stb of oil and no water. In reservoir barrels that is 2882.279677331791 injected against 2823.385111342983 produced, a ratio of 1.020859558177947.

The field that month was at 0.85, deliberately under-injecting during commissioning. The North element was already over-replacing, because it was receiving 59 percent of a field injection that had been sized for the whole field.

So the honest statement is: this element never had a fill-up phase. It has been in surplus since the first month of record. The flag says exactly that, and a bare date of "2023-01" without the flag would have implied a crossing that never happened.

## Reading the South element's answer

Null. The South element's cumulative VRR ends the record at 0.6097477559533482 and never approaches 1.0. There is no fill-up because the element has never replaced what it took, on any window, at any point in three years.

That is a stronger statement than a low VRR by itself. A low CURRENT VRR could be a recent problem. A cumulative VRR that has never reached 1.0 in 36 months means the deficit is structural and has been accumulating since the flood started.

Quantify it: the South element produced 109139.77242556904 rb of voidage and replaced 66547.73132174983 rb, leaving a cumulative deficit of 42592.04110381921 reservoir barrels. At $B_w = 1.02$ that is 41756.90304296001 barrels of water that were never injected there.

## Why null is not zero

A tool that returned 0 for "never filled up" would be actively dangerous, because 0 is a valid index meaning the first period. The South element would then report exactly what the North element reports, and the two most different fill-up states in the field would be indistinguishable.

This is the same discipline as the null VRR flag on a shut-in period from the Associate tier. Undefined and zero are different, and any code path that conflates them will eventually produce a confident wrong answer.

## What fill-up means at pattern level

At field level, fill-up is a milestone with a physical flavour: the flood has, on the whole, put back what it took, and further injection builds new margin.

At pattern level it is weaker, because a pattern is not a closed system. Pressure equilibrates across pattern boundaries in a connected sand, so an over-injected North element is partly supporting the South element through the rock, in a way the allocation matrix does not model at all. The South element's 42592 rb deficit does not mean its pressure is 42592 rb below where it should be; some of that has been made up laterally.

That caveat cuts both ways. It softens the South element's deficit, and it also means the North element's surplus is not doing as much local good as the number suggests. What it does not do is make the imbalance go away.

## The misconception to avoid

"The North element filled up in January 2023." It did not fill up at all. It started in surplus. The label 2023-01 is the first period the function could report, not a crossing, and the `startedAbove` flag is the whole content of the answer. Any summary that drops the flag and keeps the label has inverted the meaning.

## Exercise

First, verify the North element's January 2023 pattern VRR from the period volumes given above, using $B_o = 1.21584$ and $B_w = 1.02$, and confirm it is above 1.0.

Second, the South element's cumulative deficit is 42592.04110381921 rb. Using the last month's South injection of 1625.5740587247217 bbl as a baseline, compute how many months of DOUBLED injection into the South element it would take to clear that deficit, assuming production is unchanged.
