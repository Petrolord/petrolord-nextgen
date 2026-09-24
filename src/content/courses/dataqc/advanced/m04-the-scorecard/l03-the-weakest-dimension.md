# The weakest dimension

{{panel:dq-monitor-explorer}}

Beside the total, the scorecard names the weakest dimension: the one with the lowest score. On EKENE-3 it is uniqueness, at 0.538462, under equal weights and under the stated weights alike. The totals are 0.889531 and 0.927390, and neither of them shows that 6 of the 13 well names duplicate an earlier one. The weakest dimension does.

| scorecard | total | weakest | weakest score |
| --- | --- | --- | --- |
| EKENE-3, equal weights | 0.889531 | uniqueness | 0.538462 |
| EKENE-3, stated weights 3, 2, 2, 1, 1 | 0.927390 | uniqueness | 0.538462 |
| the tie example, stated | 0.916667 | validity | 0.9 |
| RHOB completeness beside NPHI validity | 0.953903 | | |

## Why a total needs a weakest

A weighted mean lets strong dimensions cover for a weak one. On EKENE-3 four of the five scores lie between 0.966667 and 0.988506, and they carry the total. The weakest dimension is reported so that the one score the total smooths over is named every time. A reader who stops at the total can miss the duplicated names; the weakest dimension puts them first.

## The tie rule

Two dimensions can share the lowest score. The engine's rule is stated in its basis block, verbatim: "the weakest is the lowest score; a tie goes to the dimension listed first". The stated example: scores 0.9, 0.9 and 0.95 for validity, completeness and consistency, listed in that order. Validity and completeness tie at 0.9, and validity is named because it is listed first. The total is 0.916667.

A tie rule looks like a detail. It matters because a scorecard is run again and again, and a weakest dimension that flipped between runs on equal scores would read as a change in the data when nothing had changed. A stated rule makes the answer the same every time, and the caller controls it through the order in which the dimensions are listed.

## A direct score beside a counted one

A dimension may carry a score directly. The stated example sets RHOB completeness at 0.950000 as a direct score and counts NPHI validity from its range check, 237 checked and 10 failed, and the total is 0.953903. The two rows describe different channels of EKENE-7's log, and the scorecard accepts them together because each row carries its own rule: "score, or 1 - failed / checked". The note says which rows were direct and where each score came from.

## What the weakest dimension asks for

The weakest dimension is the first place to look. On EKENE-3 it points at the well names: exact repeats, names equal after normalisation, and one near pair, EKENE-4 and EKNE-4. The fix is a decision about the names, made by someone who knows the wells, and the engine flags the pairs without choosing between them.

## Exercise

The panel's scorecard view lists its five rows in the engine's display order, completeness first. Give completeness and validity the same counts, 10 checked and 1 failed each, so both score 0.9, and leave the other rows scoring higher. Read which of the two the panel names as weakest, and explain it from the tie rule and the listing order. Then return to EKENE-3's five rows and find the largest number of uniqueness failures, out of 13 checked, at which uniqueness is no longer the weakest.
