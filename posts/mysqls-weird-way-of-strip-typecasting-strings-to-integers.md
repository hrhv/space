---
title: A tale of strip-typecasting in MySQL
slug: mysqls-weird-way-of-strip-typecasting-strings-to-integers
description: MySQL silently strip-typecasts strings to integers when comparing against integer columns — here's how and why.
tags:
  - mysql
  - databases
added: 2019-11-22T00:00:00.000Z
---

> As much as we think we know MySQL, it never fails to surprise us with unusual and weird, yet well-documented, scenarios.

I was perplexed when I learnt about one such thing about MySQL today where it \*\*\*strip-typecasts \*\*\*(as I like to say it) strings to integers. For example, let’s first have a well-defined table schema and insert some dummy data into it.

Assuming the schema like the one shown below -

```
+---------+----------+--------+-------+-----------+----------------+
| Field   | Type     | Null   | Key   | Default   | Extra          |
|---------+----------+--------+-------+-----------+----------------|
| id      | int(11)  | NO     | PRI   | <null>    | auto_increment |
| name    | text     | YES    |       | <null>    |                |
| city    | text     | YES    |       | <null>    |                |
| state   | text     | YES    |       | <null>    |                |
| country | char(36) | YES    |       | India     |                |
+---------+----------+--------+-------+-----------+----------------+
```

We insert dummy data in the table after which it looks something like -

```
+-------+---------+-----------+-------------+-----------+
| id    | name    | city      | state       | country   |
|-------+---------+-----------+-------------+-----------|
| 12345 | Harshit | Bengaluru | Karnataka   | India     |
| 34213 | Rahul   | New Delhi | New Delhi   | India     |
| 34256 | Rohan   | Dehradun  | Uttarakhand | India     |
| 45897 | Satwik  | Mumbai    | Maharashtra | India     |
| 98364 | Aayush  | Pune      | Maharashtra | India     |
+-------+---------+-----------+-------------+-----------+
```

Now, what according to you will a query like `SELECT * from table_name where id = 12345;` return? Well yes, you’re right. It will return -

```
+-------+---------+-----------+-----------+-----------+
| id    | name    | city      | state     | country   |
|-------+---------+-----------+-----------+-----------|
| 12345 | Harshit | Bengaluru | Karnataka | India     |
+-------+---------+-----------+-----------+-----------+
```

Let’s tweak that query a bit to something like `SELECT * from table_name where id = '45897siujwehrirc';` and can you now predict the output? And no, as much as you think that MySQL will throw an error or return an empty set, in fact it doesn’t. Here’s the output that you’d get -

```
+-------+--------+--------+-------------+-----------+
| id    | name   | city   | state       | country   |
|-------+--------+--------+-------------+-----------|
| 45897 | Satwik | Mumbai | Maharashtra | India     |
+-------+--------+--------+-------------+-----------+
```

So the question is why this? And the answer is quite a cliche one though -

## This is how MySQL works!

What MySQL does is get all the numbers from the start of the string `'45897siujwehrirc’` and strip off any characters following it before typecasting it to integer and querying the table. So, the resultant query which actually gets fired to the table is -

`SELECT * from table_name where id = 45897;`

whose expected result matches our result.

Coming to the part where I tell you that MySQL has [documented](https://dev.mysql.com/doc/refman/5.7/en/type-conversion.html) this clearly.


Weirdly counterintuitive way of casting `'45897siujwehrirc'` to `45897`. Ain't it?
