# Which one, and when

The rule is one line long, it is right most of the time, and it is not a criterion.

{{panel:st-frac-explorer}}

## The rule of thumb

Compare the fracture length with the fracture height.

If the fracture is long relative to its height, use PKN. If it is short relative to its height, use KGD.

The reasoning behind it is the reasoning from the previous two lessons. Whichever dimension is smaller is the one that controls the compliance, because it is the shorter path over which the rock has to be pushed aside. PKN puts that control in the height. KGD puts it in the length. Choose the model whose controlling dimension is genuinely the smaller one.

## Where the published case sits

The published design targets a half-length of 150 m in a fracture height of 30 m. Length beats height by a factor of five, and the entire model sweep, from a half-length of 40 m up to 300 m, stays above the height. There is no ambiguity at these conditions. PKN is the model.

That clarity is convenient for teaching and it is also common in practice, because most designs aim for a contained fracture that is far longer than it is tall.

## Why it stays a rule of thumb

Four reasons, and none of them are small.

**It is a comparison, not a test.** Nothing tells you where the switch happens. Length equal to height is the natural crossover, but neither model is correct there, and neither model announces its own failure.

**Every fracture starts in the wrong regime.** In the first seconds of a treatment the fracture is shorter than it is tall, which is KGD, and it ends far longer than it is tall, which is PKN. A single model for the whole job is a decision to be wrong at one end.

**The height is an assumption too.** You compare length against a height you also predicted. If the barriers do not hold and the fracture grows out of zone, the comparison you used to pick the model was made against the wrong number.

**Neither model conserves anything the other does.** They are not two approximations either side of a truth you could interpolate between. They are different elastic problems, and the answer is not obliged to lie between them.

## The engine will not stop you

`fracGeometry` computes whichever model you name at whatever geometry you give it. It refuses a non-positive rate, viscosity, half-length, height or modulus, and it refuses a model name it does not know. It does not refuse a bad pairing of model and geometry, because it cannot know which of the two numbers you trust.

## Exercise

Take the published height of 30 m and find the half-length at which the rule of thumb stops giving a clear answer.

Then run both models at that half-length in the panel and write down how far apart they are.
