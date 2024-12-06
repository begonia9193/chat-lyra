// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod hotkey;
mod translate;
mod store;

use std::sync::OnceLock;

pub static APP: OnceLock<tauri::AppHandle> = OnceLock::new();

#[cfg_attr(mobile, tauri::mobile_entry_point)]
fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_global_shortcut::Builder::default().build())
        .plugin(
            tauri_plugin_log::Builder::new()
                .level_for("tao", log::LevelFilter::Off)
                .level_for("os_info", log::LevelFilter::Off)
                .level_for("notify", log::LevelFilter::Off)
                .level_for("notify_debouncer_full", log::LevelFilter::Off)
                .build()
        )
        .invoke_handler(tauri::generate_handler![
            hotkey::registry_hotkey_by_frontend
        ])
        .setup(|app| {
            APP.get_or_init(|| app.handle().clone());

            store::init_store(&app);

            hotkey::init_hotkey().expect("快捷键初始化失败");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn main() {
    run()
}
