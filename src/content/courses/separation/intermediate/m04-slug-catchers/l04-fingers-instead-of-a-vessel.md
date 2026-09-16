# Fingers instead of a vessel

The same slug can be held in a harp of pipe rather than in a drum. ABANA's 350.000000 bbl in 5.000000 fingers of 20.000000 inch bore, filled to 0.800000, needs 2456.380208 ft3, which is 225.184350 ft in each finger and 1125.921751 ft of pipe in total.

{{panel:fc-slug-explorer}}

## A volume spread across pipes

Each finger of 20.000000 inch bore offers 2.181662 ft2 of cross-section. Five of them share the 2456.380208 ft3 the harp needs, which puts 225.184350 ft in each, and the total pipe to be bought and supported is 1125.921751 ft.

A harp is sized on bore, count and fill in the same way a drum is sized on volume and slenderness. Two of the three are choices: how many fingers, and how large a bore.

## The harp ignores the normal inflow

This is the reading trap in the whole topic. The vessel form takes the slug and the normal inflow and sizes on 391.666667 bbl of working volume. The finger form takes the slug alone and sizes on 350.000000 bbl.

The two forms are answering slightly different questions from the same inputs, and the difference is exactly the 41.666667 bbl the normal inflow contributes. A reader comparing a drum against a harp on their volumes is comparing an answer that includes the hold against one that does not.

## Two published harps

| case | fingers | bore inch | fill | volume ft3 | per finger ft | total pipe ft |
| --- | --- | --- | --- | --- | --- | --- |
| finger1500bbl6x24in | 6.000000 | 24.000000 | 0.800000 | 10527.343750 | 558.492932 | 3350.957591 |
| finger500bbl4x16in | 4.000000 | 16.000000 | 0.750000 | 3743.055556 | 670.191518 | 2680.766073 |

The second case holds a third of the slug of the first and its fingers are longer, 670.191518 ft against 558.492932 ft, because a 16.000000 inch bore across four fingers is much less cross-section than a 24.000000 inch bore across six.

## When the fingers get too long

Squeeze ABANA's slug into 2.000000 fingers of 12.000000 inch bore and each one comes out at 1563.780209 ft, with a warning attached: "fingers longer than about 1500 ft each: add fingers or a larger bore rather than building a very long harp".

The engine still returns the dimensions. The warning is advice about buildability rather than a refusal, and the fix it names is the right one: more fingers or a wider bore, rather than a longer run of pipe.

## The mistake

The mistake is choosing the harp because its volume looked smaller. ABANA's harp needs 2456.380208 ft3 against the drum's 3665.075231 ft3, and part of that gap is the fill fraction of 0.800000 against 0.600000 while the rest is the normal inflow the harp never counted.

## Exercise

Size ABANA's harp: give the volume, the length per finger and the total pipe, and state the cross-section of one 20.000000 inch finger. Then explain which quantity the finger form leaves out that the vessel form includes, and give the warning the engine attaches at 1563.780209 ft.
