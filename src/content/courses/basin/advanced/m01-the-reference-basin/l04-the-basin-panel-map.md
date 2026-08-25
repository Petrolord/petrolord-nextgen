# The basin panel map

This tier's panel runs the full forward model, live, twice: once with the erosion amount you choose and once with no event, so that every view is a comparison. It is the same engine the capstone grades, on the same fixture. This lesson is the tour.

{{panel:bs-charge-explorer}}

## The control

One control matters: the erosion amount, selectable at 0, 300, the reference 600, and 900 m, always removed at 10 Ma. The reference basin is the 600 setting; the others exist because a forward model is understood through its sensitivities, and module 3's last lesson grades your reading of them. While the model runs you will see a brief computing state: the panel is genuinely marching 150 Ma of history at 1 Ma steps, not looking up curves.

## The burial track

The first chart is the source layer's burial history: depth of its top and bottom against age. Its shape is a staircase, and the treads are the lesson. Deposition events drop it instantly: at 120 Ma the Mid Sand lands, at 80 Ma the Upper Shale's 1600 m arrive in one step and the source top leaps from 1467.7117658564923 to 2800 m. Between events, nothing moves. At 20 Ma the phantom section arrives, deepening the source once more; at 10 Ma it vanishes and the track rebounds to its present 2800 to 3200. Module 2 explains the instant treads, module 3 the phantom.

## The temperature and maturity tracks

The second chart carries two curves against age: the source's centre temperature, and its reflectance, with the no-erosion run's reflectance drawn faintly behind. Watch three episodes. The temperature spike at 80 Ma when the overburden lands, then the slow transient catch-up. The hot decade, 20 to 10 Ma, where temperature peaks at 168.51433459340572 degC. And the endgame: temperature falls back to 149.76037539670858, while the reflectance, a ratchet, holds everything it earned; the gap between the solid and faint Ro curves at age zero is the erosion signature itself, visible as a picture before module 3 makes it a graded number.

## The mass chart and the cap

The third chart is generation and expulsion, cumulative kilograms per square metre, with the retention cap drawn between them. Generated mass rises with TR; expelled mass is zero until generation first exceeds the cap, then tracks the excess monotonically. The cap line does something the modules ahead depend on: it steps down during the phantom decade, because the buried source is thinner and less porous, and steps back up at the rebound. Where the cap dips while generation stands high, expelled mass jumps and never gives the jump back. That is the squeeze, module 4's centrepiece, sitting in plain sight.

## The tiles

The tiles are the graded surface and its supports: final Ro, final temperature, final TR, generated, expelled, and the erosion signature against the no-erosion baseline, plus the closed-form potential 18786.405883452077 kg/m2 as the QC anchor. At the 600 m setting the six graded values read exactly as the capstone expects; at any other setting the signature tile shows what module 3's sensitivity lesson will have you predict before looking.

## Exercise

Set the erosion amount to 0 and note which tiles move and which stay. Then answer in one sentence each: why does the burial track move in steps rather than ramps, and what single visual feature of the temperature-maturity chart encodes the capstone's sixth graded field?

As a self check: at 0 m the signature tile goes to zero, final Ro falls to 1.6151780693528823, expelled falls to 8790.335784168848, while the potential tile and the final temperature barely move, the latter because the thermometer forgets. The burial track steps because the model deposits each layer instantaneously at its start age. The sixth field is the terminal gap between the solid reflectance curve and the faint no-erosion one: the erosion signature, 0.05665081052235643 at the reference setting.
