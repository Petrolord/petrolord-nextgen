# Reading a design off the optimum

One number tells you which way a stimulation design is wrong, and what to do about it.

{{panel:st-pack-explorer}}

## The diagnostic

You are handed a completed design or a job that has already been pumped. Compute its dimensionless fracture conductivity and compare it with 1.6. That single comparison sorts the design into one of three states, and each state has its own remedy.

| where the design sits | what is limiting it | what to do |
|---|---|---|
| conductivity well below 1.6 | the pack cannot carry what the fracture collects | more conductivity, or less length |
| conductivity near 1.6 | neither, at this proppant volume | nothing, the proppant is well spent |
| conductivity well above 1.6 | the fracture does not reach far enough to use the pack it has | more length, or less conductivity |

The remedies mirror each other because the trade is symmetric. At fixed proppant, buying length spends width and buying width spends length, so below the optimum you can move towards it from either side.

## Which lever you actually have

"More conductivity" is not one action. It is a stronger proppant that crushes less at the closure stress, a larger proppant volume, or a smaller damage factor from better cleanup. The published case applies a damage factor of 0.5, which halves the pack permeability the design gets credit for, so half of the conductivity in that job is being thrown away before the well is opened.

"Less length" is usually the cheaper lever, because it costs nothing. It is the same proppant, placed over less face.

If more proppant is on the table then the trade is no longer fixed, and the optimum moves. That is the subject of the next lesson.

## Where the published job sits

The published design has a half-length of 150 m and a dimensionless conductivity of 0.6649847808507611.

That is below 1.6, so read it off the table. The job is transport limited. It was designed long, and the proppant it carried is spread too thin to bring back what a 150 m fracture collects.

The fix that costs nothing is to place the same proppant over a shorter fracture.

| design | half-length, m | conductivity | pseudo-skin | effective radius, m |
|---|---|---|---|---|
| as published | 150 | 0.6649847808507611 | -5.3116380662677045 | 21.889652014700083 |
| at the searched optimum | 95.62290278496067 | 1.6363280590574483 | -5.4132436175894565 | 24.230679198301456 |

Look at the size of the prize before you rewrite anybody's design. The pseudo-skin moves from -5.3116380662677045 to -5.4132436175894565 and the effective wellbore radius from 21.889652014700083 m to 24.230679198301456 m. The published job is off the optimum but it is not a bad job, because the optimum is flat near its minimum. Being somewhat off it costs little, and that flatness is why designs pumped at 150 m rather than 95.62290278496067 m still perform.

The lesson to take is directional. Below the optimum, more conductivity or less length. Above it, the opposite. And check what the move is worth before you argue for it.

## The number you must also check

Before diagnosing anything, confirm the conductivity is inside 0.1 to 1000. That is the range over which the engine's pseudo-skin correlation is stated to apply. Outside it the skin still prints, and it is no longer a reading you should quote.

## Exercise

First, take the 260 m and 60 m rows of the sweep, state which of the three states each falls into, and name the remedy.

Second, for the published job, write the one sentence you would put in a design review saying what is limiting it and what you would change.
