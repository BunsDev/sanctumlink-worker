
# SanctumLink – Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![TypeScript](https://img.shields.io/badge/Typescript-blue)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-orange)
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.1-brightgreen)

> SanctumLink Revotulizing web3 kyc protocol.

This is the backend for the SanctumLink project at the [Chainlink Block Magic 2024 Hackathon](https://chain.link/hackathon). The repository is built using Cloudflare Workers with OpenAPI 3.1, leveraging [itty-router-openapi](https://github.com/cloudflare/itty-router-openapi).

## Getting Started

> **Pre-requisites:**
>
> - Sign up for [Cloudflare Workers](https://workers.dev). The free tier is more than enough for most use cases.
> - Clone this repository and install dependencies with `npm install`
> - Run `wrangler login` to login to your Cloudflare account in wrangler

## Project Structure

1. **Main Router**: Defined in `src/index.ts`.
2. **Endpoints**: Each endpoint has its own file in `src/endpoints/`.
3. **Documentation**: Read the [itty-router-openapi official documentation](https://cloudflare.github.io/itty-router-openapi/) for more information.

## Development

1. Run `wrangler dev` to start a local instance of the API.
2. Open `http://localhost:9000/` in your browser to see the Swagger interface where you can try the endpoints.
3. Changes made in the `src/` folder will automatically trigger the server to reload, you only need to refresh the Swagger interface.
