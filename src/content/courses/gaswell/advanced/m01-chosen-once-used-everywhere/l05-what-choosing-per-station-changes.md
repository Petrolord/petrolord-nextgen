# What choosing per station changes

Asking the recommendation at every station instead of once at the gauge is a small edit with a large consequence, and it is not obviously an improvement.

{{panel:pd-remedy-explorer}}

## The profile it would produce

On the teaching well EBOCHA-5, which is not a published case, the recommendation is coleman at 880.0 psia and 978.0 psia and turner at 1090.0 psia and below. A per-station profile therefore reads the top two stations under Coleman and the bottom four under Turner.

| Depth, ft | Correlation | Ratio | Loaded |
| --- | --- | --- | --- |
| 0.0 | coleman | 1.1605604334 | false |
| 1500.0 | coleman | 1.1184659554 | false |
| 3000.0 | turner | 0.8968019786 | true |
| 4500.0 | turner | 0.8617107374 | true |
| 6000.0 | turner | 0.8315904346 | true |
| 7500.0 | turner | 0.8016268212 | true |

The single-correlation Coleman profile puts the shallowest loading station at 6000.0 ft. Choosing per station puts it at 3000.0 ft, which is a different well to remediate.

## The step it introduces

The Coleman critical rate at 1500.0 ft is 2771.653428599 Mscf/d and the Turner critical rate at 3000.0 ft is 3456.727431568 Mscf/d. Under one correlation the critical rate rises 108.952764374 Mscf/d between those stations and the ratio falls 0.0423035811, in line with the increments on either side. A mixed profile replaces that smooth rise with a step, and the step is not a property of the well: it is where a pressure threshold happened to land inside the traverse. Nothing physical changes at 1000.0 psia, and a discontinuity invites a reader to look for a mechanism at that depth.

## What actually changes

Not much, if the study reports the station. Both correlations put the controlling station at 7500.0 ft and both call it loading, at -3.80478145 percent under Coleman and -19.83731788 percent under Turner. The honest reading is that the shoe loads by somewhere between those two figures. The choice cannot turn a loading shoe into a healthy one.

## The mistake

Reaching for the per-station edit to remove the disagreement. It relocates the disagreement and buys a discontinuity to do so. The useful response is to print both columns and name the station that produced each.

## What it refuses

`recommendCorrelation` returns guidance and not a decision, so nothing in the engine does this for you. `loadingProfile` takes one correlation for the whole traverse and has no argument for a per-station list, so a mixed profile is assembled by hand and then defended by hand.

## Exercise

Build the mixed profile in the panel and record the shallowest loading station under it, against the shallowest loading station under Coleman alone.

Then write one sentence explaining what a reader would wrongly infer from the step between 1500.0 ft and 3000.0 ft.
