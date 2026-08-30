# The end of the job

Two numbers at the last step, and one of them decides whether the floats do any work.

{{panel:cm-placement-explorer}}

## The float differential

    floatDiffPa = annulus head at the end - inside head at the end

Computed once, at the final step, with no friction in it because the pumps have stopped.

## What it means

**Positive** means the annulus is heavier than the inside. The cement in the annulus wants to fall back INTO the casing, and the float equipment has to hold it. That is exactly what floats are for and it is the normal condition.

**Negative** means the inside is heavier. The engine warns:

    Inside column is heavier than the annulus at the end of the job;
    floats must hold the reverse U-tube.

which is a worse situation, because a one-way valve designed to hold flow in one direction is being asked to hold it in the other.

## The four values

| well | programme | float differential (Pa) |
|---|---|---|
| slant | lead and tail | 5714040.2699640095 |
| slant | neat | 6081982.155976057 |
| horizontal | lead and tail | 570815.1577260531 |
| horizontal | neat | 969242.4068793952 |

All four positive. And the slant well's is TEN TIMES the horizontal well's on the two-slurry programme.

## Why the factor of ten

The same reason as everything else on these two wells: true vertical depth.

Both have the same annular cement column in measured depth. On the slant well that column covers 2507.9196993011733 m of vertical from surface to the shoe. On the horizontal well, 1214.859173174059.

Less vertical height means less head, on both sides, and the DIFFERENCE shrinks with it.

## What a small float differential means in practice

That the floats have little to hold, which sounds good and is mostly neutral. The differential is what drives cement back into the casing if a float leaks, so a small one means a leak matters less.

It also means the job is closer to the reverse condition, and a small change in the displacement fluid density could push it negative.

## The relationship to the end pump pressure

    end pump pressure = float differential + friction at the last step

On the slant well's two-slurry job: 13712451.13169735 against a float differential of 5714040.2699640095, so 7998410.86173334 Pa of the final pressure is friction.

More than half the plug bump pressure is friction rather than hydrostatic imbalance, which is why the bump pressure falls when the rate is reduced for the last few cubic metres.

## The vertical fixture, where they are equal

The published vertical fixture carries no rheology on any fluid, so its friction is identically zero and

    end pump pressure = float differential = 5364986.726283755 Pa

exactly. That equality is the cleanest possible demonstration of what the two numbers are.

## Exercise

On the slant well's neat programme the end pump pressure is 14397110.807469234 Pa and the float differential is 6081982.155976057.

Compute the friction at the last step, and compare it against the two-slurry job's. Say why the neat job has more.
