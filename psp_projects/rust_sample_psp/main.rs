#![no_std]
#![no_main]

// Entry point and core module for modern rust-psp development
// Target: mipsel-sony-psp

#[panic_handler]
fn panic(_info: &core::panic::PanicInfo) -> ! {
    loop {}
}
