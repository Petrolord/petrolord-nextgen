# Source pack notes: Supply Chain course 5, Contract & Supplier Management (`contracts`)

Built 2026-09-27. Nothing here is committed to any repo. `SOURCES.json` lists 33 sources (27 file-backed, 6 concept only). `passages_draft.json` holds 217 passages (133 quotes, 84 paraphrases). `verify_quotes.py` result: PASS, 0 warnings, 0 failures (full output in `verify_output.txt`). The builder scripts are in `_build/`.

## What was fetched (2026-09-27 unless noted)

| id | file | how |
|---|---|---|
| S01 | uk_govs008.pdf | gov.uk content API, then assets.publishing.service.gov.uk |
| S02 to S07 | uk_sourcing_playbook.pdf, uk_delivery_model.pdf, uk_efs.pdf, uk_resolution_planning.pdf, uk_cfd.pdf, uk_rapa.pdf | attachments on the Sourcing and Consultancy Playbooks page |
| S08 to S14 | pa23_*.pdf | Procurement Act 2023 guidance, Manage and Define phase pages |
| S15, S16 | uk_cm_principles.pdf, uk_cm_framework.pdf | "Commercial capability: contract management standards" page |
| S17, S19 | wb_cm_practice_2024.pdf, wb_ppsd_2025.pdf | thedocs.worldbank.org (URLs found by web search) |
| S23 to S25 | ncdmb_*.pdf | ncdmb.gov.ng/operational-guidelines/ |
| S26 | ng_ama2023.pdf | acerislaw.com upload of the scanned Act |
| S27 | pa23_act.pdf | legislation.gov.uk PDF, as enacted |
| S18, S20, S21, S22 | reused from /root/sc2-sources (fetched 2026-09-26), same bytes, re-hashed | URLs as in FINDINGS-tender.md |

Text conversion used `pdftotext`. Multi-column documents use the flow mode (`*_flow.txt`), and single-column guidance uses `-layout`. Zero-width spaces were stripped from the gov.uk texts. Superseded conversions and fetched files I did not use are in `raw/` and `raw/unused/`.

## Failures and gaps

- ncdmb.gov.ng/downloads/, /resources/ and /nogicjqs/ returned HTTP 404. /guidelines/ and /operational-guidelines/ returned 200.
- The NCDMB guidelines on Expatriate Quota (S24), NOGIC JQS (S25), TWP, HCDIS, NCROU and NCTCR are scanned images with no text layer, and no OCR tool (tesseract) is installed. I read the pages of S24 and S25 visually from rendered PNGs (`raw/img/`), so their passages are paraphrase only. TWP, HCDIS, NCROU and NCTCR are not used.
- The Arbitration and Mediation Act 2023 has no government-hosted copy. A `site:gov.ng` search found only a nass.gov.ng news item. S26 is a law firm's upload of the scanned, signed Act with an OCR layer, and every quote is verified against that OCR text.
- The World Bank procurement framework page (worldbank.org/.../procurement-new-framework) returned 200, but its document list is rendered by JavaScript, so there were no links to follow. The guidance URLs came from web search on thedocs.worldbank.org.
- The Procurement Act 2023 guidance series has no standalone "contract management overview" or "close-out" document. Its Manage phase lists: Termination, KPIs, Contract Performance Notices, Modifications, Electronic Invoicing and Payment, Payments Compliance Notices, and Contract Payment Information. Close-out is covered here from the termination notice guidance, GovS 008 5.4.7 and World Bank Annex XI.
- The Contract Management Professional Standards cited by GovS 008 as reference [13] were not found as a public OGL document. The public items are the Contract Management Principles and the Framework Summary (S15, S16), both 2014 PDFs.
- The Contract Tiering Tool is referenced (S02, S05) but was not fetched. It is not listed as an attachment on the Playbook page.
- The BPP link for the Public Procurement Act 2007 returned an HTML page, not a PDF (recorded in the sc2 findings, 2026-09-26). The NCDMB-hosted copy is used.

## Licence reasoning

