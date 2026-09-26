# The exceedance definition

{{panel:pr-contract-calculator}}

The contract comparison returns a mean and three percentiles for every cost, labelled P90, P50 and P10. Those labels carry a definition, and in this course the definition decides which figure is the low one. This module is about reading the labels correctly, because a percentile read backwards turns a comfortable budget into a likely overrun.

## One definition, set once

The label is set once, in the platform's `lib/conventions/percentile.js`, and the tender engine imports it from there. Its definition, verbatim:

> P90 means a 90% probability the actual quantity meets or exceeds this value, per SPE PRMS.

This is an exceedance definition. It says how likely it is that the outcome comes in at or above the figure. It is the convention of the SPE Petroleum Resources Management System, written for recoverable volumes. The tender engine keeps the same definition for a cost, so a reader never has to guess which convention a figure uses.

## How the engine reads a percentile

The engine's percentile basis states both the rule and its consequence, verbatim:

> lib/stats basicStats on the sorted values: P90 = index floor(0.1 n), P50 = floor(0.5 n), P10 = floor(0.9 n). P-labels per lib/conventions/percentile.js: P90 means a 90% probability the actual quantity meets or exceeds the value, so for a cost P90 is the LOW cost (10th percentile) and P10 the HIGH cost (90th percentile).

The values are sorted in ascending order, and the first sorted value is index 0. For the Ekene job at 20000 iterations on seed 20270211, the engine reads:

| label | index into the sorted costs | what it is |
| --- | --- | --- |
| P90 | 2000 | the LOW figure: nine outcomes in ten meet or exceed it |
| P50 | 10000 | the middle |
| P10 | 18000 | the HIGH figure: one outcome in ten meets or exceeds it |

## No interpolation

The index is the floor of a fraction of the count, and the engine reads the value at that index as it stands. It does not interpolate between neighbouring values. Another library might interpolate and return a slightly different figure from the same samples. That is a stated choice, and a report that quotes a percentile from this engine names it: floor-index percentiles on the sorted values, under the exceedance labels.

## The definition travels with the figure

The engine returns the definition beside every set of cost percentiles, as the field `percentileDefinition`, and the calculator prints it under the table. A percentile copied into a report without its definition invites the reader to supply one, and the conversational reading, in which a bigger number labels a bigger outcome, is the wrong one here. This course prints every cost P90 beside its definition for that reason.

## Exercise

Open the contract calculator on the view "Contract types on one job" and set `iterations` to 20000 on seed 20270211. Find the block "THE PERCENTILE DEFINITION" under the table and check it against the definition quoted above, then read "THE PERCENTILES, in the engine's words" and match it to the basis. For the day rate row, write the P90 and the P10 side by side with the words "low" and "high" beside the right one. Then set `iterations` to 200 and say which index the engine now reads for each label.
