import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArchivePostProps } from '@/types/pages/posts/edit';
import { router } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ArchivePost({ post, disabled, setArchiving }: ArchivePostProps) {
    const isArchived: boolean = !!post.archived_at;

    const archivePost: FormEventHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setArchiving(true);
        router.patch(route('posts.archive', { post: post.id }), {
            archive: !isArchived,
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="cursor-pointer rounded-lg bg-yellow-600 px-6 py-3 text-sm font-medium text-white shadow-md transition hover:bg-yellow-700 disabled:bg-yellow-400 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:disabled:bg-yellow-400">
                    {isArchived ? 'Unarchive' : 'Archive'}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>{'Are you sure you want to ' + (isArchived ? 'unarchive' : 'archive') + ' this testimony?'}</DialogTitle>
                <DialogDescription>
                    {isArchived
                        ? 'The post will be available to the public again.'
                        : 'The post and media will not be deleted, but the post will be hidden from non-admin users.'}
                </DialogDescription>
                <form className="space-y-6" onSubmit={archivePost}>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" className="cursor-pointer">
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button variant="default" className="cursor-pointer" disabled={disabled} asChild>
                            <button type="submit">{isArchived ? 'Unarchive' : 'Archive'}</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
