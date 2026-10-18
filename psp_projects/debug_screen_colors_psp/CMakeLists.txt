cmake_minimum_required(VERSION 3.11)

project(debug_screen_colors)

add_executable(${PROJECT_NAME} main.c)

target_link_libraries(${PROJECT_NAME} PRIVATE
    pspdebug
    pspdisplay
    pspge
    pspctrl
    pspgu
    pspuser
    c
)

# Create an EBOOT.PBP file for PSP hardware and PPSSPP emulator
create_pbp_file(
    TARGET ${PROJECT_NAME}
    ICON_PATH NULL
    BACKGROUND_PATH NULL
    PREVIEW_PATH NULL
    TITLE "Debug Screen Colors"
    VERSION 01.00
)
