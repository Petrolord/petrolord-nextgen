# Why downstream apps care

Depth handling feels like housekeeping until you follow a badly handled well into the applications that consume it. This lesson walks the damage forward, because knowing exactly what breaks, and where, is what turns the import rules from ritual into judgment.

## Curve arithmetic assumes aligned samples

Almost everything petrophysics does is arithmetic between curves at the same depth: density porosity from RHOB, shale volume from GR, saturation from porosity and resistivity together. Sample i of one curve is combined with sample i of another on the assumption that both sit at the same depth. Within one well-behaved file that assumption holds, because every curve shares the depth column. It stops holding the moment depth is mishandled: a feet well imported as metres puts its samples at depths three and a quarter times too deep, and any curve brought in from another source at the correct depths no longer lines up sample for sample. The arithmetic still runs. It just combines rock from different places, and nothing in the output says so.

## Thickness counting assumes a known step

The beginner petrophysics course books net pay by counting samples that pass cutoffs and multiplying by the step: thickness equals sample count times spacing. That equation has two failure modes, and this module has now shown you both. If the step is wrong, every thickness is wrong in proportion, which is why rounding 0.6096 m to 0.6 m is not cosmetic. If the grid is irregular, there is no single spacing to multiply by, and honest software must either integrate increment by increment or refuse; software that assumed the average step would misallocate thickness sample by sample without ever producing an obviously absurd number. The step field the importer records, including its honest null for irregular files, is what downstream thickness logic keys off.

## Correlation and ties assume one datum in one unit

Well correlation flattens sections on picked tops; synthetic seismograms tie logs to seismic through time-depth relationships; mapping grids surfaces from tops posted in metres. All of it assumes every well speaks the same unit. A single well left in feet drags its tops hundreds of metres out of position, bends correlation panels, and plants a false structural high or low in any surface gridded through it. These errors are conspicuous when they are huge, but a partial mishandling, one converted curve missed, one step rounded, produces subtle versions that survive review. The defence is not vigilance downstream; it is correctness once, at import, recorded visibly.

## Resampling is modelling, not parsing

When an irregular well finally must live on a uniform grid, someone has to choose the spacing and the interpolation, and both choices alter the data. Interpolating a resistivity log across a gap invents rock; averaging fine samples onto a coarse grid erases thin beds. These can be perfectly good trades, but they are interpretive trades, so they belong where interpretation lives: in the professional import pipeline, chosen explicitly, with the original samples preserved underneath. The parser's job is fidelity. That division of labour is why the platform's parser never regrids, never rounds and never converts silently, and why the import layer that does convert writes the source unit and factor into provenance.

## The beginner rule set

Everything in this module compresses to three rules you can apply from day one. Convert to metres at import, every depth-referenced curve included, using the exact factor. Record the true step, which means the increment-verified step or an explicit null for irregular files, never the header claim and never a rounded value. Flag irregular files for explicit resampling later, leaving the logged depth column untouched as the well's depth vector. Wells that enter the registry under these rules can be trusted by every application above them; wells that do not will eventually cost someone a day, a map or a booking.

## Exercise

A colleague imports a feet well by converting only the depth column, leaving DT in US/F, and rounds the converted step from 0.6096 to 0.6 m before loading. List the two distinct downstream errors this creates, and for the step error compute the depth mismatch at sample 150: 0.0096 x 150 = 1.44 m. Then state, in one sentence each, which import rule from this lesson each error violates, and which single QC artefact (the provenance record or the verified step field) would have exposed it before the well reached an interpreter.
