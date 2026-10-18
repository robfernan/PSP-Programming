#include "psp_compat.h"

// Forward declaration of internal SDK model check
extern int kuKernelGetModel(void);

PspHardwareModel pspCompatGetModel(void) {
    #if defined(__PSP__)
    int model = kuKernelGetModel();
    if (model >= 0 && model <= 4) {
        return (PspHardwareModel)model;
    }
    #endif
    return PSP_MODEL_1000_PHAT; // Safe universal default
}

int pspCompatHasExtendedRam(void) {
    PspHardwareModel model = pspCompatGetModel();
    return (model != PSP_MODEL_1000_PHAT);
}

int pspCompatHasWifi(void) {
    PspHardwareModel model = pspCompatGetModel();
    // PSP Street (E1000) has no Wi-Fi module
    return (model != PSP_MODEL_STREET_E100);
}

const char* pspCompatGetModelName(void) {
    switch (pspCompatGetModel()) {
        case PSP_MODEL_1000_PHAT:   return "PSP-1000 (Phat) [32MB Baseline]";
        case PSP_MODEL_2000_SLIM:   return "PSP-2000 (Slim) [64MB Extended]";
        case PSP_MODEL_3000_BRITE:  return "PSP-3000 (Brite) [64MB Extended]";
        case PSP_MODEL_GO_N1000:    return "PSP Go [64MB Extended + 16GB Flash]";
        case PSP_MODEL_STREET_E100: return "PSP Street (E1000) [64MB No Wi-Fi]";
        default:                    return "Generic PSP Device";
    }
}
