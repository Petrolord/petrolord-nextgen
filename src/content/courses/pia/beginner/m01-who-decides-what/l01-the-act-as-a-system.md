# The Act as a system

{{panel:pia-royalty-calculator}}

The Petroleum Industry Act 2021 is usually described as a long list of rates. This course reads it as a system. For any barrel or cubic foot a lease produces, the Act and the texts around it decide four things: which instrument applies, who pays it, on what base it is charged, and since when the rule has been in force. Learn to ask those four questions and the rates fall into place.

## Four questions for every line

Take any line a government receives from a Nigerian upstream lease: a royalty, a tax, a levy or a contribution to a fund. Each line answers the same four questions, and each answer comes from a cited provision.

| question | what decides it | an example this tier teaches |
| --- | --- | --- |
| which instrument | the kind of product and the kind of licence | condensate pays royalty as crude oil |
| who pays and who collects | the licence holder pays; the Act names the collector | the Service assesses the hydrocarbon tax |
| on what base | the value, volume or profit the rate reads | royalty reads the value of production |
| since when | the year of assessment and the text in force | the development levy in years under the Nigeria Tax Act 2025 |

## One engine behind every figure

Every figure in this course comes from one engine, the ledger function `computeCashFlow` and the rate functions it calls. It takes the terms of a lease and three sets of rows (production, capex and opex) and returns one row a year and a set of totals. When an input breaks a rule of the texts, the engine refuses and says exactly which condition failed.

The course teaches 41 provisions. The engine computes 27 of them, and those can be graded, but only on a figure the engine returns. The other 14 are concept-only: taught from the text with their citation and never graded on a number. The fiscal oil price the Commission sets and the terms of a lease that has not converted are two examples.

## What each tier owns

This Associate tier draws the map: the institutions, the licences and terrains, royalty by terrain and by price, and the instruments stacked on one year. The Professional tier takes up the hydrocarbon tax as a system. The Expert tier takes up the transitions and the reading of a whole fiscal outcome.

## What this course leaves to others

Two other courses share this ground. The cash flow course owns the ledger arithmetic: discounting, NPV, IRR, payback, the order of the ledger rows, loss pools and working-interest scaling. The fiscal course owns regime design in the abstract: sliding scales, R-factors and templates. This course names the provision behind a line and points to those courses for the arithmetic.

## The data is synthetic

Every lease in this course is an Ekene teaching case written for this platform. No real company, licence, field or price list appears. The numbers are realistic in shape so that the rules have something to act on.

## Exercise

Open the royalty calculator and choose the view "Royalty by terrain and daily rate". Set the terrain to shallow_water, the daily rate to 8320 and the year to 2026, which is Ekene Alpha in its first year. Read the weighted royalty rate; the course prints it as 0.059976. Now change only the terrain, to deep_offshore and then to frontier, and write down each rate the engine returns. For each of the three answers, name which of the four questions the terrain answered.
