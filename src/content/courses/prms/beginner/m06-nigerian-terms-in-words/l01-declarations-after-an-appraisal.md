# Declarations after an appraisal

{{panel:prms-classification-calculator}}

In Nigeria a discovery does not simply sit in a licensee's books. When the appraisal of a discovery is finished, the Petroleum Industry Act 2021 (Act No. 6, Official Gazette No. 142, Vol. 108, 27 August 2021, read on 2026-09-27) requires the licensee to say what it will do with it. This module teaches those Nigerian terms in words, beside the PRMS classes, and shows how the engine carries them as notes.

## Three declarations

| declaration (engine key) | the Act | what follows |
| --- | --- | --- |
| commercial-discovery | s.78(8)(a) | a field development plan within 2 years, s.79(1) |
| significant-crude-oil-discovery or significant-gas-discovery | s.78(8)(b) | the area may be retained, s.78(9) |
| no-interest | s.78(8)(c) | the Commission may require the parcels over the structure to be given up, s.78(15) |

The Act puts the duty and the three choices this way:

> "(8) The licensee shall, upon the completion of the appraisal program" (PIA s.78(8))

> "(a) declare a commercial discovery ; (b) declare a significant gas discovery or a significant crude oil discovery ; or" (PIA s.78(8)(a) and (b))

> "(c) inform the Commission that the discovery is of no interest to the licensee." (PIA s.78(8)(c))

## A commercial discovery

The Act defines a commercial discovery as one the licensee judges can be developed economically once all relevant economic factors are weighed (s.318). After declaring one, the licensee has two years to submit a field development plan:

> "licensee shall within two years of the declaration, submit to the Commission a" (PIA s.79(1))

## Notes beside the class

The engine accepts an optional `nigeria` block for a discovered project, with a declaration and the years since it was made. It prints a note citing the Act and leaves the PRMS class unchanged. The Act's declaration and the PRMS class answer different questions: one is a legal step with the regulator, the other a description of the project's maturity. For Ekene Main waterflood, stated as a commercial discovery declared 12 years ago, the note reads:

> commercial discovery declared (PIA 2021 s.78(8)(a)); a field development plan is due within 2 years of the declaration (s.79(1)); 12 years since the declaration: the two-year period has passed

## A declaration the engine does not know

The declaration must be one of the four keys in the table. A short form is refused, with the accepted keys named:

> nigeria.declaration must be one of "commercial-discovery", "significant-crude-oil-discovery", "significant-gas-discovery", "no-interest"; got "significant"

And because the declarations follow a discovery, a `nigeria` block on an undiscovered accumulation is refused:

> nigeria must be left out for an undiscovered accumulation (PIA 2021 s.78(8) declarations follow a discovery); got {"declaration":"commercial-discovery","yearsSinceDeclaration":0}

## Exercise

Open the classification calculator, the course's own calculator panel, in the view "The class, the sub-class and the chance of commerciality", and start from "EKN-1 Ekene Main waterflood". Read the Nigerian note under the decision table. Change the control "Years since the declaration (optional)" to 2 and read how the note changes. Then start from "EKN-6 Ekene Deep prospect" and add a `nigeria` block by hand in the box with a commercial discovery declaration; read the refusal and say why an undiscovered prospect cannot carry one.
