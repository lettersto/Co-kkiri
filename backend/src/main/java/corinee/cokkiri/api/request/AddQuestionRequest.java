package corinee.cokkiri.api.request;

import lombok.Data;

@Data
public class AddQuestionRequest {
    private String email;
    private Long roomId;
    private String title;
    private String content;
    private String language;
    private String code;
}
