use diesel::{Connection, SqliteConnection};
use tauri::{AppHandle, Manager};
use std::sync::{OnceLock, Mutex};

pub static DB: OnceLock<Mutex<SqliteConnection>> = OnceLock::new();

pub fn establish_connection(app: &AppHandle) {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .expect("Failed to get app data dir");
    std::fs::create_dir_all(&app_data_dir).expect("create app data dir failed");

    let app_name = app.package_info().name.to_string();
    let db_path = app_data_dir.join(format!("{}.db", app_name));

    let conn = SqliteConnection::establish(&db_path.to_string_lossy())
        .expect(&format!("failed to connect to db {}", db_path.to_string_lossy()));
    
    // 初始化全局连接
    DB.get_or_init(|| Mutex::new(conn));
}
