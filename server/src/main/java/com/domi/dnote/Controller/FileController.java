package com.domi.dnote.Controller;

import com.domi.dnote.Enums.FileGroup;
import com.domi.dnote.Exception.FileException;
import com.domi.dnote.Service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RequiredArgsConstructor
@RestController
@RequestMapping("/file")
public class FileController {
    private final FileService fileService;

    @GetMapping(path = "/{type}/{path}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE, MediaType.APPLICATION_OCTET_STREAM_VALUE})
    byte[] getImage(@PathVariable("type") String typeInput, @PathVariable("path") String path) throws IOException {
        String enumKey = typeInput.substring(0, 1).toUpperCase() + typeInput.substring(1); // 앞글자만 대문자

        try {
            FileGroup type = FileGroup.valueOf(enumKey);
            return fileService.getFile(type, path);
        } catch (IllegalArgumentException ignored) {
            throw new FileException(FileException.Type.NOT_FOUND_GROUP);
        }
    }

//    @PostMapping("/test")
//    String testFileUpload(@RequestParam("domi") MultipartFile file) throws IOException {
//        return fileService.registerFile(FileGroup.Avatar, file);
//    }
//
//    @DeleteMapping(path = "/{type}/{path}")
//    void removeImageTest(@PathVariable("type") String typeInput, @PathVariable("path") String path) throws IOException {
//        String enumKey = typeInput.substring(0, 1).toUpperCase() + typeInput.substring(1); // 앞글자만 대문자
//
//        try {
//            FileGroup type = FileGroup.valueOf(enumKey);
//            fileService.removeFile(type, path);
//        } catch (IllegalArgumentException ignored) {
//            throw new FileException(FileException.Type.NOT_FOUND_GROUP);
//        }
//    }
}
