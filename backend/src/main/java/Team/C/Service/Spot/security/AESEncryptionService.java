package Team.C.Service.Spot.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

/**
 * AES Encryption utility for sensitive data like phone numbers.
 * Uses AES/ECB/PKCS5Padding for encryption/decryption.
 */
@Component
@Slf4j
public class AESEncryptionService {

    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/ECB/PKCS5Padding";

    // 16-byte secret key for AES-128 (must be exactly 16 characters)
    private static final String SECRET_KEY = "QuickServe@12345";

    private final SecretKeySpec secretKeySpec;

    public AESEncryptionService() {
        this.secretKeySpec = new SecretKeySpec(SECRET_KEY.getBytes(), ALGORITHM);
    }

    /**
     * Encrypt a plain text string
     * 
     * @param plainText the text to encrypt
     * @return Base64 encoded encrypted string, or original if encryption fails
     */
    public String encrypt(String plainText) {
        if (plainText == null || plainText.isEmpty()) {
            return plainText;
        }
        try {
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
            byte[] encryptedBytes = cipher.doFinal(plainText.getBytes());
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            log.error("Error encrypting data: {}", e.getMessage());
            return plainText; // Return original on failure
        }
    }

    /**
     * Decrypt an encrypted string
     * 
     * @param encryptedText Base64 encoded encrypted string
     * @return decrypted plain text, or original if decryption fails
     */
    public String decrypt(String encryptedText) {
        if (encryptedText == null || encryptedText.isEmpty()) {
            return encryptedText;
        }
        try {
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);
            byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedText));
            return new String(decryptedBytes);
        } catch (Exception e) {
            // If decryption fails, it might be plain text (legacy data)
            log.debug("Decryption failed, returning original: {}", e.getMessage());
            return encryptedText;
        }
    }
}
