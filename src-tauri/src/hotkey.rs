use std::str::FromStr;
use log::{info, warn};
use serde_json::{Value};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};
use crate::{APP, CONFIG_STORE};
use crate::translate::{ocr_translate, selection_translate};

pub fn init_hotkey() -> Result<(), String> {
    info!("hotkey is init");
    let config_store = CONFIG_STORE.get().unwrap();

    if let Some(Value::Object(hotkey_config)) = config_store.get("hotkey") {
        let keys = vec!["selection_translate", "ocr_translate"];

        for key in keys {
            if let Some(Value::String(hotkey_value)) = hotkey_config.get(key) {
                println!("key is : {}, hotkey_value is {:?}", key, hotkey_value);
                registry_hotkey(key, hotkey_value)?;
            }
        }
    }

    Ok(())
}

#[tauri::command]
pub fn registry_hotkey(key: &str, hotkey: &str) -> Result<(), String> {
    let shortcut = Shortcut::from_str(hotkey).expect(&format!("shortcut key parsed error {}", hotkey));

    match key {
        "selection_translate" => {
            registry(key, shortcut, selection_translate)?;
        },
        "ocr_translate" => {
            registry(key, shortcut, ocr_translate)?;
        },
        _ => {
            info!("hotkey registry fail, not matched key: {}", key)
        },
    }

    Ok(())
}

fn registry(key: &str, shortcut: Shortcut, handler: fn()) -> Result<(), String> {
    let app_handle = APP.get().unwrap();
    let manager = app_handle.global_shortcut();

    let config_store = CONFIG_STORE.get().unwrap();
    if let Some(Value::Object(hotkey_config)) = config_store.get("hotkey") {
        if let Some(Value::String(hotkey_value)) = hotkey_config.get(key) {
            let shortcut = Shortcut::from_str(hotkey_value).expect(&format!("shortcut key parsed error {}", hotkey_value));
            if manager.is_registered(shortcut) {
                manager.unregister(shortcut).expect("hotkey unRegistry failed");
            }
        }
    }

    if let Err(e) = manager.on_shortcut(shortcut, move |_app_handle, _hotkey, ev| {
        if ev.state == ShortcutState::Released {
            handler()
        }
    }) {
        warn!("hotkey registry fail {:?}, error is {:?}", shortcut, e);
        return Err(e.to_string());
    };

    Ok(())
}
