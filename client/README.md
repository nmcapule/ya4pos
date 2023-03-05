# Ya4POS Mobile App

## Deployment

We only use GH pages for now :P

To deploy, just type:

```sh
$ yarn deploy
```

This deployment is based on
https://docs.expo.dev/distribution/publishing-websites/#github-pages

## Code Structure

```
- components/
- screens/
    - account/
        - Login.tsx
        - Profile.tsx
    - pos/
        - POS.tsx
        - Review.tsx
        - Receipt.tsx
        - Orders.tsx
    - inventory/
        - Warehouses.tsx
        - Stock.tsx
- services/
    - inventory.ts
    - transactions.ts
    - transfers.ts
    - warehouses.ts
- App.tsx
```
