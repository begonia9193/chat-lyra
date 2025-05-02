use tauri::{
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager,
};

pub fn init_tray(app: &tauri::AppHandle) {
    let tray = TrayIconBuilder::new().build(app).unwrap();

    tray.set_icon(Some(app.default_window_icon().unwrap().clone()))
        .unwrap();
    tray.set_tooltip("ChatLyra".into()).unwrap();

    let main_window = app.get_window("main").unwrap();
    tray.on_tray_icon_event(move |_, event| match event {
        TrayIconEvent::Click {
            button: MouseButton::Left,
            button_state: MouseButtonState::Up,
            ..
        } => {
            if !main_window.is_visible().unwrap() {
                main_window.show().unwrap();
            }
        }
        _ => {}
    });
}
