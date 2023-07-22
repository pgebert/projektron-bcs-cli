![bcs-cli](docs/_media/bcs_cli_header.png "bcs-cli")

<h1 align="center">bcs-cli</h1>

<p align="center">
 <img alt="Static Badge" src="https://img.shields.io/badge/BCS_Version-V21.4-blue">
</p>


Command line interface (cli) to handle time recordings in Projectron BCS from your terminal - saving time, money and
nerves.

<p align="center">
<img src="docs/_media/terminal-demo.gif" width="800px" height="auto" />
</p>

# Design goals

1. Providing an intuitive CLI for BCS
2. Reduce the manual steps for time recording as much as possible

# Usage

## Requirements

- node >= v16.16.0

## Installation

Clone this repository and execute the following steps:

```shell
cd bcs-cli
npm run build
npm install --location=global .
```

## Examples

### Getting Started

Simply run:

```shell
bcs
```

Adding your time recordings to BCS never has been easier 🚀

📢 You may want to adjust the `deriveProjectId` method in the `task` class to match your individual needs.

Hints:

- use `tab` to keep and edit initial values

# Miscellaneous

## 🤝 Contributing

Contributions, [issues](https://github.com/pgebert/bcs-cli/issues) and feature requests are welcome!

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
