# Two means in one engine

Ask this engine for "the average porosity" and it has two different answers, both correct, used by different methods for different reasons. Not knowing which one a number came from is a genuine audit failure mode, so this lesson separates them permanently.

## The two numbers

The ARITHMETIC mean of the four control values, weights ignored:

$$\frac{0.315 + 0.2935651232824187 + 0.277 + 0.2765}{4} = 0.2905162808206047$$

The WEIGHTED mean, MD weights applied:

$$\frac{0.315(35) + 0.2935651232824187(120) + 0.277(45) + 0.2765(46)}{246} = 0.2903935560727246$$

They differ by 0.0001227247478801: small here, because W2's heavily weighted value sits near the middle of the four, but structurally distinct numbers that respond differently to every data change.

## Who uses which

Simple kriging uses the ARITHMETIC mean. "Simple" kriging means kriging with a KNOWN mean; the engine, given no explicit mean, defaults to the plain average of the data values, weights not consulted. That mean anchors everything: residuals are measured from it, and the far-field estimate relaxes to it, which is why the panel's far tile reads 0.2905162808206047 exactly. Pass an explicit mean and the far field follows it instead; the default is a convention, documented, not a law.

The CONSTANT population method uses the WEIGHTED mean: its whole job is "the best single value for this data", and for that job the engine honours the weights, giving 0.2903935560727246 field-wide, or per block, block 0's graded 0.28631191845445614.

So one engine, two means, and the split is principled: the estimator's anchor is a statistical convention about residuals; the constant's value is a data-summary convention about representativeness. But principled or not, the split means a map's far field and the same model's "constant" disagree in the fourth decimal by construction, and anyone diffing the two maps node by node will find a mystery 0.00012 unless they know this lesson.

## Where the split shows up

Three places in this course alone. The panel's paired tile prints both means side by side, and the far-field tile matches the LEFT one. Block 1's kriged map is 0.315 everywhere, which is simultaneously that block's arithmetic mean, weighted mean and only value, the one case where the split vanishes, n equals 1. And the fixture stores 0.2903935560727246 under the name constant_weighted precisely so tests can pin WHICH mean a code path consumed; a refactor that quietly switched the kriging default to the weighted mean would fail the far-field pin by 0.00012, a deliberately detectable drift.

The general habit: whenever a system contains more than one "mean", find out which one each consumer reads, and make at least one test that can tell them apart. A fixture value chosen so the two means COINCIDE would have been useless for that; the 0.00012 gap is a designed tripwire.

## Worked example

Predict both means' response to the same edit, deleting W3 from the data. Arithmetic: the deleted 0.277 sat 0.01352 below the mean of four; removing a point moves the mean by its deviation over the remaining count, $0.01352/3 = 0.0045$, giving $(0.315 + 0.2935651232824187 + 0.2765)/3 = 0.2950217077608062$. Weighted: W3 carried 45 of the 246 units of weight; the new weighted mean is $\frac{0.315(35) + 0.2935651232824187(120) + 0.2765(46)}{201} = 0.2933921134024390$, a shift of 0.0030. Same edit, two anchors, responses differing by half again, because the weighted mean felt W3 at its 18 percent weight share while the arithmetic mean felt it at a full quarter. A system pinned on only one of the means would call the other's drift a bug.

## Exercise

Compute the exact value the far-field kriging tile would show after deleting W3 (it is one of the two numbers you just computed, and knowing WHICH is the point). Then state what the constant method's field-wide value becomes, and which tile in the panel would reveal the difference between the two edits fastest.
