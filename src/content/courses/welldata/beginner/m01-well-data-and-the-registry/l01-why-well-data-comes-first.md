# Why well data comes first

Every course in the NextGen geoscience path stands on well data. Petrophysics computes shale volume, porosity and saturation from well curves. Well correlation hangs its tops on them. Synthetics turn sonic and density curves into seismograms. Mapping grids surfaces between wells, and volumetrics turns those surfaces into barrels. Whatever door you eventually walk through, the numbers you trust there were once columns in a well data file that somebody imported, checked and published.

That is why Well Data Manager is the root of the path, and why its Associate certificate is the prerequisite for every other geoscience course. Before you are allowed to interpret data, you learn to receive it.

## How bad data travels

The dangerous thing about a data error is not that it breaks the workflow. It is that it usually does not. Software is obliging: it will compute porosity from a density curve in the wrong units, correlate tops on a depth column that silently changed reference, and grid a surface through values that were never real measurements. The numbers come out looking like numbers.

Consider the two classic failures this course trains you to catch. The first is the unit error. One of our teaching files, feet_20.las, records depth from 4900 to 5200 in feet. Read those values as metres and every sample in the well lands more than three kilometres below where the rock actually is. Nothing crashes. The curves still plot. Only much later, when a correlation refuses to close or a synthetic will not tie, does someone start digging, and by then the error is buried under three apps' worth of derived products.

The second is the unflagged null. Well data files mark missing samples with a sentinel value, commonly -999.25, and one of our teaching files uses -9999 instead. A reader that assumes the common flag will treat every -9999 as a real measurement. A gamma ray average with a few of those mixed in is not slightly wrong; it is meaningless, and it will sit in a report looking respectable.

In both cases the failure is silent at the point of entry and expensive at the point of discovery. That gap between where an error enters and where it surfaces is the entire reason data management exists as a discipline.

## The cost asymmetry

Catching these problems at import costs minutes. The import QC panel in this app shows you the depth unit, the declared null value, the sample count, the step, and the null count and statistics of every curve, all computed from the file by the same parser the platform uses everywhere. Reading that panel carefully for one well is a five minute job.

Not reading it costs days. A wrong unit discovered downstream means finding every product built on the bad curve, deciding which are salvageable, recomputing the rest, and re-earning the trust of everyone who used them. The arithmetic is lopsided enough that the rule writes itself: no curve enters the shared registry without passing QC first.

## Gatekeeper, not clerk

It is tempting to treat data loading as clerical work, a chore to click through on the way to the interesting interpretation. This course asks you to take the opposite view. The data manager is a gatekeeper. Every file that arrives is a claim about the subsurface, and your job is to decide whether the claim is fit to be believed before anyone builds on it.

That means you do not just load files; you interrogate them. Does the format parse cleanly? Are the units what the header says they are? Is the sampling regular, and does the depth range make sense for this well? Are the missing intervals flagged honestly, and are the statistics of each curve physically plausible? A gatekeeper who asks those questions every time is the cheapest insurance a subsurface team can buy.

The rest of this course gives you the tools to ask them properly: the LAS format in module 2, depth and units in module 3, nulls and completeness in module 4, headers and metadata in module 5, and the full QC workflow in module 6. The graded capstone at the end asks you to run exactly this gatekeeping job on six files and report what you find.

## Exercise

A colleague hands you a LAS file and says the header block looks fine, so it can go straight into the project. List the four things you would still check before publishing it, and for each one name the consequence of skipping the check. As a self-check, your four should cover structure, units, sampling and completeness; if your list only covers the header, re-read the section on how bad data travels. Then write one sentence explaining why an error that does not crash any software is more dangerous than one that does.
