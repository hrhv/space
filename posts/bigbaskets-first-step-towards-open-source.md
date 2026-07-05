---
title: "How BigBasket stepped into Open Source"
slug: bigbaskets-first-step-towards-open-source
description: "The story behind BigBasket's first open-source contribution — ra-treemenu, a React Admin tree menu package."
added: 2021-03-17
tags: ["opensource", "npm", "reactjs"]
---

### The answer to “why?”

With the fraternity getting fairly scrutinised in the last few years, it would not be wrong to say that the modern tech is indeed driven by open source software. The plethora is so firm and crisp that we typically use certain open source softwares and tools without even realising that they’re open source. From Python to Node.js to React to Golang to Java to Apache Kafka to Redis to dozens of other recognised languages / frameworks that we all use, we are all constantly taking from the open source community.

And it’s not long before we, at BigBasket Tech, realised that it’d be really good to give something back to the community. And that’s when we made our first-ever mark into giving back to the open source community by sourcing a tiny bit of our code open for the community – a react package called **ra-treemenu**.

### A little background, eh? Sure.

We use an open-source react-based framework called React Admin for our catalog, search engine and review admin portals. While in the early days when we did not have a lot of quick access menu items to be shown on the sidebar, things worked well for us. But gradually with about 20+ items on the quick access sidebar menu already, the layout started overflowing and it was turning out to be inefficient for our administrators to navigate through the portal. Also, this was certainly a bottleneck at the back of our minds for new menu items and features to be added to this admin portal.



> There’s always a way to do it better – one just needs to find it.<br/>– Thomas A. Edison

With that thought in mind, what we needed was a better way to group them and create a multi-level hierarchy and that would solve our problem without over-engineering things.

### So, did we check for existing open-source packages which we could integrate to make this work?

Of course, the first idea was to search for a react package (which would be compatible with React Admin) which could do this for us with some tweaks. But unfortunately, we couldn’t find any which worked well. Clearly, the next choice for us was to build one from scratch – extending over the React Admin framework.

Soon after building the package, with the statistics that we had about React Admin’s user-base around the world, we thought it would be a good value addition to the community if we decided to open source it.

And the rest is history! ☺️

![ra-demo.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1620828387716/qijz1B1v_A.png)

### What now?

Since August ’20, when we made the package open source (https://github.com/BigBasket/ra-treemenu) and published the first version of it on NPM (https://www.npmjs.com/package/@bb-tech/ra-treemenu), we have had over 2400+ downloads with an average of about 10-12 downloads per day. We’ve released 4 versions till date which had decent contributions from the community as well. Here’s what it looks like:


![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1620828401780/l3X2DgF8j.png)

Detailed stats: https://npm-stat.com/charts.html?package=%40bb-tech%2Fra-treemenu&from=2020-08-01&to=2021-03-17

Now that we have put our foot into open-source and the traction we’ve got in the last few months is keeping us all motivated, it would not be a surprise to see us open sourcing more of such small and big pieces of our work, right?

Do stay tuned to our Github Org (https://github.com/BigBasket).

Cheers!



This article is republished from [BigBasket's Tech Blog](https://tech.bigbasket.com/a-first-step-towards-open-source/).
