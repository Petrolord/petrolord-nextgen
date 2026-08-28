# The two fluids in this course

One designed and one measured, and the difference between them is the course.

{{panel:fluid-correlation-explorer}}

## Ekene

The field every course in this series is built on. Its oil:

| property | value |
|---|---|
| oil gravity | 32 API |
| gas gravity | 0.75 |
| reservoir temperature | 180 F |
| bubble point | 2000 psia |
| initial pressure | 3200 psia |
| solution gas | 400 scf/stb |
| formation volume factor | 1.2 rb/stb |
| oil viscosity | 1.8 cp |

Those numbers were DESIGNED. Nobody measured them: they were chosen when the material balance course built the tank model, and every course since has carried them unchanged so that a number computed in one course still means the same thing in the next.

That makes Ekene the right fluid to learn correlations on, because you can hold what the correlation says against what the field is defined to be and the difference is visible.

## What the correlations say about it

The panel above runs every Pb, Rs and Bo correlation the engine carries at those conditions. Two things are worth noticing immediately.

The three bubble points disagree by hundreds of psia on the same fluid. That is not one of them being broken; it is three fits to three different sets of oils, evaluated on a fourth.

And none of them returns the designed 2000 psia, because the designed fluid was not built by a correlation. The simulation course established that gap and left the arithmetic for this one.

## Good Oil Co. Well No. 4

A real reservoir fluid study: Core Laboratories report RFL 88001, on a well in Samson County, Texas, reproduced in McCain's *The Properties of Petroleum Fluids* and in Whitson and Brule's *Phase Behavior*. It is one of the most reproduced PVT studies in the literature, which is why the engine uses it as a gate.

What the report contains:

| quantity | value |
|---|---|
| reservoir temperature | 220 F |
| bubble point | 2634.65 psia |
| total gas-oil ratio | 768 scf/stb |
| stock tank gravity | 40.7 API |
| formation volume factor | 1.474 rb/stb |
| components reported | 11, including a C7+ fraction |

Every one of those is tier `measured`. A laboratory put a sample of this fluid in a cell and did the experiments.

## Why the course needs both

Ekene teaches what the correlations do, with a designed answer to hold them against.

Good Oil teaches what a laboratory actually does, and what a model makes of real measurements. The Professional tier reads the report; the Expert tier runs an equation of state against it and then tunes one. You cannot learn either of those on a fluid nobody measured.

## The pressures to keep straight

Ekene's bubble point is 2000 psia and its initial pressure is 3200 psia. Good Oil's bubble point is 2634.65 psia and its reservoir pressure is the same number, because the report's sample was at its bubble point.

Confusing an initial pressure with a bubble point is the commonest arithmetic error in this material and it produces answers that look reasonable.

## The misconception to avoid

"A designed fluid is a fake fluid, so the exercises are artificial." A designed fluid is one whose true answer you know, which is what makes it a teaching fluid. The correlations being run on it are the same correlations that would be run on a real one, and the errors they make are the same errors.

## Exercise

First, open the panel and read the three bubble points for the Ekene fluid. State the spread between the highest and the lowest, and say what that spread tells you about quoting a bubble point from a correlation without naming the correlation.

Second, list which of Ekene's eight properties above are measured. Then do the same for Good Oil.
