# gasman

track gas incurred by contributors

## Usage

### getJuiceboxGasSpend

Calculate how much gas Peel contributors spent on `tap` (distribute) transactions, from a given block.

```
npm run getJuiceboxGasSpend -- <start-block>
```

### getMultisigGasSpend

Calculate how much gas Peel contributors spent on executing multisig transactions, from a given block.

```
npm run getMultisigGasSpend -- <start-block>
```

### getTotalGasSpend

Calculate how much gas Peel contributors spent on transactions, from a given block, across the following types of transactions:

- PeelDAO multisig
- `tap` (distribute) transactions

```
npm run getTotalGasSpend -- <start-block>
```
