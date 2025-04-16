import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DeletePostProps } from '@/types/pages/posts/edit';
import { router } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function DeletePost({ postId, deleting, processing, setDeleting }: DeletePostProps) {
    const deletePost: FormEventHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setDeleting(true);
        router.delete(route('posts.delete', { post: postId }));
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="cursor-pointer rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white shadow-md transition hover:bg-red-700 disabled:bg-red-400 dark:bg-red-500 dark:hover:bg-red-600 dark:disabled:bg-red-400">
                    {deleting ? 'Deleting...' : 'Delete'}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Are you sure you want to delete this testimony?</DialogTitle>
                <DialogDescription>Once this testimony is deleted, all of its resources and data will also be permanently deleted.</DialogDescription>
                <form className="space-y-6" onSubmit={deletePost}>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" className="cursor-pointer">
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button variant="destructive" className="cursor-pointer" disabled={deleting || processing} asChild>
                            <button type="submit">{deleting ? 'Deleting...' : 'Delete Testimony'}</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
