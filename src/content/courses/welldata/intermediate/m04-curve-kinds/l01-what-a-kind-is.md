# What a kind is

The previous module asked one question of every curve: what unit is this in, and does it need converting. This module asks the other question the importer asks: what sort of measurement is this.

The importer's answer to that second question is called the curve's kind. It is a short label from a fixed vocabulary, and it is derived from the file itself rather than from anything a user typed. The mnemonic is what the lookup is keyed on, and the unit is the corroborating evidence you read alongside it when you check the result.

## The problem kinds solve

Consider the situation a project is actually in. Logs arrive from several vendors, several decades and several countries. The gamma ray curve in one file is called GR. In another it is SGR. In another it is CGR, because that vendor separates the computed gamma ray from the total. In a fourth it is GRC. Four mnemonics. One measurement.

Now consider what the applications downstream want. A petrophysics calculation wants the density log. A synthetic seismogram wants the sonic and the density. A shale volume calculation wants the gamma ray. None of them wants RHOB specifically, and none of them should have to know that RHOB, DEN and ZDEN are three names for the thing it needs.

If nothing sits between the file and the application, every application has to carry its own list of acceptable mnemonics, and those lists drift apart. One app knows about ZDEN and another does not, so the same well works in one screen and appears to have no density in the next. The failure is quiet, it is per app, and it grows with the catalogue.

The kind is the layer that stops that happening. The importer maps the vendor's mnemonic to a project vocabulary word once, at import. Downstream, applications ask for a kind. They never ask for a mnemonic.

## What a kind is not

Three clarifications, because the word invites over-reading.

A kind is not a rename. The mnemonic survives import intact and is stored with the curve. Open a well and you still see that this curve was called SGR in the file it came from, which matters when you go back to the source or talk to the vendor. The kind is added alongside, not substituted for.

A kind is not a unit. Unit and kind are independent facts about a curve, computed independently, as the previous module laboured to establish. A sonic in US/F and a sonic in US/M are both of kind sonic; the unit differs, the kind does not.

A kind is not a promise about quality. Labelling a curve as density says the importer believes it holds a bulk density. It says nothing about whether the tool was calibrated, whether the hole was washed out, or whether the curve is dead. Those are questions the QC workflow from the Associate tier answers, and a curve can carry a perfectly good kind and still be unusable.

## Where the kind comes from

The importer holds a table of kinds, and against each kind a list of mnemonics that it recognises as that kind. Reading it out gives you the whole vocabulary this platform currently uses:

- depth is recognised from DEPT, DEPTH and MD
- gr is recognised from GR, SGR, CGR and GRC
- density is recognised from RHOB, DEN and ZDEN
- neutron is recognised from NPHI, NPHIS, CNC and TNPH
- sonic is recognised from DT, DTC, AC and DTCO
- resistivity is recognised from RT, RES, ILD, LLD and RDEP
- caliper is recognised from CALI, CAL and HCAL
- sp is recognised from SP
- pef is recognised from PEF and PE

To assign a kind, the importer takes the mnemonic, upper-cases it, and strips any run suffix after a colon, because a re-logged curve often arrives as GR:2 or RHOB:1 and the run number is not part of the identity. It then looks for that base name in the lists. The first list that contains it names the kind. If no list contains it, the kind is null and the curve is unrecognised.

Work one through. A re-logged density arrives as RHOB:2. The importer upper-cases the mnemonic, which changes nothing here, then strips the run suffix after the colon, leaving the base name RHOB. RHOB sits in the density list, so the kind is density, exactly as it would be for a curve delivered as plain RHOB. The run number said nothing about what the curve measures, which is why it is removed before the lookup rather than allowed to defeat it.

Two properties of that mechanism are worth naming. It is a lookup, not a pattern match, so a mnemonic is recognised only if somebody put it in the table. And it is exact on the base name, so GR is recognised and GR_EDIT is not.

## Suggest, then confirm

The comment in the engine calls these kind guesses, and the word is chosen carefully. The philosophy of the import layer is to suggest and let the user confirm rather than to decide silently.

That is the right posture for two reasons. Mnemonics are conventions, not standards, and a vendor is free to use DT for something other than a compressional slowness. And the cost of a wrong kind is asymmetric: an unrecognised curve is visible and someone deals with it, while a confidently wrong kind is invisible and flows into calculations wearing a label nobody doubts.

So the import screen shows the kind the importer proposes, and a human is expected to look at the mapping before the well is committed to the registry. In the graded work of this course the mapping is taken as the importer proposes it, but in a real import that review step is part of the job.

## Exercise

A vendor delivers two wells in the same field. Well A carries GR, RHOB, NPHI and DT. Well B carries SGR, ZDEN, TNPH and DTCO. Say what kind the importer assigns to each of the eight curves, then say what a shale volume application asks the project for when it needs the gamma ray in both wells, and why that is better than asking for a mnemonic.

Self-check: in Well A the kinds are gr, density, neutron and sonic. In Well B they are also gr, density, neutron and sonic, because SGR is in the gr list, ZDEN is in the density list, TNPH is in the neutron list and DTCO is in the sonic list. The application asks for the kind gr and gets the right curve from both wells without knowing that one of them called it SGR. Asking for a mnemonic would mean the application carried its own list of acceptable spellings, and every application in the platform would carry a slightly different one.
