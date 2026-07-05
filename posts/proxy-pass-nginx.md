---
title: "Proxying to your app running on custom port in NGINX"
slug: proxy-pass-nginx
description: "A quick NGINX config snippet to proxy pass requests from port 80 to a custom port where your app is running."
added: 2021-05-13
tags: ["proxy", "nginx", "nanobits"]
coverImage: /assets/proxy-pass-nginx-cover.png
---

More than ever, if you're managing a server either as an EC2 instance on AWS, or as a VM instance on GCP, or just working on your local machines, proxying to your app's custom port comes in handy if:


- Your app uses a protocol other than HTTP/HTTPS
- You are working towards balancing the load across multiple containers
- You want to test new features as canary deployments
- and so on...

Here's a quick `.conf` snippet to proxy pass a request coming on port `80` to port `8081` where your custom app is running:


```
server {
    listen 80;
    access_log /path/to/log/access.log;
    error_log /path/to/log/error.log;

    location / {
        proxy_pass http://localhost:8081;
        proxy_set_header Host $host:$server_port;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade;
        proxy_set_header Accept-Encoding gzip;
    }
}
```

Of course, you can replace the ports with your own values.
