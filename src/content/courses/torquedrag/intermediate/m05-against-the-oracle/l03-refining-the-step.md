# Refining the step

The experiment that separates discretisation from a model difference.

{{panel:td-friction-explorer}}

## The experiment

Run the same case at 10, 5, 2, 1, 0.5 and 0.25 m of integration step, and watch the gap against the oracle.

If the gap shrinks toward zero, the disagreement is discretisation and the two implementations agree in the limit.

If it settles on a nonzero value, the disagreement is in the models and no amount of refinement will close it.

## The horizontal well, tripping in

| step | gap against the oracle |
|---|---|
| 10 m | 1196.6856587605325 N |
| 5 m | 608.9049081801495 N |
| 2 m | 254.38013469088764 N |
| 1 m | 135.33604164059216 N |
| 0.5 m | 75.787626945792 N |
| 0.25 m | 45.937824464563164 N |

Each halving roughly halves the gap. First-order convergence toward zero.

So the worst disagreement in the whole comparison is discretisation, and the two implementations are computing the same thing.

## The slant well, rotating on bottom

| step | gap against the oracle |
|---|---|
| 10 m | -31.824017251492478 N |
| 5 m | -32.44401590770576 N |
| 2 m | -32.617614887072705 N |
| 1 m | -32.6424146972131 N |
| 0.5 m | -32.64861468784511 N |
| 0.25 m | -32.650164601625875 N |

It settles on -32.65 N and stops. Refining a hundredfold moves it by less than a newton.

That is a model difference, not discretisation.

## The build-and-hold well, same operation

Settles on -18.011927655432373 N by the same pattern.

## So there are two things going on

A discretisation error that the engine can reduce at will, which dominates in compression along a lateral and is where the headline disagreements are.

And a residual model difference of a few tens of newtons that refinement does not touch, which is present on every well and is far below anything a decision turns on: 32.65 N on a 730 kN hookload is 4.5e-5.

## Which one is right

Refinement cannot answer that. Both implementations are converging, and they are converging on slightly different answers.

Answering it needs a third source, and the next lesson has one.

## The practical rule this gives you

Refine the step once, on the case you are about to rely on, and see how much the answer moves.

If it moves by more than you care about, keep refining. If it does not, the default is fine. That is one extra run and it is the difference between a number you have checked and one you have not.

## Exercise

Run the step study on the horizontal well tripping OUT and on the vertical well tripping out.

One converges toward the oracle and one does not move at all. Explain both, and predict what the build-and-hold well tripping in will do before you run it.
