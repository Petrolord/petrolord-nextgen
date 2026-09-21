# The refinery draws its own cuts

The same blend has different yields at different refineries. Nothing about the crude changes. The cut set does.

{{panel:crude-valuation-explorer}}

## Two cut sets on one curve

Kwale is a topping refinery with no vacuum unit. Its cut set ends at atmospheric residue, from 650 F with no upper bound, running to 100 percent. The course gives the reason in its own words: "The Kwale refinery has no vacuum unit, so its cut set ends at atmospheric residue." The studio's default cut set, which the Associate tier used on the Obigbo library, is a vacuum refinery's: it splits the heavy end at 1000 F into vacuum gasoil and vacuum residue.

| cut | Kwale from F | Kwale to F |
| --- | --- | --- |
| LPG / Light ends | no lower bound (from 0 percent) | 90 |
| Naphtha | 90 | 330 |
| Kerosene / DPK | 330 | 480 |
| Diesel / AGO | 480 | 650 |
| Atmospheric residue | 650 | no upper bound (to 100 percent) |

| cut | default from F | default to F |
| --- | --- | --- |
| LPG / Light ends | no lower bound (from 0 percent) | 90 |
| Naphtha | 90 | 350 |
| Kerosene / Jet | 350 | 500 |
| Diesel / Gasoil | 500 | 650 |
| Vacuum gasoil | 650 | 1000 |
| Vacuum residue | 1000 | no upper bound (to 100 percent) |

## The Kwale blend on both

The tables below print the Kwale blend, 55 and 45, on each.

| cut (Kwale's set) | yield volume percent |
| --- | --- |
| LPG / Light ends | 0.7174 |
| Naphtha | 20.5591 |
| Kerosene / DPK | 16.2860 |
| Diesel / AGO | 19.3849 |
| Atmospheric residue | 43.0526 |

| cut (the studio's default set) | yield volume percent |
| --- | --- |
| LPG / Light ends | 0.7174 |
| Naphtha | 22.6185 |
| Kerosene / Jet | 16.6604 |
| Diesel / Gasoil | 16.9510 |
| Vacuum gasoil | 26.6940 |
| Vacuum residue | 16.3586 |

## Reading the two tables

Both sets draw LPG / Light ends from 0 percent, with no lower bound, to 90 F, and both tables print 0.7174 for it. Where the bounds are the same, the yield is the same, because it is the same stretch of the same curve.

Everywhere else the bounds differ. Kwale ends naphtha at 330 F; the default set ends it at 350 F. Kwale's kerosene runs 330 to 480 F; the default's runs 350 to 500 F. Kwale's diesel runs 480 to 650 F; the default's runs 500 to 650 F. Each of those cuts covers a different stretch of the curve, so each has its own yield, and the two sets give those cuts different names: DPK and Jet, AGO and Gasoil.

At the heavy end, Kwale sells one cut from 650 F where the default set sells two, split at 1000 F.

## Lesson 2, several times over

Going from one cut set to the other is a series of moved boundaries. The boundary between naphtha and kerosene moves from 330 F to 350 F. The one between kerosene and diesel moves from 480 F to 500 F. A new boundary appears at 1000 F inside Kwale's residue. For a moved boundary, lesson 2's rule applies: moving a cut point moves barrels between two cuts and nowhere else. This course prints the two tables and not each move on its own, so the lesson reads the tables as printed.

## Whose cuts

The course says of Kwale that "It draws its own cut points", and it prints the studio's default set beside them "for contrast (a vacuum refinery's cut set)". The blend's curve is the same under both tables. The cut set is what changes, so a yield is quoted with the cut set it was drawn on: 20.5591 is naphtha on Kwale's cuts, and 22.6185 is naphtha on the default's.

The next module values the blend on Kwale's cuts and Kwale's prices. Its netback table lists Kwale's five cuts, each with its own yield and its own price per barrel of product.

## Exercise

Read the Naphtha row in both yield tables, 20.5591 and 22.6185, and the naphtha bounds in both cut sets. Say what differs between the two cuts, and what the two yields show about quoting a yield without its cut set. Then say why LPG / Light ends prints the same figure in both.
