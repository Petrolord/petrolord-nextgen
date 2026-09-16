# Series adds head at equal flow

Machines in series pass the same liquid one after another, so they all see the same flow and their heads add. The combination is exact at a stated flow, and the duty still has to be re-solved.

{{panel:fc-suction-explorer}}

## The same machines, stacked

On the same system, a static head of 60.000000 ft plus a friction head of 380.000000 ft at 1100.000000 gpm:

| machines | duty flow gpm | duty head ft | head over one machine |
| --- | --- | --- | --- |
| 1 | 1103.518695 | 442.434987 | 1.000000000 |
| 2 | 1465.998506 | 734.940178 | 1.661125814 |
| 3 | 1676.470978 | 942.653617 | 2.130603693 |

Three machines give a duty head of 942.653617 ft, and the head over one machine on that row is 2.130603693. The duty flow moved too, from 1103.518695 gpm to 1676.470978 gpm, because a taller curve crosses the same system further to the right.

## The stack itself reads back exactly

The combination is not an approximation. At 1000.000000 gpm one machine makes 459.953894 ft and three in series make 1379.861681 ft, a quotient of 3.000000000.

That is the test worth knowing, because it separates two things that are easy to confuse. At a fixed flow the heads add exactly. At the duty they do not appear to, and the reason is that the duty flow is not fixed: the crossing moved.

## Two answers about the same stack

A stack of three on this system delivers 1676.470978 gpm at 942.653617 ft. The same three machines at a flow of 1000.000000 gpm deliver 1379.861681 ft. Both figures are the engine's, and they describe the machines at two different flows.

Quoting a curve reading as a duty, or a duty as a curve reading, is the error this invites, and it is hard to see because both are heads in feet from the same three pumps.

## Choosing between the two arrangements

Parallel and series are answers to different shortages. A station short of flow at a head it can already make wants machines in parallel. A station making enough flow against a head it cannot reach wants them in series. The system decides which shortage you have, and the way to find out is to solve both and read the duties.

## The mistake

The mistake is multiplying a single machine's duty head by the number of machines. Three times 442.434987 ft is not 942.653617 ft, and the difference is the duty flow moving.

The second mistake is reading the head over one machine column as a defect in the stack. On the three-machine row it is 2.130603693, and nothing about that says the machines fell short. They added their heads exactly at every flow, and the crossing simply landed somewhere else.

## Exercise

Give the duty flow and duty head for one, two and three machines in series on this system. Then state what one machine and three machines make at 1000.000000 gpm and the quotient between them, and explain why that quotient is a whole number while the duty heads do not stand in the same relation.
