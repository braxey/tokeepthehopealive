import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DeleteCommentProps } from '@/types/pages/posts/show';
import { Trash2 } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function DeleteComment({ deleteComment }: DeleteCommentProps) {
    const onDelete: FormEventHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteComment();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Trash2 size={18} className="cursor-pointer text-lg text-neutral-500 transition hover:text-red-600" />
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Are you sure you want to delete comment?</DialogTitle>
                <DialogDescription>This cannot be undone.</DialogDescription>
                <form className="space-y-6" onSubmit={onDelete}>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" className="cursor-pointer">
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button variant="destructive" className="cursor-pointer" asChild>
                            <button type="submit">Delete</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
