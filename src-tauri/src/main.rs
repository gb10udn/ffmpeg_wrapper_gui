// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::path::Path;
use std::fs;
use reqwest::blocking::Client;
use zip::read::ZipArchive;

const FFMPEG_PATH: &str = "./misc/ffmpeg.exe";
const FFMPEG_URL: &str = "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip";

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![download_ffmpeg, check_ffmpeg_downloaded])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


#[tauri::command]
fn download_ffmpeg() -> Result<(), String> {  // TODO: 240511 初回の ffmpeg ダウンロードでフリーズする時間が生じる。非同期でやるべきなのだが、requwest との兼ね合いか、async 付けるだけだとうまくできなかった。
    if !Path::new(FFMPEG_PATH).exists() {
        println!("Start to download ffmpeg ...");
        let temp_dir = Path::new("./temp_ffmpeg");
        fs::create_dir_all(temp_dir).expect("Fail to create temp directory ...");

        let client = Client::new();
        let mut response = client.get(FFMPEG_URL).send().expect(format!("Fail to access -> {} ...", FFMPEG_URL).as_str());
        if response.status().is_success() {
            let mut dst = fs::File::create(temp_dir.join("ffmpeg.zip")).expect("Fail ...");
            response.copy_to(&mut dst).expect("Fail ...");

            let zip_path = temp_dir.join("ffmpeg.zip");
            let target_dir = temp_dir.join("ffmpeg");
            let mut archive = ZipArchive::new(fs::File::open(zip_path).expect("Fail ...")).expect("Fail ...");
            archive.extract(&target_dir).expect("Fail ...");

            let src_path = target_dir.join("ffmpeg-master-latest-win64-gpl/bin/ffmpeg.exe");

            if let Some(dst_dir) = Path::new(FFMPEG_PATH).parent() {
                fs::create_dir_all(dst_dir).unwrap();
            }

            fs::copy(src_path, FFMPEG_PATH).expect("Fail to copy ...");
            fs::remove_dir_all(temp_dir).expect("Fail to remove temp directory ...");
        } else {
            println!("Failed to download FFmpeg.");
        }
    }
    Ok(())
}


#[tauri::command]
fn check_ffmpeg_downloaded() -> bool {
    Path::new(FFMPEG_PATH).exists()
}