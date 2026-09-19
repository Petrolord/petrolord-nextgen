# What the next tier changes

This tier took a blend as given and asked what it was worth. The Expert tier turns the question round: given what a product must meet, what should go into it.

## From a recipe to a decision

Everything here started from a recipe someone chose. Kwale Light and Ughelli Medium, 55 and 45. The engine computed the blend's curve, its cut yields, its netback and its differential, and every figure followed from that one choice.

A blending terminal faces the reverse problem. It has a pool of components, each with a cost, a quality and an amount on hand. It has a product specification with limits: sulfur at most this, octane at least that, vapour pressure within a band. It has a volume to deliver. The shares are no longer an input. They are the answer, and the question is which shares meet every limit at the least cost.

That is a continuous decision with many variables and many limits at once, and it is solved as a linear programme. This course owns linear programming for the whole downstream module, and the Expert tier teaches it from the start: what an objective, rows and bounds are, why the optimum sits on a vertex, and what optimal, infeasible and unbounded mean.

## What carries over

The bases do. Every blending rule the Associate and Professional tiers taught becomes a row in the programme, and each row has to be written on the property's own basis. Gravity goes through specific gravity on volume. Sulfur and the other per-mass properties go on mass. Viscosity goes through an index. The Expert tier adds a vapour pressure index of its own. A row written on the wrong basis gives the solver a wrong constraint, and it will satisfy that constraint exactly.

The discipline carries over too. The engine names its bases, names what it skipped, and refuses what it cannot answer. The optimizer does the same.

## What is new

Three kinds of answer have no counterpart in this tier.

Binding specifications. At the least-cost recipe some limits are met exactly and the rest have room to spare. Which limits bind is an answer in its own right: it says what is holding the cost up.

The value of relief. For each binding limit, the solver can say how much the cost would fall if that limit were eased by one whole unit of the property. That is the shadow price, and the Expert tier reads it per unit of the property.

Infeasible. Some pools cannot meet some specifications at any price. That is not an error. It is an answer, and the engine says so in its own words.

## Where the Expert tier stops

The same linear programming kernel also plans refineries. That work belongs to the `refinery` course, which builds on the Expert tier's lessons and does not repeat them. Tanks, strapping and landed cost belong to the `supply` course.

## Exercise

Read the Kwale blend's figures from module 1 of this tier: blend API 33.1219, SG 0.8595, sulfur 0.2268 wt% (mass basis). Name the basis each was blended on and how the API relates to the SG. Then say why each of those rules must keep its own basis when it becomes a row in a linear programme, and what a solver does with a row written on the wrong basis.
