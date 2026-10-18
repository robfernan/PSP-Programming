---
name: psp-dev
description: "Comprehensive guide, scaffolding, and hardware guardrails for Sony PlayStation Portable (PSP) homebrew development using C (PSPSDK), SDL2, modern Rust (rust-psp), and Zig (Zig-PSP)."
---

# PSP Homebrew Development Skill

This skill provides expert knowledge, architectural blueprints, scaffolding templates, and hardware guardrails for developing Sony PlayStation Portable (PSP) homebrew applications.

---

## 1. Hardware Architecture & Technical Constraints

Always design PSP code within the physical hardware boundaries:

| Subsystem | Specification | Key Constraints & Best Practices |
| :--- | :--- | :--- |
| **CPU (Allegrex)** | MIPS R4000 32-bit (1 - 333 MHz) | Default clock is 222MHz. Call `scePowerSetClockFrequency(333, 333, 166)` for intensive 3D/audio tasks. |
| **RAM** | 32 MB (PSP-1000) / 64 MB (Slim/Brite/Go) | Always target 32MB baseline for universal compatibility. Keep user heap allocations $< 24\text{MB}$. |
| **VRAM (EDRAM)** | 2 MB high-speed on-chip RAM | Framebuffer sizes: $480 \times 272$ at 32-bit color ($512 \times 272$ pitch with padding). Dual-buffering consumes $\approx 1.1\text{MB}$. |
| **GPU (GE/GU)** | Fixed-function & primitive rendering pipeline | Texture dimensions **MUST be powers of 2** ($16, 32, 64, 128, 256, 512$). Max texture dimension is $512 \times 512$. |
| **Display** | $480 \times 272$ pixels @ 60 Hz | Always sync the main loop with `sceDisplayWaitVblankStart()` to prevent screen tearing and excessive CPU spinning. |

---

## 2. Mandatory Core Architecture (C / PSPSDK)

Every PSP application requires module identification, user-space thread attributes, and a dedicated callback thread to handle the **Home / Exit Button**:

```c
#include <pspkernel.h>
#include <pspdebug.h>
#include <pspdisplay.h>

PSP_MODULE_INFO("ProjectName", PSP_MODULE_USER, 1, 0);
PSP_MAIN_THREAD_ATTR(PSP_THREAD_ATTR_USER | PSP_THREAD_ATTR_VFPU);

static int exitRequest = 0;

int exitCallback(int arg1, int arg2, void *common) {
    exitRequest = 1;
    return 0;
}

int callbackThread(SceSize args, void *argp) {
    int cbid = sceKernelCreateCallback("Exit Callback", exitCallback, NULL);
    sceKernelRegisterExitCallback(cbid);
    sceKernelSleepThreadCB();
    return 0;
}

void setupCallbacks(void) {
    int thid = sceKernelCreateThread("update_thread", callbackThread, 0x11, 0xFA0, 0, NULL);
    if (thid >= 0) {
        sceKernelStartThread(thid, 0, NULL);
    }
}
```

---

## 3. CMake Standard Build Configuration

Each subproject should use the modern `psp-cmake` standard:

```cmake
cmake_minimum_required(VERSION 3.11)
project(my_psp_game)

add_executable(${PROJECT_NAME} main.c)

target_link_libraries(${PROJECT_NAME} PRIVATE
    pspdebug
    pspdisplay
    pspge
    pspgu
    pspctrl
    c
)

create_pbp_file(
    TARGET ${PROJECT_NAME}
    ICON_PATH NULL
    BACKGROUND_PATH NULL
    PREVIEW_PATH NULL
    TITLE "My PSP Game"
    VERSION 01.00
)
```

---

## 4. Modern Ecosystems (Rust & Zig)

### Rust (`rust-psp`)
* Uses `#![no_std]` and `#![no_main]`.
* Target architecture: `mipsel-sony-psp`.
* Implements automatic exit callbacks and safe wrappers around `psp::sys`.

### Zig (`Zig-PSP`)
* Employs `build.zig` with direct cross-compilation targeting MIPS.
* Native SFO, ELF, and PBP generation without requiring external GCC SDK installs.

---

## 5. Common Pitfalls & Guardrails

1. **Non-Power-of-2 Textures**: Passing a $400 \times 200$ texture directly to the PSP GPU will result in corrupt rendering. Pad to $512 \times 256$ in memory and map UV coordinates to $(400/512, 200/256)$.
2. **Missing `sceDisplayWaitVblankStart()`**: Running an uncapped loop burns battery and desynchronizes frame swaps.
3. **Large Stack Allocations**: The default PSP thread stack size is limited ($0xFA0 = 4\text{KB}$ in callback threads, custom in main). Never allocate massive arrays on the stack; use the heap (`malloc`) or static memory.
4. **Intermediate Binaries in Git**: Never commit `a.out`, `*.elf`, `PARAM.SFO`, or `build/` to repository history.
