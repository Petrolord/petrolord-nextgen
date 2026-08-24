# Recognising four kinds

Run the import pipeline on feet_20 and the importer recognises four kinds: gr, density, neutron and sonic. That 4 is the graded number for this module, and it is graded exactly.

This lesson walks all five curves from what the file says to what the importer concludes, so that the count is something you derive rather than something you remember.

## The five logs after import

| mnemonic | kind | unit after | unit before | converted |
|---|---|---|---|---|
| DEPT | depth   | M     | F     | YES |
| GR   | gr      | GAPI  | GAPI  | no  |
| RHOB | density | G/C3  | G/C3  | no  |
| NPHI | neutron | V/V   | V/V   | no  |
| DT   | sonic   | US/M  | US/F  | YES |

Note before you start that the kind column and the unit columns disagree about which rows are interesting. Two rows converted. Five rows carry a kind. Four rows are counted. Three different populations in one table, and the whole of this module is about keeping them apart.

## GR to the kind gr

The mnemonic is GR. Upper-cased it is GR, and there is no run suffix to strip. The importer looks GR up in its kind table and finds it in the gamma ray list, alongside SGR, CGR and GRC. The kind is gr.

Now corroborate with the unit. The curve carries GAPI, which is the API gamma ray unit, and a gamma ray unit on a curve the table says is a gamma ray is exactly the agreement you want to see. The unit did not decide the kind, and the importer never consulted it for this purpose, but a mismatch between the two is the strongest signal you get that a mnemonic has been reused for something else.

## RHOB to the kind density

The mnemonic is RHOB, from the Greek rho for density with a b for bulk. The importer finds RHOB in the density list, next to DEN and ZDEN. The kind is density.

The unit is G/C3, grams per cubic centimetre, which is a mass over a volume and therefore a density. Corroborated. Note in passing that this curve did not convert, as the previous module established, and that its kind is unaffected by that. Kind and conversion are computed from different inputs and neither one is evidence about the other.

## NPHI to the kind neutron

The mnemonic is NPHI, neutron porosity. The importer finds it in the neutron list with NPHIS, CNC and TNPH. The kind is neutron.

The unit is V/V, a dimensionless volume fraction, which is the right shape for a porosity. It is worth noticing that the kind is neutron rather than porosity. The vocabulary names the measurement, which is a neutron response, not the petrophysical property somebody derives from it. That distinction matters more than it looks: a neutron log is not a porosity until a matrix assumption has been applied to it, and the importer is careful not to claim a property it has not computed.

## DT to the kind sonic

The mnemonic is DT, delta t, the interval transit time. The importer finds DT in the sonic list with DTC, AC and DTCO. The kind is sonic.

The unit here is the one that carried all the weight in the previous module: US/F before import, US/M after. The kind is sonic in both cases and would be sonic in a file that never left North American units. The conversion changed the unit column and the converted flag; it did not touch the kind column, because the kind was read off DT and DT did not change.

## DEPT and the count

The fifth row is DEPT, and its kind is depth. That kind is real, it appears in the table, and it is stored on the curve.

It is nevertheless not part of the count, and the graded answer for feet_20 is 4 rather than 5. The reason is that DEPT is the index curve rather than a measurement, and the count is a count of recognised measurements. The next lesson is entirely about why an index is structurally different, so take it here as a rule and go and get the reason.

For now, the arithmetic to hold on to is this. The file declares five curves. One of them is the index. Four measurements remain, and the importer recognises all four, so the count is 4. There is no unrecognised curve in this file, which means 4 is simultaneously the number of measurements and the number of recognised measurements. Those two are not always the same number, and the last lesson of this module is about the case where they part company.

## Reading it off the panel

The panel below runs the import pipeline on any of the six teaching files and shows the per-curve unit, kind and converted flag.

Load feet_20 and read the kind column top to bottom before you read anything else. You should see depth, gr, density, neutron, sonic, in that order, which is the curve order in the file. Then cover the kind column and try to reproduce it from the mnemonics alone. Then compare the kind column against the converted column and satisfy yourself that they mark different rows, which is the single most useful habit this module can leave you with.

{{panel:wd-import-explorer}}

## Exercise

Work from the file to the kinds without the panel. feet_20 declares DEPT, GR, RHOB, NPHI and DT, in that order. For each one, name the kind, name the unit as the file writes it, and say whether the curve was converted. Then give the count of recognised kinds as the pipeline reports it, and say in one sentence why that count is not the number of rows in your table.

Self-check: DEPT is kind depth, unit F before and M after, converted. GR is kind gr, unit GAPI, not converted. RHOB is kind density, unit G/C3, not converted. NPHI is kind neutron, unit V/V, not converted. DT is kind sonic, unit US/F before and US/M after, converted. The count of recognised kinds is 4, which is one fewer than the five rows because DEPT is the index curve and the count is of recognised measurements rather than of curves. If you also noticed that the converted column marks DEPT and DT while the counted rows are GR, RHOB, NPHI and DT, you have the point of the module.
