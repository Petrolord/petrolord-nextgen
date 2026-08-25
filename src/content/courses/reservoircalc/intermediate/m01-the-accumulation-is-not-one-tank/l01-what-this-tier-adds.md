# What this tier adds

The Associate tier finished with one number. Six wells, two picked surfaces, a 100 m grid with 201 live nodes, a contact at 1560 m, and a chain of four constants gave 12.139208 MMstb of stock tank oil initially in place. That number is correct, and this tier does not revise it.

What this tier questions is not the arithmetic. It is the sentence hidden underneath the arithmetic: that the accumulation is one connected body of rock.

## One instruction changes

Almost nothing moves between the two tiers. The same six Ekene wells supply the same TOP_SAND and BASE_SAND picks. The same gridder builds the same two surfaces on the same frame, 25 columns by 20 rows of 100 m cells starting at an easting of 400 m and a northing of 800 m. The same 201 nodes come back live. The same oil water contact at 1560 m clips the same 169 cells. Net to gross is still 0.8, porosity still 0.20, water saturation still 0.35, the formation volume factor still 1.2.

One instruction is added. Every node in the frame is given a block label before the volumes are summed, and the engine keeps a separate running total for each label.

That is the whole mechanical difference. A course could describe it in a paragraph. The reason it takes six modules is that the consequences are not mechanical.

## Why a single number stops being enough

A volume is booked so that somebody can decide something. The decisions that follow a volumetric estimate are all about wells: how many, where, and whether the last one pays for itself.

Every one of those decisions assumes that oil in one part of the field can reach a well in another part. Remove that assumption and the same total barrels support a completely different development. Oil that cannot flow to any planned well is oil you have booked and will not produce.

A sealing fault removes exactly that assumption, and faults are ordinary. Most fields of any size have them. So the question this tier asks is not exotic. It is the second question anybody asks after the first estimate lands: is this one tank or several?

## What you will be able to do

By the end of this tier you will be able to take a mapped accumulation and a fault, partition it, and book each compartment separately. That sounds procedural, and the procedure is genuinely short. The judgement around it is not, and four things in particular will occupy us.

The first is that a partition has to be checked, because a partition that does not reproduce the total it came from has a bug in it. You will learn which parts of the chain reproduce it exactly, which parts do not, and why the difference is not a mistake.

The second is that a fault has to be placed, and placing it involves conventions that nobody writes down. The Ekene fault lands exactly on a column of grid nodes, and the rule that assigns those nodes to a block is worth close to a million barrels. That is not a rounding detail. It is a decision, and it should be made deliberately rather than inherited from whichever comparison operator the code happens to use.

The third is the most uncomfortable. The surfaces underneath the partition were gridded before anybody mentioned a fault. The interpolator ran straight across the fault trace as though the rock were continuous, because as far as it knew, the rock was continuous. You will measure how much of one block's booking rests on a well on the other side of a seal, and the answer is large.

The fourth is that once the field is compartments, its contact stops being a single fact about the field. Two blocks that do not communicate have no obligation to share an oil water contact, and in fields where faults seal they frequently do not. The field total then depends on two assumptions instead of one.

## What this tier does not do

It does not touch the properties. Net to gross, porosity and water saturation remain the four constants the Associate tier was handed, and the Expert tier is where they stop being constants. It does not revisit the mapping, beyond measuring what the mapping cost. It does not compute recovery, reserves or value.

It also does not re-derive the field booking. The 12.139208 MMstb figure, the 169 cells, the 22.269036 million cubic metres of gross rock volume and the 20.2818603515625 m maximum column belong to the tier below. They will appear here as checks, because a partition is checked against the whole it partitions, and they will not be re-taught.

## Worked example

Before the first module ends, one number is worth fixing in mind. At the capstone fault position the west block holds 117 of the 169 oil bearing cells and the east block holds 52. Those two counts add to 169 exactly, which is the first and cheapest check a partition can pass.

The barrels split 9.855617 MMstb west and 2.283591 MMstb east. Those two do not divide in the ratio 117 to 52. Work the ratios out: the cells split 69.2 percent to the west, the barrels 81.2 percent. A tenth of the field has moved from one column of the answer to the other purely because the two blocks hold different shapes of rock.

## Exercise

Write down, without looking ahead, what you would check first if a colleague handed you a field split into two blocks and told you the partition was complete. Then list the three things about that field you would want to know before you believed either block's number.

Self check: the first check is that the parts reproduce the whole, in cell count and in volume, because a partition that loses or gains cells is not a partition. The three things worth knowing are where the fault was placed and on what evidence, whether the surfaces were built with the fault in them or across it, and whether the two blocks were assumed to share one contact.
