# What a wrong factor costs

Every rule in this module exists because of a specific failure, and the failures are not equally dangerous. Some announce themselves within seconds. Others sit quietly in a registry for a year and surface as a dry hole review. This lesson sorts them, because knowing which errors are loud and which are silent tells you where to spend your attention.

## The loud failure

Apply the factor upside down and divide where you should have multiplied, and a well that starts at 4900 ft lands at a converted depth several times larger than any well ever drilled. Nobody ships that. The first person to open the well sees a depth that does not belong to this planet and the import gets redone.

Loud failures are cheap. They cost an afternoon and they teach the person who made them. Notice what makes this one loud: the error is large enough to leave the range of physically plausible values, so the number itself objects to being wrong. That is the only mechanism by which a wrong number catches itself, and the dangerous failures lack it.

## The silent failure

Skip the conversion entirely and store the native numbers under a metres label. The well now runs from 4900 to 5200 in a registry where every reader assumes metres, and its correctly converted range would have been 1493.52001953125 m to 1584.9599609375 m converted. The well is about 3.28 times too deep, since one metre contains 1/0.3048 = 3.2808 feet.

Now ask what objects. A well from 4900 to 5200 m is an ordinary well, deep and unremarkable, the sort of thing a basin has thousands of. The depths are plausible, the log values are untouched, the curve names are right, the null handling is right, the sample count is right. Everything about the well is correct except where it is, and nothing in the file, the panel or the registry contradicts the placement.

This is the failure that matters, so it is worth seeing why it survives inspection.

## Why single-well QC cannot see it

The error is uniform. Every depth in the well is multiplied by the same wrong number, which means the well remains perfectly self-consistent. The gamma ray still lines up with the density at every sample. The step is still constant. The curves still start and stop together. The internal relationships that QC checks are all preserved, because the error moved the whole well without distorting any part of it relative to any other part.

So the error is invisible from inside the file. It becomes visible only by comparison with something outside the file: a neighbouring well, a formation top from a report, a seismic horizon, a driller's total depth. That is the practical reason to know the difference between a check that reads one file and a check that reads a file against the world.

## What it does downstream

Keep this qualitative, because the damage depends on what the well is used for, and every use is damaged differently.

Tops never tie. A top picked on the misplaced well sits hundreds of metres from the same top in every neighbour. In a correlation panel the marker on that well is off the bottom of the display while every other well behaves, and the natural reading is that this well is in a different structural position rather than that it is in the wrong units.

Maps grow features that are not there. A surface gridded through the well is dragged toward the false depth, planting a deep low or, in the other direction of error, a high. The map looks like geology. Somebody may drill it.

A log plots against nothing. Overlay the well's sonic on a seismic section through a time-depth relationship and the events do not correspond to anything, because the log is describing rock from a different part of the section. A well tie that will not tie is a common symptom, and units are one of the first things an experienced interpreter checks.

Volumes move. Any thickness or column height computed against a datum inherits the displacement, and the numbers that come out are precise, confident, and about the wrong rock.

## The half-conversion

There is a third case, and it is the most instructive of the three. The depth column is converted correctly, and a per-length curve is missed.

On feet_20.las this shows up as a count. The pipeline converts two curves: the depth column, and the sonic, which arrives in microseconds per foot with a length in its denominator and whose unit string is in the importer's conversion table. Convert the depth alone and the count is one. That is why the graded reading is a count with no tolerance: it is not measuring your arithmetic, it is measuring whether your model of unit trouble includes curves other than depth.

Converted the wrong way round, a sonic lands outside its plausible range by more than a factor of ten, which is loud enough to catch if anyone looks at the values. Left unconverted, it is quiet, because a transit time in microseconds per foot and a transit time in microseconds per metre are both numbers that look like transit times. The well then has correct depths and a curve that is wrong by a fixed factor, and anything computed from that curve, an acoustic impedance, a synthetic seismogram, a porosity from sonic, carries the factor forward.

## The defences

Four, and this module has now built all of them.

The importer reads the declared unit rather than inferring it from the values. It looks the factor up and refuses the file when the lookup fails, rather than defaulting. It converts every curve, checking each one's unit on its own rather than treating the file as being in a single unit. And it records the source unit and the factor on every converted curve, so the conversion is visible to anyone who looks later.

The fourth is the one that survives you. The first three prevent the mistake at import; provenance is what lets somebody find it if it ever happens anyway.

## Exercise

A well is imported from a foot-denominated file with the depth conversion skipped, and it enters the registry looking healthy. Write down three symptoms that would eventually appear downstream and, for each, name what the symptom would most likely be blamed on first by someone who does not know the well's history. Then answer this in one sentence: why does the file's own QC pass despite the error.

Self-check: acceptable symptoms include tops that miss their neighbours by hundreds of metres, blamed on a bad pick or a fault; a gridded surface with a spurious low or high at the well, blamed on geology; and a well tie that will not tie, blamed on the time-depth relationship or on the seismic. The file's own QC passes because the error scales every depth in the well by the same factor, so the well stays internally consistent and only reveals itself when compared against something outside itself.
