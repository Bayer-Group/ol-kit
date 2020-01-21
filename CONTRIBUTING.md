# Contribution Guidelines

## Pull requests are always welcome
We try hard to keep our systems simple, lean and focused. We don't want them to be everything for everybody. This means that we might decide against incorporating a new request.

## Create issues
Any significant change should be documented as a GitHub issue before anybody starts working on it. Please take a moment to check that an issue doesn't already exist documenting your request. If it does, it never hurts to add a quick "+1" or "I need this too". This will help prioritize the most common requests.

## Conventions
Fork the repository and make changes on your fork on a branch:

1. Create the right type of issue (defect, enhancement, test, etc)
2. Name the branch `n-something` where `n` is the number of the issue.

Work hard to ensure your pull request is valid. All build hooks (including tests, coverage etc.) must be green.

Pull request descriptions should be as clear as possible and include a reference to all the issues that they address.

## Merge approval
Repository maintainers use **LGTM (Looks Good To Me)** in comments on the code review to indicate acceptance.

A change requires LGTMs from an absolute majority of the **MAINTAINERS**. The **Benevolent Dictator For Life (BDFL)** reserves sole veto power. We recommend also getting an LGTM from the BDFL in advance of merging to avoid the possibility of a revert.


#### Small patch exception
There are exceptions to the full merge approval process. Currently these are:

* Your patch fixes spelling or grammar errors.
* Your patch fixes Markdown formatting or syntax errors in any .md files in this repository

In these cases, only a single maintainer need approve to merge a request.


## How can I become a maintainer?
Make important contributions. Don't forget, being a maintainer is a time investment. Make sure you will have time to make yourself available. You don't have to be a maintainer to make a difference on the project!


## What is a maintainer's responsibility?
It is every maintainer's responsibility to:

1. Deliver prompt feedback and decisions on pull requests.
2. Be available to anyone with questions, bug reports, criticism, etc. on their component. This includes Slack and GitHub requests
3. Make sure their component respects the philosophy, design and road map of the project.


## How are decisions made?

Short answer: with pull requests to this repository.

All decisions, big and small, follow the same 3 steps:

1. Open a pull request. Anyone can do this.

2. Discuss the pull request. Anyone can do this.

3. Accept (`LGTM`) or refuse a pull request. The relevant maintainers do this (see below "Who decides what?")

   1. Accepting pull requests

      1. If the pull request appears to be ready to merge, give it a `LGTM`, which stands for "Looks Good To Me".

      2. If the pull request has some small problems that need to be changed, make a comment addressing the issues.

      3. If the changes needed to a PR are small, you can add a "LGTM once the following comments are addressed..." this will reduce needless back and forth.

      4. If the PR only needs a few changes before being merged, any MAINTAINER can make a replacement PR that incorporates the existing commits and fixes the problems before a fast track merge.

   2. Closing pull requests

      1. If a PR appears to be abandoned, after having attempted to contact the original contributor, then a replacement PR may be made. Once the replacement PR is made, any contributor may close the original one.

      2. If you are not sure if the pull request implements a good feature or you do not understand the purpose of the PR, ask the contributor to provide more documentation. If the contributor is not able to adequately explain the purpose of the PR, the PR may be closed by any MAINTAINER.

      3. If a MAINTAINER feels that the pull request is sufficiently architecturally flawed, or if the pull request needs significantly more design discussion before being considered, the MAINTAINER should close the pull request with a short explanation of what discussion still needs to be had. It is important not to leave such pull requests open, as this will waste both the MAINTAINER's time and the contributor's time. It is not good to string a contributor on for weeks or months, having them make many changes to a PR that will eventually be rejected.


## Who decides what?
All decisions are pull requests, and the relevant maintainers make decisions by accepting or refusing pull requests. Review and acceptance by anyone is denoted by adding a comment in the pull request: `LGTM`. However, only currently listed `MAINTAINERS` are counted towards the required majority.

Event repositories follow the timeless, highly efficient and totally unfair system known as [Benevolent dictator for life](http://en.wikipedia.org/wiki/Benevolent_Dictator_for_Life). This means that all decisions are made in the end, by default, by **BDFL**. In practice decisions are spread across the maintainers with the goal of consensus prior to all merges.

The current BDFL is listed by convention in the first line of the MAINTAINERS file with a suffix of "BDFL".

## I'm a maintainer, should I make pull requests too?
Yes. Nobody should ever push to master directly. All changes should be made through a pull request.

## Who assigns maintainers?
MAINTAINERS are changed via pull requests and the standard approval process - i.e. create an issue and make a pull request with the changes to the MAINTAINERS file.
