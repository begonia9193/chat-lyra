// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod window;
mod tray;

use std::sync::OnceLock;
use tauri::{Manager, RunEvent};

pub static APP: OnceLock<tauri::AppHandle> = OnceLock::new();

#[cfg_attr(mobile, tauri::mobile_entry_point)]
fn run() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            let main_window = app.get_webview_window("main").unwrap();
            main_window.show().unwrap();
            main_window.set_focus().unwrap();
        }))
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_global_shortcut::Builder::default().build())
        .plugin(
            tauri_plugin_log::Builder::new()
                .level_for("tao", log::LevelFilter::Off)
                .level_for("os_info", log::LevelFilter::Off)
                .level_for("notify", log::LevelFilter::Off)
                .level_for("notify_debouncer_full", log::LevelFilter::Off)
                .level_for("enigo", log::LevelFilter::Off)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![])
        .setup(|app| {
            println!("Chat Lyra is Setup !");
            window::init_main_window(app.handle());
            tray::init_tray(app.handle());

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    app.run(|handle, event| match event {
        RunEvent::Reopen { has_visible_windows, .. } => {
            if !has_visible_windows {
                let main_window = handle.get_webview_window("main").unwrap();
                main_window.show().unwrap();
                main_window.set_focus().unwrap();
            }
        },
        _ => ()
    });
}

fn main() {
    run();
}
