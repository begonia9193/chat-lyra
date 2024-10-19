use serde_json::Value;
use crate::{CONFIG_STORE};
use crate::translate::{ocr_translate, selection_translate};

#[derive(Debug)]
struct Hotkey {
    key: &'static str,
    handler: fn(),
}

static HOTKEYS: &[Hotkey] = &[
    Hotkey {
        key: "selection_translate",
        handler: selection_translate,
    },
    Hotkey {
        key: "ocr_translate",
        handler: ocr_translate,
    }
];

pub fn init_hotkey() {
    let config_store = CONFIG_STORE.get().unwrap();

    if let Some(Value::Object(hotkey_config)) = config_store.get("hotkey") {
        for hotkey in HOTKEYS.iter() {
            if let Some(Value::String(hotkey_value)) = hotkey_config.get(hotkey.key) {
                println!("{:?}", hotkey_value)
            }
        }
    }
}

pub fn registry() {}
