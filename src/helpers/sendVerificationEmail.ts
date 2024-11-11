import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificarionEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { renderToStaticMarkup } from "react-dom/server";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifycode: string,
): Promise<ApiResponse> {
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystry message | Verification Code',
           react : VerificationEmail({username,otp: verifycode})  
        });

        return { success: true, message: 'Verification mail sent successfully' };
    } catch (emailError) {
        console.error("Failed to send email", emailError);
        return { success: false, message: 'Failed to send verification mail' };
    }
}
