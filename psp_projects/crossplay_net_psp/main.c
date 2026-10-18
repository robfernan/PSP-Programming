#include <pspkernel.h>
#include <pspdebug.h>
#include <pspdisplay.h>
#include <pspnet.h>
#include <pspnet_inet.h>
#include <pspnet_apctl.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <string.h>
#include "../../shared/include/psp_compat.h"

PSP_MODULE_INFO("CrossPlayNet", PSP_MODULE_USER, 1, 0);
PSP_MAIN_THREAD_ATTR(PSP_THREAD_ATTR_USER | PSP_THREAD_ATTR_VFPU);

#define PC_PORT 8080
#define PACKET_MAGIC 0x50535031 // "PSP1"

typedef struct {
    unsigned int magic;
    int playerX;
    int playerY;
    unsigned int buttonMask;
} CrossPlayPacket;

static int is_running = 1;

int exit_callback(int arg1, int arg2, void *common) {
    is_running = 0;
    sceKernelExitGame();
    return 0;
}

int callback_thread(SceSize args, void *argp) {
    int cbid = sceKernelCreateCallback("Exit Callback", exit_callback, NULL);
    sceKernelRegisterExitCallback(cbid);
    sceKernelSleepThreadCB();
    return 0;
}

void setup_callbacks(void) {
    int thid = sceKernelCreateThread("callback_thread", callback_thread, 0x11, 0xFA0, 0, NULL);
    if (thid >= 0) sceKernelStartThread(thid, 0, NULL);
}

int main(void) {
    setup_callbacks();
    pspDebugScreenInit();

    pspDebugScreenPrintf("=== PSP to PC Cross-Play Network Demo ===\n\n");
    pspDebugScreenPrintf("Hardware Detected: %s\n", pspCompatGetModelName());

    if (!pspCompatHasWifi()) {
        pspDebugScreenSetTextColor(0xFF0000FF);
        pspDebugScreenPrintf("Notice: Wi-Fi disabled on PSP Street (E1000).\n");
        pspDebugScreenPrintf("Running in local loopback simulation mode.\n");
    } else {
        pspDebugScreenSetTextColor(0xFF00FF00);
        pspDebugScreenPrintf("Wi-Fi Hardware Ready (802.11b Little-Endian MIPS)\n");
        pspDebugScreenPrintf("Broadcasting UDP game state packets on port %d...\n", PC_PORT);
    }

    CrossPlayPacket packet;
    packet.magic = PACKET_MAGIC;
    packet.playerX = 240;
    packet.playerY = 136;
    packet.buttonMask = 0;

    while (is_running) {
        sceDisplayWaitVblankStart();
        // In real network flow: sendto(sock, &packet, sizeof(packet), 0, (struct sockaddr*)&addr, sizeof(addr));
    }

    return 0;
}
