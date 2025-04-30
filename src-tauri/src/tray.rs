use tauri::tray::TrayIconBuilder;


pub fn init_tray(app: &tauri::AppHandle) {
  TrayIconBuilder::new().build(app).unwrap();
}
