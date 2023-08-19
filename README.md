![projektron-bcs-cli](https://github.com/pgebert/projektron-bcs-cli/assets/6838540/6dca9cef-bc3b-4f55-9b01-f323b2a7db21)

<h1 align="center">projektron-bcs-cli</h1>

<p align="center">
 <img alt="Static Badge" src="https://img.shields.io/badge/BCS_Version-V21.4-blue">
</p


Command line interface (cli) to handle time recordings in Projektron BCS from your terminal - saving time, money and
nerves.

<p align="center">
<img src="https://github.com/pgebert/projektron-bcs-cli/assets/6838540/ed9f7559-c5e0-497c-aa15-0491ba400b1c" width="800px" height="auto" />
</p>

# Design goals

1. Providing an intuitive CLI for BCS
2. Reduce the manual steps for time recording as much as possible

# Usage

## Requirements

- node >= v16.16.0

## Getting Started

Simply run the following and follow the instructions:

```shell
npm install -g projektron-bcs-cli
bcs
```

Adding your time recordings to BCS never has been easier 🚀

## Commands

Currently, the following commands are supported:

| Command | Description                                                                         |
|---------|-------------------------------------------------------------------------------------|
| add     | Add your time recordings for a specific day (overwrites your previous recordings!). |
| get     | Show your time recordings for a specific day.                                       |
| reset   | Reset your time recordings for a specific date.                                     |
| check   | Show your monthly time balance.                                                     |
| mapping | Customize the task to projectId mapping for your needs!                             |
| quit    | Quit the cli.                                                                       |

## Additional Notes

📢 You may want to use the `mapping` command to customize the task to projectId mapping for your needs
and let the cli do the magic for you.

Hints:

- use `tab` to keep and edit initial values

# Miscellaneous

## 🤝 Contributing

Contributions, [issues](https://github.com/pgebert/bcs-cli/issues) and feature requests are welcome!

## Installation from source

Clone this repository and execute the following steps:

```shell
cd bcs-cli
npm run build
npm install --location=global .
```

## 💻 Development

You may want to create a `.env` file in the project ,directory with the evironment variables `BCS_URL`, `BCS_USERNAME`
and `BCS_PASSWORD`.

To run the application without installing it globally:

```shell
cd bcs-cli
npm install

# hot reloading
npm run start:dev

# build and run
npm run build
npm run start

# test
 npm run test
```

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2023 [pgebert](https://github.com/pgebert).  
This project is licensed under [Apache 2.0](LICENSE).
