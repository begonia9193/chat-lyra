use std::sync::OnceLock;
use tauri::{App, Wry};
use tauri_plugin_store::{Store, StoreExt};

pub static CONFIG_STORE: OnceLock<Store<Wry>> = OnceLock::new();

pub fn init_store(app: &App) {
    let config_store = app.store("config.json");
    CONFIG_STORE.get_or_init(|| config_store);
}