package com.domi.dnote.Service;

import com.domi.dnote.Enums.FileGroup;
import com.domi.dnote.Exception.DomiException;
import com.domi.dnote.Util.MiscUtil;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
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
            throw new DomiException("FILE0", "파일을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);

        return Files.readAllBytes(file.toPath());
    }

    // 파일 등록
    public String registerFile(FileGroup type, MultipartFile multipartFile) throws IOException {
        String fileName = multipartFile.getOriginalFilename();
        int dotIdx = fileName.lastIndexOf('.');
        String ext = fileName.substring(dotIdx);

        String id = MiscUtil.randomString(20);
        String path = getPath(type, id + ext);

        File file = new File(path);
        multipartFile.transferTo(file);

        return id + ext;
    }
}
