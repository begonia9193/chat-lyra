use crate::APP;
use selection;
use std::{
    option::Option,
    thread::sleep,
    time::Duration,
};
use tauri::{Emitter, LogicalSize, Manager, Size, Window};

pub fn selection_translate() {
    let text = selection::get_text();
    if let Some(window) = get_window() {
        if window.is_visible().unwrap() == false {
            let window_size = LogicalSize::new(350, 400);
            window.set_size(Size::new(window_size)).unwrap();
            sleep(Duration::from_millis(10));

            window.set_always_on_top(true).unwrap();
            window.center().unwrap();
            window.show().unwrap();
            window.center().unwrap();
            sleep(Duration::from_millis(10));
        }
        window.set_focus().unwrap();
        
        if !text.trim().is_empty() {
            window.emit("translate_text_change", text).unwrap();
        }
    }
}

pub fn ocr_translate() {
    println!("ocr_translate")
}

pub fn get_window() -> Option<Window> {
    let app_handle = APP.get().unwrap();
    let window: Option<Window> = app_handle.get_window("translate");
    window
}

#[tauri::command]
pub fn translate_hide_window() {
    if let Some(window) = get_window() {
        window.hide().unwrap();
    }
}
