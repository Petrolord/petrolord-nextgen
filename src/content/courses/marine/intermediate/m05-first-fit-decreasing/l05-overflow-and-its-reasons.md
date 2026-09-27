# Overflow and its reasons

{{panel:marine-deck-calculator}}

Every unit a deck plan cannot place is overflow, with a reason in the engine's own words. Module four read the reasons that call for a different deck. This lesson reads the other kind: a unit that would fit an empty voyage finds no room at its turn, which calls for another voyage.

## How the reason is built

The reason is written after every earlier unit in the packing order has been placed. It states, in order: what the unit needs in usable area and deck load; the most usable area left on any voyage at its turn, marked short or enough; the most deck load left, marked the same way; and the limit that stops it. The first Ekene overflow unit under first-fit decreasing, verbatim:

> skip#6 is overflow: it needs 4.5 m2 of usable area and 3 t of deck load; at its turn the most left on any voyage was 3.1704 m2 (short) and 1503 t (enough); usable area stops it

The skip needs four and a half square metres, barely three are left, and deck load is plentiful: area stops it.

## The four endings

The limit is named in one of four endings. The golden cases show each:

| case | rule | voyages | the ending |
| --- | --- | --- | --- |
| usable area stops a unit | first-fit-decreasing-area | 1 | usable area stops it |
| deck load stops a unit | first-fit | 1 | deck load stops it |
| both limits stop a unit | first-fit | 1 | usable area and deck load both stop it |
| no one voyage has both | first-fit | 2 | no one voyage had both, so usable area and deck load together stop it |

The first three are read straight off the short and enough marks: one short limit names itself, and two short limits are named together. The fourth needs care. Its reason, verbatim:

> c is overflow: it needs 3 m2 of usable area and 1 t of deck load; at its turn the most left on any voyage was 9 m2 (enough) and 9 t (enough); no one voyage had both, so usable area and deck load together stop it

Both marks say enough, and the unit still overflows. The area left is on one voyage and the deck load left is on the other: each limit alone would pass, and no single voyage passes both. The reason names the pair because the planner has to know that neither a larger deck nor a stronger one would help alone.

## Room used exactly

On the last golden case the unit before c fills the voyage exactly, which fits because a fit is inclusive, and nothing is left at c's turn:

> c is overflow: it needs 1 m2 of usable area and 1 t of deck load; at its turn the most left on any voyage was 0 m2 (short) and 0 t (short); usable area and deck load both stop it

A reason explains the plan; the numeric fields in the voyage table are the figures to reason with.

## Exercise

Open the deck calculator, choose the view "The deck plan".

1. Start from each of "Usable area stops a unit", "Deck load stops a unit", "Both limits stop a unit" and "No one voyage has both" in turn, and match each overflow reason to its ending in the table.
2. On "No one voyage has both", change "Voyages (stated)" to 3. Before you read the result, predict whether c still overflows and where it goes.
3. On "Deck load stops a unit", set "Deck load, t (stated)" to 11. Predict whether b fits, and say which rule of the fit decides it.
