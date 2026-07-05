---
title: "What is an API?"
slug: what-is-an-api
description: "Most modern software uses APIs — here's a simple breakdown of what they are, how they work, and what they look like."
added: 2023-02-09
tags: ["api", "apis", "api-basics"]
---

> Before we get into this, if you're new here or don't know me - I'm Harshit, and I'm a Software Engineer currently working at Postman (https://postman.com), an API Development Platform.
> 
> This is a new series that I've started - Demystifying APIs, and it aims to promote API Literacy in the tech community. Feel free to ask me any questions around APIs in the comments below or by tweeting to me (https://twitter.com/harshitbudhraja) - I'll be happy to answer each one of those.
> 
> Also, don't forget to subscribe to my newsletter, so that you don't miss any of the further posts in this series.

Well, nothing fancy here. Let me start by telling you that most (actually, ALL) modern software use APIs in one way or the other.

# Okay, but what exactly is an API? 🤔

API stands for **Application Programming Interface**. Don't stress too much over it (just remember it for your interviews though 😛).

Breaking it down for you:

1. **Application -** This **c**ould be anything from a mobile app, web app, or desktop app to apps that run on your smartwatch to even browser extensions.
    
2. **Programming** - To make them (i.e. the apps) work according to your requirements.
    
3. **Interface** - Any tool/library/software/hardware that helps you complete your task (in this case, helps you program your apps).
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1675952113900/07bda8dc-255d-4bb4-96af-21b7684f2bc6.png)

# Ah, that was a bouncer for me 🤯

Haha, no big deal. Let's understand it using a simple example:

Your smartphone shows you **weather updates**, right? Do you think companies like Oppo, Vivo, Xiaomi, Micromax or Samsung own satellites that relay this information to them for them to deliver it to you on that home screen? **Well, they don't.**

**Then, where do they get these weather updates from?**

The answer to this question is simple - from organizations that have satellites and specialize in meteorology.

**But how?**

Here's a little diagram to understand how this communication takes place:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1675953991948/5b77925e-848e-4b14-94bc-568b613170b0.png)

Satellites owned by meteorological organizations relay the weather data to them, who in turn relay this to the requesting companies - like Samsung, and they further make this data available to their users on their smartphones.

**But, where do APIs come into the picture?**

Simply putting, everywhere you see **blue arrows** in the above diagram :p

# Wow, I think I get it. But what do they look like? 😍

Beautiful 🥰

Just kidding (well, not really).

Okay, so there are many different types of APIs: SOAP APIs, RPC APIs, REST APIs, Websocket APIs etc. of which **REST APIs** are the most commonly used ones. You'll find them almost everywhere. They generally use a universally recognized data interchange format/language like [JSON (Javascript Object Notation)](https://en.wikipedia.org/wiki/JSON) or [XML (Extensible Markup Language)](https://en.wikipedia.org/wiki/XML) which are typically both machine-readable and human-readable to exchange data.

For example, if you'd like to see a real-world weather API, you can check this out: [https://open-meteo.com/en/docs](https://open-meteo.com/en/docs). Whenever anyone requests weather data from them, they return a response that looks something like this:

```json
{
  "latitude": 52.52,
  "longitude": 13.419,
  "elevation": 44.812,
  "generationtime_ms": 2.2119,
  "utc_offset_seconds": 0,
  "timezone": "Europe/Berlin",
  "timezone_abbreviation": "CEST",
  "hourly": {
    "time": ["2022-07-01T00:00", "2022-07-01T01:00", "2022-07-01T02:00", ...],
    "temperature_2m": [13, 12.7, 12.7, 12.5, 12.5, 12.8, 13, 12.9, 13.3, ...]
  },
  "hourly_units": {
    "temperature_2m": "°C"
  },
  "current_weather": {
    "time": "2022-07-01T09:00",
    "temperature": 13.3,
    "weathercode": 3,
    "windspeed": 10.3,
    "winddirection": 262
  }
}
```

This, by the way, is the JSON format.

# Final Notes (for now) 📝

Don't worry if you don't understand a word in that 😅 We'll take this slow and step-by-step. And by the end of this series, you would have a fair understanding of everything you need to know about APIs.

With that, I hope you have an idea of what APIs are 🤞🏻 In the upcoming posts in this series, we'd be talking more about APIs and their types in detail.

Cheers!
