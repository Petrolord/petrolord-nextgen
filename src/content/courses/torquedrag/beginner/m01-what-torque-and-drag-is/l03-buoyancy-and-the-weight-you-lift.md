# Buoyancy, and the weight you actually lift

The first correction, and the only one with a closed form.

{{panel:td-string-explorer}}

## The factor

    buoyancy factor = 1 - (mud density / steel density)

with steel at 7850 kg/m3.

In 1440 kg/m3 mud that is 0.8165605095541402. The string in the hole weighs about 82 percent of what it weighs in air, and the other 18 percent is carried by the mud.

## Why it is a factor rather than a force

Because it applies to every metre of the string identically. A buoyed weight per metre is just the air weight per metre times the factor, so the whole calculation can carry one scalar instead of a distributed force.

That is only true because the string is fully immersed in one fluid. It stops being true the moment the string has different fluids inside and outside it, which is the case in a completion string and is one of the things this engine does not do.

## The table

| mud density | buoyancy factor |
|---|---|
| 1000 kg/m3 | 0.8726114649681529 |
| 1200 kg/m3 | 0.8471337579617835 |
| 1440 kg/m3 | 0.8165605095541402 |
| 1600 kg/m3 | 0.7961783439490446 |
| 1800 kg/m3 | 0.7707006369426752 |
| 2000 kg/m3 | 0.7452229299363058 |

Read the span. Going from a 1000 kg/m3 water-based mud to a 2000 kg/m3 heavy mud takes 15 percent off the string's weight. On a long string that is tonnes.

## The one closed-form answer in the course

On the vertical well the string hangs straight. There is no curvature, so tension pulls it against nothing; there is no inclination, so gravity presses it against nothing. With no normal force there is no friction, and the hookload is exactly the buoyed weight of the string:

    896824.4970405255 N in air, times 0.8165605095541402, is 732311.468284047 N

That is a number you can compute with a pocket calculator, and it is the only one in this course you can.

Keep it. Module 5 uses it to settle a disagreement between two implementations of the model.

## The misconception to avoid

"Buoyancy reduces the weight on bit." It does not. Weight on bit is what you set by slacking off, and the buoyed weight is what determines how much string you need above the bit to supply it without putting the drill pipe into compression. Buoyancy changes the arithmetic of that, and the weight on bit itself is whatever you choose.

## Exercise

Compute the buoyancy factor in 1440 kg/m3 mud yourself, then compute the buoyed weight of the build-and-hold well's string from the air weight in the previous lesson.

Check it against the panel. Then work out what mud weight would be needed to make the string neutrally buoyant, and say why that number tells you the model has an implicit assumption in it.
