# Reporting a volume honestly

The mapping course closed its reading module with a list of five questions to ask of a map before believing a single contour. This lesson does the same job for a volume, and the rule behind it is the same rule: a number is only as good as the statement of what supports it.

## A single STOIIP is not a result

Suppose you write 12.139208107496763 MMstb in an email and press send. Every digit of that is exactly what the engine returned. It is still not a result, for three reasons.

It does not say which contact it assumes, and the previous lessons showed that the same map and the same properties give 3.835815 MMstb at 1550 m and 22.044451 MMstb at 1570 m. A reader who does not know the contact cannot tell which of those three worlds you are in.

It does not say which properties it assumes. NTG of 0.8, porosity of 0.20, water saturation of 0.35 and Bo of 1.2 were handed over as constants at this tier, and each one multiplies the chain once. A reader who assumes different constants will not reproduce your number and will have no way of knowing why.

It does not say which surface it was built on. The Ekene volume rests on a TOP_SAND grid at a 100 m cell with an 800 m extrapolation limit, which left 201 live nodes of the 500 in the frame. Change the cell size or the limit and the mapped ground changes, and the volume changes with it.

The twelve decimal places make it worse rather than better. Precision that the inputs do not support is a claim, and a reader who takes it seriously has been misled by a number that was arithmetically correct.

## What has to travel with the number

Four things, and they fit in a short paragraph.

The contact, with its evidence or with a plain statement that it was assumed. The properties, as the values used and where they came from. The surface and its settings, meaning cell size, extrapolation limit and live node count. And the range, meaning the volume at a low and a high contact as well as the mid case.

A model paragraph for Ekene reads like this. The SAND accumulation at an assumed oil water contact of 1560 m holds a gross rock volume of 22.269036 million m3 over 169 grid cells of 100 by 100 m, giving a STOIIP of 12.139208 MMstb at NTG 0.8, porosity 0.20, water saturation 0.35 and Bo 1.2. The volumes were computed on a TOP_SAND grid at a 100 m cell with an 800 m extrapolation limit, 201 live nodes. The contact is assumed rather than measured, and at contacts of 1550 m and 1570 m the same map and properties give 3.835815 and 22.044451 MMstb.

That is four sentences. It carries every number a reader needs in order to reproduce the work or to disagree with it in a specific place.

## Rounding is part of honesty

Two different audiences want two different levels of precision, and both are legitimate.

The capstone wants the engine value, because it is checking that you read the panel correctly rather than that you have judgement about significant figures. Report what the panel shows.

A partner, a management report or a reserves submission wants a number rounded to what the inputs support. On this kind of input, about 12.1 MMstb at the mid case is the right level, with the low and high cases quoted at the same level. Rounding the mid case to twelve decimal places while the contact is uncertain by ten metres is a statement that the volume is known to a fraction of a barrel, and no reader should believe it.

One more rounding trap is worth naming. Do not round the low and high cases inward to make the spread look tidier than it is. The range on Ekene runs from 3.835815 to 22.044451 MMstb around a mid case of 12.139208 MMstb, and that spread is the most informative thing in the whole booking. It says that the field could be a modest development or a substantial one, and that the question deciding which is the depth of the contact rather than anything about the rock.

## The habit to carry

When you are handed a volume, ask the four questions in order: what contact, what properties, what surface and settings, and what range. When you produce a volume, answer them before you are asked.

You will find that the questions do more than protect the reader. They protect you, because you cannot answer the fourth one without having computed the low and high cases, and computing them is what turns a single number into an understanding of the field.

## Exercise

Take the four sentence model paragraph above and cut it down to a single sentence that could sit in a table cell, keeping as much of the supporting information as will fit. Then write down which piece of information you dropped and what a reader could now get wrong.

Self check: a workable single sentence is that the Ekene SAND holds 12.139208 MMstb of STOIIP at an assumed 1560 m contact, with 3.835815 MMstb at 1550 m and 22.044451 MMstb at 1570 m. That keeps the contact, keeps the range and keeps the fact that the contact is assumed. What you dropped is the property set and the grid settings, so a reader cannot reproduce the number and cannot tell whether a difference against their own booking comes from the properties, from the cell size and extrapolation limit, or from something real about the rock. The safe way to drop them is a footnote pointing at the full paragraph rather than silence.
