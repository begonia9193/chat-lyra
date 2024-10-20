use serde_json::Value;
use crate::{CONFIG_STORE};

pub fn init_hotkey() {
    let config_store = CONFIG_STORE.get().unwrap();

    if let Some(Value::Object(hotkey_config)) = config_store.get("hotkey") {
        let keys = vec!["selection_translate", "ocr_translate"];
        for key in keys {
            if let Some(Value::String(hotkey_value)) = hotkey_config.get(key) {
                println!("{:?}", hotkey_value)
            }
        }
    }
}

pub fn registry(key: &str, hotkey: &str, ) {}
