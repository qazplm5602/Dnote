package com.domi.dnote.Service;

import com.domi.dnote.Repository.TempAttachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class TempAttachService {
    final TempAttachRepository tempAttachRepository;
}
