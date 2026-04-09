# AgentShield MCP Server

> Trust no contract. Verify before you transact.

Real-time smart contract security for autonomous AI agents. 19 MCP tools covering contract verification, wallet monitoring, drain detection, threat reporting, and competitive leaderboards. Supports Ethereum, Base, Polygon, Arbitrum, Optimism, BSC, Avalanche, and Solana.

[![npm version](https://img.shields.io/npm/v/agentshield-mcp)](https://www.npmjs.com/package/agentshield-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Install

```bash
npx agentshield-mcp
```

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

## Usage with Claude Code

```bash
claude mcp add agentshield -- npx agentshield-mcp
```

## 19 MCP Tools

### Core Security (free tier: 10 verify + 5 scan + 2 deep per day)

| Tool | Description |
|------|-------------|
| `verify_contract` | Quick safety check — honeypots, rug pulls, high taxes, hidden ownership. $0.001 via x402. |
| `scan_contract` | Full threat scan: 14+ checks including mint authority, freeze authority, proxy backdoors, liquidity traps, holder concentration. |
| `deep_scan` | Forensic analysis: bytecode patterns, ownership graph, exploit matching, risk breakdown. |
| `verify_batch` | Verify up to 50 contracts at once (API key required). |
| `contract_diff` | Compare two snapshots of a contract — detect proxy upgrades, permission changes. |

### Wallet Protection

| Tool | Description |
|------|-------------|
| `monitor_wallet` | Real-time drain detection. Fires webhook + auto-freezes all agent wallets on suspicious drop. |
| `freeze_wallet` | Emergency freeze all wallets for an agent. Stops transaction signing instantly. |
| `get_alerts` | Recent drain alerts and threat notifications for a wallet. |

### Community & Intelligence

| Tool | Description |
|------|-------------|
| `report_threat` | Report a malicious contract. 3+ reports auto-flag it. Earns +50 bonus API calls. |
| `get_reputation` | Community reputation score for any contract based on verified reports. |
| `register_webhook` | Get notified on proxy upgrades, ownership transfers, liquidity removal. |
| `get_dashboard` | Your API usage, billing, active webhooks, and alerts. |
| `get_stats` | Platform-wide stats: contracts verified, threats blocked, wallets monitored. |

### Leaderboard & Social

| Tool | Description |
|------|-------------|
| `get_leaderboard` | Race to 1M verifications. Free + paid users compete. Top 10 win $500 USDC. |
| `set_agent_name` | Set your agent's display name on the leaderboard. |
| `get_giveaway` | View active giveaways (paid subscribers only). |
| `enter_giveaway` | Enter a giveaway. Builder = 10x tickets, Pro = 5x, Starter = 1x. |
| `create_referral` | Generate a referral code. Earn 20% commission on referrals. |
| `redeem_referral` | Redeem a referral code for bonus API calls. |

## Threat Detection

AgentShield detects 14+ threat types:

- Honeypot contracts (can buy, can't sell)
- Rug pulls (liquidity removal patterns)
- Hidden mint functions (infinite supply risk)
- Freeze authority (owner can freeze your tokens)
- Proxy backdoors (upgradeable to malicious code)
- Tax manipulation (extreme buy/sell fees)
- Blacklist functions (owner can block wallets)
- Self-destruct capability
- Hidden ownership transfers
- External call exploits
- Creator token concentration
- Low/fake liquidity
- Sell suppression patterns
- Brand new unverified contracts

## Supported Chains

Ethereum, Base, Polygon, Arbitrum, Optimism, BSC, Avalanche, Solana

## Payment

AgentShield uses [x402](https://x402.org) micropayments — pay per call, no signup required.

| Tier | Price | Calls |
|------|-------|-------|
| Free | $0 | 10 verify + 5 scan + 2 deep per day |
| Pay-per-call | $0.001 | Unlimited (x402 USDC on Base or SOL) |
| Starter | $4.99/mo | 5,000 calls |
| Pro | $19.99/mo | 100,000 calls + unlimited deep scans + webhooks |
| Builder | $49.99/mo | Unlimited everything |

**Solana:** 500 lamports to `7ci48VmgPTyEoqQCW2yb9HHEC8qDEK9gGbGoBV1GfHDf`
**Base USDC:** $0.001 to `0x4BBc455ff6bA13682feC3b5F0261520b28C19e1c`

## JS SDK

```bash
npm install agentshield-js
```

```javascript
import { AgentShield } from 'agentshield-js';
const shield = new AgentShield();
const result = await shield.verify('0x...', 'ethereum');
if (result.is_honeypot) console.log('DANGER: Honeypot detected!');
```

## API

Full REST API at [agentshield.win](https://agentshield.win)

## License

MIT
