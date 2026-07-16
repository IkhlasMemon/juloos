import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type PaginationLink as PaginationLinkType } from '@/types';
import { Link } from '@inertiajs/react';

export function DataPagination({ links, from, to, total }: { links: PaginationLinkType[]; from: number | null; to: number | null; total: number }) {
    if (total === 0) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
                Showing {from} to {to} of {total} results
            </p>
            <Pagination className="mx-0 w-auto">
                <PaginationContent>
                    {links.map((link, index) => (
                        <PaginationItem key={index}>
                            {link.url ? (
                                <Link
                                    href={link.url}
                                    preserveScroll
                                    className={cn(buttonVariants({ variant: link.active ? 'outline' : 'ghost', size: 'icon' }))}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                </Link>
                            ) : (
                                <span
                                    className="px-3 py-2 text-sm text-muted-foreground/50"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )}
                        </PaginationItem>
                    ))}
                </PaginationContent>
            </Pagination>
        </div>
    );
}
