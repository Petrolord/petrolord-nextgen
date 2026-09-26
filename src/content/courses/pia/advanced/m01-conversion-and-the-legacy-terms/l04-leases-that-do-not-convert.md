# Leases that do not convert

{{panel:pia-ledger-calculator}}

Conversion is voluntary, so some holders will not sign. Three sentences say what happens to them, two in the Petroleum Industry Act 2021 and one in the Nigeria Tax Act 2025 (Official Gazette No. 117, Vol. 112, 26 June 2025; re-gazetting ordered in December 2025 and no Certified True Copy read). All three say the lease keeps its old terms until it ends.

## The three sentences

PIA s.92(6) states the default. For a holder who "does not enter into a conversion contract prior to the conversion date, the terms and conditions applicable to the oil prospecting licence or oil mining lease prior to the effective date of this Act shall continue to apply".

PIA s.303(1) keeps the Act away from any holder of an oil "prospecting licence or oil mining lease who do not enter into a conversion" contract, until the licence or lease ends or expires.

NTA s.87(1) repeats the rule for the new hydrocarbon tax Part, which with the PIA does "not apply to holders of an oil prospecting licence or oil mining lease who do not" sign.

## What the old terms look like

An unconverted lease stays on petroleum profits tax and the royalty table that went with it. The course cites Part II of the Nigeria Tax Act 2025 beside s.87(1) for those terms, and the same Act prints a gas royalty in its Seventh Schedule Part IV para 7(3)(c) for leases under its Chapter Three Parts II and III: "any flare or waste gas appropriated by the Government of the Federation for its own use or for any purpose approved by it, as follows: (i) onshore areas: 7 %, and (ii) offshore areas: 5%;". Beside the Act's gas royalty of 5 percent, or 2.5 percent for gas used in-country, the two kinds of lease can pay different royalty on the same gas.

The same Act lists among its repeals, in s.196: "(h) Petroleum Profits Tax Act, Cap. P13, Laws of the Federation of Nigeria,2004;". A careful reader holds both facts at once: the statute that carried the old tax is listed as repealed, and s.87(1) keeps the leases that never converted outside the new hydrocarbon tax Part. The course states both and teaches them as concept-only.

## Why the engine gives no number

The engine models converted leases and leases granted out of new acreage and nothing else. It has no petroleum profits tax and no pre-Act royalty table, and it refuses any other status:

> pia_lease_status must be "converted" or "new"; got "renewed".

That refusal marks the boundary of a model built on the Act. A figure for an unconverted lease would need texts the engine does not carry. A company holding both kinds of acreage compares two legal regimes, and the comparison is honest only when it says so.

## Exercise

Open the ledger calculator on "The whole ledger, year by year" and load ekene_onshore_across_2026. In the case, set pia_lease_status to "unconverted" and read the refusal; then set the licence type to "OML" and read that refusal too. Name the provision behind each refusal. Then open "The engine notes" and confirm that no note describes petroleum profits tax.
