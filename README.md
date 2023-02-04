# ya4pos - Yet another half-baked attempt at a POS

`ya4pos` is a simplified implementation of a POS and inventory tracking system
for small and medium enterprises.

## Implementation

![architecture](/assets/architecture.png)

`ya4pos` is composed of three main components:

- **Client**
  - Implemented via [React Native].
- **Backend**
  - Implemented via [Fresh](http://fresh.deno.dev), a framework for creating web
    apps in [Deno](http://deno.dev).
- **Store**
  - Implemented via pocketbase.io, which is backend for quick prototyping with a
    nifty admin UI and out of the box features.

## Concepts

### Warehouses

> TODO: This section is under construction.

### Transfers

> TODO: This section is under construction.

## FAQs

<details>
<summary>Why have separate backend and storage?</summary>

- I wanted to learn how to create apps via Deno + Fresh.
- For the sake of scalability.
- Besides, it'll also be easy to just have a single Docker container that have
  both the backend and store components.

</details>
