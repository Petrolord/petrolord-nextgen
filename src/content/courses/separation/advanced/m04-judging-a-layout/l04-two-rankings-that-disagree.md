# Two rankings that disagree

The engine returns two orderings of the breaches and calls neither of them the worst. On ERHA `worstAbsolute` and `worstRelative` name different pairs, and both namings are correct.

{{panel:fc-layout-explorer}}

## The six breaches on one station

| kind | from | to | actual m | required m | shortfall m | shortfall fraction |
| --- | --- | --- | --- | --- | --- | --- |
| spacing | Flare stack | Control room | 46.1777 | 90.0000 | 43.8223 | 0.486914 |
| radiation | Flare stack | Control room | 46.1777 | 64.6458 | 18.4681 | 0.285681 |
| radiation | Crude tank | Transfer pump A | 43.1555 | 59.5294 | 16.3739 | 0.275056 |
| radiation | Crude tank | Transfer pump B | 44.1452 | 59.5294 | 15.3842 | 0.258430 |
| radiation | Crude tank | Heater treater | 50.1598 | 59.5294 | 9.3696 | 0.157395 |
| spacing | Transfer pump A | Transfer pump B | 1.2067 | 3.0000 | 1.7933 | 0.597753 |

`worstAbsolute` names Flare stack to Control room, 43.8223 m short. `worstRelative` names Transfer pump A to Transfer pump B, 0.597753 of its requirement. The pump pair is last on metres and first on fraction, and the flare pair is the other way round.

## Why a relative ranking alone misleads

A fraction has no size in it. Two pumps 1.2067 m apart where the table asks 3.0000 m are missing 1.7933 m, which is a chalk line and a day of steelwork. A control room 46.1777 m from a flare that needs 90.0000 m is missing 43.8223 m, which is a different building or a different plot.

Rank on fraction alone and the pumps come first, so the list hands its top slot to the cheapest item on the plan and buries the one that decides where the control room goes. The fraction is still worth having, because a pair missing most of a small requirement is genuinely close to its neighbour, which an absolute ranking of a small number hides.

## When they agree

The two rankings often name the same pair, which is why a single ranking survived as long as it did. radiationAndTableWithGhostSource has both naming radiation f1 to t1, 18.1988 m of 68.1427 m and a fraction of 0.267069. unknownPairIncomplete has both naming spacing b to c, 22.0090 m of 30.0000 m and 0.733633.

s4RankingsDisagree is the case built to separate them: `worstAbsolute` is spacing f1 to c1, 40.0561 m of 90.0000 m, while `worstRelative` is spacing p1 to p2 at 0.667041. Two breaches, two answers, one plan.

## The ranking that was retired

The retired code returned one ranking, built on the relative shortfall, and labelled it worst. On s4RankingsDisagree it reported `["spacing","p1","p2"]` as the worst breach, which is the pair whose absolute shortfall is the smaller of the two.

Naming one of two orderings the worst is the part that fails. Had it been labelled the largest relative shortfall it would have been a true statement with a second statement missing, and a reader would have known to ask for the metres.

## The mistake

The mistake is escalating off one ranking. A works order written from the relative list starts with the pumps and never reaches the control room, and a works order written from the absolute list moves the control room while two pumps stay closer than the table allows.

The second mistake is averaging the two orderings into a score. A shortfall in metres and a shortfall as a fraction are different quantities, and a combined index hides which of the two put a pair at the top.

## Exercise

Name the pair `worstAbsolute` picks on ERHA and the pair `worstRelative` picks, with the figure each ranking uses. Then explain why the relative ranking puts the pump pair first, why that would misdirect a works order, and what the retired single ranking reported on s4RankingsDisagree.
