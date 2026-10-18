cmake_minimum_required(VERSION 3.11)

project(crossplay_net_psp)

include_directories(../../shared/include)

add_executable(${PROJECT_NAME} 
    main.c 
    ../../shared/src/psp_compat.c
)

target_link_libraries(${PROJECT_NAME} PRIVATE
    pspdebug
    pspdisplay
    pspge
    pspctrl
    pspnet
    pspnet_inet
    pspnet_apctl
    c
)

# Create an EBOOT.PBP file
create_pbp_file(
    TARGET ${PROJECT_NAME}
    ICON_PATH NULL
    BACKGROUND_PATH NULL
    PREVIEW_PATH NULL
    TITLE "Cross-Play PSP Net"
    VERSION 01.00
)
