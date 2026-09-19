# Two apps and one barrel

A refinery is judged on its margin per barrel of crude. This course follows that one barrel through two Suite apps, and this tier works the first of them: the screen that prices the barrel before any capital is spent.

## The two apps

The Modular Refinery Feasibility Studio calls the modularRefinery module, and through its feasibilityEconomics function it reaches the screening engine. The Refinery Planning Studio calls refineryPlanning, which runs over lib/lp/simplex and streamModel. Counted from the modules themselves:

| module | exported functions | exported lists and constants |
| --- | --- | --- |
| refineryPlanning | 3 | 0 |
| streamModel | 7 | 4 |
| modularRefinery | 6 | 4 |
| screening | 6 | 1 |
| simplex | 1 | 1 |

The Associate tier lives almost entirely in modularRefinery. The Professional and Expert tiers move to refineryPlanning and streamModel.

## The lists the screen carries

modularRefinery exports four lists, and each one names a thing you choose on the screen. SCALING_EXPONENT holds STICK_BUILT 0.6 and MODULAR 0.9, the two ways capital grows with size. CONFIGURATIONS holds topping, hydroskimming and conversion, the three plants the screen can value. SUPPLY_SCENARIOS holds firm, tight and disrupted, the three futures for crude arriving at the gate. LICENSING_STAGES holds Licence to Establish, Licence to Construct and Licence to Operate, in that order.

Every module of this tier is built on one of those lists. Capital comes from the exponents, the product slate from the configurations, the run rate and the crude price from the supply scenarios, and the project's paperwork from the licensing stages.

## One barrel, read three ways

The later tiers read the same barrel on three ledgers. streamModel.LEDGER names them: plan, schedule and actual. The screen in this tier comes before any of those exist. It asks a narrower question: given a plant size, a configuration, a crude price and a set of product prices, what is a barrel of crude worth once it has been refined, and what does it cost to put through?

That is why the screen's headline figure is a gross margin per barrel of crude. Every other number it prints either feeds that margin or scales it up to a year.

## Two functions that read a clock

Two exports read the machine clock when an argument is left out. cascadeToSchedule reads it when periodStart is missing, and feasibilityEconomics and calculateEconomics read the year when startYear is missing. The figures in this course pass both every time, with start year 2027 for every valuation, so a figure you read here does not move with the day you read it.

## What this tier leaves to other courses

Linear programming and the crude assay belong to the `crude` course. Terminals, measurement and landed cost belong to the `supply` course. The Studio shows an NPV and an IRR, and the Economics courses teach both. This tier stays with the screen's own arithmetic: capital, slate, throughput and margin.

## Exercise

Name the four lists modularRefinery exports and the entries in each. For each list, say which quantity on the screen it controls. Then read the counts table and say which module this tier works in and which modules the Professional and Expert tiers move to.
