---
title: "Making apt decisions while you code to save money"
slug: making-apt-decisions-while-you-code-to-save-money
description: "One small implementation decision — treating jobs as a set vs. individually — can have a meaningful impact on infrastructure cost."
added: 2019-09-13
tags: ["engineering", "architecture"]
---

It’s fairly common to find students coding all through their college and I was one of the lot — played around with a lot of code, services, APIs, hooks, bots and what not. I used to be confident that I’m pretty good at what I do, until now when stepping out of that confined water bucket into the ocean made me realise that I’m not at par with practices adopted by the industry. And one of the most underrated yet essential aspect of product design is **making apt decisions**, which I’m going to talk about in this post.

Let me make my point with the help of a small example.

Let’s say we have an architecture like -

![Example architecture](https://cdn.hashnode.com/res/hashnode/image/upload/v1620820617262/lEqSMla3-.png)*Example architecture*

Assuming that each replica of the codebase can do only one job at a time and it takes ‘t’ time for one replica to complete one task, only after which can it take up the next one, consider -
> ***Case I** — Where Job #A — {Job #1, Job #2, Job #3} i.e. Job #A is a collective job which strictly needs to be completed sequentially. When the replicas take up jobs, the situation is something like -*

Replica #1 &lt;= Job #A : Running time = 3t

Replica #2 &lt;= Job #4 : Running time = t

Replica #3 &lt;= Job #5 : Running time = t

In this case, the total time the system will take to complete all the five jobs would be 3t.
> ***Case II** — Where all the five jobs are independent. When the replicas take up jobs now, one of the permutations of the possible situations is something like -*

Replica #1 &lt;= Job #1, Job #4 : Running time = 2t

Replica #2 &lt;= Job #2, Job #5 : Running time = 2t

Replica #3 &lt;= Job #3 : Running time = t

In this case, the total time the system will take to complete all the five jobs would be 2t.

What if you had this situation in a real life scenario — Your user uploads some **“sets of images”** to your app and now while displaying those images, you actually want your UI to display thumbnails of those images and when the user clicks the thumbnail, show him the actual image. Pretty common and relatable example, right? Now, you write an asynchronous service that is called as soon as a set of images uploaded by a user is available and generates the thumbnails for them. Or you write an asynchronous service that is called as soon as an image is uploaded and generates a thumbnail for it. The service is deployed on a three-node kubernetes cluster. For a user, the images are a set, no doubt. But from engineering perspective, it is upto you as an engineer whether you want your service to treat them as a set (Case I of the above example) or you want your service to treat them as individual images (Case II of the above example).

Clearly, from the above example, we can see that one small implementation decision can impact the overall infrastructure cost.And further, with managed services like Google Cloud, AWS, DigitalOcean etc. offering pay-as-you-go plans which are the most popular plans among customers, **optimal use of your resources might just save you a lot of money**.

Just something to ponder over!

Cheers 🍻

*Originally published at [https://premagious.xyz](https://premagious.xyz/making-apt-decisions-while-you-code-to-save-money/) on September 13, 2019.*
