package Team.C.Service.Spot.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOTPEmail(String toEmail, String otp, String purpose) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject(getSubject(purpose));
            helper.setText(buildEmailContent(otp, purpose), true);

            mailSender.send(message);
            log.info("OTP email sent successfully to: {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send OTP email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }

    private String getSubject(String purpose) {
        return switch (purpose) {
            case "REGISTRATION" -> "ServiceSpot - Verify Your Email";
            case "PASSWORD_RESET" -> "ServiceSpot - Password Reset OTP";
            default -> "ServiceSpot - OTP Verification";
        };
    }

    private String buildEmailContent(String otp, String purpose) {
        String action = purpose.equals("REGISTRATION") ? "verify your email" : "reset your password";
        
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); 
                             color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .otp-box { background: white; padding: 20px; text-align: center; 
                              border-radius: 8px; margin: 20px 0; border: 2px dashed #667eea; }
                    .otp-code { font-size: 32px; font-weight: bold; color: #667eea; 
                               letter-spacing: 5px; margin: 10px 0; }
                    .warning { color: #e74c3c; font-size: 14px; margin-top: 20px; }
                    .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>ServiceSpot</h1>
                        <p>Your trusted service provider platform</p>
                    </div>
                    <div class="content">
                        <h2>OTP Verification</h2>
                        <p>Hello,</p>
                        <p>You have requested to %s. Please use the OTP below:</p>
                        
                        <div class="otp-box">
                            <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
                            <div class="otp-code">%s</div>
                            <p style="margin: 0; font-size: 12px; color: #999;">Valid for 10 minutes</p>
                        </div>
                        
                        <p>If you didn't request this, please ignore this email.</p>
                        
                        <div class="warning">
                            ⚠️ Never share this OTP with anyone. ServiceSpot will never ask for your OTP.
                        </div>
                    </div>
                    <div class="footer">
                        <p>© 2025 ServiceSpot. All rights reserved.</p>
                        <p>This is an automated email. Please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(action, otp);
    }
}