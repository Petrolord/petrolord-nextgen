# A litre grows when it warms

{{panel:supply-tank-explorer}}

## The same product, a different volume

Fill a tank with petrol on a cool morning and dip it again in the heat of the afternoon, with nothing received and nothing delivered. The dip will have risen. No product arrived; what was there expanded. Liquid fuels grow in volume as they warm and shrink as they cool, and the effect is large enough to matter in a tank the size of AK-01.

That is a problem for anyone who has to agree a stock. A cargo loaded in a cool port and discharged in a warm one reads a different number of cubic metres at each end. A tank dipped at dawn and again at noon reads two different stocks of the same fuel.

## A reference temperature

The answer is to state every volume against one reference. In the correction form this course reads, that reference is 15 C: the density enters as the density at 15 C, the temperature enters as the observed temperature less 15 C, and the VCF is exactly 1.000000 at 15 C. The volume the tank held at its real temperature is the gross observed volume. The same volume multiplied by the VCF is the volume at standard.

The figure that carries one to the other is the volume correction factor, the VCF:

standard volume = gross observed volume x VCF

The VCF depends on two things about the product: how dense it is at 15 C, and how far its observed temperature sits from 15 C.

## Watching the factor move

The next lesson gives the formula. Before that, here is its shape, drawn on a SYNTHETIC set of coefficients invented for this course. They are not any commodity group's published row, and no stock in the course is corrected with them. They show the form only. At a density of 741.6 kg/m3, the temperature swept:

| temperature C | alpha | VCF (synthetic) |
| --- | --- | --- |
| 10 | 0.001350036 | 1.006736 |
| 15 | 0.001350036 | 1.000000 |
| 20 | 0.001350036 | 0.993236 |
| 25 | 0.001350036 | 0.986447 |
| 31.5 | 0.001350036 | 0.977583 |
| 35 | 0.001350036 | 0.972793 |
| 40 | 0.001350036 | 0.965932 |

Read it from the middle row. At 15 C the VCF is 1.000000: product already at the reference temperature needs no correction, and the gross observed volume is the standard volume. At 10 C, a cooler tank, the VCF is 1.006736, so the standard volume is the larger. From 20 C upward the VCF is below one, and the warmer the product the further below one it reads, down to 0.965932 at 40 C. Warm product has swollen, and the correction takes the swelling back out.

## Why a coastal terminal cares

AKODO is an invented coastal terminal, and this morning its tanks were dipped at 31.5 C, 30 C and 29 C. None of them is at 15 C. Every cubic metre in the gross observed table of module three is a warm cubic metre, and the day cannot be closed on warm cubic metres against an opening stock held at standard.

In the panel, open the SYNTHETIC box and slide the temperature from 10 C to 40 C at a density of 741.6 kg/m3.

## Exercise

Read the synthetic VCF at 15 C and at 31.5 C. Say what the figure at 15 C does to a gross observed volume and what a VCF below one does to it.

Self check: at 15 C the VCF is 1.000000, so the standard volume equals the gross observed volume. At 31.5 C the synthetic VCF is 0.977583, below one, so multiplying by it gives a standard volume below the gross observed volume.
