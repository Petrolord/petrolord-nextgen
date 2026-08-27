# The primary window

Every lesson so far has quietly assumed that the well you are looking at is the same well it was last month. Decline curve analysis lives or dies on that assumption, and this lesson makes it concrete: it names the stretch of the Ekene history where the assumption holds, shows you the exact month it stops holding, and explains why one Arps curve cannot cover both sides of that date.

## The assumption, restated as a rule

An Arps curve is a description of how one drainage system, produced one way, has been fading. It carries no memory of choke settings and no knowledge of the wells around it. So it is only entitled to describe a period in which:

- the completion and the artificial lift are unchanged,
- the choke and operating policy are unchanged,
- no new well is competing for the same drainage volume, and
- the drive mechanism is unchanged.

That last one is the big one. A drive mechanism is the physical process pushing oil to the well, and in the Ekene primary period there is only one: the compressed rock and fluid expanding as pressure falls. When water injection begins, a second process joins in, one that adds energy rather than spending it. The well now belongs to a different system, and the old curve is a description of a system that no longer exists.

## Ekene's primary window

The Ekene data set states its own boundary. Every producer's record carries a primary window that runs from that well's first month up to and including **2022-12-01**, and the field's `flood_start` is **2023-01-01**, the month Ekene-2 and Ekene-4 begin injecting. So the primary window is "from first oil to the last month before injection," and because the four producers came on stream at different times, they contribute different numbers of monthly rows to it:

| Well | First production | Primary rows | Last primary rate (stb/d) |
|---|---|---|---|
| Ekene-1 | 2020-01-01 | 36 | 33.4312717799524 |
| Ekene-3 | 2020-03-01 | 34 | 37.313200788552315 |
| Ekene-5 | 2020-06-01 | 31 | 42.20299641274531 |
| Ekene-6 | 2020-09-01 | 28 | 43.73443754606159 |

Every well ends its primary window on the same calendar date and none of them ends it at the same age. Ekene-1 has been flowing 1096 days by 2023-01-01; Ekene-3 has 1036 days, Ekene-5 has 944, and Ekene-6 only 852. Same field, same event, four different clocks, exactly as lesson 3 warned.

## Watch the assumption break, one row at a time

The best way to feel what the flood does is to walk Ekene-1's rate table across the boundary and look at the ratio of each month to the one before it. In the primary window the well is exponential, so each monthly ratio is $e^{-D_i \Delta t}$ and depends on nothing but the number of days in the step.

From 2022-11-01 (34.65672334631468 stb/d) to 2022-12-01 (33.4312717799524 stb/d) is a 30 day step, and

$$\frac{33.4312717799524}{34.65672334631468} = 0.964640293483123 = e^{-0.0012 \times 30}$$

From 2022-12-01 to 2023-01-01 is a 31 day step, and the ratio is 0.963483419394221, which is $e^{-0.0012 \times 31}$ to within the last digit that double precision can carry. The curve is still perfectly in charge on the flood-start row itself, because injected water has not reached anything yet.

Now take one more step. From 2023-01-01 to 2023-02-01 the rate goes from 32.210476049246076 stb/d to 32.210476049246076 stb/d. The ratio is exactly **1**. The well stops declining. It holds that flat rate for six monthly rows while the injected water travels through the rock, then it starts climbing: 33.71363159821089 in July 2023, 35.21678714717571 in August, and up to a peak of **41.22940934303498** stb/d in December 2023.

Stop and do that last comparison yourself. Ekene-1 produced 33.4312717799524 stb/d in December 2022 and 41.22940934303498 stb/d in December 2023, a ratio of 1.23325877682460. After four years on decline the well is making 23 percent more oil than it did a year earlier. No Arps curve can do that. Every member of the family is monotonically decreasing by construction: $q_i e^{-D_i t}$, $q_i/(1 + D_i t)$ and the hyperbolic form in between all fall forever and never turn.

## Why one fit over everything is wrong

Suppose you ignore all this and hand the full 2020 to 2025 history to a fitting engine anyway. The engine will not refuse. It will find whichever curve minimises the error, and that curve has an impossible job: it must sag steeply enough to follow three years of real decline and then flatten enough to keep up with a rate that stopped falling and rose. The compromise it reaches passes near the early data and near the late data and is not the truth of either.

Three things go wrong at once. The fitted $q_i$ is no longer the well's initial rate. The fitted decline no longer matches the physics that produced the first three years. And the exponent $b$ is dragged upward, toward the flat-tailed end of the family, because flatness is what the late data demands, which quietly inflates every long-term forecast you make from it. You will meet the diagnostics for all of that in the Professional tier, along with how to choose and defend window boundaries. At this tier, one discipline is enough: **fit the primary window, and say so.**

## The misconception to retire

"More data is always a better fit." It is not. Data is only useful to a model that is entitled to describe it. Twenty-four extra months of a flooded well add nothing to your knowledge of the primary decline and actively corrupt it. Choosing the window is not throwing data away; it is stating which physical period your forecast claims to describe. Everything the Associate tier grades, the fits, the EURs, the cumulative at the flood start, is computed on the primary window and on nothing else.

## Exercise

Using the table above, work out how many monthly rows each producer would gain if you carelessly fitted its whole record instead of its primary window. Each well's record runs through 2025-12-01, so Ekene-1 has 72 rows in total, Ekene-3 has 70, Ekene-5 has 67 and Ekene-6 has 64. Then answer in one sentence, for yourself: which of the four wells would a full-history fit distort the most as a fraction of its own history, and why?
