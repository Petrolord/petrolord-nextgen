# Separator tests

The experiment that defines what a stock tank barrel of this fluid actually is.

{{panel:fluid-study-explorer}}

## What is done

Take the fluid at its bubble point and reservoir temperature. Flash it into a separator at a chosen pressure and temperature. Collect the gas, measure its volume and gravity. Take the liquid and flash it again, either into a second separator or straight to a stock tank at atmospheric pressure and 60 F.

Measure the final liquid volume and its gravity. That final volume is one stock tank barrel by definition.

## What it gives

**Total gas-oil ratio.** All the gas from all the stages, divided by the stock tank liquid volume.

**Stock tank gravity**, in API. This is the number the oil is sold on.

**Formation volume factor at the bubble point**, written Bofb: the volume of fluid at the bubble point divided by the stock tank volume it produced.

**Gas gravity for each stage.** The first separator releases the lightest gas; later stages release progressively heavier gas.

## Why the separator pressure is chosen and reported

Because the answer depends on it, substantially.

A high separator pressure keeps more of the intermediate components in the liquid at the first stage, but those components then flash off in the tank, and tank losses are pure loss. A low separator pressure releases too much at the first stage.

Between them is an optimum: a separator pressure that maximises stock tank liquid and therefore maximises stock tank gravity and minimises the total gas-oil ratio. A good study runs several separator pressures precisely to find it.

That is why a separator test is quoted WITH its conditions. A GOR of 768 scf/stb is not a property of the fluid; it is a property of the fluid and the separator it went through.

## Good Oil Well No. 4

The report lists a two-stage test at 100 psig and 75 F, which is the optimum-pressure row, giving:

| quantity | value |
|---|---|
| total gas-oil ratio | 768 scf/stb |
| stock tank gravity | 40.7 API |
| formation volume factor | 1.474 rb/stb |

100 psig against a base of 14.65 psia is 114.65 psia, which is what the fixture carries.

## The stage that is not listed

The report lists the separator. It does not list the stock tank as a stage, because the stock tank is where the oil ends up rather than a piece of separation equipment somebody chose.

But it IS a flash stage. The liquid leaving the separator at 114.65 psia arrives in a tank at 14.65 psia and 75 F, and gas comes off. That gas is in the reported total gas-oil ratio.

So reproducing this test in a model needs TWO stages: the separator at 114.65 psia and the stock tank at 14.65 psia. Model it with one and the stock tank gas is missing, the liquid volume is too large, and every reported quantity comes out wrong in a way that looks like a modelling problem rather than a bookkeeping one.

The next lesson is entirely about that.

## Why this experiment is the anchor

Because the reservoir engineer's Bo and Rs are defined per stock tank barrel, and only the separator test says what a stock tank barrel is.

The differential liberation supplies the SHAPE of the curves through depletion. The separator test supplies the LEVEL. Neither is usable without the other.

## The misconception to avoid

"The separator test is a surface facilities calculation, not reservoir engineering." It defines the denominator of every reservoir volume the study will quote. Change the separator train and the oil in place in stock tank barrels changes, on identical rock and identical fluid, because a stock tank barrel has become a different amount of matter.

## Exercise

First, name the four quantities a separator test reports and say which one defines the denominator of Bo.

Second, Good Oil's optimum test ran at 100 psig and 75 F. Explain in two sentences why a higher and a lower separator pressure would both produce less stock tank liquid.
