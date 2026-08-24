# Quality control

A volume that is wrong looks exactly like a volume that is right. Both come out of the same engine, both are quoted in MMstb, and neither carries a warning. The defence is a fixed set of checks run in the same order every time, before anybody is allowed to quote the number.

Five checks cover most of what goes wrong at this tier.

## Does the rock volume reconstruct

Start by rebuilding the gross rock volume a second way. You have 169 oil cells, each standing for 10,000 square metres, so an oil area of 1,690,000 square metres, which is 1.69 square kilometres. The mean oil column over those cells is 13.176944 m. Multiply the mean column by the area and you are back at the gross rock volume of 22.269036 million m3.

Then walk the chain and confirm each link is a single multiplication by the constant you expect. GRV 22.269036 times NTG 0.8 gives net 17.815229. Net times porosity 0.20 gives pore 3.563046. Pore times one minus Sw 0.35 gives HCPV 2.315980. HCPV divided by Bo 1.2 and multiplied by 6.2898 gives 12.139208 MMstb.

The value of this check is that it catches a property applied twice or a property left out, which are the two most common errors in a spreadsheet version of the same workflow. If a link does not reproduce, the fault is in the link and not in the map.

## Are the dry wells where you expect

Look at the wells and predict, before reading anything off the panel, which ones should hold oil.

At a contact of 1560 m any well whose TOP_SAND pick is below 1560 m must be dry. Ekene-2 picks the top at 1565 m and Ekene-4 at 1590 m, so both must come back with no oil. The other four must carry columns equal to the contact minus their own pick, which is 12 m at Ekene-1, 19 m at Ekene-3, 8 m at Ekene-5 and 14 m at Ekene-6.

A well that disagrees with that arithmetic is telling you something is wrong upstream, most often a coordinate error that has put the well on the wrong part of the map, or a contact that was not applied to the surface you thought it was.

## Does the maximum column equal contact minus crest

The tallest column on a contact limited accumulation is the contact minus the shallowest point of the top surface, and nothing else. On Ekene, $1560 - 1539.7181396484375 = 20.2818603515625$ m, which is exactly the number the panel reports.

Two things follow. First, if those two do not agree, either the crest you are quoting is not from the same grid or the accumulation is not contact limited, and the next check will tell you which. Second, the mapped crest of 1539.72 m is 1.2819 m shallower than Ekene-3's pick of 1541 m, which is the thin plate spline bending over a high. That means the maximum column inherits an artefact of the interpolator, and it is a number to explain rather than a discovery.

## Contact limited or base limited

Ask which surface is cutting off the column at each cell. The column is the shallower of the base surface and the contact, minus the top, so either the contact is doing the cutting or the base is.

At 1560 m the answer is uniform. At all 169 oil cells the BASE_SAND surface lies deeper than the contact, so the column is the contact minus the top everywhere, and the accumulation is contact limited. The base surface contributes nothing at all to this booking. It would only begin to matter if the contact were pushed deeper than the shallowest point on BASE_SAND, which is 1570 m.

Knowing which regime you are in tells you what to expect when you move the contact. In a contact limited accumulation, every extra metre of contact is an extra metre of column on every cell that already held oil. In a base limited one, cells that are already full stop responding.

## Do the units survive

The last check is arithmetic hygiene, and it is the one people skip.

Metres of column times square metres of cell area gives cubic metres, and dividing by a million gives the million m3 that GRV, net, pore and HCPV are all quoted in. NTG, porosity and one minus Sw are dimensionless, so they change the size of the number and not its units. Bo is reservoir m3 per stock tank m3, so dividing by it converts reservoir volume to surface volume. Then 6.2898 stb per m3 turns cubic metres into barrels, and dividing by a million gives MMstb.

A missing factor of a million or a Bo multiplied instead of divided produces a number that looks plausible in a table and is wrong by orders of magnitude.

Try it yourself: run all five checks against the panel below at the capstone contact.

{{panel:rc-volume-explorer}}

## Exercise

Run the five checks on the Ekene booking at 1560 m and write one line for each, saying what passed and what needed an explanation. As a self check: the rock volume reconstructs, since 169 cells of 10,000 square metres at a mean column of 13.176944 m return 22.269036 million m3, and each link of the chain is one multiplication down to 12.139208 MMstb; the dry wells are Ekene-2 and Ekene-4 as their tops of 1565 and 1590 m lie below the contact; the maximum column of 20.2818603515625 m equals the contact minus the mapped crest, with the crest itself 1.2819 m shallower than any pick and needing that explanation; the accumulation is contact limited at all 169 cells, since the base is deeper than the contact everywhere; and the units carry through to MMstb. Then answer in one sentence: which check would catch a booking where the porosity had been applied twice? The chain reconstruction, because the pore volume would not equal the net volume times 0.20.
