# 🕹️ PSP-Programming

**"Cross-Platform Homebrew: From Linux to Handheld Iron"**

A collection of PlayStation Portable (PSP) homebrew projects and tutorials using C, SDL2, and PSPSDK. This repository demonstrates low-level development with a cross-platform mindset—compile and test on **Linux** for speed, then deploy to a real **PSP** for the authentic experience.

---

## ⚡ Technical Architecture

The PSP features a MIPS R4000-based CPU and a dedicated Media Engine. These projects leverage:

* **PSP GU (Graphics Utility):** Direct access to hardware 3D rendering and texture mapping.
* **SDL2 Layer:** Unified API for input and 2D rendering, making code portable between PC and console.
* **Native SPU Audio:** Direct PCM/WAV streaming alongside `SDL2_mixer`.

---
## 📦 Project Gallery

| Project | Description | Preview |
| :--- | :--- | :--- |
| **Hello World** | Minimal C and PSPSDK implementation. | ![Hello World](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/hello_world_psp/images/Screenshot_20250913_234532.png) |
| **3D Cube** | Renders a spinning 3D cube using PSP GU. | ![3D Cube](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/cube_3d_psp/images/Screenshot_20250915_164148.png) |
| **Texture Mapping** | Demonstrates hardware-accelerated mapping on the GU. | ![Texture Mapping](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/texture_mapping_psp/images/Screenshot_20250915_190149.png) |
| **SDL2 Image** | Loading and displaying PNGs via SDL2_image. | ![SDL Image](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/sdl_image_psp/images/Screenshot_20250914_050129.png) |
| **SDL2 Mixer** | Background music logic with pause/resume support. | ![SDL Mixer](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/sdl_mixer_psp/images/Screenshot_20250914_135529.png) |
| **OpenGL Triangle** | OpenGL-style API implementation on PSP hardware. | ![OpenGL Triangle](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/opengl_triangle_psp/images/Screenshot_20250915_175751.png) |
| **Audio SPU** | Native audio playback for WAV/OGG/MP3. | ![Audio](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/audio_psp/images/Screenshot_20250914_042302.png) |
| **SDL2 TTF** | Rendering TrueType fonts for high-quality UI text. | ![SDL TTF](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/sdl_ttf_psp/images/Screenshot_20250914_145746.png) |
| **Input Debug** | Reading controller state and drawing dynamic shapes. | ![Input Debug](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/drawing_input_psp/images/Screenshot_20250914_041746.png) |
| **Sprite Logic** | Handling positioning and movement of 2D assets. | ![Sprites](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/drawing_sprite_psp/images/Screenshot_20250914_040928.png) |
| **SDL2 Squares** | Basic square rendering and input loop handling. | ![Squares](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/sdl_square_psp/images/Screenshot_20250914_044040.png) |
| **Basic Geometry** | Drawing primitives (rectangles) on a clean background. | ![Drawing](https://github.com/robfernan/PSP-Programming/raw/main/psp_projects/drawing_square_psp/images/Screenshot_20250914_000316.png) |

---

## 🚀 OS-Specific Setup

### **1. PSP Toolchain (Universal)**

To build for the console, you need the **PSPSDK**.

1. Follow the [pspdev/pspdev](https://github.com/pspdev/pspdev) instructions to install.
2. Ensure `psp-cmake` is in your system PATH.

### **2. PC Development (Testing/Linux)**

For fast iteration, build these projects natively on your desktop:

#### **Ubuntu / Debian / Linux Mint**

```bash
sudo apt update
sudo apt install build-essential cmake libsdl2-dev libsdl2-image-dev libsdl2-mixer-dev libsdl2-ttf-dev

```

#### **Fedora / Nobara**

```bash
sudo dnf install gcc make cmake SDL2-devel SDL2_image-devel SDL2_mixer-devel SDL2_ttf-devel

```

#### **Arch / Manjaro**

```bash
sudo pacman -S base-devel cmake sdl2 sdl2_image sdl2_mixer sdl2_ttf

```

---

## 🛠️ Build Workflow

1. **Navigate** to a project: `cd psp_projects/hello_world_psp`
2. **Generate Build Files:**
* **For PSP:** `mkdir build && cd build && psp-cmake ..`
* **For PC:** `mkdir build && cd build && cmake ..`


3. **Compile:** `make`
4. **Run:**
* **On PC:** Run the resulting binary: `./hello_world`
* **On PSP:** Transfer `EBOOT.PBP` to `PSP/GAME/PROJECT_NAME/`.



---

## ❓ Why This Project?

PSP development often feels like a "lost art" due to fragmented legacy toolchains. This repository serves as a modern bridge, allowing developers to use contemporary tools like **VS Code** and **CMake** to breathe new life into this legendary handheld.

Special thanks to the [Pikuma](https://pikuma.com) courses and the [PSPDev](https://pspdev.github.io/) community for the foundational knowledge that made these modules possible.

---

**Happy Hacking!**
*Created by [Robert Fernandez*](https://www.google.com/search?q=https://github.com/robfernan)
