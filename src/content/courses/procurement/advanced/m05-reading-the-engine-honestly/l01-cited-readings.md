# Cited readings and their dates

{{panel:pr-contract-calculator}}

An evaluation engine applies rules, and every rule comes from somewhere. This module reads the tender engine the way an auditor would: where each rule comes from, where a source leaves a choice open, what the engine does that no source asks for, and where a source disagrees with itself. It starts with the sources, because a rule quoted without its edition cannot be checked.

## Every source, with its edition and the date it was read

The course follows one rule for every law, regulation and guidance it teaches: each is named with its edition or gazette date and the date it was read, only public texts are quoted, and every threshold, rate, margin and Schedule percentage the engine applies is cited to its section. Every text below was read on 2026-09-26.

| text | edition or date |
| --- | --- |
| World Bank, Procurement Regulations for IPF Borrowers | Seventh Edition, September 2025 |
| World Bank, Procurement Guidance: Evaluating Bids and Proposals (including use of Rated Criteria) | February 2025 |
| World Bank, Standard Procurement Document, Request for Bids, Works, two-envelope | September 2025 |
| World Bank, Standard Procurement Document, Request for Bids, Goods, two-envelope | February 2025 |
| World Bank, Procurement Guidance: Abnormally Low Bids and Proposals | Second Edition, July 2016 |
| Nigeria, Public Procurement Act 2007 (Act No. 14) | Official Gazette No. 65, Vol. 94, 19 June 2007 |
| Nigeria, Nigerian Oil and Gas Industry Content Development Act 2010 (Act No. 2) | commenced 22 April 2010, as enacted |
| Kiiver and Kodym, Price-quality ratios in value-for-money awards, Journal of Public Procurement 15(3) | Fall 2015 |
| Chen, An economic approach to public procurement, Journal of Public Procurement 8(3) | 2008 |

The Regulations were read in their Seventh Edition; the Sixth, of February 2025, is superseded, and none of the evaluation rules used here changed between them. The content Act's Schedule is taught as enacted in 2010. A later target set by the Nigerian Content Development and Monitoring Board enters only as a stated target with its source.

What the engine reads from each is narrow and named. From the Regulations: para 5.50 for the Rated Criteria weighting and the US$10 million high-value line, paras 5.69 and 5.70 for the Most Advantageous Bid, para 6.29 for two envelopes and Annex X paras 3.3 to 3.9. From the two-envelope documents: ITB 34.1 for an omitted item, ITB 35.1 for arithmetic, and Section III for completion time and the combined formula. From the 2007 Act: s.24(3), s.31, s.32(3), s.48 and s.51(2). From the 2010 Act: s.11 with its Schedule, s.14 and s.16. Every result carries its citation in its own `basis.source`, so the rule and the figure never travel apart.

Licensed texts are never quoted. The materials criteria name API 5CT, API 6D, API 10A and API 13A, which are paid standards, and the course names them by number only. Model contracts sold under licence are taught by concept.

## Where a text leaves a choice open

A source that leaves a question open forces an evaluator to answer it. The engine either states its reading in its basis or reason, or makes the answer a required input:

| question the text leaves open | what the engine does |
| --- | --- |
| which bids price an omitted item | the other bids still responsive; a bid never prices its own omission |
| what the completion-time rate applies to | the corrected price less the unconditional discount, stated in every schedule reason |
| three phrases of s.14 | two read as stated in every reason; "at least 5% higher" is the required input ncLeadBasis |
| how to add man-hours to tonnes | a weighted mean with the bid's stated weights |
| which standard deviation the relative ALB test uses | the population one, as the Guidance's own Annex I Example 1 computes it |
| the pass mark, the weights, the technical weight, the band | required inputs with no default |

A reading stated in every reason travels with every figure it moves. A reader who disagrees with it can see exactly where, and rerun the evaluation with the other answer where the engine makes it an input.

## Exercise

Open the contract calculator on the view "The whole tender, any award basis" and change `ncLeadBasis` to "relative". Read the award reason under the tiles: it carries the engine's three readings of s.14. Match each reading to its row in the second table above. Then open the view "The engine refusing, in its own words". Every refusal there names an input with no default: say which of them appear in the second table above, and for each of the others say why the engine asks the caller instead of choosing.
