# The capstone walkthrough

The capstone asks for six numbers from this model, and this lesson walks the full derivation of each, with the panel open for verification. Everything is a re-run of earlier lessons; the value of the walkthrough is seeing the six as one connected computation.

{{panel:em-tie-explorer}}

## Field one: W2's TVDSS at its TopA pick

Trajectory: build endpoint at station 1500 (x 1511.876968573417, TVDSS 1440.0948948471319), then linear interpolation at fraction $0.2$ toward station 1900. TVDSS $= 1440.0948948471319 + 0.2 \times 282.84271247461896 = 1496.6634373420557$. Graded to 0.01, and every digit is closed-form: an arc, a hold and a fraction.

## Fields two through four: three residuals

W1 BaseB: vertical shortcut, 1595 minus 25 gives 1570; clamped BaseB at (1100, 2100) reads 1565; residual plus 5.

W2 TopB: landed at fraction 0.5 into the hold, TVDSS 1581.5162510844414; clamped TopB at the landing blends columns 13 and 14 on row 4 to 1573.1978994886435; residual plus 8.318351595797822.

W3 TopA: 1580 minus 20 gives 1560 against 1559 at the wellhead node; residual plus 1.

Note what the three jointly certify if you get them right: the vertical shortcut with KB handling (W1, W3), the full deviated chain (W2), and sampling at both node and non-node locations.

## Field five: the worst residual

Scan all twelve absolute values; the maximum is W2 BaseB at 45.02816332199586. The panel shows it on every well view as the fixed "worst in set" tile. If your pipeline produces a different row as worst, the specific row it produces is diagnostic: W3 or W4 BaseB winning usually means W2's trajectory was never built; W2 TopB winning usually means a sign was dropped in the TopA row.

## Field six: W2's zone A control point x

Zone A interval 1580 to 1700, midpoint MD 1640, landed at fraction 0.35 into the hold: x $= 1511.876968573417 + 0.35 \times 282.84271247461896 = 1610.8719179395334$. Graded to 0.01. The wrong-but-plausible answers each tell a story: 1400 means the vertical assumption; 1568.45 means the TopA landing was reused; 1653.30 means TopB's.

## The connected picture

One trajectory (W2's) feeds four of the six fields; the other two are the vertical controls. The capstone is deliberately structured so that a candidate who has only memorised the worst residual still has to build the machinery for the rest, and a candidate whose machinery is subtly wrong fails specific fields in diagnosable ways. That is what makes it a practical exam rather than a quiz: the six numbers are one pipeline's outputs, and the pipeline is the thing being graded.

## Worked example

Run the whole set in the panel now. Select W2, survey trajectory: read TopA TVDSS 1496.66 from the pick-versus-surface tile, TopB residual plus 8.318 from its residual tile, the control point x 1610.87 from its tile, and the worst tile's 45.028. Select W1: BaseB residual plus 5. Select W3: TopA residual plus 1. Six fields, three panel selections, under a minute, and every one traceable back through the modules that derived it.

## Exercise

For each of the six fields, name the single earlier lesson whose content most directly derives it, and the most likely wrong answer a candidate would produce by skipping that lesson. Six lines.
