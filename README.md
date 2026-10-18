# 🕹️ PSP-Programming

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Sony%20PSP%20%7C%20PPSSPP-003791?style=for-the-badge&logo=playstation&logoColor=white" alt="PSP" />
  <img src="https://img.shields.io/badge/CI-Automated%20Builds-success?style=for-the-badge&logo=github-actions&logoColor=white" alt="CI" />
  <img src="https://img.shields.io/badge/VS%20Code-PSP%20Dev%20Studio-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white" alt="VS Code Extension" />
  <img src="https://img.shields.io/badge/Stack-C%20%7C%20SDL2%20%7C%20Rust%20%7C%20Zig-blueviolet?style=for-the-badge" alt="Stack" />
  <img src="https://img.shields.io/badge/Toolchain-pspdev%20%2F%20Docker-orange?style=for-the-badge&logo=docker" alt="Docker" />
</p>

<p align="center">
  <strong>"The Modern PlayStation Portable Development & Porting Hub"</strong><br>
  Cross-Platform Homebrew, PS2-to-PSP Reverse Engineering Architecture, VS Code Extension, Automated CI/CD, and Next-Gen Toolchains (C, SDL2, Rust & Zig).
</p>

---

## 🚀 Highlights & Features

### 🧩 1. Official VS Code Extension: `PSP Dev Studio`
Included in [`extensions/vscode-psp-toolkit/`](extensions/vscode-psp-toolkit/):
* **Top-Bar Quick Play (`▶`)**: One-click build and launch of the active project directly into the **PPSSPP** emulator.
* **Environment Doctor & Dashboard (`📊`)**: Interactive diagnostic window checking MIPS compilers, CMake, and emulator installation with automatic auto-install via `winget` (Windows) / `brew` (macOS) / `flatpak` (Linux).
* **Cross-Platform**: Zero configuration needed on Windows 11, macOS, and Linux.

### 🔄 2. PS2-to-PSP Reverse Engineering & Porting Architecture
Explore our technical manifesto on how modern REA agents, decompilation pipelines, and emulators translate PlayStation 2 (Emotion Engine MIPS R5900) games to run natively on PSP (Allegrex R4000) hardware:
* Read the [PS2 to PSP Porting Manifesto](docs/porting_guide/ps2_to_psp_rea.md).
* Covers instruction downscaling, VU0/VU1 microcode mapping to VFPU, and VRAM memory budgeting ($4\text{MB} \to 2\text{MB}$).

### ⚡ 3. Automated CI/CD Nightly Builds
Every push triggers our GitHub Actions pipeline (`.github/workflows/build.yml`) inside the official `pspdev/pspdev` container, compiling all demos and publishing a **Nightly EBOOT Pack** downloadable under Workflow Artifacts.

### 🤖 4. Antigravity & Agent AI Ready
Includes a dedicated AI skill in [`.agents/skills/psp-dev`](.agents/skills/psp-dev/SKILL.md) that teaches AI coding assistants PSP hardware limits (32MB RAM, VRAM pitch padding, power-of-2 textures, and kernel exit callbacks) to pair-program without crashing hardware.

---

## ⚡ Technical Architecture: Dual-Pipeline Development

```mermaid
graph LR
    subgraph Host ["Workstation / Emulator Loop"]
        PC_Source["Cross-Platform Source (C / SDL2 / Rust / Zig)"]
        VSCode["PSP Dev Studio (VS Code Extension)"]
        PPSSPP["PPSSPP Emulator (Fast Iteration)"]
    end

    subgraph CI ["Automated GitHub Actions CI"]
        Docker["Docker: pspdev/pspdev:latest"]
        BuildPack["Nightly EBOOT.PBP Release Bundle"]
    end

    subgraph Target ["Physical Sony PSP Hardware"]
        Allegrex["MIPS R4000 Allegrex CPU (333 MHz)"]
        GE["Graphics Engine (2MB EDRAM)"]
        MemoryStick["/PSP/GAME/<TITLE>/EBOOT.PBP"]
    end

    PC_Source --> VSCode --> PPSSPP
    PC_Source --> Docker --> BuildPack --> MemoryStick
    BuildPack --> Allegrex
    Allegrex --> GE
```

---

## 📦 Project Gallery

