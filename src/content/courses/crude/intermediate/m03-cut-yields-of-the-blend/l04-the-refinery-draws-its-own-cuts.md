# The refinery draws its own cuts

The same blend has different yields at different refineries. Nothing about the crude changes. The cut set does.

{{panel:crude-valuation-explorer}}

## Two cut sets on one curve

Kwale is a topping refinery with no vacuum unit. Its cut set ends at atmospheric residue, from 650 F with no upper bound, running to 100 percent, because it has nowhere to split that material further. The studio's default cut set, which the Associate tier used on the Obigbo library, is a vacuum refinery's: it splits the heavy end at 1000 F into vacuum gasoil and vacuum residue.

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

The digest prints the Kwale blend, 55 and 45, on each.

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

Everywhere else the bounds differ. Kwale ends naphtha at 330 F; the default set ends it at 350 F. Kwale's kerosene runs 330 to 480 F; the default's runs 350 to 500 F. Kwale's diesel runs 480 to 650 F; the default's runs 500 to 650 F. Each of those cuts covers a different stretch of the curve, so each has its own yield, and the names do not line up either: DPK and Jet, AGO and Gasoil are two refineries' words for their own products.

At the heavy end, Kwale sells one cut from 650 F where the default set sells two, split at 1000 F.

## Lesson 2, several times over

Going from one cut set to the other is a series of moved boundaries. The boundary between naphtha and kerosene moves from 330 F to 350 F. The one between kerosene and diesel moves from 480 F to 500 F. A new boundary appears at 1000 F inside Kwale's residue. Each move shifts barrels between the two cuts that share that boundary and nowhere else, which is why the rule of lesson 2 is enough to explain every difference between these tables without a new idea.

## Why the cut set belongs to the refinery

A crude assay is a property of the crude. A cut set is a property of the refinery that runs it: the units it has, the products it sells and the specifications it meets. That is why the studio takes the cut set as an input rather than fixing one. Asking what a blend yields without saying whose cuts is an incomplete question.

It is also why the next module values the blend on Kwale's cuts and Kwale's prices. A netback is a refinery's view of a crude. The same blend valued on the default set would carry a vacuum refinery's products and a vacuum refinery's prices, and its figure would answer a different buyer's question.

## Exercise

Read the Naphtha row in both yield tables, 20.5591 and 22.6185, and the naphtha bounds in both cut sets. Say what differs between the two cuts and why that is enough to give the same blend two naphtha yields. Then say why LPG / Light ends prints the same figure in both.
