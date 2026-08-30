# The pressure skin costs

Turning a dimensionless number into psi, which is the form anyone will act on.

{{panel:wt-buildup-explorer}}

## The conversion

    dp_skin = 141.2 q B mu S / (k h)      psi

The 141.2 is the same group that appears in the semilog slope, without the base-ten logarithm conversion: 162.6 is 141.2 times 2.303 times half, near enough, and both come from the same solution.

Notice that this quantity is proportional to rate. The skin factor is not; the pressure it costs is. A well with a skin of plus 6.5 producing at 900 stb/d is paying twice the pressure penalty it pays at 450, which is the reason damage matters more on good wells than on poor ones.

## What it is worth on this well

At the PLANTED values, permeability 85 mD and skin plus 6.5, the skin pressure drop at 450 stb/d is

    141.2 x 450 x 1.25 x 0.9 / (85 x 45) x 6.5 = 121.47352941176467 psi

The well was flowing at 4530.771773811249 psia against an initial reservoir pressure of 4800, which is a total drawdown of about 269 psi. So of the pressure being spent to make this well produce, something like 45 percent is being spent in a thin annulus around the wellbore, and the rest is doing the actual work of moving oil through the reservoir.

That is the sentence that gets a workover approved.

## Two ways it is wrong

Two things move that number and both are common.

**The skin was read off the wrong window.** Everything from the previous lesson applies, and the skin's error propagates linearly here.

**The permeability in the denominator is the fitted one.** The skin pressure drop uses k, and it is the k from the same fit. So a window error that lowers the permeability and lowers the skin partly cancels in this product, which is a small mercy and not one to rely on: the two errors are not proportional and the cancellation is incomplete.

The practical consequence is that the skin pressure drop from a well-chosen window and the one from a badly chosen window differ by less than the skins do, but they still differ by enough to matter.

## What it is used for

Three things.

**Deciding to intervene.** A large skin pressure drop is a recoverable loss, and it can be compared against the cost of an acid job or a re-perforation directly.

**Predicting the gain.** If a workover removed the skin entirely, the well could produce at the same rate with the flowing pressure raised by dp_skin, or at a higher rate at the same flowing pressure. The second is the useful form and needs the productivity index.

**Reconciling with a production test.** The pressure drop a well shows in production should be consistent with the reservoir's flow capacity plus the skin. When it is not, either the test is old, the skin has grown, or something else has changed.

## Skin can change

Skin is not a fixed property of a well. It grows as scale deposits and fines migrate; it falls after a stimulation; it changes when the drawdown changes enough to move fines. In gas wells it depends on rate directly, which is the subject of an Expert lesson.

That is why the skin from a test five years ago is not evidence about the well today, and why repeat tests on the same well are worth running: the trend in skin is often more useful than any single value.

## The misconception to avoid

"A big skin pressure drop means a big skin." It means a big product of skin, rate, viscosity and the inverse of flow capacity. A modest skin on a high-rate well in poor rock can cost more pressure than a large skin on a low-rate well in good rock, and the intervention decision follows the pressure, not the dimensionless number.

## Exercise

Open the panel, take the skin and permeability from the window that uses every point, and compute the skin pressure drop they imply.

Compare it against the 121.47352941176467 psi the planted values give. Then say, in one sentence, what an engineer acting on the first number rather than the second would decide to do about this well.