| Project | Stack | Description | Preview |
| :--- | :--- | :--- | :--- |
| **Debug Screen Colors** | C / PSPSDK | Kernel callbacks, text formatting, and hex color palettes | [Inspect](psp_projects/debug_screen_colors_psp) |
| **3D Cube** | C / PSP GU | Hardware 3D rendering with dynamic matrix rotation | ![3D Cube](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/cube_3d_psp/images/Screenshot_20250915_164148.png) |
| **Texture Mapping** | C / PSP GU | Hardware-accelerated texture binding and UV mapping | ![Texture Mapping](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/texture_mapping_psp/images/Screenshot_20250915_190149.png) |
| **SDL2 TTF** | SDL2 / TTF | High-resolution TrueType vector font rendering | ![SDL TTF](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/sdl_ttf_psp/images/Screenshot_20250914_145746.png) |
| **SDL2 Mixer** | SDL2 | Multi-track audio playback with pause/resume loops | ![SDL Mixer](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/sdl_mixer_psp/images/Screenshot_20250914_135529.png) |
| **OpenGL Triangle** | GLES / GU | Modern graphics pipeline emulation on PSP hardware | ![OpenGL Triangle](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/opengl_triangle_psp/images/Screenshot_20250915_175751.png) |
| **Audio SPU** | Native SPU | Direct hardware audio streaming (PCM/WAV) | ![Audio](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/audio_psp/images/Screenshot_20250914_042302.png) |
| **SDL2 Image** | SDL2 | Loading and displaying PNGs via `SDL2_image` | ![SDL Image](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/sdl_image_psp/images/Screenshot_20250914_050129.png) |
| **Input Debug** | C / PSP Ctrl | Reading controller state and drawing dynamic shapes | ![Input Debug](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/drawing_input_psp/images/Screenshot_20250914_041746.png) |
| **Sprite Logic** | C / GU | Handling positioning and movement of 2D assets | ![Sprites](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/drawing_sprite_psp/images/Screenshot_20250914_040928.png) |
| **SDL2 Squares** | SDL2 | Basic square rendering and input loop handling | ![Squares](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/sdl_square_psp/images/Screenshot_20250914_044040.png) |
| **Basic Geometry** | C / GU | Drawing primitives (rectangles) on clean background | ![Drawing](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/drawing_square_psp/images/Screenshot_20250914_000316.png) |
| **Zig Cube** | Zig-PSP | Zero-dependency modern systems programming for MIPS | [Inspect](psp_projects/zig_cube_psp) |
| **Rust Sample** | rust-psp | Memory-safe `#![no_std]` game loop targeting MIPS | [Inspect](psp_projects/rust_sample_psp) |

---

## 🛠️ Build Workflow

### Using the VS Code Extension
1. Open this repository in VS Code.
2. Open any file in `psp_projects/<project_name>/`.
3. Click the **Play (`▶`)** button in the top-right header, or run `Ctrl+Shift+B`.

### Command Line
1. **Navigate** to a project: `cd psp_projects/hello_world_psp`
2. **Generate Build Files:**
   * **For PSP:** `mkdir build && cd build && psp-cmake ..`
   * **For PC:** `mkdir build && cd build && cmake ..`
3. **Compile:** `make`
4. **Deploy:**
   * **On Emulator:** Launch `build/EBOOT.PBP` in PPSSPP.
   * **On Physical PSP:** Copy `build/EBOOT.PBP` to `X:/PSP/GAME/<PROJECT_NAME>/EBOOT.PBP`.

---

## 🗺️ Project Roadmap

- [x] **Automated CI/CD**: Nightly compilation of all homebrew projects with downloadable EBOOT artifacts.
- [x] **PS2-to-PSP Porting Manifesto**: Architecture guides for decompilation and REA targeting Allegrex hardware.
- [x] **VS Code Extension (`PSP Dev Studio`)**: Top-bar instant run button and diagnostics webview.
- [ ] **Marketplace Packaging (`.vsix`)**: Package the VS Code extension for one-click marketplace install.
- [ ] **In-Browser PPSSPP WASM Player**: Embedded playable demo directly on GitHub Pages.
- [ ] **Standalone Windows MSI Installer**: Automated bundled installer for PPSSPP, toolchain paths, and VS Code extension.
- [ ] **Cross-Play Networking Demo**: Ad-Hoc socket communication between PSP and PC client.

---

## 📜 Acknowledgments
* Special thanks to the **PSPDev Community**, the developers of **rust-psp** and **Zig-PSP**, and the **PPSSPP** project.
* Created & maintained by [Robert Fernandez](https://github.com/robfernan).
