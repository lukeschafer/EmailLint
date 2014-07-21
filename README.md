EmailLint
=========

Validate cross-client compatible emails. Written in node.js by Luke Schafer. See it in action at http://emaillint.com/

# Overview

EmailLint is a lint program ( http://en.wikipedia.org/wiki/Lint_(software) ) designed to ensure HTML emails are created using techniques that are available in all major email clients. You can read more at http://emaillint.com/what

This repository is for all the code required to host a replica of the site you see at http://emaillint.com

# Installation

Emaillint uses a zero-build-step style of node.js 

# Contributions

This site was created from a real need back in 2012. Since then it has seen very little love. It is untested on newer versions of node.js, and uses old versions of packages.

You can help by submitting pull requests! Primarily looking at the following things:
* Updates to bootstrap and other client libs.
* Ensure latest node.js support.
* Updates to node.js packages (express et al).
* New rules.
* Unit tests/integration tests.

# License

GPLv2 because, well, I already host a free version for anyone to use, I would like to keep changes free and public for all. Give me a good reason to and I'll issue additional licenses or change it.
