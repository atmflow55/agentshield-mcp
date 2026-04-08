# AgentShield MCP Server

> Trust no contract.

Real-time smart contract security for autonomous AI agents. Verify any contract for honeypots, rug pulls, and risks before executing transactions.

## Install

```bash
npx agentshield-mcp
```

## Tools

- **verify_contract** — Verify a smart contract for security risks ($0.001 via x402)
- **get_stats** — Platform stats: contracts verified, threats blocked
- **monitor_wallet** — Watch a wallet for drain threats in real-time

## Payment

AgentShield uses [x402](https://x402.org) micropayments — $0.001 per verification, no signup required.

- **Solana:** 500 lamports to `7ci48VmgPTyEoqQCW2yb9HHEC8qDEK9gGbGoBV1GfHDf`
- **Base USDC:** $0.001 to `0x4BBc455ff6bA13682feC3b5F0261520b28C19e1c`

## Supported Chains

Ethereum, Base, Polygon, Arbitrum, Optimism, BSC, Avalanche, Solana

## Usage with Claude Desktop

```json
{
  "mcpServers": {
    "agentshield": {
      "command": "npx",
      "args": ["agentshield-mcp"]
    }
  }
}
```

## API

Full REST API at [agentshield.win](https://agentshield.win)
