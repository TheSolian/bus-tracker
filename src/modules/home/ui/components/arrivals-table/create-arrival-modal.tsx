import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Props = {
  open: boolean;
  onClose: () => void;
};

export const CreateArrivalModal = ({ open, onClose }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Arrival</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
