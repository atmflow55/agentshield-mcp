#!/usr/bin/env node
// AgentShield MCP Server
// Exposes AgentShield smart contract security as MCP tools
// API: https://agentshield.win — $0.001/call via x402

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const BASE_URL = "https://agentshield.win";

const server = new Server(
  { name: "agentshield", version: "1.4.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "verify_contract",
      description: "Verify a smart contract for security risks before transacting. Detects honeypots, rug pulls, high taxes, hidden ownership, and other threats. Costs $0.001 via x402 micropayment (USDC on Base or SOL). Always call this before approving any on-chain transaction.",
      inputSchema: {
        type: "object",
        properties: {
          contract: {
            type: "string",
            description: "Contract address (0x... for EVM chains, base58 for Solana)"
          },
          chain: {
            type: "string",
            description: "Chain ID: 1=Ethereum, 56=BSC, 137=Polygon, 8453=Base, 42161=Arbitrum, 10=Optimism, solana",
            default: "1"
          },
          payment: {
            type: "string",
            description: "x402 payment proof. For Solana: JSON string {network:'solana',txSignature:'...'}. For EVM: {txHash:'0x...',network:'base-mainnet'}. Omit to get payment instructions."
          }
        },
        required: ["contract"]
      }
    },
    {
      name: "scan_contract",
      description: "Full threat detection scan: honeypots, rug pulls, mint authority, freeze authority, proxy backdoors, tax manipulation, blacklist functions, liquidity analysis, and holder concentration. 14+ checks in under 2 seconds. Use this before trading any token.",
      inputSchema: {
        type: "object",
        properties: {
          contract: {
            type: "string",
            description: "Token/contract address to scan"
          },
          chain: {
            type: "string",
            description: "Chain: solana, ethereum, base, bsc, polygon, arbitrum, optimism",
            default: "solana"
          }
        },
        required: ["contract"]
      }
    },
    {
      name: "deep_scan",
      description: "Deep forensic analysis: ownership, permissions, exploit pattern matching, bytecode analysis, and risk breakdown. Goes deeper than verify or scan. 2 free/day, unlimited for Pro/Builder subscribers.",
      inputSchema: {
        type: "object",
        properties: {
          contract: {
            type: "string",
            description: "Contract address (0x... for EVM)"
          },
          chain: {
            type: "string",
            description: "Chain: ethereum, base, polygon, arbitrum, optimism, bnb, avalanche",
            default: "ethereum"
          }
        },
        required: ["contract"]
      }
    },
    {
      name: "monitor_wallet",
      description: "Watch a wallet for drain threats. When balance drops beyond threshold in a single transaction, fires an alert to your callback URL and auto-freezes all linked agent wallets.",
      inputSchema: {
        type: "object",
        properties: {
          wallet: {
            type: "string",
            description: "Wallet address to monitor (0x...)"
          },
          callback_url: {
            type: "string",
            description: "Public HTTPS URL to POST drain alerts to"
          },
          threshold_pct: {
            type: "number",
            description: "Balance drop percentage to trigger alert (default: 20)",
            default: 20
          },
          agent_id: {
            type: "string",
            description: "Agent identifier for grouping monitored wallets"
          },
          chains: {
            type: "array",
            items: { type: "string" },
            description: "Chains to monitor (default: ['ethereum', 'base'])",
            default: ["ethereum", "base"]
          }
        },
        required: ["wallet", "callback_url"]
      }
    },
    {
      name: "freeze_wallet",
      description: "Emergency freeze all monitored wallets for a wallet address or agent. Stops all transaction signing until manually unfrozen. Requires API key (X-Agent-Key) or wallet ownership.",
      inputSchema: {
        type: "object",
        properties: {
          wallet: {
            type: "string",
            description: "Wallet address to freeze"
          },
          agent_id: {
            type: "string",
            description: "Agent ID to freeze all wallets for"
          },
          reason: {
            type: "string",
            description: "Reason for freeze",
            default: "Threat detected"
          },
          api_key: {
            type: "string",
            description: "AgentShield API key for authorization"
          }
        }
      }
    },
    {
      name: "get_alerts",
      description: "Get recent drain alerts and threat notifications for a wallet address.",
      inputSchema: {
        type: "object",
        properties: {
          wallet: {
            type: "string",
            description: "Wallet address to check alerts for"
          },
          limit: {
            type: "number",
            description: "Max alerts to return (default: 20, max: 100)",
            default: 20
          }
        },
        required: ["wallet"]
      }
    },
    {
      name: "get_stats",
      description: "Get AgentShield platform statistics: contracts verified, wallets monitored, threats blocked.",
      inputSchema: {
        type: "object",
        properties: {}
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "get_stats") {
    const res = await fetch(`${BASE_URL}/stats`);
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  if (name === "verify_contract") {
    const url = `${BASE_URL}/verify?contract=${args.contract}&chain=${args.chain || "1"}`;
    const headers = { "Content-Type": "application/json" };
    if (args.payment) headers["X-Payment"] = args.payment;

    const res = await fetch(url, { headers });
    const data = await res.json();

    if (res.status === 402) {
      return {
        content: [{
          type: "text",
          text: `Payment required. Send $0.001 USDC on Base to 0x4BBc455ff6bA13682feC3b5F0261520b28C19e1c OR 500 lamports SOL to 7ci48VmgPTyEoqQCW2yb9HHEC8qDEK9gGbGoBV1GfHDf, then retry with the payment field set to your tx signature.\n\nFull payment details:\n${JSON.stringify(data, null, 2)}`
        }],
        isError: true
      };
    }
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  if (name === "scan_contract") {
    const res = await fetch(`${BASE_URL}/scan?contract=${encodeURIComponent(args.contract)}&chain=${args.chain || "solana"}`);
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  if (name === "deep_scan") {
    const res = await fetch(`${BASE_URL}/deep-scan?contract=${encodeURIComponent(args.contract)}&chain=${args.chain || "ethereum"}`);
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  if (name === "monitor_wallet") {
    const res = await fetch(`${BASE_URL}/monitor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet: args.wallet,
        callback_url: args.callback_url,
        threshold_pct: args.threshold_pct || 20,
        agent_id: args.agent_id || undefined,
        chains: args.chains || ["ethereum", "base"],
      }),
    });
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  if (name === "freeze_wallet") {
    const headers = { "Content-Type": "application/json" };
    if (args.api_key) headers["X-Agent-Key"] = args.api_key;
    if (args.wallet) headers["X-Wallet"] = args.wallet;

    const res = await fetch(`${BASE_URL}/freeze`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        wallet: args.wallet || undefined,
        agent_id: args.agent_id || undefined,
        reason: args.reason || "Threat detected",
      }),
    });
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  if (name === "get_alerts") {
    const params = new URLSearchParams({ wallet: args.wallet, limit: String(args.limit || 20) });
    const res = await fetch(`${BASE_URL}/alerts?${params}`);
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  throw new Error(`Unknown tool: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
