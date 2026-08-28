# The story so far

A real study, an untuned model, and four numbers held against each other.

## What a laboratory does

Four experiments, each answering a different question.

The **constant composition expansion** expands the fluid with nothing removed and gives the bubble point, which is the least ambiguous number in the report.

The **differential liberation** depletes it stepwise and removes the gas at each step, imitating the reservoir. Its Bod and Rsd are referenced to a RESIDUAL oil at 60 F, not to a stock tank barrel, and using them directly overstates both.

The **separator test** takes the fluid to a stock tank through chosen stages and defines what a stock tank barrel is. It supplies the level; the differential supplies the shape.

The reservoir engineer's Bo and Rs come from combining them by the Amyx correction, which is exact at the bubble point by construction and approximate below it. Neither experiment measures them alone.

## The study

Good Oil Co. Well No. 4, Core Laboratories RFL 88001, reproduced in McCain, in Whitson and Brule and in Ahmed.

| quantity | value |
|---|---|
| reservoir temperature | 220 F |
| bubble point | 2634.65 psia |
| total gas-oil ratio | 768 scf/stb |
| stock tank gravity | 40.7 API |
| formation volume factor | 1.474 rb/stb |

Pressures in the report are psig on a 14.65 psia base. The optimum separator test ran at 100 psig and 75 F, and the stock tank stage it implies but does not list is at 14.65 psia.

## The fluid

Eleven components. Methane at 0.3647 and C7+ at 0.3329, which together say black oil rather than volatile oil or condensate.

The C7+ is one lump carrying a third of the moles and most of the mass, described by a molecular weight of 218 and a specific gravity of 0.8515. From those two numbers the engine builds eight pseudo-component properties through six correlations, and everything the model does at the heavy end follows from them.

Its Watson K comes out at 11.73724869095868, a normal slightly naphthenic heavy end, which is the free sanity check on the two measured inputs.

## The untuned model against it

| quantity | measured | model | error |
|---|---|---|---|
| saturation pressure | 2634.65 psia | 2791.100735294379 psia | +5.938198064045652 pct |
| total gas-oil ratio | 768 scf/stb | 793.8042771796476 scf/stb | +3.3599319244332757 pct |
| stock tank gravity | 40.7 API | 31.8056416463794 | -8.894358353620603 API |
| formation volume factor | 1.474 rb/stb | withheld | no basis |

Two ordinary errors, one large one, and a refusal.

The saturation pressure runs high because a single lumped pseudo-component smears the balance between light and heavy ends. The gravity runs light because a generalized volume shift correlation is being applied to that lump; the pure C7+ pseudo recovers a standard-condition specific gravity of 0.9075 against the defined 0.8515.

The formation volume factor is undefined because the model's saturation pressure sits ABOVE the pressure the laboratory calls reservoir pressure, so on this model the fluid there is two phase and there is no single-phase volume to report. The engine returns null rather than a number.

## What the tier established

**A documented bias is not a defect.** Understood, reproducible, recorded, directional. The engine pins each one just above its observed value so a change fails a test.

**An untuned equation of state is not automatically better than a correlation.** On the stock tank gravity it is much worse, because a gravity from a separator test is a measurement and a gravity from an untuned model is a construction.

**A correlation is enough more often than people assume.** It stops being enough when the decision turns on the difference, when the composition is the answer, when the fluid is unusual, or when the composition is being changed.

## What the Expert tier does

Builds the equation of state and then tunes it, four bounded knobs against these same four targets, and reports what the tuning cost. Three targets improve and one gets worse, and that trade is the tier's subject.

## Exercise

First, write the one-paragraph summary of this fluid a reservoir engineer joining the study should read first, containing one measured number, one model error and one caveat.

Second, of the four experiments in a PVT study, name the one whose numbers are most often misused and say what the misuse is.
