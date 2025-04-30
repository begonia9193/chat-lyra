use tauri::Manager;

pub fn init_main_window(app: &tauri::AppHandle) {
    let main_window = app.get_webview_window("main").unwrap();
    let clone_main_window = main_window.clone();
    main_window.on_window_event(move |event| match event {
        tauri::WindowEvent::CloseRequested { api, .. } => {
            clone_main_window.hide().unwrap();
            api.prevent_close();
        }
        _ => {}
    });
}
