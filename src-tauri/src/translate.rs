use std::{thread::sleep, time::Duration};
use tauri::{Manager, LogicalSize, Size};
use crate::APP;

pub fn selection_translate() {
    let app_handle = APP.get().unwrap();

    if let Some(window) = app_handle.get_window("translate") {
        let window_size = LogicalSize::new(350, 400);
        window.set_size(Size::new(window_size)).unwrap();

        window.set_always_on_top(true).unwrap();
        window.center().unwrap();
        window.show().unwrap();
        sleep(Duration::from_millis(10));
        window.set_focus().unwrap();
    }
}

pub fn ocr_translate() {
    println!("ocr_translate")
}
