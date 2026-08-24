# When recognition fails

Every curve in feet_20 was recognised. That is convenient for a teaching file and unrepresentative of an archive. In real work you will regularly import a file in which the importer looks up a mnemonic, finds nothing, and has to say so.

This lesson is about that outcome: what the pipeline does, why it is a warning rather than an error, and what a careful data manager does next.

## What the pipeline does

The mechanism is short. The importer takes the mnemonic, upper-cases it, strips any run suffix after a colon, and looks the base name up in its kind lists. If no list holds it, the function returns nothing and the curve's kind is null.

Nothing else changes. The samples are imported exactly as parsed. The unit is whatever the file said, converted if the unit table had an entry for it and left alone if not, because the unit question and the kind question are decided separately and neither one depends on the other. The curve is stored, it is complete, and it is queryable. It has no kind on it, and that is the only difference.

Two consequences follow. The curve is not counted among the recognised kinds, which is what makes that count informative rather than a restatement of the curve count. And downstream applications, which ask for kinds rather than mnemonics, will not find it. The data is in the project and invisible to the parts of the platform that select by kind.

## Why a warning and not an error

The importer refuses a file outright when its depth unit is unrecognised. It does not refuse a file when a curve's mnemonic is unrecognised. The difference is worth understanding, because it is a design principle rather than an inconsistency.

An unrecognised depth unit makes the file uninterpretable. There is no honest way to place any reading in the well, so every curve in the file is worthless and importing it would put wrong data into the registry wearing a correct-looking label. Refusal is the only safe answer.

An unrecognised mnemonic does not make anything wrong. The samples are still the samples. The depth axis is still the depth axis. The only thing missing is the platform's opinion about what sort of measurement this is, and an opinion is exactly the sort of thing a human can supply. Refusing the file would throw away four good curves to avoid an unlabelled fifth.

There is also the asymmetry from the first lesson of this module. A missing kind is loud: it is a blank in a column, it lowers the recognised count, and the curve does not appear where somebody expects it. A wrong kind is silent: the curve appears everywhere it should not, wearing a label nobody doubts, feeding calculations that have no way to question it. A system that guesses aggressively to avoid blanks is trading a visible problem for an invisible one, and that is always a bad trade in data management.

This is why the engine calls its kind assignments guesses and why the import layer's stated philosophy is to suggest and let the user confirm. The blank is not a failure of the importer. It is the importer declining to invent.

## Why recognition fails

Knowing the causes helps you respond to the right one.

The mnemonic is a vendor variant the table does not carry. This is the common case. The lists are finite and the field is not, so a legitimate density curve arriving under a name nobody added is unrecognised through no fault of the file.

The mnemonic has been decorated. A curve exported as GR_EDIT or GR_FINAL after processing carries a name that is not the base name, and the lookup is exact on the base name, so it misses. The run suffix after a colon is stripped, and other decorations are not.

The curve is genuinely something the vocabulary has no word for. A processed output, a derived product, a quality flag, a tool status channel. Here the blank is the correct answer, because the platform has no kind for it and inventing one would be worse than leaving it unlabelled.

The mnemonic is being used for something else. Rarer, and the reason the unit is worth reading. A curve whose mnemonic says one thing and whose unit says another deserves a look at the file before it is trusted.

## What a careful importer does

Four steps, in order.

Read the mapping before committing the well. The import screen shows the kind proposed for every curve. Unrecognised curves are the ones to look at, and the count of recognised kinds is the quickest way to see whether there are any: compare it with the number of measurements in the file and the difference is the number of blanks.

Go to the source for each blank. Read the curve's description in the curve section, read its unit, and read a few of its values. Between those three you can usually say what the curve is. Where you cannot, the vendor or the log header can.

Decide deliberately. Either the curve is a known measurement under an unfamiliar name, in which case the fix belongs in the platform's kind lists so that every future file benefits, or it is something the vocabulary has no word for, in which case leaving it unrecognised is the honest outcome and the curve stays in the project as a labelled-by-mnemonic extra.

Record what you decided. A blank that somebody investigated and a blank that nobody has looked at are the same blank on screen and very different facts about the project.

The habit underneath all four is the one this whole tier is built on. The importer tells you what it did and what it declined to do, and reading both is the job.

## Exercise

A file imports cleanly. It declares an index and six measurements, and the pipeline reports four recognised kinds. Say what you know, say what you do not know, and list the first two things you would do at the import screen. Then say why the platform reports this situation as a warning while it refuses a file whose depth unit it does not recognise.

Self-check: you know that two of the six measurements carry no kind, because six measurements less four recognised leaves two blanks. You do not know which two, why they failed, or whether they matter, and nothing in the count tells you. The first two moves are to find the two unrecognised rows in the mapping and to read each one's description, unit and first few values in the source file. The situation is a warning because unrecognised curves are still correct data on a correct depth axis and a human can supply the missing label, whereas an unrecognised depth unit makes every reading in the file unplaceable, so there is nothing left worth importing.
