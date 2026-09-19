# A screen before a study

A feasibility screen is the cheapest look at a refinery that still produces a number. It takes a handful of inputs, returns a margin per barrel and a set of annual streams, and it does this before anyone has paid for engineering. A study follows only if the screen gives a reason to.

{{panel:refinery-screen-explorer}}

## What the screen takes

OKORDIA is the invented plant this tier screens. Its inputs, as the digest prints them:

| input | OKORDIA |
| --- | --- |
| configuration | hydroskimming |
| capacity | 5000 bpd |
| on-stream days | 330 |
| supply | firm (utilisation 0.9200, crude premium 0.0000) |
| crude cost | 76.0000 a barrel |
| fixed operating cost | 7500000.00 a year |
| variable operating cost | 3.2000 a barrel |
| construction years | 2 |
| operating years | 20 |

Add a vendor quotation for capital and a price for each product and the screen has everything it needs. Each input is a box on the panel, and each box is one thing a person has to know or assume.

## What the screen returns

The function behind the panel is feasibilityStreams. From those inputs it returns a capital figure of 64000000.00, a capital per bpd of 12800.00, an annual throughput of 1518000.00 bbl, a gross value per barrel of crude of 83.7900 and a gross margin per barrel of 4.5900. It also lays out the years: two construction years carrying capital and twenty operating years carrying revenue and costs, 22 years in the streams.

Those streams are what feasibilityEconomics hands to the screening engine for a valuation. That valuation, and the NPV and IRR the Studio shows from it, belong to the Economics courses. This tier reads the streams and the margin that drives them.

## Why a screen is shaped like this

A screen is built to be argued with. Every figure it prints comes from an input you can see, so a disagreement about the answer turns into a disagreement about one box. If someone doubts the margin, the question becomes whether the crude cost of 76.0000 a barrel or the product prices are right. If someone doubts the capital, the question becomes whether the vendor quotation or the exponent is right.

That traceability is also the screen's limit, and it shows its limits as openly as its answers. Each configuration carries one fixed row of yields. The annual streams print a crude run of 1518000.00 bbl, a revenue of 127193220.00 and a crude cost of 115368000.00 in year 2, in year 3 and in year 21. A reader who wants a plant that changes from year to year needs a different tool.

## Reading the panel

Set the panel to OKORDIA's inputs and check the returns against the figures above before you move anything. Then change one box at a time. A screen read one box at a time tells you which inputs the margin is sensitive to, and a screen read with several boxes moved together tells you very little.

## The mistake

Treating the screen as the answer to whether to build. It answers a narrower question: at these prices and this run rate, does a barrel of crude earn more than it costs to buy and process? A positive gross margin earns the project a study. A negative one earns it a hard look at the inputs that produced it.

## Exercise

Read OKORDIA's inputs and its returns. Name the three inputs that set the annual throughput of 1518000.00 bbl, and the three figures that set the gross margin per barrel of 4.5900. Then say which input appears in neither calculation and where it shows up instead.
