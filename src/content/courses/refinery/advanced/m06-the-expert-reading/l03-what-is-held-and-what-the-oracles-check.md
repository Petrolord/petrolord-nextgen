# What is held and what the oracles check

Every figure in this course comes from an engine, and every engine has limits. Some limits are held decisions the course states and never grades. Some are limits the engines state about themselves. And behind the figures stand two independent oracles that check the engines' answers. This lesson reads all three, so a learner knows how far each figure can be trusted.

## Held items

Three items are held. Each is taught as a stated limit and never graded.

**H1.** The scaling exponents 0.6 and 0.9 are defaults for a vendor's own figures to replace. No published source for them is in the engines repository. When a screen's capital comes from the modular law, as ODIOMA's expansion capital does, the capital is only as good as that exponent. A vendor quotation for the actual plant replaces it.

**H2.** The screening engine depreciates capital in the year it is spent and offers no capital allowance schedule starting at commissioning. Carrying the loss forward covers the refinery case; a fuller allowance model belongs to the Economics module.

**H3.** materialBalance counts receipts in and deliveries, burns, flares, vents and losses out, and a unit run moves nothing. A refinery's crude leaves its tank through the crude unit and its products arrive from units, so the function cannot close a refinery tank. It serves a tank whose movements are receipts and deliveries. This course prints no material balance.

## Decisions in force

Three owner decisions stand as rules of the engines:

- Loss carry-forward is an option of the screening engine, off by default for every other caller; the refinery switches it on.
- No royalty on a refinery: feasibilityEconomics passes a royalty rate of 0.
- A feedless unit is the crude unit and carries every barrel of crude; a plan with no feedless unit writes no crude-unit row.

## Limits the engines state themselves

Yields are fixed vectors. Quality is not carried through the plan. The plan covers one period at a time with no inventory between periods. The schedule models no tank capacity, jetty window or turnaround.

H3 follows from the event model of module 1: a unit_run signs to 0 for the site. Stock and tank reconciliation belong to the supply course.

## What the oracles check

| golden file | cases | written by | method |
| --- | --- | --- | --- |
| refineryplanning_cases.json | 6 plans, 3 variance lines, 1 schedule | tools/validation/downstream/oracle_refineryplanning.py | exact rational simplex with a duality certificate; stream values by exact re-solve; dates by datetime.date |
| modularrefinery_cases.json | 8 feasibility cases, 5 scale points | tools/validation/downstream/oracle_modularrefinery.py | annual accounts; a dated tax-loss ledger used oldest first; mid-year NPV restated from the screening engine |

The plan oracle solves each plan in exact rational arithmetic and accepts it only with a duality certificate. It values a stream by re-solving with a small extra supply of it. The feasibility oracle keeps annual accounts and a dated tax-loss ledger used oldest first.

An oracle is a second, independent calculation of the same answer. The plan oracle checks three variance lines as well as plans, so the volume, price and unexplained split of module 2 is checked by a calculation made apart from the engine.

## What the oracles do not check

Neither oracle checks a refusal's wording. So every refusal sentence the course quotes is the engine's own, and it is quoted as printed. The oracles check answers: a figure, a status, a date.

## Exercise

State H1, H2 and H3 in your own words, and say for H1 and H2 what a real project would supply to replace each. Then read the two golden files and the cases each covers, and say which oracle checks the variance split and which checks the tax-loss pool. Finally, say why a unit_run signing to 0 is the reason behind H3.
