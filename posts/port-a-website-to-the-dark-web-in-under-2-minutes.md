---
title: "Port a website to the Dark Web in under 2 minutes"
slug: port-a-website-to-the-dark-web-in-under-2-minutes
description: "What if I tell you that you can now host your own website on the tor network in less than 2 minutes?"
added: 2021-05-27
tags: ["docker", "nginx", "tor", "dark-web", "nanobits"]
---

What if hosting a website on the dark web was as easy as running a tiny docker container in your own machines or a remote server or merely on your Raspberry Pi? What if I tell you that it actually is, and you can now host your own website on the Tor 🧅 network in less than 2 minutes? ⌛️

## What is tor-nginx-proxy?

[![Docker Hub badge](http://dockeri.co/image/harshitbudhraja/tor-nginx-proxy)](https://hub.docker.com/r/harshitbudhraja/tor-nginx-proxy/)

[tor-nginx-proxy](https://github.com/harshit-budhraja/tor-nginx-proxy) is a docker image which helps you to do exactly that ☝🏻

## How does this actually work?

What you see is a tiny [docker](https://en.wikipedia.org/wiki/Docker_%28software%29) image based on [alpine](https://en.wikipedia.org/wiki/Alpine_Linux) which encapsulates [tor](https://en.wikipedia.org/wiki/Tor_%28anonymity_network%29) and [nginx](https://en.wikipedia.org/wiki/Nginx) in a single container, and enables you to proxy traffic from your `.onion` url to your website on the [clearnet](https://en.wikipedia.org/wiki/Clearnet_%28networking%29). Too many jargons, eh?

In NSS ("not-so-sophisticated") terms, this can be understood as a simple [proxy_pass](/blog/proxy-pass-nginx) happening from your website on the dark web which is being served through tor to your website on the internet, but inside the docker container.

## Can I see any website live on Tor which is using this? `discontinued`

Of course! [IPOAlerts.in](https://ipoalerts.in), [a service which was built by me over a weekend](https://www.linkedin.com/posts/harshitbudhraja_ipoalert-trading-startupstory-activity-6787310217878110208-LnLI) last month, is now available over Tor 🎊 And it's using nothing more than `tor-nginx-proxy` behind-the-scenes. Here's a glance of my docker container which is serving it on Tor.

![tor-nginx-proxy_container.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1622135951077/TWbEM-N4T.png)

Check it out on: `http://ipoaltnp5be3mvotgap2ohu62py5nyu25cg2uognl7u5kysqxsrezoad.onion/` using the [Tor Browser](https://www.torproject.org/download/).

You can also check out the twitter feed to see who else is talking about [#tor_nginx_proxy](https://twitter.com/search?q=%23tor_nginx_proxy&src=typed_query).

## Why call it "tiny"?

Because, it's less than ~15MB in size 😆
![Docker Image Size (tag)](https://img.shields.io/docker/image-size/harshitbudhraja/tor-nginx-proxy/latest)

## How can I use it?

To get started, I recommend checking out the README(s) on either of the following:

1. Github Repository: https://github.com/harshit-budhraja/tor-nginx-proxy
2. DockerHub Repository: https://hub.docker.com/repository/docker/harshitbudhraja/tor-nginx-proxy/


You can possibly use it in any way you'd like to (given that it adheres to the terms of the [License](https://github.com/harshit-budhraja/tor-nginx-proxy/blob/master/LICENSE)).

## Show some support 🙇🏻‍♂️

This is my first attempt to really give something back to the open-source community. If you liked this and are currently using (or planning to use) it, please do show some support by [starring](https://github.com/harshit-budhraja/tor-nginx-proxy/stargazers) and [forking](https://github.com/harshit-budhraja/tor-nginx-proxy/network/members) the repository and / or by following me on Github and Twitter to be updated with more such work by me.

**These little actions won't cost you a penny, but they'll boost my motivation and confidence in ways I can't even express 😅
**

[![Twitter Follow](https://img.shields.io/twitter/follow/harshitbudhraja?style=social)](https://twitter.com/harshitbudhraja)
[![GitHub followers](https://img.shields.io/github/followers/harshit-budhraja?style=social)](https://github.com/harshit-budhraja)
[![GitHub forks](https://img.shields.io/github/forks/harshit-budhraja/tor-nginx-proxy?style=social)](https://github.com/harshit-budhraja/tor-nginx-proxy)
[![GitHub Repo stars](https://img.shields.io/github/stars/harshit-budhraja/tor-nginx-proxy?style=social)](https://github.com/harshit-budhraja/tor-nginx-proxy)

Also because I don't have any tracker to see who's using this at all (in-fact, I'm not a supporter of trackers), please don't forget to talk about how you're using `tor-nginx-proxy` for your use-case with the hashtag: [#tor_nginx_proxy](https://twitter.com/search?q=%23tor_nginx_proxy&src=typed_query).

## Can I contribute to maintaining it?

Of course, I'd be glad to have you contribute to this in any way possible. Please feel free to [open an issue](https://github.com/harshit-budhraja/tor-nginx-proxy/issues/new/choose) or reach out to me on [Twitter](https://twitter.com/harshitbudhraja) to discuss more about it.

## Have any issues?

Please [open a new issue](https://github.com/harshit-budhraja/tor-nginx-proxy/issues/new/choose) on the github issue tracker so that me or anyone from the community can have a look at it and suggest.

## Support The Tor Project

<p align="center">
  <img width="300px" src="https://upload.wikimedia.org/wikipedia/commons/8/8f/Tor_project_logo_hq.png">
</p>

For the Tor project sustainability, I strongly encourage you to help [setup Tor bridges/exit nodes](https://trac.torproject.org/projects/tor/wiki/TorRelayGuide)([**script**](https://github.com/PeterDaveHello/ubuntu-tor-simply-setup)) and [donate](https://donate.torproject.org/) money to the Tor project *(Not this nginx-proxy project)* as and when you have the ability / capacity :))
