package api.email.controller.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class EmailRequest {

    @NotNull
    @Email
    private String to;

    @NotNull
    private String description;

    @NotNull
    private LocalDateTime date;

    @NotNull
    private ZoneId zoneId;

}
