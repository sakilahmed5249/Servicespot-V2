package Team.C.Service.Spot.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when attempting to register with a phone number that already
 * exists
 * Returns HTTP 409 CONFLICT status
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicatePhoneException extends RuntimeException {

    public DuplicatePhoneException(String phone) {
        super("Phone number already registered: " + phone);
    }
}
