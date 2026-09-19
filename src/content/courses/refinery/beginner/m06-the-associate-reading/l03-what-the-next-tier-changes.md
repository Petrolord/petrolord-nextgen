# What the next tier changes

This tier has priced a barrel of crude before any capital is spent. The Professional tier finds that barrel's margin inside a running plant, and the change is bigger than it looks.

## What this tier's screen assumed

Every figure in this tier came from a fixed yield row per configuration, one price table, one utilisation and one crude. The screen asked what a barrel is worth if the plant makes a fixed slate. It never asked what the plant should make.

That is the right question for a screen, and the OKORDIA screen answers it: 4.5900 a barrel of crude on hydroskimming under firm supply, and a nine-row table of what configuration and supply do to it.

## What the Professional tier asks

The Professional tier moves to the Refinery Planning Studio and its module, refineryPlanning, over lib/lp/simplex. The question changes from what a fixed slate is worth to how a month should be run. A plan chooses how much of each crude to buy, how hard to run each unit and how much of each product to make, within the plant's limits, to earn the most margin in the month.

Four things change as a result.

The crude unit carries every barrel. In the plan, every barrel of crude the plant buys passes through the crude unit, and the crude unit's own capacity and cost become part of the answer.

Yields become streams. The fixed slate of this tier becomes a network: the crude unit makes intermediate streams, other units take those streams as feed, and products are made from what arrives.

Every stream has a value. The plan prices one more barrel of each stream arriving from outside. Those marginal values are what the Professional tier uses to judge a debottleneck. How the plan finds them is linear programming, and the `crude` course teaches it; this course reads the plan's answers.

The plan is dated. The Professional tier cascades the month's plan into a schedule of cargoes, unit runs and lifts across the period. That is the first time this course puts a calendar date on a barrel.

## What stays the same

The unit of the answer. The plan's headline is still a margin per barrel of crude, read the same way this tier read it: product value, less crude, less the cost of running units. 
The discipline stays too. The planning module refuses what it cannot answer in its own words, and a blank limit and a typed zero mean different things there as they do here.

## After that

The Expert tier reads actuals against the plan, line by line, on what each gap did to margin, and values an expansion through the same screening engine this tier's streams are handed to. The one sentence this course serves holds all three tiers: the screen prices the barrel, the plan finds it, the schedule dates it, and the actuals are read against it.

## Exercise

Read the OKORDIA hydroskimming row under firm supply: a gross value per barrel of crude of 83.7900, a crude cost of 76.0000, a variable operating cost of 3.2000 and a gross margin per barrel of 4.5900. Say which of those four figures the screen fixed by assumption, and which of them a monthly plan would have to find for itself.
