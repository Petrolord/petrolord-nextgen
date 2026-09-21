# What rate can I tolerate

{{panel:fc-inhibitor-integrity-explorer}}

The remaining-life door runs one way. Hand it a rate, an allowance, a consumed depth and a design life and it gives back the remaining allowance, the remaining years, the allowance a design life demands, the shortfall and a verdict. Most questions in this module are the same door read backwards. Fix the verdict and ask what input would produce it.

## The inverse question

The first inversion is the simplest to state. Given this allowance, this consumed depth and this design life, what is the largest rate at which the engine still says the design life is met?

There are two ways to answer it and the difference between them is the lesson. You can rearrange the arithmetic on paper and divide the remaining allowance by the design life. Or you can bisect the engine's own `meetsDesignLife` flag, narrowing a bracket on the rate until the verdict turns over, and read the rate at the turn.

## Why bisect the verdict

Take the second route. The flag is what the engine actually returns, and the boundary of a flag is the exact place where the module's answer changes. An algebraic rearrangement answers a question you wrote down, and the two agree only while every guard, every rounding and every branch inside the door behaves the way the rearrangement assumes.

This module gives several reasons for that caution in one door. A zero rate does not come back as an unbounded life with a passing verdict: `remainingYears` is null, `meetsDesignLife` is null and `unbounded` is true. An allowance already consumed past its own depth is a refusal rather than a negative life. A design life left out gives a remaining life with `meetsDesignLife` null and `requiredAllowanceMm` null. None of those behaviours falls out of dividing one number by another, and a bisection on the flag meets all of them on the way.

## Where the rate comes from

There is a second reason this inversion is clean enough to grade. The rate fed into the life door does not have to come from the correlation. A capstone here states the rate from an operator's inspection survey, which means no held constant is anywhere in the chain. The whole arithmetic then reduces to a division, a multiplication and a comparison over quantities somebody measured or typed.

Work the lab's own case to see the shape. At a stated rate of 0.250000 mm/yr, with a 4 mm allowance, 1.2 mm gone and a 20 year design life, the remaining allowance is 2.800000 mm and `requiredAllowanceMm` is 5.000000 mm, so the shortfall is 2.200000 mm. Every one of those is arithmetic over the four numbers handed in.

## Exercise

Take that worked case and find, by bisection on `meetsDesignLife`, the largest rate at which the design life is still met. Record the bracket you started with and the value you converged on. Then compute the same answer by rearranging the arithmetic, and say what would have to be true inside the door for the two to disagree.
