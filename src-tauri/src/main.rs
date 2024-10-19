// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod hotkey;
mod translate;

use std::sync::OnceLock;
use serde_json::json;
use tauri::{Manager, Wry};
use tauri_plugin_store::{Store, StoreExt};

pub static APP: OnceLock<tauri::AppHandle> = OnceLock::new();
pub static CONFIG_STORE: OnceLock<Store<Wry>> = OnceLock::new();

#[cfg_attr(mobile, tauri::mobile_entry_point)]
fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_global_shortcut::Builder::default().build())
        .invoke_handler(tauri::generate_handler![])
        .setup(|app| {
            APP.get_or_init(|| app.handle().clone());

            let path = app.path().data_dir().unwrap();
            println!("Current directory: {:?}", path);

            let config_store = app.store("config.json");
            CONFIG_STORE.get_or_init(|| config_store);

            hotkey::init_hotkey();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn main() {
    run()
}
