---
title: "Generating vanity .onion addresses for Tor v3 (ED25519) hidden services"
slug: generating-vanity-onion-addresses-for-tor-v3-hidden-services
description: "How to generate custom vanity .onion addresses for Tor v3 hidden services using Docker and mkp224o."
added: 2023-02-13
tags: ["tor", "dark-web", "onion", "nanobits"]
coverImage: /assets/generating-vanity-onion-addresses-for-tor-v3-hidden-services-cover.png
---

[**ED25519**](https://ed25519.cr.yp.to) (formerly, Proposal 224) is a public-key signature system that is now being adopted by Tor v3 hidden services. As per [Tor's official statement on its blog](https://blog.torproject.org/v2-deprecation-timeline), v2, which relies on older systems of public-key signatures, will be completely deprecated and removed by October 2021.

So, as I was experimenting with Tor in the last few days, I decided to check out tools to help generate these new ED25519 signatures. Out of many out there, [mkp224o](https://github.com/cathugger/mkp224o) worked well for me.

Now usually, setting up the dependencies for such C99-based tools is usually trickier in most Windows or MacOS systems than in Linux systems. But, thanks to [this](https://hub.docker.com/r/nwtgck/mkp224o) docker image which I found on the [DockerHub](https://hub.docker.com), things were smooth for me.

## Let's see how to generate one, then?

It's fairly straightforward with Docker - just run a container from the image, exec inside it and use the tool 🚀

To run a container and exec inside it:

```bash
docker run -it nwtgck/mkp224o
```

Once you're in, `mkp224o` will be available to you as an executable. You can check out the usage and options by running `mkp224o -h` to see a help text like this:

![image.png](/assets/generating-vanity-onion-addresses-for-tor-v3-hidden-services-1.png)

## Need a quick-start command to begin with, eh?

Well, got you covered there. Let's quickly see which options are the easiest, to begin with:

1. `-B` - Use this for batching the key generation process.
    
2. `-S 1` - Use this for printing stats after every second as the generator is running.
    
3. `-d dirname` - Use this to output all the generated .onions to a `dirname` directory
    
4. `-n 1` - To stop the process after 1 key is matching the filters is found
    

With all the above options, here's how the syntax to generate 2 keys starting with `temp` and store them into a `onions` directory looks like:

```bash
mkp224o -B -S 1 -d onions -n 2 temp
```

And voila, we now have them in the specified directory:

![image.png](/assets/generating-vanity-onion-addresses-for-tor-v3-hidden-services-2.png)

You can find the public key, secret key and a hostname file for each .onion that you've generated.

Happy Tor-ing! 🧅😁
