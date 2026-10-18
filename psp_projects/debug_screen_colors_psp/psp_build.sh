/c/pspsdk/bin/psp-gcc -I/c/pspsdk/psp/sdk/include -D_PSP_FW_VERSION=150 main.c -L/c/pspsdk/psp/sdk/lib -lpspdebug -lpspdisplay -lpspge -lc -lpspuser
/c/pspsdk/bin/mksfo "HelloPSP" PARAM.SFO
/c/pspsdk/bin/psp-strip.exe a.out -o a_out_strip.elf
/c/pspsdk/bin/psp-fixup-imports.exe a_out_strip.elf
/c/pspsdk/bin/pack-pbp.exe EBOOT.PBP PARAM.SFO NUL NUL NUL NUL NUL a_out_strip.elf NUL
/c/Program\ Files/PPSSPP/PPSSPPWindows.exe ./EBOOT.PBP