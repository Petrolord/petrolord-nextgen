# The capstone walkthrough

The Associate capstone for this course is short. Its brief gives a case of its own: a contact, and a net to gross, porosity, water saturation and Bo that differ from the teaching case the modules worked. You type that case into the volume explorer and report six numbers from it. There is no essay, no free interpretation and no hidden dataset. If you have worked the five previous modules, every step is already familiar; only the inputs are new.

This lesson walks the six fields in the order the capstone asks for them, on the teaching case, so you can see where each is read and where marks are lost. The values below are the teaching case's, at a 1560 m contact with NTG 0.8, porosity 0.20, Sw 0.35 and Bo 1.2. The capstone does not grade them.

## The six fields, worked on the teaching case

| Field | Unit | Teaching case | Tolerance |
| --- | --- | --- | --- |
| Oil-bearing grid cells | count | 169 | 0 |
| Maximum oil column | m | 20.2818603515625 | 0.1 |
| Gross rock volume | 10^6 m3 | 22.26903564453125 | 0.05 |
| Pore volume | 10^6 m3 | 3.563045809312045 | 0.01 |
| Hydrocarbon pore volume | 10^6 m3 | 2.3159797972902343 | 0.01 |
| STOIIP | MMstb | 12.139208107496763 | 0.05 |

**Oil-bearing grid cells, tolerance 0.** The count of live grid nodes whose oil column is positive at the contact, out of the 201 nodes the map carries. On the teaching case it is 169. Read it from the cell count on the panel summary.

**Maximum oil column, tolerance 0.1.** The tallest column anywhere in the accumulation, which is the contact minus the mapped crest: 20.2818603515625 m on the teaching case. Read it from the maximum column figure on the panel.

**Gross rock volume, tolerance 0.05.** The oil column summed over the oil cells and multiplied by the cell area, quoted in millions of cubic metres. Read it from the GRV line of the panel summary.

**Pore volume, tolerance 0.01.** The gross rock volume after the net to gross and the porosity have been applied. Read it from the pore volume line.

**Hydrocarbon pore volume, tolerance 0.01.** The pore volume after the water saturation has been removed. Read it from the HCPV line.

**STOIIP, tolerance 0.05.** The hydrocarbon pore volume divided by the formation volume factor and converted to stock tank barrels. Read it from the STOIIP line, and note the unit is millions of stock tank barrels.

## Where marks are lost

The cell count has a tolerance of zero. It has to be exact. There is no partial credit and no rounding to fall back on, so one cell either way is wrong. If your count looks off, the fault is almost always in the inputs rather than in your reading, so check that the contact is the one the brief states before you check anything else. The cell count depends on the contact alone, so the four properties cannot move it.

The panel shows a net rock volume sitting between the gross rock volume and the pore volume (17.815229 million m3 on the teaching case). It is a real number in the chain and the capstone does not ask for it. Take care that it does not end up in the pore volume box, which is the single most common slip on this capstone because the two lines sit next to each other.

The pore volume and the hydrocarbon pore volume carry the tightest tolerances, at 0.01 million m3. Read them from the panel rather than reconstructing them from a heavily rounded gross rock volume, because rounding early and multiplying afterwards is how a value drifts out of a narrow window.

You do not need to type every digit. Three decimal places clears every tolerance on the list. The long values above are what the engine holds, and you may enter fewer.

Units are graded as part of the value. Gross rock, pore and hydrocarbon pore volumes are all in units of 10^6 m3, the column is in metres and the STOIIP is in MMstb. Entering a volume in plain cubic metres puts it a factor of a million away from the answer.

## Getting to the capstone at all

The platform enforces the order. Read every lesson in a module, then pass that module's quiz at 75 percent. Three consecutive failed attempts trigger a 24 hour cooldown, so a quiz is worth preparing for rather than probing. Clear all six modules that way, pass the final exam at 70 percent, and the capstone unlocks.

Passing it grants the Associate certification for this course: a statement that you can take a mapped surface, clip it against a contact and produce a defensible volume with the assumptions attached.

Try it yourself: the panel below opens on the teaching case. Locate each of the six values there first. Then type a different contact and a different set of properties and watch which lines move: the cell count and the column follow the contact alone, and the properties enter at the net, pore, HCPV and STOIIP steps. That is the whole of the work the capstone asks for, on the case its brief states.

{{panel:rc-volume-explorer}}

## Exercise

Without opening the panel, list the six graded fields in capstone order and write the unit and tolerance for each. As a self check: oil-bearing grid cells, a count, tolerance 0; maximum oil column in m, tolerance 0.1; gross rock volume in 10^6 m3, tolerance 0.05; pore volume in 10^6 m3, tolerance 0.01; hydrocarbon pore volume in 10^6 m3, tolerance 0.01; and STOIIP in MMstb, tolerance 0.05. Then answer in one sentence: which of the six leaves you no margin at all, and which number on the panel is most likely to be entered in the wrong box? The cell count, whose tolerance is zero; and the net rock volume, which is displayed in the chain, is not asked for, and sits directly above the pore volume.
