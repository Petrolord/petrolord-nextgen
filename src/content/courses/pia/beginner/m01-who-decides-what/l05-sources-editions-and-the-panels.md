# Sources, editions and the calculator panels

{{panel:pia-royalty-calculator}}

Every rate in this course is read from a text, and every text has an edition. This lesson sets the rule the whole course follows for its sources, names each text with its edition and the date it was read, and says how the practicals run. It ends with the engine's refusals, because a refusal is the engine quoting a rule back at you.

## The texts and their editions

Every text below was read on 2026-09-26.

| text | edition | used as |
| --- | --- | --- |
| Petroleum Industry Act 2021 (Act No. 6) | Official Gazette No. 142, Vol. 108, Lagos, 27 August 2021; commencement 16 August 2021 | primary, quoted |
| Petroleum Royalty Regulations 2022 (S.I. No. 73 of 2022) | Official Gazette No. 205, Vol. 109, Lagos, 22 November 2022 | primary, quoted |
| Nigeria Tax Act 2025 (Act No. 7) | Official Gazette No. 117, Vol. 112, Lagos, 26 June 2025; effective 1 January 2026; re-gazetting ordered in December 2025 and no Certified True Copy read | primary, quoted |
| Finance Act 2023 | a scanned copy published by the Budget Office of the Federation, 7 June 2023 | primary, paraphrased |

Two values rest on secondary sources, and the course says so wherever they are used: the tertiary education tax of 2.5 percent before 2023, and the NDDC levy charged on the total annual budget. A secondary source is never a hidden default.

## Licensed texts and quotations

Only public texts are quoted, always with their citation. Model contracts sold under licence and paid commentary are taught by concept only and never quoted. A quotation in this course is short and exact, and where the gazette prints a dash the course shows a colon. A misprint in a text is quoted as printed and said to be one.

## Where the practicals run

This is an engine course, and there is no Suite app for it. The practicals run in the course's own calculator panels, which call the same engine the lessons quote: the royalty calculator at this tier, the hydrocarbon tax calculator at Professional and the ledger calculator at Expert. Every figure a panel prints is an engine return value, at six decimals. A panel shows a refusal in the engine's own words and every note the engine adds.

## When the engine refuses

A refusal is a thrown error whose message states the exact condition that failed. Four refusals belong to this tier. A licence type from before the Act:

> pia_license_type must be "PML" or "PPL"; got "OML".

A terrain the engine does not accept:

> pia_terrain must be "onshore", "shallow_water", "deep_offshore" or "frontier"; got "offshore".

A lease status the engine does not accept:

> pia_lease_status must be "converted" or "new"; got "renewed".

And a marginal field given as a terrain, whose first sentences read:

> pia_terrain "marginal_field" is not a terrain under the Petroleum Industry Act 2021: a marginal field is onshore or in shallow water (PIA Seventh Schedule para 10(4); Petroleum Royalty Regulations 2022 r.13(2)). Set pia_terrain to "onshore" or "shallow_water", and set pia_marginal_field_pre_2021 to true for a producing marginal field converted under PIA s.94(1).

A result that carries a note is a result. The engine adds notes about a stated default, a conflict between texts or an approximation, and the panel prints each one below the table.

## Exercise

Open the royalty calculator and choose "What a refusal looks like" to see the engine refuse five stated bad inputs. Then choose "The instruments stacked on a ledger", start from ekene_alpha_shallow_converted_nta, and in the case box change pia_license_type to "OML" and run it. Restore it, change pia_lease_status to "renewed" and run it again. Restore it once more, run the case, and read every note the panel prints below the table. Find the note that names the gazette edition of the Nigeria Tax Act 2025.
