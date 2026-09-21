# Infeasible and unbounded plans

Every plan read so far has had the status optimal. Not every configuration has a best month. Some cannot be run at all, some have no limit on what they would earn, and some are refused before the plan is attempted. This lesson reads the statuses the plan returns and the sentences that come with them, all from SECTION 10.

{{panel:refinery-plan-explorer}}

What infeasibility and unboundedness mean for a linear programme in general is the `crude` course's subject. Here we read what the refinery plan says when it meets them.

## Three statuses that are not optimal

**invalid** means the engine refused the input before planning. It names what it cannot trust:

| change | what the engine returns |
| --- | --- |
| the Forcados cost left blank | REFUSED: "Missing the cost of Forcados (illustrative). Enter 0 where the value really is zero." |
| the reformer capacity typed as -1 | REFUSED: "Naphtha reformer capacity must be zero or more; leave it blank for no limit." |
| a gasoline floor of 500000 above its ceiling of 450000 | REFUSED: "Gasoline has a minimum demand above its maximum." |
| no crude at all | REFUSED: "The plan needs at least one crude." |
| no product at all | REFUSED: "The plan needs at least one product to sell." |

When more than one box is missing, the refusal names them all. With the reformer's operating cost and the jet price both left blank:

REFUSED: "Missing the operating cost of Naphtha reformer, the price of Jet A-1. Enter 0 where the value really is zero."

The engine also returns the missing list itself: the operating cost of Naphtha reformer; the price of Jet A-1.

The gasoline row is worth a moment. A floor above its ceiling can never be met, and the engine sees that from the two numbers alone, so the input is invalid and no plan is attempted.

**infeasible** means the input was valid and no plan satisfies it. The lab raises the jet ceiling to 1200000 and sets a jet floor of 1000000. Each number is sound on its own. But ABUA's crudes and units cannot make that much kero in a month:

REFUSED: "No plan satisfies these constraints. A product floor is probably beyond what the crudes and units can make."

The engine's sentence names the usual cause and says "probably". It cannot know which limit you meant to relax. It knows only that together they leave no plan.

**unbounded** means the plan could earn without limit. The lab leaves every crude availability, unit capacity and demand ceiling blank:

REFUSED: "The plan is unbounded: a product has a price and no demand ceiling, or a crude has no availability limit and no cost."

Module 1 said a blank limit is no limit. This is that rule taken to its end. With nothing limiting crude and nothing limiting sales, every profitable barrel invites another, and there is no best month to report.

## No plan, no schedule

An infeasible plan cascades to 0 events, with the note "No optimal plan to cascade." Module 5 builds the schedule from the plan, and a status other than optimal leaves it nothing to build from.

## What to do with each

An invalid status is fixed at the box it names. An infeasible status is fixed by relaxing a floor or a limit, and the refusal says where to look first. An unbounded status is fixed by typing the limit that was left blank. In every case the engine's sentence is the plan's answer, and a page should show it as the answer, in the engine's words, and never as an empty chart.

## Exercise

Read the three statuses the lab prints for the jet floor of 1000000 with its ceiling raised to 1200000 (infeasible), for every limit left blank (unbounded), and for a gasoline floor of 500000 above its ceiling of 450000 (invalid). Say why the gasoline case is refused before any plan is attempted while the jet case is only found to have no plan by planning, and what a planner should change in each.
