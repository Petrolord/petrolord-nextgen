# Exploration, prospecting and mining licences

{{panel:pia-royalty-calculator}}

A licence decides what a company may do on an acreage, and at the fiscal end it decides which hydrocarbon tax class a producing area falls into. The Act creates three instruments, and the engine asks for one of two of them by name. This lesson reads the three from the text and shows what the engine accepts.

## Three instruments in one subsection

Section 70(1) of the Act lists them. The first two, in PIA s.70(1)(a) and (b):

> "(a) petroleum exploration licence, which may be granted to qualified applicants to carry out petroleum exploration operations on a non-exclusive basis ; (b) petroleum prospecting licence, which may be granted to qualified applicants to: (i) drill exploration and appraisal wells"

And the third, in PIA s.70(1)(c):

> "(c) petroleum mining lease, which may be granted to qualified applicants to: (i) win, work, carry away and dispose of crude oil, condensates and natural gas on an exclusive basis,"

The spaces before the semicolons are the gazette's own. The exploration licence is non-exclusive and exists to gather data. The prospecting licence lets a holder drill exploration and appraisal wells. The mining lease is the producing instrument: an exclusive right to win and dispose of crude oil, condensate and gas.

## How long each lasts

| instrument | term the Act sets | citation |
| --- | --- | --- |
| petroleum exploration licence | three years, renewable once for three more if prescribed conditions are met | PIA s.71(3) |
| petroleum prospecting licence, deep offshore and frontier | not more than 10 years: five years of initial exploration and an optional five-year extension | PIA s.77(2) |
| petroleum mining lease | a maximum of 20 years, including the development period | PIA s.86(1) |

## What the engine accepts

The engine models producing operations, so it asks for the licence under which barrels are produced. It accepts `pia_license_type` "PML" for a petroleum mining lease or "PPL" for a petroleum prospecting licence. A licence type from before the Act is refused:

> pia_license_type must be "PML" or "PPL"; got "OML".

An oil mining lease or oil prospecting licence is the older instrument. A holder of one may convert it under the Act, and a lease that does not convert stays on its old terms, outside the Act's fiscal Part and outside the engine. The conversion rules are concept-only in this course, and the Expert tier reads them in full.

## Why the licence moves a fiscal line

The Act's hydrocarbon tax has two rates, and the licence is one of the things that picks between them: a converted mining lease onshore or in shallow water sits in one class and a prospecting licence in the other (PIA s.267). This tier names that link and leaves the tax itself to the Professional tier. On a ledger the effect is easy to see, because the licence moves one line and leaves the royalties where they are.

## Exercise

Open the royalty calculator and choose "The instruments stacked on a ledger". Run ekene_alpha_shallow_converted_nta and note each year's total royalty and hydrocarbon tax. In the case box change pia_license_type from "PML" to "PPL" and run it again. Compare the two runs column by column and write down which columns moved and which did not. Then change the licence to "OML", run it, and copy the refusal the panel prints. In one sentence, say why a licence type moves a tax line and leaves the royalty alone.
