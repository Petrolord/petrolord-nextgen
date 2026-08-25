# The workflow end to end

This lesson puts the whole tier into one sequence. Nothing here is new; the value is in the order and in knowing what each step can go wrong in.

## The eight steps

**One. Establish that the field is compartmentalised.** Volumetrics cannot tell you this. The evidence is pressure differences across the fault, contacts that differ, production interference, or a juxtaposition argument from the interpreted displacement. Without evidence, a partition is a hypothesis, and it should be labelled as one.

**Two. Fix the fault geometry.** Position, and if the reservoir is thick relative to the cell size, dip. Record the position uncertainty, because you will price it in step seven.

**Three. Build the surfaces.** Grid the top and base as usual. Note whether the gridder knew about the fault. If it did not, which is the normal case for a first estimate, record that fact now rather than discovering it later.

**Four. Label the grid.** Assign a block to every node in the frame. Decide, deliberately, which side the boundary cells go to when the fault falls on a node column, and write the decision down.

**Five. Choose a contact for each compartment.** Not one for the field. If the evidence supports only one contact, use it for both and say that it is an assumption applied twice rather than a measurement of both.

**Six. Run the chain per block.** The same four constants, the same four multiplications, once per compartment.

**Seven. Check and price.** Verify that the blocks reproduce the field total. Then price the three things that move the answer: the fault position, the boundary convention, and the map's ignorance of the fault.

**Eight. Report per compartment.** With contacts, evidence and the sum labelled as an arithmetic sum.

## Where each step fails

Step one fails silently when somebody partitions a field because a fault is visible on seismic rather than because there is evidence it seals. The output looks identical either way.

Step three fails when the surfaces are built for a field and then reported as though they had been built for compartments. This is the failure with the largest number attached at Ekene, worth 1.989889 MMstb on the western block.

Step four fails when nobody knows which way the tie break went. Worth 0.901423 MMstb here.

Step five fails when a single contact is applied to both compartments out of habit. The eastern compartment at Ekene ranges over a factor of seventeen across the contacts the data allows.

Step seven fails when the check passes and is reported as though it validated the model. The check proves only that no cell was lost or double counted. It cannot detect a cell in the wrong block, and it says nothing about whether the fault seals or the contacts are right.

## The order matters in one place

Steps three and four can be done in either order mechanically, and the result is identical, since labelling does not change depths and gridding does not read labels.

They cannot be reordered conceptually. If you intend the compartments to be independent, that intention belongs in step three, where it would change how the surfaces are built. Doing step four after step three and then claiming independence is exactly the contradiction module four measured.

## Worked example

Run the whole sequence on Ekene in one pass, quoting the number produced at each step.

One: the fault is given as sealing. Two: it runs north to south at 1800 m, vertical, position uncertainty not stated so assume at least 100 m. Three: two surfaces gridded from all six wells, 201 live nodes, no fault awareness. Four: 500 nodes labelled, boundary column at 1800 m assigned east, 280 nodes west and 220 east. Five: both compartments at 1560 m, an assumption not a measurement in the east. Six: west 117 cells and 9.855617 MMstb, east 52 cells and 2.283591 MMstb. Seven: blocks reproduce 169 cells and 12.139208 MMstb; fault position worth about 0.9 MMstb, convention worth 0.901423 MMstb, cross fault control worth 1.989889 MMstb on the west. Eight: report as in the previous module.

The whole tier is eight lines. What took six modules was knowing what each line is worth.

## Exercise

A colleague hands you a partitioned model and asks you to review it. List, in order, the four questions you would ask, and say which of them can be answered from the model file alone.

Self check: ask what evidence supports the seal, where the fault is and with what uncertainty, whether the surfaces were built with the fault in them, and what contact each compartment was given and on what evidence. Only the third and the contact half of the fourth can be answered from the model file, since the seal evidence and the contact evidence come from pressure and fluid data that the volumetric model never sees.
