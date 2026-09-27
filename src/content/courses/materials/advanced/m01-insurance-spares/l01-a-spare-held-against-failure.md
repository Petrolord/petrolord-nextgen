# A spare held against failure

{{panel:materials-spares-calculator}}

An insurance spare is a part a plant keeps on the shelf because the equipment it replaces cannot wait for a supplier once it fails. In this course the phrase carries a narrow meaning: an insurance spare is a spare sized by the stated one-for-one model at a stated failure rate, lead time and downtime cost. This module teaches that model, the two costs it weighs and the number of spares it chooses, on the ESP motor of the Ekene register.

## The question this tier owns

The Associate tier classified items and sized orders. The Professional tier set safety stock against a named service target. The Expert tier takes up spares, lead-time risk and the limits: how many insurance spares cost least, how a sampled lead time moves the chance of a stockout, and where the engine's answers stop. Its capstone grades that question alone.

## Seven stated inputs

The engine's insuranceSpares function reads seven inputs. Each one is stated by the user, and none has a default:

| input | what it states | the ESP motor |
| --- | --- | --- |
| failuresPerYear | failures a year across the units the spares protect | 2 |
| leadTimeDays | days to replace a failed unit | 150 |
| daysPerYear | the days in the costing year | 365 |
| unitCost | the price of one spare | 185000 |
| holdingRate | the holding charge a year, as a share of the unit cost | 0.2 |
| downtimeCostPerDay | the cost of one unit down for one day | 18000 |
| maxSpares | the largest number of spares searched | 6 |

The engine holds none of a register's figures and no policy of its own. The Ekene register is synthetic, written for this platform, and so is every figure in the table. A failure rate estimated from field data is a question for the rotating course and the reliability parts of the academy; here it arrives as a stated number.

## A missing input is refused by name

A call that leaves out an input, or states one that cannot work, returns a refusal whose message starts with the field it refuses. Two this tier must know, each in the engine's own words:

> failuresPerYear must be a finite number above 0; got 0

> daysPerYear must be a finite number above 0; got undefined

A result that comes back with a reason, such as a cheapest stock that sits on the search limit, is a result. It is no refusal.

## Where the practicals run

This is an app course. The Suite app is the Materials & Spares Planner, in the Suite's Midstream & Downstream module, and it runs the same vendored engine. Every practical in this tier also runs in the course's own spares calculator, which calls that engine on the inputs you type, and the same inputs typed into the Planner give the same figures. The spares calculator has three views: insurance spares, a slow-moving spare on Poisson demand, and lead-time risk by Monte Carlo, whose figures are sampled and ungraded. Every refusal it prints is the engine's own message.

## Exercise

Open the spares calculator on the view "Insurance spares" and start from "The ESP motor on the Ekene register". Find the control for each of the seven inputs in the table above and check that it shows the stated figure. Read the "Mean orders outstanding" tile (0.821918) and the "Cheapest number of spares" tile (4). Now clear the "Days a year (stated)" control so that it reads not stated, and read the refusal. Restore 365, set "Failures a year (stated)" to 0, and read the second refusal. Write one sentence for each message naming the field it starts with and the condition it states.
