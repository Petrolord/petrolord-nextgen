# The coefficients are an input

{{panel:supply-tank-explorer}}

## The refusal

Call volumeCorrectionFactor with a density and a temperature and no coefficients, and the engine refuses:

REFUSED: The volume correction factor needs the API MPMS Chapter 11.1 coefficients for your commodity group, which are a published table this package does not ship. Supply K0, K1 and K2, or enter a VCF read from your own tables.

It names what is missing, says where it lives, says the engine does not ship it, and offers two ways forward. Supply K0, K1 and K2 yourself, or skip the form altogether and enter a VCF read from your own tables.

## Why there is no default

The form of the last lesson is fixed. The coefficients are not. They are a published table per commodity group, so the row that fits a petrol is not the row that fits a diesel or a kerosene. The engine ships none of that table and has no default.

A default row would be a coefficient that nobody typed. With no default, every VCF the form returns rests on three coefficients the caller supplied, and without them the form returns no VCF at all, only the refusal above. The synthetic row shows the same form moving with density: at 31.5 C it reads 0.975246 at 700 kg/m3 and 0.983832 at 900 kg/m3, so the row and the density both reach the figure that multiplies the stock.

So the coefficients are an input, like the dip and the strapping table. The engine carries the form, and the terminal carries the table.

## The other refusal

The form also needs its two measured inputs. Leave out the density or the temperature, and the engine refuses:

REFUSED: Density at 15 C and observed temperature are both needed.

Both are measured inputs, and the engine forms no VCF without them. A typical density from a product reference list is a starting point at most. The certificate of quality is the authority on what arrived, and where a cargo's quality comes from is the subject of the sibling course `crude`.

## A limit the course teaches and never grades

The missing coefficient table is a held limit of the engines. It stays unshipped on purpose, alongside every published rate, and the course teaches it as a limit. No lesson names, rounds or recalls a real one. The only coefficients you will see are the SYNTHETIC row, K0 = 520, K1 = 0.3 and K2 = 0, and they exist to show the form.

That leaves the second way forward in the refusal. AKODO takes it: for each tank it reads a VCF off its own tables for that tank's density and temperature and types it in. The next lesson reads those typed figures.

In the panel, clear the coefficients in the SYNTHETIC box and read what replaces the VCF. Then clear the density instead.

## Exercise

Read the two refusals from volumeCorrectionFactor in this lesson. Say which input each one lacks, and name the two ways forward the first refusal offers.

Self check: the first lacks the coefficients for the commodity group; the second lacks the density at 15 C or the observed temperature. The two ways forward are to supply K0, K1 and K2, or to enter a VCF read from your own tables.
