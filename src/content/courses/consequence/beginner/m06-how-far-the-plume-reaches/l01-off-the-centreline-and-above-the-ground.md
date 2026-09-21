# Off the centreline and above the ground

{{panel:cq-release}}

The UBIT tables so far read the plume at one kind of receptor: at ground level, directly downwind, from a release at ground level. Real receptors sit elsewhere. A control room lies to one side of the wind direction; an air intake sits on a roof; a release comes from a vent stack well above grade. The plume expression carries all three positions, and this lesson reads what each one does.

## Off the centreline

The crosswind term of the expression is exp(-y^2 / 2 sy^2). On the centreline y is zero and the term is one. A receptor to the side sees the concentration reduced by that factor. UBIT at 500 m downwind, class D, ground level release and receptor:

| crosswind m, stated | concentration mg/m3 | over the centreline, derived |
| --- | --- | --- |
| 0 | 239.712839 | 1.000000 |
| 20 | 210.227800 | 0.876998 |
| 50 | 105.544135 | 0.440294 |
| 100 | 9.008708 | 0.037581 |

At 500 m in class D sigma_y is 39.036003 m. A receptor half a sigma to the side keeps most of the centreline value; one more than two sigmas out sees only a few percent of it. The factor depends only on y over sigma_y, so the same crosswind offset matters less far downwind, where the plume is wider.

## The receptor height and the release height

The vertical bracket carries the receptor height z and the release height h:

exp(-(z - h)^2 / 2 sz^2) + exp(-(z + h)^2 / 2 sz^2)

For a ground level release and receptor, both terms are one. Raise the receptor, or the release, and the terms fall below one, by amounts set by sigma_z. The Purple Book worked plume places both the release and the receptor at 1 m, which is why its result is close to a ground level one.

## An elevated release

From a stack the picture changes. Near the source the plume is thin and high, and a receptor at ground level sits beneath it where the concentration is almost nothing. As the plume widens downward the ground level concentration rises, reaches a peak, and then falls as the plume keeps diluting. From a 25 m stack, receptor at ground level, class D, UBIT peaks at 153.887548 mg/m3 at 347.557177 m downwind.

Compare that with the ground level release, which gives 1272.709839 mg/m3 at 200 m and 239.712839 mg/m3 at 500 m. Height buys dilution. The peak from the stack is lower than the ground level release gives at either distance, and it sits hundreds of metres away from the source.

## What a receptor position means for a study

Every concentration a study reports needs its receptor stated: how far downwind, how far to the side, and at what height. A figure without them cannot be checked. The engine reports the concentration at exactly the position typed, and the next lesson shows that its distance to a concentration is always a centreline distance.

## Exercise

On the plume view, run UBIT at 500 m in class D and set the crosswind distance to 50 m. Read the concentration against the table. Then return the crosswind distance to 0, set the release height to 25 m, and read the ground level concentration at 500 m and at 100 m. Write one sentence on why the elevated release gives a lower reading at 100 m than at 500 m.
