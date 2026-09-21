# What the next tier changes

This tier took a blend as given and asked what it was worth. The Expert tier turns the question round: given what a product must meet, what should go into it.

## From a recipe to a decision

Everything here started from a recipe someone chose. Kwale Light and Ughelli Medium, 55 and 45. The engine computed the blend's curve, its cut yields, its netback and its differential, and every figure followed from that one choice.

A blending terminal faces the reverse problem. It has a pool of components, each with a cost, a quality and an amount on hand. It has a product specification with limits: sulfur at most this, octane at least that, density within a band. It has a volume to deliver. The shares are no longer an input. They are the answer, and the question is which shares meet every limit at the least cost.

That is a decision over many volumes and many limits at once, and the optimizer solves it as a linear programme. This course owns linear programming for the whole Commercial & Trading module, and the Expert tier teaches it from the start: what an objective, rows and bounds are, why the optimum sits on a vertex, and what optimal, infeasible and unbounded mean.

## What carries over

The bases do. Every blending rule the Associate and Professional tiers taught becomes a row in the programme, and each row has to be written on the property's own basis. Gravity goes through specific gravity on volume. Sulfur and the other per-mass properties go on mass. Viscosity goes through an index. The Expert tier adds a vapour pressure index of its own. The course's one sentence names those bases, and it names the recipe as a linear programme in the same breath.

The discipline carries over too. The engine names its bases, names what it skipped, and refuses what it cannot answer. The optimizer does the same.

## What is new

Three kinds of answer have no counterpart in this tier.

Binding specifications. At the least-cost recipe some limits are met exactly and the rest have room to spare. Which limits bind is an answer in its own right: it says what is holding the cost up.

The value of relief. For each binding limit, the solver reports a rate: how fast the cost falls as that limit is eased, at the margin, at the least-cost recipe. That is the shadow price, and the Expert tier reads it per whole unit of the property, dollars per ppm or per psi. It is a rate at the optimum. The Expert tier also re-solves with a limit moved by one whole unit, and the saving that re-solve prints is a different number from the rate.

Infeasible. Some pools cannot meet some specifications with the components available. The Expert tier reads that as an answer, and the engine says so in its own words.

## Where the Expert tier stops

Refinery planning is the subject of the `refinery` course, which builds on the Expert tier's lessons and does not repeat them. Tanks, strapping and landed cost are the subject of the `supply` course.

## Exercise

Read the Kwale blend's figures from module 1 of this tier: blend API 33.1219, SG 0.8595, sulfur 0.2268 wt% (mass basis). Name the basis each was blended on and how the API relates to the SG. Then quote the course's one sentence on the basis each property is computed on.
