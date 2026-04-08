#!/usr/bin/env node
// AgentShield MCP Server
// Exposes AgentShield smart contract security as MCP tools
// API: https://agentshield.win — $0.001/call via x402

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const BASE_URL = "https://agentshield.win";

const server = new Server(
  { name: "agentshield", version: "1.0.0" },
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
      name: "get_stats",
      description: "Get AgentShield platform statistics: contracts verified, wallets monitored, threats blocked.",
      inputSchema: {
        type: "object",
        properties: {}
      }
    },
    {
      name: "monitor_wallet",
      description: "Watch a wallet address for drain threats and suspicious activity in real-time.",
      inputSchema: {
        type: "object",
        properties: {
          wallet: {
            type: "string",
            description: "Wallet address to monitor"
          },
          webhook_url: {
            type: "string",
            description: "URL to POST alerts to when a threat is detected (optional)"
          },
          chain: {
            type: "string",
            description: "Chain ID (default: 1 = Ethereum)",
            default: "1"
          }
        },
        required: ["wallet"]
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "get_stats") {
    const res = await fetch(`${BASE_URL}/stats`);
    const data = await res.json();
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
    };
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

    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
    };
  }

  if (name === "monitor_wallet") {
    const res = await fetch(`${BASE_URL}/monitor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet: args.wallet, webhook_url: args.webhook_url, chain: args.chain || "1" })
    });
    const data = await res.json();
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
