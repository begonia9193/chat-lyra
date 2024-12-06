use std::fmt;
use crate::store::CONFIG_STORE;
use crate::translate::{ocr_translate, selection_translate};
use crate::APP;
use log::{info, warn};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::str::FromStr;
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};

#[derive(Debug, Serialize, Deserialize)]
pub enum HotKeys {
    SelectionTranslate,
    OcrTranslate,
}

impl HotKeys {
    pub fn as_str(&self) -> &str {
        match self {
            HotKeys::SelectionTranslate => "selection_translate",
            HotKeys::OcrTranslate => "ocr_translate",
        }
    }
}

// 为了解析错误定义一个简单的错误类型
#[derive(Debug)]
pub struct HotKeyParseError;

impl fmt::Display for HotKeyParseError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "invalid hotkey")
    }
}

impl std::error::Error for HotKeyParseError {}

impl FromStr for HotKeys {
    type Err = HotKeyParseError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "selection_translate" => Ok(HotKeys::SelectionTranslate),
            "ocr_translate" => Ok(HotKeys::OcrTranslate),
            _ => Err(HotKeyParseError)
        }
    }
}

pub fn init_hotkey() -> Result<(), String> {
    info!("hotkey is init");
    let config_store = CONFIG_STORE.get().unwrap();

    if let Some(Value::Object(hotkey_config)) = config_store.get("hotkey") {
        let keys = vec![&HotKeys::OcrTranslate, &HotKeys::SelectionTranslate];

        for key in keys {
            if let Some(Value::String(hotkey_value)) = hotkey_config.get(key.as_str()) {
                println!(
                    "key is : {:?}, hotkey_value is {:?}",
                    key.as_str(),
                    hotkey_value
                );
                registry_hotkey(key, hotkey_value)?;
            }
        }
    }

    Ok(())
}

fn registry_hotkey(key: &HotKeys, hotkey: &str) -> Result<(), String> {
    let shortcut =
        Shortcut::from_str(hotkey).expect(&format!("shortcut key parsed error {}", hotkey));

    match key {
        HotKeys::SelectionTranslate => {
            registry(key, shortcut, selection_translate)?;
        }
        HotKeys::OcrTranslate => {
            registry(key, shortcut, ocr_translate)?;
        }
    }

    Ok(())
}

#[tauri::command]
pub fn registry_hotkey_by_frontend(key: &str, hotkey: &str) -> Result<(), String> {
    let key: HotKeys = HotKeys::from_str(key).unwrap();
    registry_hotkey(&key, hotkey)
}

fn registry(key: &HotKeys, shortcut: Shortcut, handler: fn()) -> Result<(), String> {
    let app_handle = APP.get().unwrap();
    let manager = app_handle.global_shortcut();

    let config_store = CONFIG_STORE.get().unwrap();
    if let Some(Value::Object(hotkey_config)) = config_store.get("hotkey") {
        if let Some(Value::String(hotkey_value)) = hotkey_config.get(key.as_str()) {
            let shortcut = Shortcut::from_str(hotkey_value)
                .expect(&format!("shortcut key parsed error {}", hotkey_value));
            if manager.is_registered(shortcut) {
                manager
                    .unregister(shortcut)
                    .expect("hotkey unRegistry failed");
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
