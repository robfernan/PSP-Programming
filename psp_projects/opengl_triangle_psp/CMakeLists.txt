cmake_minimum_required(VERSION 3.11)


project(opengl_triangle_psp)

add_executable(${PROJECT_NAME} psp_polygon.c)

target_link_libraries(${PROJECT_NAME} PRIVATE
    pspgu
    pspgum
    pspdebug
    pspdisplay
    pspge
    m
)

# Create an EBOOT.PBP file
create_pbp_file(
    TARGET ${PROJECT_NAME}
    ICON_PATH NULL
    BACKGROUND_PATH NULL
    PREVIEW_PATH NULL
    TITLE "OpenGL Triangle PSP"
    VERSION 01.00
)