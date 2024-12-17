package com.domi.dnote.DTO;

import com.domi.dnote.Entity.ChatBase;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatBaseDTO {
    protected long owner;
    protected String content;
    protected LocalDateTime created;

    public void applyData(ChatBase chat) {
        owner = chat.getOwner().getId();
        content = chat.getContent();
        created = chat.getCreated();
    }
}
