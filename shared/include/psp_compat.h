#ifndef PSP_COMPAT_H
#define PSP_COMPAT_H

#include <pspkernel.h>
#include <psputility_sysparam.h>

/**
 * Universal Hardware Compatibility Layer for PSP
 * Targets PSP-1000 (32MB) as baseline while scaling up on Slim/Go/Street (64MB)
 */

typedef enum {
    PSP_MODEL_1000_PHAT   = 0, // 32MB Total RAM (~24MB User Heap)
    PSP_MODEL_2000_SLIM   = 1, // 64MB Total RAM (~52MB User Heap)
    PSP_MODEL_3000_BRITE  = 2, // 64MB Total RAM + Mic
    PSP_MODEL_GO_N1000    = 3, // 64MB Total RAM + 16GB Flash + Bluetooth
    PSP_MODEL_STREET_E100 = 4, // 64MB Total RAM, No Wi-Fi, Mono Speaker
    PSP_MODEL_UNKNOWN     = -1
} PspHardwareModel;

// Maximum safe user heap allocation for universal compatibility (PSP-1000 safe)
#define PSP_1000_MAX_SAFE_HEAP_BYTES (24 * 1024 * 1024) // 24 MB

/**
 * Detects the physical PSP hardware revision at runtime
 * Returns PspHardwareModel enum
 */
PspHardwareModel pspCompatGetModel(void);

/**
 * Checks if the running device has the extended 64MB RAM
 * Returns 1 if 64MB is available (Slim/Brite/Go/Street), or 0 if 32MB baseline (1000 Phat)
 */
int pspCompatHasExtendedRam(void);

/**
 * Checks if Wi-Fi hardware is present (PSP Street E1000 has no Wi-Fi)
 * Prevents calling pspnet / ad-hoc initialization on PSP Street which crashes
 */
int pspCompatHasWifi(void);

/**
 * Returns a human-readable model name
 */
const char* pspCompatGetModelName(void);

#endif // PSP_COMPAT_H