- **UK (S01 to S16, S27): Open Government Licence v3.0.** Most PDFs print the OGL line. S06, S15 and S16 carry no licence line in the extracted text, so the gov.uk page footer ("All content is available under the Open Government Licence v3.0, except where otherwise stated") is recorded. Policy is **quote**. Third-party copyright exceptions do not affect the passages used. S16 is a summary based on the NAO framework, and only its own sentences are quoted.
- **World Bank (S17, S18, S19).** The documents print "may be reproduced ... for noncommercial purposes" (S17, S19) or "used and reproduced for non-commercial purposes, with attribution ... may not be modified" (S18). A paid course is commercial use, which that grant does not cover. Policy is **short-quote**: every quote is at most 300 characters and attributed. S17 p.50 itself quotes the FIDIC definition of a claim, and that quotation is not reused (see S33).
- **Nigerian statutes (S20, S22, S26).** None prints a licence. These are official statutory texts, quoted with section citation, so policy is **quote**. S21, the NCDMB copy of the NOGICD Act, is marked "(c) 2016 NCDMB PROPRIETARY" on every page. It is used only to cross-check S20, and nothing is quoted from it. The cross-check covered ss.31 to 33, 68 and 104, and the wording and figures agree.
- **NCDMB contracting-process guidelines (S23).** No licence is printed. This is a public regulator document, so policy is **short-quote**.
- **NCDMB Expatriate Quota guideline (S24).** Every page footer says "for internal use only ... exclusive property of NCDMB ... Use, duplication, or disclosure is prohibited", and the cover says "Restricted", even though the file is posted publicly. Policy is **concept**: paraphrases only, and every figure is cited to the Act, not to this document.
- **NOGIC JQS guideline (S25).** A scanned image with no licence statement, so policy is **concept**.
- **Concept only, not downloaded (S28 to S33).** Kraljic (HBR 1983), ISO 44001:2017, CIPS material, AIPN model contracts, LOGIC standard contracts, and FIDIC conditions including the FIDIC text in World Bank SPD GCCs. Each has a bibliographic entry and a one-line concept. Their passages are my own words with no figures.

## Figures that looked usable but could not be sourced exactly (not used, or flagged)

- **PPA 2007 s.16(12), records retention.** The printed Act reads "a period often years from the date of the award". This is probably "of ten years", but the text does not say ten. P052 flags it as a likely misprint to confirm against another official copy, and no number is taught.
- **Sourcing Playbook p.39 against p.41.** p.39 says "four KPIs from each of the government's most important contracts shall be made publicly available" (three most relevant plus one social value KPI). The pull-quote on p.41 says "three KPIs". The Act (s.52) says "at least three". Only the statutory three and the "10 to 15 per service" guidance are used.
- **World Bank delay damages.** The "say, 10% of the contract price" cap is illustrative. P188 presents it as an illustration and not as a rule.
- **World Bank price adjustment base date.** "28 days prior to the bid submission deadline" appears only inside a case study (Figure VII) as "normally specified". Not used.
- **NCDMB contracting-cycle day counts** (180 day target, 10, 18, 8 and 7 day steps). These sit in table layouts that flow extraction scrambles. Not used. Check them against the PDF if a later lesson needs them.
- **NOGICD Act s.104 (1% NCDF deduction).** This applies to contracts in the **upstream sector** as the section words it. It is often quoted as "1% of every contract". P134 quotes the exact wording.
- **NOGICD Act s.14 (1% and 5%) and s.16 (10%).** These are tender-stage figures that belong to the procurement course, so they are not used here.
- **Procurement Act 2023 text (S27)** is the as-enacted PDF of 26 October 2023. The guidance documents (S08 to S14) are the current versions. The Act figures used (£5 million, three KPIs, twelve months, 30 days) match the current guidance, but later amendments to the Act were not checked.
- **World Bank Contract Management Practice** exists as two near-identical PDFs, one with a "June 2024" cover and one "FINAL" with a "May 2024" cover. Both say "Second Edition, May 2024". The June file is used, and the other is kept in raw/.
- **AIPN** may have been renamed. I could not verify the new name from a fetched source, so the passages use "AIPN" only.
- **The Resolution Planning guidance note (S05)** is dated May 2021 and predates the Procurement Act 2023 regime. Its £10m per year scope figure is quoted as that note states it.
