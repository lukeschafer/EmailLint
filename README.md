EmailLint
=========

Validate cross-client compatible emails. Written in node.js by Luke Schafer. See it in action at http://emaillint.com/

# Overview

EmailLint is a lint program ( http://en.wikipedia.org/wiki/Lint_(software) ) designed to ensure HTML emails are created using techniques that are available in all major email clients. You can read more at http://emaillint.com/what

This repository is for all the code required to host a replica of the site you see at http://emaillint.com

# Installation on Linux

Emaillint uses a zero-build-step style of node.js. It is hosted on a $5 VPS and has been running for years with zero intervention, so it should be pretty stable!

1. Get the source on the server. On emaillint.com this is a git checkout/pull in ~/www/emaillint
2. If you would like to run on a different port, change the last line in SRC/web/index.js
3. Install node.js
4. Run it - /usr/local/bin/node /YOURUSER/www/emaillint/web/index.js

## Use Monit

I use monit to ensure the app is always running.

1. Install monit - sudo apt-get install monit
2. Edit /etc/monit/monitrc and make sure it has 'set http' on
3. Create /etc/monit/services/emaillint the stuff in the following code block.
4. Restart monit - sudo service monit restart
```
  check host emaillint with address 127.0.0.1
    start program = "/usr/local/bin/node /[YOURUSER]/www/emaillint/web/index.js"
    stop program  = "/usr/bin/pkill -f 'node /[YOURUSER]/www/emaillint/web/index.js'"
    if failed port [YOURPORT] protocol HTTP
        request /
        with timeout 10 seconds
        then restart

```

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
