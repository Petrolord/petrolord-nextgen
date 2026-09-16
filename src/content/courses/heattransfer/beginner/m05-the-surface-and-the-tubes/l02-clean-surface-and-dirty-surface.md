# Clean surface and dirty surface

An exchanger has two overall coefficients, and the difference between them is a decision rather than a measurement. The clean one is what the surfaces would carry with nothing on them. The dirty one has fouling allowances added as resistances, and those allowances were chosen by a person. On the studio case the clean coefficient is 134.459410 and the dirty one is 92.110348 Btu an hour per ft2 per degF, both referred to the outside tube surface.

{{panel:fc-exchanger-explorer}}

## Two coefficients, one duty

Put each of those through the same division, with the same duty of 2750000.0000 Btu an hour and the same log mean of 130.064846 degF, and two surfaces come out.

| coefficient used | area, ft2 |
| --- | --- |
| U clean, 134.459410 | 157.246707 |
| U dirty, 92.110348 | 229.543151 |

The clean coefficient is the larger of the two, so the surface it asks for is the smaller of the two. The engine also reports a fouling penalty on this case, of 31.495796 percent. What that penalty is a percentage of, and how the two fouling allowances get into the coefficient at all, are the coefficient module in the next tier. Here it is enough to know the figure is reported and that the two areas are both real answers to two different questions.

## Why the dirty one sizes the steel

The surface you buy is sized on the dirty coefficient. The reason is the whole of it: the exchanger has to do its duty when it is dirty. A unit sized on 157.246707 ft2 would meet its duty on the day it was commissioned and fall short of it as soon as anything settled on a tube, which is to say almost immediately.

So the clean figure is not useless and it is not the answer. It tells you what the machine can do at its best, which is worth knowing for a performance check on a freshly cleaned unit. It is the wrong number to hand to a fabricator.

Two allowances chosen by a person are the only reason those two figures differ. That makes the dirty coefficient, and every area that comes out of it, a number with a judgement inside it. Write the allowances down beside the area.

## A coefficient of zero

The area door refuses a non-positive coefficient by name: the area needs a positive overall coefficient, and it was 0 Btu/hr.ft2.F. That is a division by zero waiting to happen, and an infinite surface is not an answer anybody can act on.

## A factor above one

The other refusal on this door is on the correction factor, which must be greater than zero and at most one. Given 1.000001 it refuses and quotes the value back.

The band is closed at one on purpose. A correction factor above one would say the arrangement in question delivers more driving force than counter-current flow does at the same terminals, and nothing does. Refusing at a millionth over the boundary looks fussy until you remember what a factor slightly above one would do to a surface, which is to make it slightly too small for a reason nobody would ever find.

## Exercise

Work both areas in the table from their own coefficients and check them. Then write one sentence saying which of the two you would put on a datasheet and why, and one sentence saying what the other one is good for.
