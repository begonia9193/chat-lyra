use crate::hotkey::HotKeys;
use serde_json::{Map, Value};
use std::sync::OnceLock;
use tauri::{App, Wry};
use tauri_plugin_store::{Store, StoreExt};

pub static CONFIG_STORE: OnceLock<Store<Wry>> = OnceLock::new();

pub fn init_store(app: &App) {
    let config_store = app.store("config.json");

    // 初始化快捷键的持久化数据
    let hotkey = config_store.get("hotkey").unwrap_or(Value::Null);

    if is_config_empty(&hotkey) {
        let mut default_hotkey_config = Map::new();
        default_hotkey_config.insert(
            HotKeys::SelectionTranslate.as_str().into(),
            Value::String("Alt+D".to_string()),
        );
        default_hotkey_config.insert(
            HotKeys::OcrTranslate.as_str().into(),
            Value::String("Alt+Shift+D".to_string()),
        );

        config_store.set("hotkey", Value::Object(default_hotkey_config));
        config_store.save().expect("全局快捷键配置初始化失败");
    }

    CONFIG_STORE.get_or_init(|| config_store);
}

pub fn is_config_empty(value: &Value) -> bool {
    match value {
        Value::Object(map) => map.is_empty(),
        _ => true,
    }
}
