use tauri::{Manager, PhysicalPosition, PhysicalSize, Size};
use crate::APP;

pub fn selection_translate() {
    let app_handle = APP.get().unwrap();

    if let Some(window) = app_handle.get_window("translate") {
        window.set_size(Size::new(PhysicalSize::new(200, 200))).unwrap();
        window.set_position(PhysicalPosition::new(200, 40)).unwrap();
        window.set_always_on_top(true).unwrap();
        window.set_focus().unwrap();
        window.show().unwrap();
    }
}

pub fn ocr_translate() {
    println!("ocr_translate")
}
