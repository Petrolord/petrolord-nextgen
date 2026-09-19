# A cut set that closes

A set of cuts that covers a whole crude should account for all of it. cutYields reports the total as it computes it, never normalised, and the set closes only when every cut has a yield and the total is within the engine's closing tolerance of 100 percent.

{{panel:crude-assay-explorer}}

## Four crudes that close

| crude | total | closes | cuts with no yield |
| --- | --- | --- | --- |
| Obigbo Light | 100.0000 | true | nothing |
| Egbema Medium | 100.0000 | true | nothing |
| Asarama Heavy | 100.0000 | true | nothing |
| Ubie Condensate | 100.0000 | true | nothing |

Each of the four full curves runs from 0 to 100 percent, and the studio's six default cuts run from the start of the curve to its end with no gap between them. So every cut has a yield, the six yields total 100.0000, and each set closes.

## A crude that does not

The Ebocha partial assay starts at 4 percent and stops at 88.

| crude | LPG / Light ends | Naphtha | Kerosene / Jet | Diesel / Gasoil | Vacuum gasoil | Vacuum residue | total | closes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Ebocha partial assay | unknown | unknown | 16.3881 | 17.2861 | unknown | unknown | 33.6742 | false |

Four of its six studio cuts reach outside the measured range, so they have no yield: LPG / Light ends, Naphtha, Vacuum gasoil and Vacuum residue. The engine names all four. Its known cuts total 33.6742 percent, and the set does not close.

## Why the total is never normalised

A tempting tidy-up would scale the known cuts so that they add to 100. The engine does not do it, and the reason is the whole point of this lesson. Scaling Ebocha's two known cuts up to fill the barrel would claim that the crude is nothing but kerosene and diesel, which the assay does not say. The total of 33.6742 tells the honest story: this much of the barrel is accounted for by cuts the curve can answer, and the rest is not.

## A cut set inside the curve

A cut set drawn inside the partial curve has every yield.

| crude | 110 to 370 F | 370 to 760 F | 760 to 920 F | total | closes | cuts with no yield |
| --- | --- | --- | --- | --- | --- | --- |
| Ebocha partial assay | 21.0000 | 45.0000 | 18.0000 | 84.0000 | false | nothing |

Every one of the three cuts has a yield, so the unknown list reads nothing. The total is 84.0000, and the set still does not close. The cuts cover the curve from 110 F to 920 F, which is the measured range from 4 percent to 88, and the parts of the barrel outside that range belong to no cut.

This row separates the two conditions for closing. Every cut having a yield is one. The total being within tolerance of 100 percent is the other. Ebocha's inner set meets the first and misses the second.

## Reading closes in practice

A cut set that closes is a complete product slate, and it can be priced. One that does not close is telling you that part of the barrel is unaccounted for. The remedy is either a fuller assay or a cut set that says openly what it covers. The engine reports closes as true or false and names every cut with no yield, so a reader never mistakes a partial slate for a whole one.

## Exercise

Read the two Ebocha rows in this lesson. Quote the total and the closes flag of each, and the cuts with no yield. Say what the two rows together show about the two conditions a cut set must meet to close. Then explain why normalising Ebocha's 33.6742 percent to 100 would misstate the crude.
