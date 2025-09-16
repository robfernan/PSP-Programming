cmake_minimum_required(VERSION 3.11)

project(cube_3d_psp)

add_executable(${PROJECT_NAME} main.c)

target_link_libraries(${PROJECT_NAME} PRIVATE
    pspgu
    pspgum
    pspdebug
    pspdisplay
    pspge
    pspctrl
    m
)

# Create an EBOOT.PBP file
create_pbp_file(
    TARGET ${PROJECT_NAME}
    ICON_PATH NULL
    BACKGROUND_PATH NULL
    PREVIEW_PATH NULL
    TITLE "Hello PSP"
    VERSION 01.00
)