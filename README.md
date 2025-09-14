# PSP Homebrew Projects: Tutorial Series Overview

Welcome! This repository is a collection of PlayStation Portable (PSP) homebrew projects, each based on step-by-step tutorials. Every project demonstrates a different aspect of PSP development using C, SDL2, and related libraries. All code is cross-platform and can be built for both PSP and Linux.

## 📚 Project List

| Project                | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| [hello_world_psp](psp_projects/hello_world_psp)         | Minimal Hello World for PSP using C and PSPSDK.                |
| [drawing_square_psp](psp_projects/drawing_square_psp)   | Draws a red rectangle on a white background using SDL2.         |
| [drawing_input_psp](psp_projects/drawing_input_psp)     | Demonstrates reading controller input and drawing shapes.        |
| [drawing_sprite_psp](psp_projects/drawing_sprite_psp)   | Loads and displays a sprite image with SDL2_image.              |
| [audio_psp](psp_projects/audio_psp)                     | Plays a WAV/OGG/MP3 file using native PSP audio or SDL2_mixer.  |
| [sdl_square_psp](psp_projects/sdl_square_psp)           | SDL2 example: draws a green square, handles input.              |
| [sdl_image_psp](psp_projects/sdl_image_psp)             | Loads and displays PNG images using SDL2_image.                 |
| [sdl_mixer_psp](psp_projects/sdl_mixer_psp)             | Plays background music with SDL2_mixer, shows pause/resume.     |
| [sdl_ttf_psp](psp_projects/sdl_ttf_psp)                 | Renders TrueType fonts with SDL2_ttf.                           |

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
- All open-source contributors and the PSP homebrew community!


