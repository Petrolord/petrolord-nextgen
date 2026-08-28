# Endpoints and axis closure

The Associate tier learned the rule: SWOF closes at 1, SGOF closes at one minus connate water. This lesson is about why endpoints are the part of a saturation table that carries the most physics and gets checked the least.

## The four endpoints in SWOF

| position | Sw | krw | krow |
|---|---|---|---|
| connate water | 0.35 | 0 | 0.9 |
| residual oil | 0.75 | 0.3 | 0 |

Four numbers, and between them they set the whole scale of the displacement.

**Connate water 0.35** is how much of the pore space is water that never moves. It sets the oil in place, because oil saturation starts at one minus it.

**Residual oil 0.25** is how much oil is left behind the front. It sets the maximum displacement efficiency, because the movable oil is one minus connate water minus residual oil, over one minus connate water.

**The endpoint mobilities 0.3 and 0.9** set the mobility ratio, which controls whether the flood is stable or fingers.

Everything in between is shape. The endpoints are magnitude.

## Why endpoints are where errors hide

Because the middle of a curve is visually obvious and the ends are not.

Plot two SWOF tables with different exponents and the difference is a visible bulge. Plot two with the same exponents and different residual oil and the curves look nearly identical over most of their range and differ only in where they stop, which is exactly where the eye stops looking.

Yet a residual oil of 0.30 rather than 0.25 removes an eighth of the movable oil from the field.

## The axis closure check again

The single most useful check is the one the Associate tier learned:

$$S_{wc} + S_{g,\max} = 0.35 + 0.65 = 1$$

If SWOF's first saturation and SGOF's last do not sum to one, the two tables were not built from the same rock, and one of them has the wrong axis.

It takes five seconds and it catches the most common structural error in a PROPS section.

## The second check

The oil endpoints should agree between the two tables. SWOF's krow at connate water is 0.9, and SGOF's krog at zero gas is also 0.9.

Both describe the same thing: the oil's mobility when it is the only mobile phase. A deck where those differ describes a rock whose oil permeability depends on which other phase is absent, which is not a thing.

Ekene's tables agree, at 0.9 in both.

## What the endpoints do NOT tell you

Whether they are right for the field.

Endpoints come from core plugs, and core plugs are small, few, and selected. Residual oil in particular is notoriously hard to measure and notoriously variable, and a field-wide residual oil saturation taken from three plugs is a strong assumption presented as a number.

The deck cannot express that uncertainty. It carries one number, and the study is where the range belongs.

## The misconception to avoid

"Both tables must run the full saturation range for consistency." They must run the range their phase can reach, and those ranges are different because connate water occupies pore space that gas can never enter. Forcing both to the same range is the axis-closure error, and it does not make the tables more consistent, it makes the gas one wrong.

## Exercise

First, compute the maximum displacement efficiency from the connate water and residual oil, then recompute it for a residual oil of 0.30 and state the percentage of movable oil lost.

Second, name the two endpoint checks in this lesson and say what each one would catch.
