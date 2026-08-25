# The worst residual

The Associate tier told you the headline: the worst residual in the set is the deviated well's BaseB at 45.028 m, because deviation moves the bottom of the hole. This lesson keeps the number and complicates the slogan, because the graded understanding is the decomposition, not the headline.

## The number, derived

W2's BaseB pick lands at (1695.7247316819194, 2200), TVDSS 1623.9426579556343. The clamped BaseB surface there reads 1578.9144946336385. Residual: $1623.9426579556343 - 1578.9144946336385 = 45.02816332199586$ m, the largest absolute value in the table, and the capstone's worst_res field.

## The slogan's problem

If deviation were the whole story, vertical wells would have small BaseB residuals. They do not: W3 carries plus 37 and W4 plus 36 with zero deviation. The slogan explains 45 only if it also explains why 37 and 36 need no explaining, and it cannot. So decompose.

What deviation actually did to W2's BaseB row: it landed the pick 295.72 m east of the wellhead, at a place where the clamped BaseB surface reads 1578.91. Had the pick been landed at the wellhead, module five shows the surface there reads 1573.0 and the assumed depth would be different too. Deviation determines WHERE the disagreement is measured and how large the trajectory-derived part is.

What deviation did NOT do: create the disagreement itself. The disagreement is mostly that the model's zone B east of the fault line of pinch-out has been clamped to zero thickness while every well logs 30 m of zone B. That mechanism produces plus 37 and plus 36 at the vertical eastern wells all by itself, next lesson's subject, and it is present in W2's row too.

## The honest decomposition

Next lesson derives an exact ledger identity for vertical wells: the BaseB residual equals the TopB residual plus the zone B disagreement. W2's version carries trajectory effects in both terms, but the same structure holds approximately: of W2's 45.03, about 8.3 belongs to the same mild TopB-level bias every well shows, and the balance, around 36.7, matches the missing-zone signal the eastern wells show. Deviation's distinctive contribution was to move the measurement point east into the pinched region and to make the arithmetic non-integer; the SIZE of the number is mostly the zone story.

This is why the tier bothers with a full table rather than a headline. The largest number in the table is real, graded, and correctly computed, and yet attributing it to "deviation" would misdirect the fix toward the trajectory, when the model's actual defect, if it is one, lives in the clamped zone B. The table's cross-checks, especially the vertical eastern wells, are what stop the misattribution.

## What "worst" is for

Operationally, the worst residual is a triage pointer: it says where to look first, not what is broken. Its value as a capstone field is that finding it requires the whole pipeline to be right: all four trajectories, all twelve landings, all twelve samples, and the absolute-value comparison across them. It is a pipeline integrity check disguised as a lookup.

## Worked example

Confirm that 45.028 really is the maximum by listing the candidates over 30: W2 BaseB 45.02816332199586, W3 BaseB 37, W4 BaseB 36, and the runner-up sign-flipped W2 TopA at 35.75883821136131 in absolute value. The margin between first and second place is 9.27 m. Note what the ranking would look like with an UNSIGNED table: identical. And with a signed-maximum instead of absolute-maximum rule, the answer would still be W2 BaseB, but W2 TopA at minus 35.76 would drop from second place to last, which is why worst-by-absolute-value is the only defensible convention for a QC ranking.

## Exercise

Suppose W2's survey had recorded a 30 degree build instead of 45, everything else unchanged. Without computing the new trajectory, state qualitatively what happens to each of the two components of its BaseB residual: the trajectory-borne part and the missing-zone part. Which direction does the total move, and can you be sure of its sign without computing? Answer in three sentences.
