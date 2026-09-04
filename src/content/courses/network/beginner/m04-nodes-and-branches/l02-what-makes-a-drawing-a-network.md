# What makes a drawing a network

A drawing becomes a network when every well can reach a pressure somebody gave. Until then it is a picture with production in it and no way to say where the production goes.

{{panel:pd-trunk-explorer}}

## Four conditions, each with its own sentence

Something has to put mass in: `A network needs at least one well. Nothing else puts anything into it.` Something has to take it out: `A network needs a delivery point: a node with a pressure the system is flowing against.` The delivery point has to carry a pressure: `The delivery point "Sep" needs a pressure. It is the boundary the whole system is solved against.` And every node has to reach it: `This node has no route to a delivery point: Manifold B. Nothing sets its pressure, so the network cannot be solved.`

## The teaching drawing

| Branch | Runs | Conductance, lb/d per root psi |
| --- | --- | --- |
| e1, AGBADA-2 flowline | t1 to ha | 275 |
| e2, AGBADA-6 flowline | t2 to ha | 365 |
| e3, AGBADA-9 flowline | t3 to hb | 198 |
| e4, AGBADA-12 flowline | t4 to ha | 126 |
| c1, North bypass | ha to hc | 690 |
| c2, Crosslink | ha to hb | 540 |
| c3, Loop leg | hb to hc | 245 |
| tk, Trunk | hc to sep | 720 |

Eight nodes, eight branches, seven unknown pressures, one delivery point at 265 psia. Every well reaches it, so this is a network.

## The loop is why the word is network

The north manifold reaches the trunk tee straight down the north bypass, and reaches it again through the crosslink and the loop leg by way of the loop tee. Two paths, one destination.

In a tree, every branch flow is fixed by the flows downstream of it and a system can be added up by hand. In a loop it is not: the split between two paths is decided by the pressures, and the pressures are decided by the split. That is why an iteration exists.

## What a branch has to be

Two ends, distinct, both real. `Branch "a" starts and ends at the same node.` `Branch "a" ends at "ghost", which is not a node.`

The pair is written as a from and a to, a labelling convention rather than a claim. The drawing was made before anybody solved anything, and which way mass goes on a branch is a property of the answer.

## The mistake

Leaving a node on the drawing because it is obviously connected in the field. The module has no field. A satellite tied in through a line nobody drew is a stranded node, and the refusal names it.

The tempting repair is to hang it off the nearest header so the case will run. That invents a branch, and every pressure downstream of it is then an answer about a system that does not exist.

## Exercise

Trace each of the four wells to the separator through the branch table and write the path down.

Then say which branch, removed, would strand a node, and which would only cost the network a path it has another of.
