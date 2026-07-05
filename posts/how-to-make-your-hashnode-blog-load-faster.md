---
title: "How to make your Hashnode blog load faster?"
slug: how-to-make-your-hashnode-blog-load-faster
description: "A guide to migrating your Hashnode blog to their new platform by updating your DNS A record."
added: 2021-07-20
tags: ["dns", "hashnode"]
coverImage: /assets/how-to-make-your-hashnode-blog-load-faster-cover.png
---

This post talks about the recent "monstrous upgrade" (as they call it) that Hashnode has brought in its architecture and how we can leverage the power of this upgrade to speed up load times of our blogs hosted on Hashnode.

# Background

![image.png](/assets/how-to-make-your-hashnode-blog-load-faster-1.png)

A lot of you might have received an email from our friendly neighbourhood Spiderman; just kidding; @[Sandeep Panda](@sandeep) (Co-founder, Hashnode) with a catchy subject starting with *[ACTION REQUIRED]* and wondered what is it about. Let's demystify this together!

# What's the story?

What we understand from the email is that Hashnode's Engineering Team, apparently, had been working on an upgrade that would make all the blogs hosted on their platform load way faster. Well, this was much needed and had been expressed by a large portion of the community in the past, so big kudos to the Engineering Team for finally rolling this out!

Now this email should've been sent to users who are using *Custom Domains* on Hashnode because that's where the migration is required. The blogs which are hosted on a subdomain under `hashnode.com` should've been taken care of by Hashnode internally. So, if you're not using a custom domain and you've still received an email, you know whose neck to hold for spamming your inbox 😉

# Let's make our blogs faster

Hashnode requires users who're using *A records* in their domain's DNS configuration to point to them make a minor change to make their blogs use the new platform. This change needs to be done by all users eventually, as Hashnode will stop supporting its legacy platform after **August 20, 2021**.

Let's dive head-first:

1. **Disable your custom CSS**: One of the breaking changes highlighted in the email was support for *non-standard CSS classes*. If you're not sure about this, it's recommended to disable your custom CSS feature as a precautionary measure. You can do so by heading over to your Blog Dashboard > Appearance and scrolling down towards the end to find the option under Advanced Settings.
![image.png](/assets/how-to-make-your-hashnode-blog-load-faster-2.png)

2. **Grab the IP Address for the new server**: Head over to your Blog Dashboard > Domain and you should see a warning like shown below. This is an indicator that you are required to migrate to the new platform manually. On scrolling down, you should see the new IP Address that Hashnode requires you to update into your DNS configurations.
![image.png](/assets/how-to-make-your-hashnode-blog-load-faster-3.png)

    For the purpose of this tutorial, let's assume the IP Address to be `XX.XX.XX.XX` as shown below. ![image.png](/assets/how-to-make-your-hashnode-blog-load-faster-4.png)

3. **Find your DNS Console**: So, if you're using a custom domain, you must have purchased the domain from a **domain registrar** like  [Godaddy](https://godaddy.com/),  [Namecheap](https://www.namecheap.com/),  [Google Domains](https://domains.google.com/registrar) etc. These domain registrars also provide you with a console to manage your DNS. You should head over to your registrar's website and find the console. 
![image.png](/assets/how-to-make-your-hashnode-blog-load-faster-5.png)

4. **Do you see an A record?**: Once you have found the way to your console, you should see all your DNS records listed there. The one we're concerned about is the **A** record which currently points to an IP Address which is the one to Hashnode's legacy platform. This is the one we need to edit.
![image.png](/assets/how-to-make-your-hashnode-blog-load-faster-6.png)

5. **Update this record's IP Address**: This is the most important step where you need to update the IP Address pointer of this **A** record to point to the new IP Address we noted in Step (2) i.e. `XX.XX.XX.XX`. 
![image.png](/assets/how-to-make-your-hashnode-blog-load-faster-7.png)

And we're done 🚀 Your blog should now be migrated to Hashnode's new platform.

# How long does it take?

It may take up to 24 hours for DNS changes to propagate fully. But it's usually pretty quick. You can check the progress by using a  [service like this](https://www.whatsmydns.net/).
![image.png](/assets/how-to-make-your-hashnode-blog-load-faster-8.png)

# What about my SSL certificate?

As usual, Hashnode will continue provisioning and managing an SSL certificate for your domain using Let's Encrypt. 
![image.png](/assets/how-to-make-your-hashnode-blog-load-faster-9.png)

# Using Cloudflare?

If you are using something like Cloudflare, remember to bypass it for this route by clicking on the "Orange Cloud". Make sure that it appears grayed out and the "Proxy Status" is "DNS Only".

![image.png](/assets/how-to-make-your-hashnode-blog-load-faster-10.png)


@[Catalin Pit](@Catalinpit) @[Ayushi Rawat](@ayushi7rawat) @[Victoria Lo](@victoria) You have been the folks who have, unknowingly, motivated me to start a blog on Hashnode. Would love to hear your feedback!
