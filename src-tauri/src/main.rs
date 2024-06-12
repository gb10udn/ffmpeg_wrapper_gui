// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::path::Path;
use std::fs;
use std::io::Write;
use std::process::{Command, Stdio};
use reqwest::Client;
use zip::read::ZipArchive;

const FFMPEG_PATH: &str = "./misc/ffmpeg.exe";
const FFMPEG_URL: &str = "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip";

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![download_ffmpeg, check_ffmpeg_downloaded, crop, mute])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


#[tauri::command]
async fn download_ffmpeg() -> Result<(), String> {
    if !Path::new(FFMPEG_PATH).exists() {
        println!("Start to download ffmpeg ...");
        let temp_dir = Path::new("./temp_ffmpeg");
        fs::create_dir_all(temp_dir).expect("Fail to create temp directory ...");

        let client = Client::new();
        let response = client.get(FFMPEG_URL).send().await.expect(format!("Fail to access -> {} ...", FFMPEG_URL).as_str());
        if response.status().is_success() {
            let mut dst = fs::File::create(temp_dir.join("ffmpeg.zip")).expect("Fail ...");
            let bytes = response.bytes().await.expect("Faile ....");
            dst.write_all(&bytes).expect("Fail .....");

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

#[tauri::command]
async fn crop(src: String, start_x: u32, start_y: u32, width: u32, height: u32) -> Result<(), String> {
    if Path::new(FFMPEG_PATH).exists() && Path::new(&src).exists() {
        let path_obj = Path::new(&src);
        let dst_fname = path_obj.file_stem().unwrap().to_string_lossy();

        let dst: String;
        if let Some(dst_dir) = path_obj.parent() {
            dst = format!("{}/{}_cropped_x={}_y={}_w={}_h={}.mp4", dst_dir.to_string_lossy(), dst_fname, start_x, start_y, width, height);
        } else {
            dst = format!("{}_cropped_x={}_y={}_w={}_h={}.mp4", dst_fname, start_x, start_y, width, height);
        }

        // ffmpeg -i sample_movie.mp4 -vf crop=w=80:h=72:x=0:y=0 output.mp4
        Command::new(FFMPEG_PATH)
            .args([
                "-i",
                &src,
                "-vf",
                &format!("crop=w={}:h={}:x={}:y={}", width, height, start_x, start_y),
                "-r",
                "10",
                &dst,
            ])
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .output()
            .expect("\n\nFailed to execute command\n\n");
        Ok(())        
    } else {
        Err(String::from("File not found"))
    }
}

#[tauri::command]
async fn mute(src: String) -> Result<(), String> {
    if Path::new(FFMPEG_PATH).exists() && Path::new(&src).exists() {
        let dst = obtain_dst_path(&src, "mute", "mp4");
        Command::new(FFMPEG_PATH)
            .args([
                "-i",
               &src,
               "-vcodec",
               "copy",
               "-an",
               &dst,
            ])
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .output()
            .expect("\n\nFailed to execute command\n\n");
        Ok(())
    } else {
        Err(String::from("File not found"))
    }
}

fn obtain_dst_path(src: &String, suffix: &str, extension: &str) -> String {
    let src = Path::new(&src);
    let file_stem = src.file_stem().unwrap().to_string_lossy().to_string();
    let dst = src.with_file_name(format!("{}_{}.{}", file_stem, suffix, extension));
    dst.to_string_lossy().to_string()
}