import { FlashToast } from '@/components/flash-toast';
import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import { Toaster } from 'sonner';

export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <AuthLayoutTemplate title={title} description={description} {...props}>
            {children}
            <Toaster richColors position="top-right" />
            <FlashToast />
        </AuthLayoutTemplate>
    );
}
