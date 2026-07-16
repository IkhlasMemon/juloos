import { type SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function FlashToast() {
    const { flash } = usePage<SharedData>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    useEffect(() => {
        const removeInvalidListener = router.on('invalid', (event) => {
            const status = event.detail.response?.status;

            if (status === 419) {
                toast.error('Your session has expired. Please refresh the page and try again.');
            } else if (status && status >= 500) {
                toast.error('Something went wrong on our end. Please try again.');
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        });

        const removeExceptionListener = router.on('exception', () => {
            toast.error('Unable to reach the server. Please check your connection and try again.');
        });

        return () => {
            removeInvalidListener();
            removeExceptionListener();
        };
    }, []);

    return null;
}
