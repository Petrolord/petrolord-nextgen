# Every charge names its base

A rate is half a charge. The other half is the quantity or the value it is levied on, and in an import build-up that base differs from line to line. A port authority bills by the tonne, a jetty by the cubic metre, a regulator by the litre, a customs duty on the insured value and a demurrage provision once for the whole cargo. The engine asks every line to name its base, and it applies each rate to exactly that base.

{{panel:supply-price-explorer}}

## The BADAGRY rates

Every rate below is invented for this course. None is a published duty, tariff or charge, and none describes any market as it is.

| line | basis | rate (invented) |
| --- | --- | --- |
| Ocean freight | per_tonne | 26.5 |
| Marine insurance | percent_of_cif | 0.16 |
| Import duty | percent_of_cif | 5.75 |
| Port and harbour charges | per_tonne | 3.05 |
| Regulatory and inspection charges | per_litre | 0.0024 |
| Jetty throughput and discharge | per_m3 | 1.2 |
| Storage and handling | per_m3 | 2.65 |
| Financing and letter of credit | percent_of_cif | 1.4 |
| Demurrage provision | per_cargo | 52500 |

## The landed lines

After CIF the walk reaches the landed stage, and the engine prints each landed charge in US dollars:

| stage | line | basis | amount USD | USD per outturn litre |
| --- | --- | --- | --- | --- |
| landed | Import duty | % of CIF | 1399086.04 | 0.030704 |
| landed | Port and harbour charges | per tonne | 103700.00 | 0.002276 |
| landed | Regulatory and inspection charges | per litre | 109854.60 | 0.002411 |
| landed | Jetty throughput and discharge | per m3 | 54927.30 | 0.001205 |
| landed | Storage and handling | per m3 | 121297.79 | 0.002662 |
| landed | Financing and letter of credit | % of CIF | 340647.04 | 0.007476 |
| landed | Demurrage provision | per cargo | 52500.00 | 0.001152 |

The walk closes with the landed total, 26513943.86 USD, and the engine's statement that the build-up is complete: "All supplied rates applied."

## Reading a line through its base

Take the lines one base at a time.

The port line is per tonne, so it reads the cargo's 34000 tonnes. The regulatory line is per litre, so it reads the bill-of-lading litres, 45772751.75. The jetty and storage lines are per m3, so they read 45772.752 m3. The demurrage line is per cargo, so its rate of 52500 is the charge, 52500.00 USD, whatever the cargo's size.

The duty and financing lines are percentages of CIF, the value frozen at the end of the insurance stage, 24331931.09 USD. The course's invented duty of 5.75 percent of CIF prints 1399086.04 USD. The invented financing rate of 1.4 percent of CIF prints 340647.04 USD. Neither line sees the port bill, the storage bill or the other percentage line, because none of those is part of CIF.

## Why the base is part of the input

Two of these bases are volumes, and the first module showed that a volume depends on the density. A per-tonne line is untouched by the density and a per-m3 line is moved by it. So a density typed wrongly reaches the jetty, storage and regulatory lines and leaves the port line alone. A reader who knows each line's base can say which figures a corrected certificate will move before running the engine again.

The same reading tells you which quantity a line is levied on. The jetty and storage lines are levied on the bill-of-lading volume. Whether a real terminal bills on that volume or on what arrives is a question the engine cannot answer, and this tier returns to it as a stated limit in the module on ocean loss.

## Exercise

For the port, regulatory, jetty and demurrage lines, record the invented rate, the base and the amount in US dollars, and name the cargo quantity each base reads. Then record the invented duty and financing lines and CIF. Say what the duty and financing amounts, read against the same CIF, show about a percentage charge biting on a frozen base.
