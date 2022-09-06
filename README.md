# gasman

track gas incurred by contributors

## Set up

You'll need the following to get started:
- Etherscan API key

1. Install dependencies

    ```bash
    npm install
    ```

2. Create a `.env` file and set `ETHERSCAN_API_KEY` to your Etherscan API key.

3. Run a script.

    ```bash
    npm run getTotalGasSpend -- 14561235 15481186
    ```

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
npm run getTotalGasSpend -- <start-block> <end-block>
```
