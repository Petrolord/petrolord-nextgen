# Applicability and its justification

The Expert tier reads one management system from end to end: the ORASHI register for ISO 14001:2015. The digest records it as Certified, with a certification cycle of 3 years and a certificate that expires 2027-01-08. Every status, count and verdict in this tier is read at the digest's as-of date, 2026-10-15, and at no other date.

Before a clause can be conformant or nonconformant, the register has to say whether it applies at all.

{{panel:compliance-readiness-explorer}}

## Two fields that move together

Each clause row carries an applicability and a status. The ORASHI register holds 13 clauses. 12 rows read Applicable, and one reads Not applicable: clause 4.4, recorded as "Environmental management system (sites outside scope)", with applicability Not applicable and status Not applicable. The readiness counts in module 5 print the same split as clauses 13, applicable 12, excluded 1.

The two fields are separate words on the record, and the engine keeps them in step. When canSetClauseStatus is asked to set a clause to the status Not applicable while its applicability still reads Applicable, it refuses:

REFUSED: A clause determined not applicable cannot also carry a conformity verdict. Set both together, or neither.

The rule prevents a register that says a requirement applies and in the same row says it has no verdict to give.

## The justification is the record

Setting both fields to Not applicable is still refused when nothing says why. For the ORASHI register, with its own standard passed to the gate, the refusal reads:

REFUSED: Say why this requirement of ISO 14001:2015 does not apply. A requirement determined not applicable keeps its justification on record.

With the justification written, the same request is ALLOWED. An exclusion is a decision somebody took, and the justification is the evidence of that decision in the same way an evidence reference is the evidence of a conformity claim.

## The refusal names the register's standard

The gate takes the register's standard record as its fourth argument, and the sentence it returns names that standard. The digest prints the same Not applicable refusal four ways:

- for ISO 14001:2015 it names ISO 14001:2015, in the sentence quoted above;
- for ISO 9001:2015 it reads: "ISO 9001:2015 §4.3 requires the justification for a requirement determined not applicable to be kept. Say why this one does not apply.";
- for ISO 45001:2018 it names ISO 45001:2018 in the same shape as the ISO 14001:2015 sentence;
- with no standard passed it reads "Say why this requirement does not apply." followed by the same second sentence.

Only the ISO 9001:2015 sentence cites a clause of the standard. The other three state the rule in the engine's own words. In every case the verdict is the same refusal, and a learner reading a refusal can tell which register it came from.

## Exercise

Open the readiness explorer at 2026-10-15. Find clause 4.4 and read its applicability and its status. Then read the four Not applicable refusals printed for ISO 14001:2015, ISO 9001:2015, ISO 45001:2018 and no standard. Say what the four refusals share, which one alone cites a clause number, and what the register would have to carry before any of the four gates reads ALLOWED.
