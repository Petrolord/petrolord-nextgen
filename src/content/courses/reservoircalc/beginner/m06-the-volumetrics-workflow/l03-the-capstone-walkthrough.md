# The capstone walkthrough

The Associate capstone for this course is short. It sets the oil water contact to 1560 m and grades six numbers, every one of them read off the volumetrics panel with the grid built at a 100 m cell on the Ekene control set and the properties fixed at NTG 0.8, porosity 0.20, Sw 0.35 and Bo 1.2. There is no essay, no free interpretation and no hidden dataset. If you have worked the five previous modules, all six numbers are already familiar.

This lesson walks them in the order the capstone asks for them, says where each is read, and points out where marks are lost.

## The six graded fields

| Field | Unit | Value | Tolerance |
| --- | --- | --- | --- |
| Oil-bearing grid cells | count | 169 | 0 |
| Maximum oil column | m | 20.2818603515625 | 0.1 |
| Gross rock volume | 10^6 m3 | 22.26903564453125 | 0.05 |
| Pore volume | 10^6 m3 | 3.563045809312045 | 0.01 |
| Hydrocarbon pore volume | 10^6 m3 | 2.3159797972902343 | 0.01 |
| STOIIP | MMstb | 12.139208107496763 | 0.05 |

**Oil-bearing grid cells, 169, tolerance 0.** The count of live grid nodes whose oil column is positive at this contact, out of the 201 nodes the map carries. Read it from the cell count on the panel summary with the contact set to 1560 m.

**Maximum oil column, 20.2818603515625 m, tolerance 0.1.** The tallest column anywhere in the accumulation, which is the contact minus the mapped crest. Read it from the maximum column figure on the panel.

**Gross rock volume, 22.26903564453125 in units of 10^6 m3, tolerance 0.05.** The oil column summed over the 169 cells and multiplied by the cell area, quoted in millions of cubic metres. Read it from the GRV line of the panel summary.

**Pore volume, 3.563045809312045 in units of 10^6 m3, tolerance 0.01.** The gross rock volume after the net to gross and the porosity have been applied. Read it from the pore volume line.

**Hydrocarbon pore volume, 2.3159797972902343 in units of 10^6 m3, tolerance 0.01.** The pore volume after the water saturation has been removed. Read it from the HCPV line.

**STOIIP, 12.139208107496763 MMstb, tolerance 0.05.** The hydrocarbon pore volume divided by the formation volume factor and converted to stock tank barrels. Read it from the STOIIP line, and note the unit is millions of stock tank barrels.

## Where marks are lost

The cell count has a tolerance of zero. It has to be exact. There is no partial credit and no rounding to fall back on, so 168 is wrong and so is 170. If your count is not 169, the fault is almost always in the settings rather than in your reading, so check that the contact is at 1560 m and the cell size at 100 m before you check anything else.

The panel shows a net rock volume of 17.815229 million m3 sitting between the gross rock volume and the pore volume. It is a real number in the chain and it is not graded. Take care that it does not end up in the pore volume box, which is the single most common slip on this capstone because the two lines sit next to each other.

The pore volume and the hydrocarbon pore volume carry the tightest tolerances, at 0.01 million m3. Read them from the panel rather than reconstructing them from a heavily rounded gross rock volume, because rounding early and multiplying afterwards is how a value drifts out of a narrow window.

You do not need to type every digit. Three decimal places clears every tolerance on the list, and 22.269, 3.563, 2.316 and 12.139 are all comfortably inside their windows. The long values above are what the engine holds, not a demand for how you enter them.

Units are graded as part of the value. Gross rock, pore and hydrocarbon pore volumes are all in units of 10^6 m3, the column is in metres and the STOIIP is in MMstb. Entering a volume in plain cubic metres puts it a factor of a million away from the answer.

## Getting to the capstone at all

The platform enforces the order. Read every lesson in a module, then pass that module's quiz at 75 percent. Three consecutive failed attempts trigger a 24 hour cooldown, so a quiz is worth preparing for rather than probing. Clear all six modules that way, pass the final exam at 70 percent, and the capstone unlocks.

Passing it grants the Associate certification for this course: a statement that you can take a mapped surface, clip it against a contact and produce a defensible volume with the assumptions attached.

Try it yourself: set the contact to 1560 m in the panel below and locate each of the six values.

{{panel:rc-volume-explorer}}

## Exercise

Without opening the panel, list the six graded fields in capstone order and write the unit and tolerance for each. As a self check: oil-bearing grid cells, a count, tolerance 0; maximum oil column in m, tolerance 0.1; gross rock volume in 10^6 m3, tolerance 0.05; pore volume in 10^6 m3, tolerance 0.01; hydrocarbon pore volume in 10^6 m3, tolerance 0.01; and STOIIP in MMstb, tolerance 0.05. Then answer in one sentence: which of the six leaves you no margin at all, and which number on the panel is most likely to be entered in the wrong box? The cell count, whose tolerance is zero; and the net rock volume of 17.815229 million m3, which is displayed in the chain but not graded and sits directly above the pore volume.
