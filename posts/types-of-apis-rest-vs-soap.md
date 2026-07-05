---
title: "Types of APIs: REST v/s SOAP"
slug: types-of-apis-rest-vs-soap
description: "A deep dive into REST and SOAP APIs — their structures, differences, and when to use each."
added: 2023-04-13
tags: ["rest-api", "soap-api", "apis"]
---

> Before we get into this, if you're new here or don't know me - I'm Harshit, and I'm a Software Engineer primarily working on Backend Systems. In my steep upward career of 3+ years, I've worked at two unicorns - BigBasket (**bigbasket.com**), India's Largest Online Grocery Supermarket and Postman ([**postman.com**](http://postman.com)), an API Development Platform which was my latest sprint.
> 
> This is a new series that I've started - Demystifying APIs, and it aims to promote API Literacy in the tech community. Feel free to ask me any questions around APIs in the comments below or by tweeting to me ([**twitter.com/harshitbudhraja**](http://twitter.com/harshitbudhraja)) - I'll be happy to answer each one of those.
> 
> Also, don't forget to subscribe to my newsletter, so that you don't miss any of the further posts in this series.

In the last post, we introduced APIs and discussed the basics of what they are and how they work. In case you missed it, do check it out here: [/blog/what-is-an-api](/blog/what-is-an-api)

In this post, we'll dive deeper into the most commonly used types of APIs - REST and SOAP APIs. Let's begin with a closer look at these two types, shall we?

# What are REST APIs?

REST stands for Representational State Transfer, and it is a type of web service that uses HTTP protocols to transfer data. REST APIs are stateless, which means that they do not maintain any information about the client. Instead, each request contains all the necessary information to complete the request.

REST APIs use standard HTTP methods such as GET, POST, PUT, DELETE, and PATCH to perform operations on resources. These resources can be anything that can be identified by a unique identifier, such as a user, a product, or an order.

One of the advantages of REST APIs is that they are easy to understand and implement, which makes them very popular among developers. They also allow for caching, which can improve performance.

# What are SOAP APIs?

SOAP stands for Simple Object Access Protocol, and it is a type of web service that uses XML as the data format and a standardized messaging protocol for communication. SOAP APIs are stateful, which means that they maintain information about the client.

SOAP APIs use a specific messaging format called a SOAP envelope, which contains a header and a body. The header contains information about the message, such as the message ID and the destination. The body contains the actual message.

SOAP APIs are often used in enterprise environments where security and reliability are of utmost importance. They provide a standardized way of communicating between systems, which makes them ideal for integrating different systems.

# Structural differences in REST and SOAP

Let's try to understand with examples, the differences in the structure of the request and response messages. Before that, you should know that REST APIs typically use JSON or XML for data exchange, while SOAP APIs use XML exclusively. Additionally, SOAP APIs require the use of a WSDL (Web Services Description Language) file to define the API methods and message formats, while REST APIs do not have a standardized definition format.

> We'll be talking about different API Definition Types in the upcoming posts in this series, so make sure you stay tuned and subscribe to the newsletter to receive email digests whenever I publish.

Okay, so we were talking about structures, right?

## REST Structure

**Request:**

```plaintext
GET /hello HTTP/1.1
Host: example.com
Accept: application/json
```

The request includes a `GET` method to access the `/hello` endpoint on the [`example.com`](http://example.com) domain. It also includes an `Accept` header indicating that the client is expecting a JSON response.

**Response:**

```plaintext
HTTP/1.1 200 OK
Content-Type: application/json

{ "message": "Hello, World!" }
```

The response includes a `200 OK` status code indicating that the request was successful. It also includes a `Content-Type` header indicating that the response is in JSON format. The response body includes a JSON object with a `message` property set to "Hello, World!".

## SOAP Structure

**Request:**

```plaintext
POST /hello HTTP/1.1
Host: example.com
Content-Type: text/xml;charset=UTF-8
Content-Length: nnn

<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <HelloWorldRequest xmlns="http://example.com">
      <name>World</name>
    </HelloWorldRequest>
  </soap:Body>
</soap:Envelope>
```

The request includes a `POST` method to access the `/hello` endpoint on the [`example.com`](http://example.com) domain. It also includes a `Content-Type` header indicating that the request is in XML format. The request body includes a SOAP envelope containing a `HelloWorldRequest` element with a `name` child element set to "World".

**Response:**

```plaintext
HTTP/1.1 200 OK
Content-Type: text/xml;charset=UTF-8
Content-Length: nnn

<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <HelloWorldResponse xmlns="http://example.com">
      <message>Hello, World!</message>
    </HelloWorldResponse>
  </soap:Body>
</soap:Envelope>
```

The response includes a `200 OK` status code indicating that the request was successful. It also includes a `Content-Type` header indicating that the response is in XML format. The response body includes a SOAP envelope containing a `HelloWorldResponse` element with a `message` child element set to "Hello, World!".

# When to use REST and when to use SOAP?

The decision to use either REST or SOAP depends on several factors such as the type of application being developed, the complexity of the API, the performance requirements, and the desired level of security.

RESTful APIs are ideal for building lightweight web services that are simple, scalable, and easy to develop. They are particularly suitable for public-facing APIs that need to support a variety of clients, including web browsers, mobile apps, and IoT devices. REST APIs use HTTP and offer a standardized set of methods and status codes, which makes them easy to use and understand. They also offer good performance and caching capabilities, which can help improve the scalability of the application.

SOAP APIs are a better choice for building complex, enterprise-level applications that require more advanced security and transaction management features. They use XML-based messaging to exchange data between client and server, which makes them more secure and reliable. SOAP APIs also offer support for advanced messaging features such as message queuing, reliable messaging, and transaction processing, which can be important for mission-critical applications.

# Examples of Public REST and SOAP APIs

SOAP APIs used to be common in the last decade, but most providers have slowly moved towards REST for the reasons mentioned above. An example of a publicly used SOAP API is the **Europe PMC** ([https://europepmc.org/SoapWebServices](https://europepmc.org/SoapWebServices)).

REST APIs are more commonly used in modern software, so the examples are numerous. But for instance, **Github** has one ([https://docs.github.com/en/rest?apiVersion=2022-11-28](https://docs.github.com/en/rest?apiVersion=2022-11-28)), **Apple** has one to help authenticate using Apple's Servers ([https://developer.apple.com/documentation/sign\_in\_with\_apple/sign\_in\_with\_apple\_rest\_api](https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api)).

These are just to mention a few. In fact, you can find yourself surrounded by APIs, you just have to look.

Now, because we're covering REST and SOAP, why don't we write simple Hello World APIs in both of them?

# Code Time: Hello World in SOAP and REST

## Using NodeJs and REST

```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`REST API Example listening at http://localhost:${port}`);
});
```

In this example, we create a simple REST API that responds to a GET request to the root URL ("/") with the message "Hello World!". The `express` package is used to handle the HTTP requests and responses.

## Using NodeJs and SOAP

```javascript
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const soap = require('soap');

const wsdlUrl = 'http://www.dneonline.com/calculator.asmx?wsdl';
const port = 3000;

app.use(bodyParser.raw({ type: function () { return true; }, limit: '5mb' }));

app.post('/hello', (req, res) => {
  const xml = req.body.toString();
  soap.createClient(wsdlUrl, (err, client) => {
    client.HelloWorld({}, (err, result) => {
      res.setHeader('Content-Type', 'text/xml');
      res.send(result.HelloWorldResult);
    });
  });
});

app.listen(port, () => {
  console.log(`SOAP API Example listening at http://localhost:${port}`);
});
```

In this example, we create a simple SOAP API that responds to a POST request to the "/hello" endpoint with the message "Hello World!". The `body-parser` package is used to parse the XML request body. The `soap` package is used to create a SOAP client and call the `HelloWorld` operation on the SOAP API.

# Conclusion

In conclusion, REST and SOAP APIs are the two most common types of APIs. REST APIs are easy to understand and implement, while SOAP APIs are more secure and reliable. Which type of API you choose to use will depend on your specific needs and requirements.

In case you have any more questions or concerns about REST or SOAP APIs, or there is something you'd want me to talk about in the upcoming posts, please tweet to me ([**twitter.com/harshitbudhraja**](http://twitter.com/harshitbudhraja)) or leave a comment on this post.

In the upcoming posts, we will be diving deeper into REST APIs and the principles governing them. We will also discuss different types of API definitions, including OpenAPI, AsyncAPI, GraphQL and more. Stay tuned!
