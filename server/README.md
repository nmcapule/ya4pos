# fresh project

## Deployment

Just type:

```sh
$ flyctl deploy
```

### Usage

Start the project:

```
deno task start
```

This will watch the project directory and restart as necessary.

### Use Cases

- Open POS
- Sell something on the POS
  - How will the crew revise in case of errs?
    - draft-commit-model? all transfers are drafts by default, and must be
      explicitly committed.
- Transfer item stocks from warehouse to warehouse
  - via transfer API
- Replenish warehouse item stocks
  - via transfer API
- Draft transfers
- Resume transfer drafts
- Commit transfers (aka. from `is_committed=FALSE` into `is_committed=TRUE`)

### APIs

```
GET /api/v1/warehouses
    Get all warehouses.

GET /api/v1/warehouses/{:id}
    Get warehouse info.

PUT /api/v1/warehouses/{:id}
    Edit warehouse info. Maybe just the name?

GET /api/v1/warehouses/{:id}/stocks
    Get all items within the warehouse.
    Params: filters?
    Notes:
        - `is_virtual` defines how quantity is calculated
        - `is_sellable` defines if the stock is sellable if the warehouse
          is a POS.

GET /api/v1/transfers/
    Get all warehouse items transfers.
    Probably need a translation for buy/sell/replenishmnets.
    Params: filters?
    Notes:
        - Can filter by `is_committed`

POST /api/v1/transfers/
    Create a new transfer record. This is a draft by default and not applied.

GET /api/v1/transfers/{:id}
    Get transfer details. Can expand member items via indirect expansion.
    Params:
        - expand?
    Notes:
        - See: https://pocketbase.io/docs/expanding-relations/#indirect-expand

PUT /api/v1/transfers/{:id}
    Update transfer record (???). Or maybe just commits?
    Notes:
        - This might be harder, since transfers have side-effects (!). Need
          to track the effects on the source and destination warehouse stocks.
        - Can update anything as long as `is_committed=FALSE`
        - Once `is_committed_TRUE`, cannot update anymore.
        - Has a different logic path when part of the update setting
          `is_committed` to TRUE.
            - Validate if possible
            - Create transfer_items where `as_ingredient_of` is set if it's a
              derived item.

GET /api/v1/transfers/{:id}/items/{:transfer_item_id}
    Get item in the transfer.

POST /api/v1/transfers/{:id}/items/
    Create a new item in the transfer.
    Notes:
        - If `is_committed=TRUE` for the parent transfer record, fail op.

PUT /api/v1/transfers/{:id}/items/{:transfer_item_id}
    Edit item in the transfer.
    Notes:
        - If `is_committed=TRUE` for the parent transfer record, fail op.

DELETE /api/v1/transfers/{:id}/items/{:transfer_item_id}
    Delete item in the transfer.
    Notes:
        - If `is_committed=TRUE` for the parent transfer record, fail op.
```

**Notes**

- For editing stocks, solely use transfers
