# Blind wells per parameter

The last lesson scored one well. The same blind check at every pack well shows which of the three parameters holds across the field. AI (acoustic impedance) correlates well at all four wells; Vp/Vs and density do not, and each is reported for what it is.

## The check

Each well is inverted with the three LFMs built from the other wells, from the near, mid and far stacks, with weights of 0.050000 for each parameter and 60 iterations. Each parameter is then scored against the well's own log after the high cut, by the rule of the post-stack blind-well lesson: the correlation, and the RMS of the relative error in percent. The LFMs come from lfm.js, which awaits its independent oracle in the engines repository; the course teaches these figures and grades none of them through it until that lands.

| well | AI correlation | AI error percent | Vp/Vs correlation | Vp/Vs error percent | density correlation | density error percent |
| --- | --- | --- | --- | --- | --- | --- |
| Ekene-1 | 0.863789 | 8.956955 | 0.470296 | 10.707173 | -0.767957 | 14.112317 |
| Ekene-2 | 0.854299 | 9.659172 | -0.287516 | 15.482932 | -0.470987 | 10.343005 |
| Ekene-3 | 0.847660 | 10.653026 | 0.360220 | 12.979404 | -0.719301 | 16.816175 |
| Ekene-4 | 0.780557 | 9.629147 | -0.132709 | 12.786564 | -0.413424 | 9.115991 |

## AI holds

The AI correlations run from 0.780557 at Ekene-4 to 0.863789 at Ekene-1, close to the post-stack model-based figures at the same wells. The AI error sits beside the LFM-alone error of the post-stack lesson: below it at Ekene-2 and Ekene-4, above it at Ekene-1 and Ekene-3. The AI errors are also below the post-stack model-based blind errors at every well.

## Vp/Vs is mixed

Vp/Vs correlates positively at Ekene-1 and Ekene-3 and negatively at Ekene-2 and Ekene-4. A parameter that follows the log at two wells and runs against it at two cannot be read between them with confidence. Its errors, from 10.707173 to 15.482932 percent, are larger than the AI errors at every well.

## Density fails

The density correlation is negative at all four wells. The inversion moves density away from the log everywhere it can be checked, as the single-well experiment showed at Ekene-1. Its error is smallest at Ekene-4, where the correlation is least negative; a small error beside a negative correlation is no sign of skill.

## What a study quotes

The blind figure for each parameter it uses, at every well. On the Ekene pack that supports AI from simultaneous inversion. It does not support a Vp/Vs map or a density map, and a study that shows either says so beside it with these scores.

The next module turns impedance into properties. It inherits these limits: a property predicted from AI rests on a parameter the blind wells support, and one predicted from Vp/Vs or density rests on a parameter they do not.

{{panel:qi-inversion-explorer}}

## Exercise

In the inversion explorer, set View to "Simultaneous inversion by stacks", Data to "Ekene teaching pack", "The well's own log" to left out, "Stacks used" to near, mid and far, weights 0.050000, 0.050000, 0.050000 and Iterations 60. Step Well through Ekene-1 to Ekene-4 and read the three parameter rows at each. Then set the well's own log to kept in at Ekene-2 and write one sentence on whether keeping the well changes the sign of its Vp/Vs correlation.
