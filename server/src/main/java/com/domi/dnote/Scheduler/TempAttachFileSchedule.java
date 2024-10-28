package com.domi.dnote.Scheduler;

import com.domi.dnote.Entity.TempAttach;
import com.domi.dnote.Enums.FileGroup;
import com.domi.dnote.Exception.DomiException;
import com.domi.dnote.Service.FileService;
import com.domi.dnote.Service.TempAttachService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Component
public class TempAttachFileSchedule {
    final Logger log = LoggerFactory.getLogger(this.getClass().getSimpleName());

    final FileService fileService;
    final TempAttachService tempAttachService;

    @Transactional
    @Scheduled(fixedDelay = 1000 * 60 * 60 * 3)
    public void removeTempFiles() {
        log.info("Starting remove temp files...");

        List<TempAttach> attachList = tempAttachService.getExpireFiles();
        log.info("Detected remove temp file "+ attachList.size());

        for (TempAttach file : attachList) {
            try {
                fileService.removeFile(FileGroup.Attachment, file.getFile());
            } catch (DomiException e) {
                log.error(String.valueOf(e));
            }
        }

        tempAttachService.removeFiles(attachList);
        log.info("Remove temp file success ");
    }
}
