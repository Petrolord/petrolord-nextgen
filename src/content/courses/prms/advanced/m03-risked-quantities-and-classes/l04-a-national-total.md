# A national total

{{panel:prms-aggregation-calculator}}

A national reserves figure is an aggregation far above the field level, added up by a regulator. In this course it is "reported reserves", quoted with its date and with who reported it, because "reserves" alone means the PRMS class.

## Who evaluates the national figure

The Petroleum Industry Act 2021 (Act No. 6; Official Gazette No. 142, Vol. 108, 27 August 2021) gives the Commission the evaluation of national reserves. The course's paraphrase: one function of the Commission is to evaluate the national reserves and set policy for prudent reservoir management.

> "(i) undertake evaluation of national reserves and develop policies for prudent reservoir management practices ;" (PIA s.7(i))

The Act is public, and the course quotes it as printed, the space before the semicolon included.

## The published figure

The NUPRC published the national annual petroleum reserves position as at 1 January 2026 in a media release dated 1 April 2026. Its page reads all rights reserved, so the course cites its figures and its date only. It prints the 2P associated gas at 100.21 and the 2P non-associated gas at 114.98 trillion cubic feet, a total of 215.19.

## The engine adds it

The golden case "agg-nuprc-2026-gas-2p" states each published 2P figure as one value, a constant with low, best and high the same, at the above-field level:

| project (golden input) | the stated 2P |
| --- | --- |
| AG, associated gas, 2P as published | 100.210000 |
| NAG, non-associated gas, 2P as published | 114.980000 |

The engine sums them to 215.190000 and reports "arithmetic" as what may be reported at the above-field level. Two constants have no spread to sample, so the Monte Carlo of that call is a formality: it runs on seed 1 with 100 draws and every draw is the same total.

## What the labels mean here

Because each stated figure is a constant, the engine's labels read 1P, 2P and 3P for the one figure. Only the 2P was published, and a report prints only that.

## What the course does not claim

The release prints a crude oil and condensate figure as well, and as its page renders the crude oil figure is truncated. The course uses only the gas figures and the total, and computes nothing from the truncated one. More broadly, no gazetted NUPRC reserves reporting regulation or booking guideline was found on the Commission's list of gazetted regulations read on 2026-09-27. This course therefore states no Nigerian booking rule. The Nigerian Upstream Petroleum (Commercial) Regulations, 2025 (S.I. No. 7 of 2025) ask for a status report that includes a statement of the reserves situation; the course takes that by concept only.

## A published total as a check

A regulator's total is a published check the engine can reproduce at the level PRMS 4.2.5.4 treats as arithmetic. It checks the arithmetic and the level, and leaves the figures underneath as stated.

## Exercise

Open the aggregation calculator on the view "Aggregation: arithmetic and probabilistic" and start from "The national 2P gas figure". Read the two projects, their distributions and the arithmetic table. Read the "What may be reported" and "Level" tiles. Then write the national 2P gas figure as a report would quote it, with its unit, its date, who reported it and the words "reported reserves", and one sentence saying why the 1P and 3P labels on this call are not published figures.
