# What converges and what does not

Refine the grid on a rod pump design and one answer settles while two others wander. The design reports all three the same way.

{{panel:pd-balance-explorer}}

## Six grids, one well, nothing else changed

Only the node count moves down these rows. Same string, same speed, same fluid, same damping.

| Nodes | Plunger stroke, in | PPRL, lb | MPRL, lb |
| --- | --- | --- | --- |
| 60 | 98.502373797 | 19337.292600 | 2433.031523 |
| 120 | 98.526653100 | 19545.877783 | 2625.472706 |
| 240 | 98.542926570 | 19662.751698 | 2697.363306 |
| 480 | 98.544247156 | 19551.233793 | 2632.612295 |
| 960 | 98.546334829 | 19520.004895 | 2463.749290 |
| 1920 | 98.546349123 | 19590.579526 | 2638.509643 |

Across those six rows the plunger stroke moves 0.043975327 in, which is 0.044644 percent. The peak load moves 325.459098 lb, 1.683064 percent of the smallest. The minimum moves 264.331784 lb, 10.864298 percent of the smallest in size. The worst section loading moves 1.577289838 percentage points.

## The published case behaves the same way

On the published taper at 9 spm over the same six node counts the plunger stroke moves 0.028790514 in, 0.057983 percent, while the peak moves 72.603716 lb, 0.440273 percent, and the minimum 48.974097 lb, 0.848148 percent of the smallest in size. Smaller numbers, same ordering: the stroke settles and the loads do not.

## Off the shipped operating point it is much worse

Run ODUMA-4 at 11 spm with a damping ratio of 0.05 and the same six grids spread the plunger stroke by 1.893435110 in, 1.908577 percent, the peak by 2591.452554 lb, 11.523296 percent, and the minimum by 1097.239493 lb, 66.702711 percent of the smallest in size. The worst section loading moves 6.686252312 percentage points. Every one of those six rows sits above 100 percent of the Goodman allowable, so the verdict holds, but the number a report would quote depends on a grid nobody chose.

## Why the stroke is the honest one

Plunger stroke is a peak to trough of one node position over a whole cycle, and a position is an integral of the wave. The two load extremes are point values of a spatial derivative, taken at whichever instant happened to be worst, and a derivative sampled on a coarser mesh is the first thing to move. So every quantity proportional to the plunger stroke, which includes the swept displacement and the produced rate, survives the grid. The peak and minimum loads do not, and neither does anything computed from them.

The peak column is not even monotone: it rises through 240 nodes, falls at 480 and 960, then rises again at 1920. Refining until the answer stops changing is not available here, because the answer changes back.

## What it refuses

The design refuses to say any of this. It reports the loads to the last figure with no grid error attached, and exposes no node count to test them with.

## Exercise

Record PPRL and plunger stroke for ODUMA-4 at 60, 240 and 1920 nodes.

Then say which of the two you would quote to a client and which you would quote with a stated uncertainty.
