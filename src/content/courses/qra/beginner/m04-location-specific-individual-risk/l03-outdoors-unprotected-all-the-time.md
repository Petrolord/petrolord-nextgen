# Outdoors, unprotected, all the time

{{panel:qr-event-tree}}

The engine's model string for LSIR ends with a definition that is easy to read past: "a person present at the location all the time, outdoors and unprotected". Each of those three words is a declared choice, and each one keeps something out of the LSIR so that it can be handled, openly, in a later step. This lesson reads the three words in turn.

## All the time

An LSIR assumes somebody stands at the place for every one of the 8760 hours of the year. Nobody does. That is the point: the LSIR belongs to the place, and the share of the year a real person spends there is applied later, when individual risk per annum turns places into a person. Keeping occupancy out of the LSIR means one number per place serves every person who visits it, whatever their shift or their role.

## Outdoors and unprotected

An LSIR also assumes the person is outdoors, with no wall, roof or shelter between them and the outcome. The stated probability of death at a place is read that way. If a building would protect someone, that protection is a separate adjustment, made for a named person at IRPA through a vulnerability factor the analyst supplies. It never changes the LSIR itself.

## What the three words keep out

| what the LSIR assumes | what it keeps out | where it enters |
| --- | --- | --- |
| all the time | the share of the year spent there | IRPA, as occupancy |
| outdoors and unprotected | shelter a building might give | IRPA, as a vulnerability factor the analyst supplies |
| a stated Pd at the place | how that Pd was made | the consequence course, as a stated input |

## The sum of places is no one's individual risk

EREMOR's three places carry these LSIRs, per year: process deck 0.000148150000, control room 0.000006545000, accommodation 0.000000108000. It is tempting to add them. The sum, 0.000154803000 per year, would be the individual risk of a person standing outdoors in all three places at once for the whole year, which no one can do. The next module shows how the same three LSIRs become one operator's IRPA of 0.000017541379 per year once occupancy enters.

The same care applies to reading a single place. The control room LSIR is 0.000006545000 per year, and 0.825057 of it comes from the explosion. The flash fire adds 0.000000000000 there because the control room lies outside the flammable cloud. That is a statement about a person standing outside the control room building all year, since an LSIR is always read outdoors.

## Exercise

Add EREMOR's three LSIRs and confirm that you reach 0.000154803000 per year. Then write two sentences: the first saying which of the three words in the model string your sum breaks, and the second naming the input the next module adds so that the three LSIRs can be combined for one person.
