package com.domi.dnote.Service;

import com.domi.dnote.Enums.FileGroup;
import com.domi.dnote.Exception.FileException;
import com.domi.dnote.Util.MiscUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

@RequiredArgsConstructor
@Service
public class FileService {
    @Value("${domi.assets.path}")
    private String assetRoot;

    private String getPath(FileGroup type, String fileName) {
        return String.format("%s/%s/%s", assetRoot, type.toString().toLowerCase(), fileName);
    }

    public byte[] getFile(FileGroup type, String fileName) throws IOException {
        String path = getPath(type, fileName);
        File file = new File(path);
        if (!file.exists())
            throw new FileException(FileException.Type.NOT_EXIST_FILE);

        return Files.readAllBytes(file.toPath());
    }

    // 파일 등록
    public String registerFile(FileGroup type, MultipartFile multipartFile) throws IOException {
        String fileName = multipartFile.getOriginalFilename();
        String newFileName  = MiscUtil.randomString(20);

        int dotIdx = fileName.lastIndexOf('.');
        if (dotIdx != -1) {
            String ext = fileName.substring(dotIdx);
            newFileName += ext;
        }

        String path = getPath(type, newFileName);

        File file = new File(path);
        multipartFile.transferTo(file);

        return newFileName;
    }

    // 파일 삭제
    public void removeFile(FileGroup type, String fileName) {
        String path = getPath(type, fileName);
        File file = new File(path);

        if (!file.exists())
            throw new FileException(FileException.Type.NOT_EXIST_FILE);

        if (!file.delete())
            throw new FileException(FileException.Type.FAILED_REMOVE);
    }
}
