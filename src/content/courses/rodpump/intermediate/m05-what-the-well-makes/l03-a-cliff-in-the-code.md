# A cliff in the code

`incompleteFillage` fires below a fillage of 0.85 and is silent at or above it, so two designs a ten thousandth apart get different treatment while their production differs by a fraction of a barrel a day.

{{panel:pd-card-explorer}}

## The threshold, walked across

| Fillage | Produced, bbl/d | Plunger stroke, in | incompleteFillage |
| --- | --- | --- | --- |
| 0.8520 | 301.999681 | 99.288669 | false |
| 0.8510 | 301.689159 | 99.303132 | false |
| 0.8505 | 301.538133 | 99.311770 | false |
| 0.8501 | 301.420209 | 99.319643 | false |
| 0.8500 | 301.389964 | 99.321361 | false |
| 0.8499 | 301.354487 | 99.321354 | true |
| 0.8495 | 301.243728 | 99.331600 | true |
| 0.8490 | 301.086896 | 99.338355 | true |
| 0.8480 | 300.769475 | 99.350648 | true |

Nine contiguous teaching rows on ODUMA-4. The silent design makes 301.389964 bbl/d and the warned one makes 301.354487 bbl/d, 0.035477 bbl/d apart, on plunger strokes of 99.321361 and 99.321354 in.

## This is a reporting cliff, not an arithmetic error

The test is a hard comparison with no hysteresis and no graduation, and the engine is not wrong to have one. A threshold placed anywhere on a continuous quantity produces this shape: a step in the report where there is no step in the well. The design at 0.8500 is pounding just as hard as the one at 0.8499, and both of them are pounding.

What it costs is the reading a careful person takes from silence. Absence of a warning is evidence that a comparison came back false. It is not evidence of a full barrel, and the row at 0.8500 is the proof.

## The message names the line it just missed

The warned design prints: The barrel fills only 85.0 percent. The load stays on the rods into the downstroke and the unit is pumping air for part of every stroke; slow it down, shorten the stroke or fit a smaller plunger.

That percentage is rounded to a whole number, so at a fillage of 0.8499 the message says the barrel fills only 85, which is the threshold the design just failed. At 0.8480, 0.8460, 0.8450 and 0.8440 it says 84. The text tells a reader the design sits on the limit when it sits below it.

## The warning list is not ordered by how bad things are

Over the wider sweep incompleteFillage stays on all the way down, while rodOverstressed appears at fillages of 0.7200 and 0.7000 and is gone again at 0.6500 and below, with nothing moved but the fillage. Two warnings at 0.7000 against one at 0.6500 does not make 0.7000 the worse design.

## The mistake

Triaging a stack of designs by their warning lists. That sorts 301.389964 bbl/d above 301.354487 bbl/d for a reason with nothing to do with either well. The fix is free: read the fillage, which the caller typed and can always be printed beside the result.

## Exercise

Set the fillage to 0.8500 and then 0.8499 in the panel and record the produced rate and the warning list at each.

Then say what the warning list told you about how far each design sits from the line, and what you would print beside a result instead.
