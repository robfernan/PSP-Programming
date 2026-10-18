#![no_std]
#![no_main]

psp::module!("sample_rust_psp", 1, 1);

fn psp_main() {
    psp::enable_home_button();
    unsafe {
        psp::sys::sceDisplayWaitVblankStart();
    }
}

