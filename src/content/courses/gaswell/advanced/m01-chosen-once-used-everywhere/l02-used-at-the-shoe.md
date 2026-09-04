# Used at the shoe

The name chosen from one pressure is applied at every station, including the one that decides whether the well loads.

{{panel:pd-remedy-explorer}}

## Six stations, one answer

The teaching well EBOCHA-5 is not a published case and no oracle has checked it. Its traverse runs from 880.0 psia and 112.00 degF at surface to 1500.0 psia and 194.00 degF at a 7500.0 ft shoe, on 3.548 in tubing throughout, at 3100.0 Mscf/d. `loadingProfile` is handed a correlation once, for the whole list. Called with the wellhead pressure, which is how it is called in practice, `recommendCorrelation` returns coleman, and coleman is what every station then gets.

## What the same function says at each station

`recommendCorrelation` takes one pressure, so asking it at each station is the same call six times, and it does not return the same answer. At 0.0 ft it is handed 880.0 psia and returns coleman. At 1500.0 ft, 978.0 psia, coleman again. At 3000.0 ft, 1090.0 psia, it returns turner, and it returns turner at 4500.0 ft on 1218.0 psia, at 6000.0 ft on 1350.0 psia and at 7500.0 ft on 1500.0 psia.

The wellhead choice is coleman and the controlling station would choose turner. At the shoe the sentence reads "At 1500.0 psia at the 7,500 ft shoe this well is above the range Coleman studied, so Turner's 20 percent adjustment is the usual choice." That sentence is available, and the study never asks for it.

## What the well looks like under each

The same six stations, evaluated once under each correlation at the same rate.

| Depth, ft | Coleman ratio | Loaded | Turner ratio | Loaded |
| --- | --- | --- | --- | --- |
| 0.0 | 1.1605604334 | false | 0.9671336945 | true |
| 1500.0 | 1.1184659554 | false | 0.9320549628 | true |
| 3000.0 | 1.0761623743 | false | 0.8968019786 | true |
| 4500.0 | 1.0340528848 | false | 0.8617107374 | true |
| 6000.0 | 0.9979085215 | true | 0.8315904346 | true |
| 7500.0 | 0.9619521855 | true | 0.8016268212 | true |

The verdicts differ at 0.0, 1500.0, 3000.0 and 4500.0 ft, and agree only where the well loads under both. The well is loaded either way, at a margin of -3.80478145 percent under Coleman and -19.83731788 percent under Turner, controlling at 7500.0 ft in both cases.

## The mistake

Assuming the disagreement lives at the deep stations, where the pressures are high and Turner is arguably right. It is the opposite. The correlations agree about the shoe and disagree about the top four stations, the ones an operator uses to call the well healthy.

## What it refuses

`loadingProfile` takes one correlation for the whole traverse and offers no way to vary it with depth. It refuses an unknown one, returning "Unknown loading correlation \"guess\". Use turner or coleman.", and refuses an empty traverse rather than treating it as a passing well. What it will not do is object when a name selected at 880.0 psia prices a droplet at 1500.0 psia.

## Exercise

Read the six stations under each correlation in the panel and record where the verdicts part company.

Then say in one sentence why a study that prints only the controlling station never notices the seam.
