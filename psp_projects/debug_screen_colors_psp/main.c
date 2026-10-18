#include <pspkernel.h>  // Required for PSP kernel functions like threads and exit
#include <pspdebug.h>   // For pspDebugScreen functions (text output)
#include <pspctrl.h>    // NEW: Include for controller input (e.g., START to exit)
#include <pspgu.h>      // NEW: Include for PSP Graphics Utility (for color definitions)
#include <string.h>     // NEW: Include for string functions (e.g., strlen, if needed for complex text layout)

// Define module info (important for the PSP system)
PSP_MODULE_INFO("Hello PSP", PSP_MODULE_USER, 1, 0);

// Set main thread attributes (good practice for the main application thread)
PSP_MAIN_THREAD_ATTR(PSP_THREAD_ATTR_USER | PSP_THREAD_ATTR_VFPU);

// Global flag to control the main loop's execution
static int exitRequest = 1;

// Function to check if the application should continue running
int isRunning() {
    return exitRequest;
}

// Exit callback function: called by the PSP system when the Home button is pressed
// This allows your application to clean up and exit gracefully.
int exitCallback(int arg1, int arg2, void *common) {
    exitRequest = 0; // Set flag to signal the main loop to exit
    return 0;        // Return 0 to allow the system to exit
}

// Thread that manages registering and waiting for callbacks
// This thread ensures that system events (like Home button presses) are handled.
int callbackThread(SceSize args, void *argp) {
    int callbackID;

    // Create a new callback handler for the "Exit Callback"
    callbackID = sceKernelCreateCallback("Exit Callback", exitCallback, NULL);
    // Register this callback with the PSP system for system exit events
    sceKernelRegisterExitCallback(callbackID);

    // Put this thread to sleep; it will wake up automatically when a registered callback is triggered
    sceKernelSleepThreadCB();

    return 0; // Thread exits when sceKernelSleepThreadCB() returns (e.g., after an exit callback)
}

// Function to set up the exit callback mechanism
// This function creates and starts the callbackThread.
void setupExitCallback() {
    SceUID threadID; // Declare threadID with correct type SceUID (System Unique ID)

    // Create a new thread named "Callback Update Thread" that will run the callbackThread function.
    // Parameters: thread name, function to run, priority (0x11), stack size (0xFA0), attributes, options.
    threadID = sceKernelCreateThread("Callback Update Thread", callbackThread, 0x11, 0xFA0, PSP_THREAD_ATTR_USER, NULL);

    if (threadID >= 0) { // Check if thread creation was successful (ID >= 0 means success)
        sceKernelStartThread(threadID, 0, NULL); // Start the newly created thread
    }
}

// Main application entry point
int main() {
    setupExitCallback();    // Call the function to set up the Home button exit functionality

    pspDebugScreenInit();   // Initialize the debug screen for text output

    // --- Start of Text Display & Color Experiment ---

    // 1. Display "Hello, PSP Portable!" ONCE
    // Clear the entire debug screen. Do this once or whenever you want to refresh the screen.
    pspDebugScreenClear();
    // Set the cursor position to column 5, row 5 (0,0 is top-left)
    pspDebugScreenSetXY(5, 5);
    // Print the message. It will stay on screen as it's outside the main loop's print.
    pspDebugScreenPrintf("Hello, PSP Portable!\n");

    // 2. Experiment with Colors
    // Colors are defined as 0xAABBGGRR (Alpha, Blue, Green, Red) in hex.
    // FF is fully opaque, 00 is fully transparent/no color.

    // Set text color to Red (opaque, no blue, no green, full red)
    pspDebugScreenSetTextColor(0xFF0000FF);
    pspDebugScreenSetXY(5, 7); // Move cursor to a new row
    pspDebugScreenPrintf("This text is RED!\n");

    // Set text color to Green
    pspDebugScreenSetTextColor(0xFF00FF00);
    pspDebugScreenSetXY(5, 9); // Move cursor again
    pspDebugScreenPrintf("This text is GREEN!\n");

    // Set text color to Blue
    pspDebugScreenSetTextColor(0xFFFF0000);
    pspDebugScreenSetXY(5, 11); // Move cursor again
    pspDebugScreenPrintf("This text is BLUE!\n");

    // Set text color back to White (default) for another message
    pspDebugScreenSetTextColor(0xFFFFFFFF);
    pspDebugScreenSetXY(5, 13); // Move cursor again
    pspDebugScreenPrintf("Back to WHITE!\n");

    // --- End of Text Display & Color Experiment ---


    // Main application loop: continues as long as exitRequest is 1
    // This loop primarily keeps the application alive and handles screen updates/input.
    while(isRunning()){
        sceDisplayWaitVblankStart(); // Wait for vertical blanking (sync with display refresh)
        // No more pspDebugScreenPrintf here for static display, preventing scrolling.

        // --- Optional: Add Controller Input to Exit with START Button ---
        // (Uncomment this section if you want to also exit with START)
        /*
        SceCtrlData pad; // Structure to hold controller data
        sceCtrlReadBufferPositive(&pad, 1); // Read the current state of the controller

        // Check if the START button is pressed
        if (pad.Buttons & PSP_CTRL_START) {
            pspDebugScreenSetTextColor(0xFFFFFF00); // Optional: change color to yellow for exit message
            pspDebugScreenSetXY(5, 15); // Print message lower on screen
            pspDebugScreenPrintf("START button pressed! Exiting...\n");
            sceKernelDelayThread(1000000); // Small delay to show message before exit (1 second)
            exitRequest = 0; // Set exit flag to terminate the main loop
        }
        */
        // --- End Optional Controller Input ---
    }

    // This line will now be reached when `isRunning()` returns 0 (e.g., Home or START button pressed)
    sceKernelExitGame(); // Cleanly exit the PSP application
    return 0; // Good practice: main function should return 0 on success
}