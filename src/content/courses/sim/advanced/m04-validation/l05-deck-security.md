# Deck security

A deck is an input file, and some of what a simulator does with an input file is more powerful than reading numbers. Running somebody else's deck is running somebody else's instructions.

## The problem

The Eclipse-family format includes keywords that do more than describe a reservoir.

**Embedded scripting.** Some keywords let a deck carry executable code that the simulator runs during the simulation, to implement custom well controls or actions. That is a genuinely useful feature and it means a deck can execute arbitrary code on the machine running it.

**File inclusion.** A deck can include other files by path. A path that escapes the deck's own directory can read anything the simulator's user can read.

**Import and restart.** Similar reach, for grids and for restart files.

None of these is a defect. Each is a designed feature that assumes the deck's author and the deck's runner are the same person or trust each other.

## Why that assumption breaks

Because decks travel. They come from partners, from consultants, from a previous operator's data room, from a template somebody downloaded.

The moment a deck arrives from outside, running it is running code somebody else wrote on a machine that holds your data and your credentials.

## What a hosted service has to do

Petrolord's Reservoir Simulation Studio runs decks that users upload, so it has to treat every deck as untrusted. Its rules are the ones any such service needs:

**Reject the scripting keywords outright.** Not sandbox them, reject them. A deck carrying embedded code is refused with an explanation.

**Confine every path.** Inclusion, import and restart paths are resolved to real paths and checked to be inside the deck's own directory. A path that escapes is refused.

**Run with nothing to steal.** The simulator process gets a scrubbed environment with no credentials in it, so a deck that finds a way to read its environment finds nothing worth having.

**Bound the run.** Memory limits, CPU limits and a wall-clock limit, so a deck cannot consume the machine whether by malice or by asking for a hundred million cells.

## What this course does not cover

Running a deck. The Studio is where a Petrolord deck goes to be run, and its gate checks and operating rules are its own subject.

What belongs here is the deck-side half: knowing which keywords carry that power, so that you recognise them in a deck you have been sent, and so that you do not put them in a deck you send to somebody else.

## The reciprocal obligation

A deck you send should be plain. No embedded scripting unless the recipient asked for it, no include paths that reach outside the package, no restart references to files you did not send.

That is partly courtesy and mostly practicality: a deck with external references does not run anywhere but the machine it was built on, and the commonest reason a shared deck fails is a missing include.

## The check

Before running an unfamiliar deck, search it for the inclusion and scripting keywords and read what each one does. That is a two-minute grep, and it is the whole of deck hygiene.

## The misconception to avoid

"It is just a data file." It is an input file to a program with a rich language, and parts of that language reach outside the reservoir. Treating a deck like a spreadsheet is reasonable ninety nine times and expensive once.

## Exercise

First, name the two classes of keyword that give a deck reach beyond describing a reservoir, and say what a hosted service should do with each.

Second, you receive a deck from a partner. List the three things you would check before running it, in order.
