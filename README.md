# Api of Artificial Intelligence Content service

Goal of this project is to provide rest api that covers operations
on articles before publishing them. It includes:

- redaction
- edition
- translation

It is open source, so you can set up it on your own server or create platform on cloud maintained by author of this
code.

https://app.aic.preciselab.io/

This project not contain code that scrape articles because from external sources.

---

## Dev Notes

New migration

```
npx mongo-migrate new hash
```

Start service

```
make up
```

Start mock

```
make mock
```
