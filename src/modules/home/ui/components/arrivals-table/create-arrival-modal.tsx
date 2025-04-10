import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateArrivalForm } from '@/modules/home/forms/create-arrival-form';

type Props = {
  open: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CreateArrivalModal = ({ open, setIsOpen }: Props) => {
  return (
    <Dialog open={open} onOpenChange={() => setIsOpen(!open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Arrival</DialogTitle>
        </DialogHeader>
        <CreateArrivalForm cancel={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
