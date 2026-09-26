# The Btu and the cubic foot

{{panel:gsa-quantity-calculator}}

{{panel:gsa-contract-calculator}}

Every energy figure in this course passes through two definitions: how many joules make a Btu, and how many cubic metres make a cubic foot. Both look settled. One of them has more than one version in the texts, and a contract that does not say which it means leaves a small gap in every MMBtu it prices.

## The engine's Btu

The engine uses the International Table Btu, 1055.05585262 J, exact by definition. It is read from NIST Special Publication 811 (2008 edition, Appendix B, read on 2026-09-26), which prints it as "1.055 056 E+03 J". So 1 MMBtu is 1055.05585262 MJ in every metric conversion the engine makes.

## The model agreement's Btu

The engine's validation record reads the Commonwealth model agreement's Btu as defined "at 59 F to 60 F", "about 1054.80 J, 0.02% smaller". A contract written on that Btu counts slightly more of them in the same gas. The engine does not switch Btus. A contract on a different Btu should state its heating value in those units, so the arithmetic stays exact on its own terms, and the report should name the Btu beside every energy figure.

## The cubic foot

The cubic foot is exactly 0.028316846592 cubic metres, the cube of the international foot of 0.3048 m. There is no second version to choose. The engine uses it to convert a volume in standard cubic metres with a heating value in Btu per standard cubic foot, or the reverse.

## The routes, and a mixed pair

| golden case | volume | heating value | basis | MMBtu (engine) |
| --- | --- | --- | --- | --- |
| energy-power-dcq | 20.000000 MMscf | 1050.000000 Btu/scf | gross | 21000.000000 |
| energy-metric | 1.000000 MMSm3 | 39.000000 MJ/Sm3 | gross | 36964.867692 |
| energy-metric-net | 1.000000 MMSm3 | 35.100000 MJ/Sm3 | net | 33268.380923 |
| energy-mixed-sm3-btu | 1.000000 MMSm3 | 1050.000000 Btu/scf | gross | 37080.400058 |

A mixed pair converts the volume by the exact factor and assumes one set of reference conditions for both, which the caller states and the engine echoes back. A contract that states its volume and its heating value at different reference conditions needs a conversion the engine does not make.

## The label and the arithmetic

The engine does the same arithmetic on a gross and a net heating value and carries the basis through as a label. The net case's numbers stated as gross return 33268.380923 MMBtu, labelled gross: the label changes and the arithmetic does not. The contract names which heating value it prices.

## Exercise

Open the quantity calculator on "Volume to energy". It starts on the Ekene power plant's DCQ. Change it to 1.000000 MMSm3 at 1050.000000 Btu/scf and confirm the mixed-pair figure. Then enter 39.000000 MJ/Sm3 gross, then 35.100000 net, and read each basis the engine echoes. Finally, in one paragraph, state which Btu your figures rest on and what a contract on the model agreement's Btu would need to say.
