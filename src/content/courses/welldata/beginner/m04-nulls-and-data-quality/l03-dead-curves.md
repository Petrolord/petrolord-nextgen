# Dead curves

The extreme case of missing data deserves its own name and its own lesson. A dead curve is a curve that is one hundred percent null: it is declared in the curve section (~C), it occupies a full column in the data grid, and not one of its cells carries a measurement. The file promises data and delivers none.

## The teaching case

nullheavy_20 carries the set's dead curve: NPHI. The QC panel reports it as 201 nulls out of 201 samples, with no first finite sample, no last finite sample, and no mean, because there is nothing to compute a mean over. That null count of 201 is one of the six numbers the capstone grades, and it is graded exactly: a reader that miscounts by even one has mishandled either the NULL declaration or the column alignment.

Note what makes this case sharp: nullheavy_20 is also the file that declares NULL as -9999 instead of the classic -999.25. A hard-coded reader would see the NPHI column as 201 perfectly valid readings of -9999 and happily average them. The dead curve and the nonstandard flag are the same trap wearing two faces.

## How curves die

A dead curve is almost never a corrupt file. It records something true about the acquisition:

* The tool never ran. The header template listed the standard curve suite, but the neutron tool was not in the string for this well, so the column was filled with the sentinel.
* A channel failed. The tool ran but its telemetry or cartridge died, and the vendor delivered the column flagged rather than dropping it.
* A splice lost it. A composite built from multiple runs kept the union of all curve mnemonics; runs that lacked a curve contribute sentinel-filled intervals, and if no run had it, the whole column is dead.

In every case the honest signal is the same: the mnemonic exists, the data does not.

## Why dead curves are dangerous downstream

Downstream software often decides what it can compute by checking which mnemonics exist. A porosity workflow that sees NPHI in the curve list may enable its neutron-density path, then produce a column of nulls, or worse, fail somewhere deep in a calculation with an error message that says nothing about the real cause. A human browsing the registry sees "NPHI" against the well and assumes neutron data exists for planning purposes.

The data manager's job is to make the deadness visible at import time, not discoverable at interpretation time. The QC panel does this by painting the dead curve's row red, with its null count equal to its sample count and its statistics empty.

## The QC decision

A dead curve at import forces a small, explicit decision: flag it or drop it.

* Flagging keeps the column, marked dead, so the record shows the curve was in the delivered file. This preserves the audit trail of what the vendor supplied.
* Dropping removes it from the registry so no downstream tool or human can mistake it for data. This keeps the working dataset honest.

Either choice can be right; the failure mode is making no decision and letting the dead column masquerade as data. Whichever you choose, record it: which curve, which file, which choice, and why.

## Worked example

Read nullheavy_20's QC panel row by row:

1. NPHI: samples 201, nulls 201. Nulls equal samples, so the curve is dead. First finite, last finite and mean are all empty, and the row renders red.
2. Compare GR in the same file: 71 nulls of 201. Badly gapped, but 130 real samples exist, so it is wounded, not dead. It keeps its statistics (mean 44.3489 GAPI over the finite samples).
3. The dead test is exact: nulls equal to samples. There is no percentage threshold involved.

Try it yourself: the panel below runs the real parser over the teaching files.

{{panel:wd-las-inspector}}

## Exercise

Apply the definition: (a) is basic_20's NPHI dead, given 0 nulls out of 301 samples? (b) Would a curve with 200 nulls out of 201 samples be dead? (c) For nullheavy_20's NPHI, state the two QC options and what each protects. As a self-check: (a) no, it is fully alive; (b) no, one finite sample means it fails the exact nulls-equal-samples test, though you would still flag it as unusable in practice and say so in the record; (c) flag it to preserve the delivery record, or drop it to keep the registry honest, and in both cases write the decision down.
