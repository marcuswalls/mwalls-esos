package uk.gov.esos.api.web.logging;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.util.ObjectUtils;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

/**
 * Facilitator class for logging rest api request/response.
 */
@Data
@Builder
public class RestLoggingEntry {
    private RestLoggingEntryType type;
    @Builder.Default
    private final Map<String, String> headers = new ConcurrentHashMap<>();
    @Builder.Default
    private Map<String, Object> payload = new HashMap<>();
    private String uri;
    private String userId;
    private String httpMethod;
    private int httpStatus;
    private String correlationId;
    @Builder.Default
    @EqualsAndHashCode.Exclude
    private LocalDateTime timestamp = LocalDateTime.now();

    long responseTimeInMillis;

    public enum RestLoggingEntryType {
        REQUEST,
        RESPONSE
    }
}
