![bcs-cli](docs/_media/bcs_cli_header.png "bcs-cli")

<h1 align="center">bcs-cli</h1>

Command line interface (cli) to handle time recordings in Projectron BCS from your terminal - saving time, money and
nerves.

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

```shell
set bcs_url=<BCS_URL>
set bcs_username=<YOUR_USERNAME>
set bcs_password=<YOUR_PASSWORD> 

bcs
```

Add your time recordings to BCS never was easier 🚀

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
