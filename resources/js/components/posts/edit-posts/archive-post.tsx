import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArchivePostProps } from '@/types/pages/posts/edit';
import { router } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ArchivePost({ postId, disabled, setArchiving }: ArchivePostProps) {
    const archivePost: FormEventHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setArchiving(true);
        router.patch(route('posts.archive', { post: postId }));
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="cursor-pointer rounded-lg bg-yellow-600 px-6 py-3 text-sm font-medium text-white shadow-md transition hover:bg-yellow-700 disabled:bg-yellow-400 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:disabled:bg-yellow-400">
                    Archive
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Are you sure you want to archive this testimony?</DialogTitle>
                <DialogDescription>The post and media will not be deleted, but the post will be hidden from non-admin users.</DialogDescription>
                <form className="space-y-6" onSubmit={archivePost}>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" className="cursor-pointer">
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button variant="default" className="cursor-pointer" disabled={disabled} asChild>
                            <button type="submit">Archive</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
