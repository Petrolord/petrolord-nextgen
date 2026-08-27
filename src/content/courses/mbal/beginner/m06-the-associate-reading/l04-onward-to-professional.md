# Onward to Professional

You can now take a set of pressure surveys, build the four terms, plot the straight line, read the oil in place off its slope, apportion the drive, and reconcile the result against an independent volumetric booking. That is a complete piece of reservoir engineering, and a great many oil in place figures in the world rest on nothing more than it, done carefully. If the Associate capstone is behind you, the skill is real.

It was also the easy case, deliberately. The Ekene tank is closed, undersaturated, noise-free and honest. It has one drive mechanism, no gas cap, no water support, per-row fluid properties supplied at every survey, and a pressure history built to balance exactly. Real tanks are rarely that well behaved, and the Professional tier is about what you do when they are not.

Here is what it takes up, and why each piece is there.

**Water arrives.** The single largest change from this tier is that most real reservoirs are not closed. They sit against a body of water, and when you drop the pressure in the reservoir the water pushes back and flows in. That imported water does work the oil would otherwise have had to do, and a tank model that has not been told about it will hand you an oil in place figure that is wrong, confidently. You will learn what water influx does to the material balance equation, why it is the one term you cannot measure directly, and why an aquifer has to be modelled rather than looked up.

**The drifting ratio.** The most valuable diagnostic in the subject, and you already have half of it. On Ekene the ratio of withdrawal to total expansion was the same number at every survey, and that constancy is what a straight line through the origin means. When a tank is receiving water, that ratio does not stay constant. It drifts, in a direction and with a shape that tells you what is missing from your model. Professional teaches you to read the drift before you choose a model, rather than fitting models until one of them looks tidy. The corollary is a habit worth carrying now: always look at the ratio survey by survey, not just at the fitted slope.

**Choosing an aquifer, and paying for the wrong one.** Once you accept that water is arriving, you have to say something about the aquifer that delivers it: how big, how connected, how quickly it responds. There are several standard models, of increasing sophistication and increasing appetite for parameters, and the tier works through them. The important lesson is the one about cost. Adding an aquifer term to a model gives the regression a new freedom, and a regression will always spend a freedom you give it, whether or not the physics needs it. Force an aquifer onto a tank that has none and the oil in place moves, sometimes catastrophically, while the fit statistic stays high enough to look healthy. You saw the mechanism of that in this tier's common errors lesson. Professional gives you the numbers.

**Gas.** Everything you have done has been an oil tank. Gas reservoirs have their own material balance, built on the same conservation idea but expressed through a different plot, and the way that plot bends when water is present is the gas equivalent of the drifting ratio. Learning it doubles the range of fluid systems you can read, and it is where several of the engine's alternative solver methods come from.

**Where fluid properties come from.** Ekene handed you an oil formation volume factor on every row. Real datasets often do not. When they do not, something has to supply the number, and there is a strict order of precedence: measured values first, then a laboratory table interpolated at the survey pressure, then a correlation. Knowing that order matters, because a laboratory table that does not span your pressure range falls through to a correlation quietly, and the answer you get is then partly a laboratory result and partly a published curve fit. Professional teaches you to know which is which, and to read the warnings the engine emits when it happens.

The tier closes as this one did, with a workflow, a walkthrough and a capstone, this time on a tank with water and on a published benchmark case.

None of it requires anything you do not already have. It requires the same habits applied where the answers stop being obvious: check the terms before the fit, look at the plot before the statistic, reconcile against something independent, and state what would change the answer.

## Exercise

Two things to write, and keep both.

First, go back to your Associate capstone submission and list every assumption the course made on your behalf: that the tank was closed, that the pressures were representative, that the fluid properties were supplied and correct, that one pressure describes the whole reservoir. Beside each, write one sentence on the evidence you would need to defend it if a reserves auditor asked.

Second, look at the Ekene ratio column one more time, the one that held the same value at every survey. Write down what you would conclude if that column had risen steadily from the first survey to the sixth, and what you would conclude if it had fallen. You will not be able to justify your answers yet. Write them anyway, and check them against yourself at the end of the Professional tier's first module.
