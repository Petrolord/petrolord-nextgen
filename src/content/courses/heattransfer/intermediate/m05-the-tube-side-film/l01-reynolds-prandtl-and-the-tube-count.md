# Reynolds, Prandtl and the tube count

The inside film coefficient is the one quantity in this module that comes out of a fitted correlation, and that correlation takes two dimensionless arguments. A Reynolds number, which is the flow, and a Prandtl number, which is the fluid. Both come back on every answer so both can be checked.

## Where a Reynolds number is taught

This course does not derive the Reynolds number. It belongs to the Pipeline and Line Sizing module, which owns it along with the friction factor, and a reader who wants it built from first principles should read it there. Here it is an argument to a correlation, and it is reported on the answer so that it can be checked against whatever source a reader trusts.

On the studio case at its converged count of 74 tubes in 2 passes, which is 37 tubes a pass, the Reynolds number is 44051.846000, the Prandtl number is 15.119375, the regime is turbulent and the film coefficient is 547.762384.

The Prandtl number is the other argument and it is a property of the fluid rather than of the bundle. It does not move when the tube count moves, and on this case it stays at 15.119375 at every count in the table below. That is worth noticing, because it means everything the geometry does to the film arrives through the Reynolds number alone.

The answer carries ten keys in all, and four of them are the ones above. The rest name the tubes a pass the engine worked at, whether the Sieder-Tate correction was applied and what factor it contributed, the service the film was computed for, a correlation block, and a warning slot.

{{panel:fc-coefficient-explorer}}

## The count sets the velocity

| tubes, at two passes | tubes a pass | Reynolds | film coefficient | U dirty that follows | area that follows, ft2 |
| --- | --- | --- | --- | --- | --- |
| 2 | 1 | 1629918.301989 | 9843.591536 | 114.011627 | 185.448625 |
| 60 | 30 | 54330.610066 | 647.823324 | 95.098250 | 222.331111 |
| 72 | 36 | 45275.508389 | 559.901439 | 92.518373 | 228.530818 |
| 74 | 37 | 44051.846000 | 547.762384 | 92.110348 | 229.543151 |

The same flow divided among more tubes moves more slowly in each of them, so the Reynolds number falls as the count rises, and the film falls with it. The coefficient then falls, and the area the coefficient asks for rises. Read the table left to right and that is the chain, on one screen, at four tube counts.

The first row is the instructive one. Two tubes carry the whole flow and the Reynolds number is enormous. A reader who took that row as an answer would size the exchanger on a coefficient belonging to a bundle nobody would build.

## Why this is a loop rather than a list

The film needs a tube count. The count needs an area. The area needs the coefficient. The coefficient needs the film. So the four quantities in the table are not four steps in a sequence, and a coefficient computed at a tube count that the same screen contradicts is not a coefficient of anything at all.

The last row is where the loop has closed, and it is the only row on that table that describes a real exchanger. The rows above it are the trail the iteration left behind.

## Exercise

Record the Reynolds number, the Prandtl number, the regime and the film coefficient at the converged count. Then record the Reynolds number and the film at each of the four counts in the table, and say in one sentence why the film falls as the count rises. Name the module that owns the Reynolds number as a subject.
