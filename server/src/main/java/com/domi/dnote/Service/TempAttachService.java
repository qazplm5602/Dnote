package com.domi.dnote.Service;

import com.domi.dnote.Entity.TempAttach;
import com.domi.dnote.Exception.FileException;
import com.domi.dnote.Repository.TempAttachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class TempAttachService {
    final TempAttachRepository tempAttachRepository;

    public TempAttach getAttach(String id) {
        Optional<TempAttach> file = tempAttachRepository.findById(id);
        return file.orElseThrow(() -> new FileException(FileException.Type.TEMP_NOT_FOUND));
    }

    public void setAttach(String id, int expire) {
        LocalDateTime now = LocalDateTime.now();

        TempAttach attach = TempAttach.builder()
                .file(id)
                .expired(now.plusSeconds(expire))
                .build();

        tempAttachRepository.save(attach);
    }

    public List<TempAttach> getExpireFiles() {
        return tempAttachRepository.findByExpiredLessThan(LocalDateTime.now());
    }

    public void removeFiles(List<TempAttach> files) {
        tempAttachRepository.deleteByFileIn(files.stream().map(TempAttach::getFile).toList());
    }
}
