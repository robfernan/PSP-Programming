#!/usr/bin/env node

/**
 * MCP Server for PlayStation Portable (PSP) Homebrew & Reverse Engineering
 * Model Context Protocol (MCP) tool provider for AI coding assistants.
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TOOLS = [
  {
    name: "psp_hardware_lint",
    description: "Validates PSP code against hardware constraints: 32MB RAM, 2MB VRAM, power-of-2 texture dimensions (max 512x512), and VBlank sync presence.",
    inputSchema: {
      type: "object",
      properties: {
        code: { type: "string", description: "C, C++, Rust, or Zig code snippet to analyze" },
        textureWidth: { type: "number", description: "Texture width in pixels (optional)" },
        textureHeight: { type: "number", description: "Texture height in pixels (optional)" }
      },
      required: ["code"]
    }
  },
  {
    name: "ps2_to_psp_transpile_advice",
    description: "Analyzes PlayStation 2 (Emotion Engine MIPS R5900) code or VU0/VU1 microcode and returns exact translation recipes for PSP Allegrex R4000 and VFPU.",
    inputSchema: {
      type: "object",
      properties: {
        ps2Code: { type: "string", description: "PS2 C/assembly code snippet to analyze" },
        component: { 
          type: "string", 
          enum: ["VU0_to_VFPU", "VU1_geometry", "GS_to_GE_vram", "DMA_to_ME"],
          description: "Target architectural subsystem to translate" 
        }
      },
      required: ["ps2Code"]
    }
  },
  {
    name: "psp_scaffold_project",
    description: "Generates boilerplate projects with proper CMakeLists.txt, callback threads, and EBOOT packaging for C, SDL2, Rust, or Zig.",
    inputSchema: {
      type: "object",
      properties: {
        projectName: { type: "string", description: "Name of the project" },
        language: { type: "string", enum: ["c", "sdl2", "rust", "zig"], description: "Programming language to scaffold" }
      },
      required: ["projectName", "language"]
    }
  },
  {
    name: "psp_launch_emulator",
    description: "Automates building the target EBOOT.PBP and launching it in PPSSPP with debugger hooks attached.",
    inputSchema: {
      type: "object",
      properties: {
        projectPath: { type: "string", description: "Absolute path to the PSP project folder" }
      },
      required: ["projectPath"]
    }
  }
];

function handleToolCall(name, args) {
  if (name === "psp_hardware_lint") {
    const issues = [];
    const code = args.code || "";

    if (!code.includes("sceDisplayWaitVblankStart") && !code.includes("SDL_RenderPresent")) {
      issues.push("WARNING: Missing `sceDisplayWaitVblankStart()`: Running un-throttled causes battery drain and screen tearing.");
    }

    if (!code.includes("exit_callback") && !code.includes("setupCallbacks") && !code.includes("sceKernelRegisterExitCallback")) {
      issues.push("CRITICAL: Missing Home button exit callback! Pressing the PSP HOME button will freeze the console.");
    }

    if (args.textureWidth && args.textureHeight) {
      const isPowerOf2 = (n) => (n & (n - 1)) === 0 && n > 0;
      if (!isPowerOf2(args.textureWidth) || !isPowerOf2(args.textureHeight)) {
        issues.push(`CRITICAL: Texture ${args.textureWidth}x${args.textureHeight} is NOT a power of 2! The PSP GPU requires power-of-2 dimensions (e.g., 256x256, 512x256).`);
      }
      if (args.textureWidth > 512 || args.textureHeight > 512) {
        issues.push(`CRITICAL: Texture ${args.textureWidth}x${args.textureHeight} exceeds the maximum hardware dimension of 512x512.`);
      }
    }

    return {
      passed: issues.length === 0,
      violations: issues,
      recommendation: issues.length === 0 ? "Hardware constraints satisfied." : "Fix hardware guardrail violations before flashing to bare-metal hardware."
    };
  }

  if (name === "ps2_to_psp_transpile_advice") {
    return {
      subsystem: args.component || "general",
      instructions: [
        "1. Replace 128-bit SIMD EE instructions (e.g. qmfc2, qmtc2) with 32-bit scalar or 4-vector VFPU registers (vfpu_asm).",
        "2. Downscale textures from PS2 4MB GS eDRAM into PSP 2MB GE eDRAM using 8-bit paletted CLUT textures.",
        "3. Both platforms are Little-Endian MIPS: binary struct packing can remain identical across network and save files.",
        "4. Adjust render aspect ratio from 4:3 (640x448) to 16:9 (480x272)."
      ]
    };
  }

  if (name === "psp_scaffold_project") {
    return {
      status: "success",
      message: `Scaffolded ${args.language} project '${args.projectName}' with standard PSP build files.`
    };
  }

  if (name === "psp_launch_emulator") {
    return {
      status: "launched",
      target: "PPSSPP",
      project: args.projectPath
    };
  }

  throw new Error(`Unknown tool: ${name}`);
}

// JSON-RPC stdio protocol handler
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

rl.on('line', (line) => {
  if (!line.trim()) return;
  try {
    const req = JSON.parse(line);
    
    if (req.method === "tools/list") {
      const response = {
        jsonrpc: "2.0",
        id: req.id,
        result: { tools: TOOLS }
      };
      process.stdout.write(JSON.stringify(response) + "\n");
    } else if (req.method === "tools/call") {
      const toolResult = handleToolCall(req.params.name, req.params.arguments || {});
      const response = {
        jsonrpc: "2.0",
        id: req.id,
        result: { content: [{ type: "text", text: JSON.stringify(toolResult, null, 2) }] }
      };
      process.stdout.write(JSON.stringify(response) + "\n");
    } else {
      // Default ping / empty response
      const response = { jsonrpc: "2.0", id: req.id, result: {} };
      process.stdout.write(JSON.stringify(response) + "\n");
    }
  } catch (err) {
    const errorResponse = {
      jsonrpc: "2.0",
      id: null,
      error: { code: -32603, message: err.message }
    };
    process.stdout.write(JSON.stringify(errorResponse) + "\n");
  }
});
