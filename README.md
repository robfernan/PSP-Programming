# PSP Homebrew Projects: Tutorial Series Overview

Welcome! This repository is a collection of PlayStation Portable (PSP) homebrew projects, each based on step-by-step tutorials. Every project demonstrates a different aspect of PSP development using C, SDL2, and related libraries. All code is cross-platform and can be built for both PSP and Linux.

## � Getting Started

These projects are designed for both PSP and Linux. You can build and run them on your PC (for development/testing) or on a real/emulated PSP.


### Prerequisites

- **For PSP builds:**
  - [PSPSDK](https://github.com/pspdev/pspsdk) and [psp-cmake](https://github.com/pspdev/psptoolchain-extra) installed and in your PATH.
  - [PPSSPP](https://www.ppsspp.org/) emulator (optional, for testing).

- **For Linux builds:**
  - Standard C development tools (gcc, make, cmake, SDL2, SDL2_image, SDL2_mixer, SDL2_ttf, etc.).
  - On Fedora/Nobara:
    ```bash
    sudo dnf install gcc make cmake SDL2-devel SDL2_image-devel SDL2_mixer-devel SDL2_ttf-devel
    ```
  - On Ubuntu/Debian:
    ```bash
    sudo apt install build-essential cmake libsdl2-dev libsdl2-image-dev libsdl2-mixer-dev libsdl2-ttf-dev
    ```

- **For macOS builds:**
  - Install [Homebrew](https://brew.sh/) if you don't have it:
    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```
  - Then install dependencies:
    ```bash
    brew install cmake sdl2 sdl2_image sdl2_mixer sdl2_ttf
    ```

- **For Windows builds:**
  - Use [MSYS2](https://www.msys2.org/) for a Unix-like environment and package management.
  - After installing MSYS2, open the MSYS2 MinGW terminal and run:
    ```bash
    pacman -Syu
    pacman -S mingw-w64-x86_64-gcc mingw-w64-x86_64-cmake mingw-w64-x86_64-SDL2 mingw-w64-x86_64-SDL2_image mingw-w64-x86_64-SDL2_mixer mingw-w64-x86_64-SDL2_ttf
    ```
  - Alternatively, you can use [WSL](https://docs.microsoft.com/en-us/windows/wsl/) to run a Linux environment on Windows and follow the Linux instructions above.

---

## �📚 Project List

| Project                | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| [hello_world_psp](psp_projects/hello_world_psp)         | Minimal Hello World for PSP using C and PSPSDK.                |
| [drawing_square_psp](psp_projects/drawing_square_psp)   | Draws a red rectangle on a white background using SDL2.         |
| [drawing_input_psp](psp_projects/drawing_input_psp)     | Demonstrates reading controller input and drawing shapes.        |
| [drawing_sprite_psp](psp_projects/drawing_sprite_psp)   | Loads and displays a sprite image with SDL2_image.              |
| [audio_psp](psp_projects/audio_psp)                     | Plays a WAV/OGG/MP3 file using native PSP audio or SDL2_mixer.  |
| [cube_3d_psp](psp_projects/cube_3d_psp)                 | Renders a spinning 3D cube using PSP GU.                        |
| [opengl_triangle_psp](psp_projects/opengl_triangle_psp) | Draws a triangle using OpenGL-style API on PSP.                 |
| [sdl_square_psp](psp_projects/sdl_square_psp)           | SDL2 example: draws a green square, handles input.              |
| [sdl_image_psp](psp_projects/sdl_image_psp)             | Loads and displays PNG images using SDL2_image.                 |
| [sdl_mixer_psp](psp_projects/sdl_mixer_psp)             | Plays background music with SDL2_mixer, shows pause/resume.     |
| [sdl_ttf_psp](psp_projects/sdl_ttf_psp)                 | Renders TrueType fonts with SDL2_ttf.                           |
| [texture_mapping_psp](psp_projects/texture_mapping_psp) | Demonstrates texture mapping on PSP GU.                         |


## 🛠️ Building & Running

Below are step-by-step instructions for building and running the projects on each platform. Replace `<project_folder>` with the folder of the project you want to build.

### 🕹️ Building for PSP (All Platforms)
1. Open a terminal and navigate to the project folder:
  ```bash
  cd psp_projects/<project_folder>
  ```
2. Create and enter the build directory:
  ```bash
  mkdir -p build
  cd build
  ```
3. Run CMake with the PSP toolchain:
  ```bash
  psp-cmake ..
  # Or, if psp-cmake is not in your PATH:
  cmake .. -DCMAKE_TOOLCHAIN_FILE=~/pspdev/psp/share/pspdev.cmake
  ```
4. Build the project:
  ```bash
  make or cmake --build .
  ```
5. The resulting `EBOOT.PBP` can be run in [PPSSPP](https://www.ppsspp.org/) or on a real PSP.

---
  # PSP Homebrew Projects: Tutorial Series Overview

  Welcome! This repository is a collection of PlayStation Portable (PSP) homebrew projects, each based on step-by-step tutorials. Every project demonstrates a different aspect of PSP development using C, SDL2, and related libraries. All code is cross-platform and can be built for both PSP and Linux.
  
  ## 🛠️ Building & Running

  - **Toolchain:** [PSPSDK](https://github.com/pspdev/pspsdk) and [psp-cmake](https://github.com/pspdev/psptoolchain-extra)
  - **Emulator:** [PPSSPP](https://www.ppsspp.org/)
  - **Build System:** CMake (use `psp-cmake` for PSP builds)

  **General Build Steps:**
  ```bash
  mkdir build
  cd build
  psp-cmake ..   # For PSP
  make
  ```
  See each project’s README for Linux build instructions and asset requirements.

  ## ⚠️ Troubleshooting

  - If EBOOT.PBP is not created or you get CMake errors about `create_pbp_file`, make sure you are using the `psp-cmake` script from your toolchain’s `bin` directory.
  - For font/image/audio projects, required assets (fonts, images, music) must be in the build directory or as described in each project’s README.
  - See each project’s README for more details and screenshots.

  ## 🙏 Credits & Resources

- [PSPSDK](https://github.com/pspdev/pspsdk)
- [SDL2](https://www.libsdl.org/)
- [PPSSPP](https://www.ppsspp.org/)
- [PSPDev Tutorials](https://pspdev.github.io/basic_programs.html)
- [PSP Eight Sprites Tutorial](https://www.youtube.com/watch?v=Ox1fq4MuY_s&list=PLzs-CfF4VCbS83bQbHg1Tw-bqvfzr3C__)
- All open-source contributors and the PSP homebrew community!